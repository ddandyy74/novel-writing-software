import prisma from '../models';
import { Work, Chapter } from '@prisma/client';
import { generateId, countWords } from '../utils/helpers';

export class WorkService {
  /**
   * 创建作品
   */
  static async create(
    userId: string,
    data: {
      title: string;
      genre?: string;
      description?: string;
      tags?: string[];
    },
  ): Promise<Work> {
    return prisma.work.create({
      data: {
        id: generateId(),
        userId,
        title: data.title,
        genre: data.genre,
        description: data.description,
        tags: data.tags || [],
        status: 'draft',
      },
    });
  }

  /**
   * 获取用户作品列表
   */
  static async findByUser(
    userId: string,
    options?: {
      page?: number;
      pageSize?: number;
      status?: string;
    },
  ) {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {
      userId,
      deletedAt: null,
    };

    if (options?.status) {
      where.status = options.status;
    }

    const [items, total] = await Promise.all([
      prisma.work.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.work.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  /**
   * 获取作品详情
   */
  static async findById(workId: string, userId?: string): Promise<Work | null> {
    const where: any = {
      id: workId,
      deletedAt: null,
    };

    if (userId) {
      where.userId = userId;
    }

    return prisma.work.findUnique({
      where,
      include: {
        chapters: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  /**
   * 更新作品
   */
  static async update(
    workId: string,
    userId: string,
    data: Partial<Omit<Work, 'id' | 'userId' | 'createdAt'>>,
  ): Promise<Work> {
    const work = await this.findById(workId, userId);

    if (!work) {
      throw new Error('作品不存在');
    }

    const { id, userId: _, createdAt, ...updateData } = data as any;
    
    return prisma.work.update({
      where: { id: workId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * 软删除作品
   */
  static async softDelete(workId: string, userId: string): Promise<Work> {
    const work = await this.findById(workId, userId);

    if (!work) {
      throw new Error('作品不存在');
    }

    return prisma.work.update({
      where: { id: workId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * 创建章节
   */
  static async createChapter(
    workId: string,
    userId: string,
    data: {
      title: string;
      content: string;
      order: number;
    },
  ): Promise<Chapter> {
    const work = await this.findById(workId, userId);

    if (!work) {
      throw new Error('作品不存在');
    }

    const wordCount = countWords(data.content);

    const chapter = await prisma.chapter.create({
      data: {
        id: generateId(),
        workId,
        title: data.title,
        content: data.content,
        wordCount,
        order: data.order,
        status: 'draft',
      },
    });

    // 更新作品统计
    await this.updateWorkStats(workId);

    return chapter;
  }

  /**
   * 获取章节列表
   */
  static async getChapters(workId: string, userId?: string) {
    const work = await this.findById(workId, userId);

    if (!work) {
      throw new Error('作品不存在');
    }

    return prisma.chapter.findMany({
      where: {
        workId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 获取章节详情
   */
  static async getChapterById(chapterId: string): Promise<Chapter | null> {
    return prisma.chapter.findUnique({
      where: {
        id: chapterId,
        deletedAt: null,
      },
    });
  }

  /**
   * 更新章节
   */
  static async updateChapter(
    chapterId: string,
    userId: string,
    data: Partial<Chapter>,
  ): Promise<Chapter> {
    const chapter = await this.getChapterById(chapterId);

    if (!chapter) {
      throw new Error('章节不存在');
    }

    // 验证权限
    const work = await this.findById(chapter.workId, userId);
    if (!work) {
      throw new Error('权限不足');
    }

    const updateData: any = { ...data, updatedAt: new Date() };

    if (data.content) {
      updateData.wordCount = countWords(data.content);
    }

    const updated = await prisma.chapter.update({
      where: { id: chapterId },
      data: updateData,
    });

    if (data.content) {
      const oldWordCount = chapter.wordCount || 0;
      const newWordCount = updated.wordCount || 0;
      const diff = newWordCount - oldWordCount;
      
      await this.incrementalUpdateWordCount(chapter.workId, diff);
    }

    return updated;
  }

  static async deleteChapter(chapterId: string, userId: string): Promise<Chapter> {
    const chapter = await this.getChapterById(chapterId);

    if (!chapter) {
      throw new Error('章节不存在');
    }

    const work = await this.findById(chapter.workId, userId);
    if (!work) {
      throw new Error('权限不足');
    }

    const deleted = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const wordCount = chapter.wordCount || 0;
    await this.incrementalUpdateWordCount(chapter.workId, -wordCount);
    await this.decrementChapterCount(chapter.workId);

    return deleted;
  }

  private static async incrementalUpdateWordCount(workId: string, diff: number): Promise<void> {
    await prisma.work.update({
      where: { id: workId },
      data: {
        wordCount: { increment: diff },
        updatedAt: new Date(),
      },
    });
  }

  private static async decrementChapterCount(workId: string): Promise<void> {
    await prisma.work.update({
      where: { id: workId },
      data: {
        chapterCount: { decrement: 1 },
      },
    });
  }

  private static async updateWorkStats(workId: string): Promise<void> {
    const stats = await prisma.chapter.aggregate({
      where: {
        workId,
        deletedAt: null,
      },
      _sum: { wordCount: true },
      _count: true,
    });

    await prisma.work.update({
      where: { id: workId },
      data: {
        wordCount: stats._sum.wordCount || 0,
        chapterCount: stats._count,
        updatedAt: new Date(),
      },
    });
  }

  static async reorderChapters(
    workId: string,
    userId: string,
    orders: Array<{ chapterId: string; order: number }>,
  ): Promise<void> {
    const work = await this.findById(workId, userId);

    if (!work) {
      throw new Error('作品不存在');
    }

    await prisma.$transaction(
      orders.map(({ chapterId, order }) =>
        prisma.chapter.update({
          where: { id: chapterId },
          data: { order, updatedAt: new Date() },
        })
      )
    );
  }
}
