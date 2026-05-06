import prisma from '../models';
import { User } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { generateId } from '../utils/helpers';

export class UserService {
  /**
   * 创建用户
   */
  static async create(data: {
    email: string;
    password: string;
    nickname: string;
  }): Promise<User> {
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('用户已存在');
    }

    // 密码哈希
    const passwordHash = await hashPassword(data.password);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        id: generateId(),
        email: data.email,
        passwordHash,
        nickname: data.nickname,
        role: 'user',
        settings: {
          theme: 'light',
          fontSize: 16,
          dailyGoal: 2000,
          autoSave: true,
        },
      },
    });

    return user;
  }

  /**
   * 通过邮箱查找用户
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * 通过 ID 查找用户
   */
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * 验证密码
   */
  static async validatePassword(user: User, password: string): Promise<boolean> {
    return verifyPassword(password, user.passwordHash);
  }

  /**
   * 更新用户设置
   */
  static async updateSettings(userId: string, settings: any): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    const updatedSettings = {
      ...(user.settings as any),
      ...settings,
    };

    return prisma.user.update({
      where: { id: userId },
      data: {
        settings: updatedSettings,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * 获取用户统计信息
   */
  static async getUserStats(userId: string) {
    const [totalWords, totalWorks, writingDays] = await Promise.all([
      prisma.work.aggregate({
        where: { userId, deletedAt: null },
        _sum: { wordCount: true },
      }),
      prisma.work.count({
        where: { userId, deletedAt: null },
      }),
      prisma.writingRecord.count({
        where: { userId },
      }),
    ]);

    return {
      totalWords: totalWords._sum.wordCount || 0,
      totalWorks,
      writingDays,
    };
  }

  /**
   * 更新用户角色
   */
  static async updateRole(userId: string, role: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  /**
   * 软删除用户
   */
  static async softDelete(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
