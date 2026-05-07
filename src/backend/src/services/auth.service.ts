import { FastifyInstance } from 'fastify';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { config } from '../config';
import { generateToken } from '../utils/crypto';
import { getRedis } from '../middleware/redis';

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    nickname: string;
  }, app: FastifyInstance): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await UserService.create(data);
    const tokens = await this.generateTokens(user, app);

    return {
      user,
      ...tokens,
    };
  }

  static async login(
    email: string,
    password: string,
    app: FastifyInstance,
  ): Promise<{ user: User; accessToken: string; refreshToken: string; expiresIn: number }> {
    const user = await UserService.findByEmail(email);
    const isValid = user && await UserService.validatePassword(user, password);

    if (!user || !isValid) {
      throw new Error('邮箱或密码错误');
    }

    const tokens = await this.generateTokens(user, app);

    return {
      user,
      ...tokens,
      expiresIn: 3600,
    };
  }

  static async generateTokens(user: User, app: FastifyInstance): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = app.jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
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
          createdAt: Date.now(),
        }),
        'EX',
        7 * 24 * 3600
      );
    } catch (error) {
      console.error('Failed to store refresh token in Redis:', error);
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(
    refreshToken: string,
    app: FastifyInstance,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    let tokenData: { userId: string; createdAt: number };
    
    try {
      const redis = getRedis();
      const data = await redis.get(`refresh-token:${refreshToken}`);
      
      if (!data) {
        throw new Error('Refresh Token 无效或已过期');
      }
      
      tokenData = JSON.parse(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Refresh Token')) {
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
    } catch (error) {
      console.error('Failed to delete old refresh token:', error);
    }

    const tokens = await this.generateTokens(user, app);
    
    return {
      ...tokens,
      expiresIn: 3600,
    };
  }

  static async logout(userId: string, refreshToken?: string): Promise<void> {
    if (!refreshToken) return;

    try {
      const redis = getRedis();
      const data = await redis.get(`refresh-token:${refreshToken}`);
      
      if (data) {
        const tokenData = JSON.parse(data);
        if (tokenData.userId === userId) {
          await redis.del(`refresh-token:${refreshToken}`);
        }
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  static async logoutAll(userId: string): Promise<void> {
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
    } catch (error) {
      console.error('Failed to logout all sessions:', error);
    }
  }
}
