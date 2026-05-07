import { FastifyInstance } from 'fastify';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { config } from '../config';
import { generateToken } from '../utils/crypto';
import { getRedis } from '../middleware/redis';
import { SessionService } from './session.service';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60;

export class AuthService {
  private static async checkAccountLock(email: string): Promise<void> {
    try {
      const redis = getRedis();
      const lockKey = `account-lock:${email}`;
      const attemptsKey = `login-attempts:${email}`;
      
      const lockUntil = await redis.get(lockKey);
      if (lockUntil) {
        const remainingTime = Math.ceil((parseInt(lockUntil) - Date.now()) / 1000);
        throw new Error(`账户已被锁定，请在 ${remainingTime} 秒后重试`);
      }
      
      const attempts = await redis.get(attemptsKey);
      if (attempts && parseInt(attempts) >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_DURATION * 1000;
        await redis.set(lockKey, lockUntil.toString(), 'EX', LOCKOUT_DURATION);
        await redis.del(attemptsKey);
        throw new Error(`登录失败次数过多，账户已被锁定 30 分钟`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('账户')) {
        throw error;
      }
    }
  }

  private static async recordLoginFailure(email: string): Promise<void> {
    try {
      const redis = getRedis();
      const attemptsKey = `login-attempts:${email}`;
      
      const attempts = await redis.incr(attemptsKey);
      if (attempts === 1) {
        await redis.expire(attemptsKey, 3600);
      }
    } catch (error) {
      console.error('Failed to record login failure:', error);
    }
  }

  private static async clearLoginFailures(email: string): Promise<void> {
    try {
      const redis = getRedis();
      const attemptsKey = `login-attempts:${email}`;
      await redis.del(attemptsKey);
    } catch (error) {
      console.error('Failed to clear login failures:', error);
    }
  }

  static async register(data: {
    email: string;
    password: string;
    nickname: string;
  }, app: FastifyInstance, metadata?: { userAgent?: string; ipAddress?: string }): Promise<{ user: User; accessToken: string; refreshToken: string; sessionId: string }> {
    const user = await UserService.create(data);
    const tokens = await this.generateTokens(user, app, metadata);

    return {
      user,
      ...tokens,
    };
  }

  static async login(
    email: string,
    password: string,
    app: FastifyInstance,
    metadata?: { userAgent?: string; ipAddress?: string }
  ): Promise<{ user: User; accessToken: string; refreshToken: string; expiresIn: number; sessionId: string }> {
    await this.checkAccountLock(email);
    
    const user = await UserService.findByEmail(email);
    const isValid = user && await UserService.validatePassword(user, password);

    if (!user || !isValid) {
      await this.recordLoginFailure(email);
      throw new Error('邮箱或密码错误');
    }

    await this.clearLoginFailures(email);

    const tokens = await this.generateTokens(user, app, metadata);

    return {
      user,
      ...tokens,
      expiresIn: 3600,
    };
  }

  static async generateTokens(user: User, app: FastifyInstance, metadata?: { userAgent?: string; ipAddress?: string }): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
    const sessionId = generateToken(16);
    
    const accessToken = app.jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    }, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = generateToken(32);

    try {
      const redis = getRedis();
      await redis.set(
        `refresh-token:${refreshToken}`,
        JSON.stringify({
          userId: user.id,
          sessionId,
          createdAt: Date.now(),
        }),
        'EX',
        7 * 24 * 3600
      );

      await SessionService.createSession(user.id, sessionId, metadata);
    } catch (error) {
      console.error('Failed to store refresh token in Redis:', error);
    }

    return {
      accessToken,
      refreshToken,
      sessionId,
    };
  }

  static async refreshToken(
    refreshToken: string,
    app: FastifyInstance,
    metadata?: { userAgent?: string; ipAddress?: string }
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number; sessionId: string }> {
    let tokenData: { userId: string; sessionId: string; createdAt: number };
    
    try {
      const redis = getRedis();
      const data = await redis.get(`refresh-token:${refreshToken}`);
      
      if (!data) {
        throw new Error('Refresh Token 无效或已过期');
      }
      
      tokenData = JSON.parse(data);
      
      const isValidSession = await SessionService.validateSession(tokenData.userId, tokenData.sessionId);
      if (!isValidSession) {
        throw new Error('会话已失效，请重新登录');
      }
    } catch (error) {
      if (error instanceof Error && (error.message.includes('Refresh Token') || error.message.includes('会话'))) {
        throw error;
      }
      throw new Error('认证服务暂时不可用，请稍后重试');
    }

    const user = await UserService.findById(tokenData.userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    try {
      const redis = getRedis();
      await redis.del(`refresh-token:${refreshToken}`);
      await SessionService.revokeSession(tokenData.userId, tokenData.sessionId);
    } catch (error) {
      console.error('Failed to delete old refresh token:', error);
    }

    const tokens = await this.generateTokens(user, app, metadata);
    
    return {
      ...tokens,
      expiresIn: 3600,
    };
  }

  static async logout(userId: string, sessionId?: string, refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        const redis = getRedis();
        const data = await redis.get(`refresh-token:${refreshToken}`);
        
        if (data) {
          const tokenData = JSON.parse(data);
          if (tokenData.userId === userId) {
            await redis.del(`refresh-token:${refreshToken}`);
            await SessionService.revokeSession(userId, tokenData.sessionId);
          }
        }
      } else if (sessionId) {
        await SessionService.revokeSession(userId, sessionId);
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  static async logoutAll(userId: string, currentSessionId?: string): Promise<number> {
    try {
      const redis = getRedis();
      const keys = await redis.keys(`refresh-token:*`);
      
      for (const key of keys) {
        const data = await redis.get(key);
        if (data) {
          const tokenData = JSON.parse(data);
          if (tokenData.userId === userId) {
            await redis.del(key);
          }
        }
      }

      return await SessionService.revokeAllSessions(userId, currentSessionId);
    } catch (error) {
      console.error('Failed to logout all sessions:', error);
      return 0;
    }
  }

  static async getSessions(userId: string) {
    return SessionService.getUserSessions(userId);
  }

  static async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    return SessionService.revokeSession(userId, sessionId);
  }
}
