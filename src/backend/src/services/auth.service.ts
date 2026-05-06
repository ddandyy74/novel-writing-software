import { FastifyInstance } from 'fastify';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { config } from '../config';
import { generateToken } from '../utils/crypto';

export class AuthService {
  /**
   * 用户注册
   */
  static async register(data: {
    email: string;
    password: string;
    nickname: string;
  }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await UserService.create(data);
    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  /**
   * 用户登录
   */
  static async login(
    email: string,
    password: string,
    app: FastifyInstance,
  ): Promise<{ user: User; accessToken: string; refreshToken: string; expiresIn: number }> {
    const user = await UserService.findByEmail(email);

    if (!user) {
      throw new Error('用户不存在');
    }

    const isValid = await UserService.validatePassword(user, password);

    if (!isValid) {
      throw new Error('密码错误');
    }

    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
      expiresIn: 3600, // 1小时
    };
  }

  /**
   * 生成 Token
   */
  static async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    // Access Token
    const accessToken = await this.signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    }, config.jwt.expiresIn);

    // Refresh Token
    const refreshToken = generateToken(32);

    // 存储 Refresh Token（实际项目中应存储到 Redis 或数据库）
    // await redis.set(`refresh-token:${user.id}`, refreshToken, 'EX', 7 * 24 * 3600);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 签名 Token
   */
  private static async signToken(payload: any, expiresIn: string): Promise<string> {
    // 这里需要 Fastify JWT 插件支持
    // 实际使用时需要通过 app.jwt.sign() 调用
    return `mock-token-${Date.now()}`;
  }

  /**
   * 刷新 Token
   */
  static async refreshToken(
    refreshToken: string,
    app: FastifyInstance,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    // 验证 Refresh Token（实际项目中应从 Redis 或数据库查询）
    // const userId = await redis.get(`refresh-token:${refreshToken}`);

    // if (!userId) {
    //   throw new Error('Refresh Token 无效');
    // }

    // const user = await UserService.findById(userId);
    // if (!user) {
    //   throw new Error('用户不存在');
    // }

    // const tokens = await this.generateTokens(user);
    // return {
    //   ...tokens,
    //   expiresIn: 3600,
    // };

    // Mock 实现
    throw new Error('需要实现 Refresh Token 逻辑');
  }

  /**
   * 登出
   */
  static async logout(userId: string, refreshToken?: string): Promise<void> {
    // 删除 Refresh Token（实际项目中应从 Redis 或数据库删除）
    // if (refreshToken) {
    //   await redis.del(`refresh-token:${userId}`);
    // }
  }
}
