import prisma from '../models';
import { generateId } from '../utils/helpers';
import { SyncChange, SyncConflict } from '../types';

export class SyncService {
  /**
   * 推送本地变更到云端
   */
  static async pushChanges(
    userId: string,
    clientId: string,
    changes: SyncChange[],
  ): Promise<{
    syncTime: Date;
    conflicts: SyncConflict[];
  }> {
    const conflicts: SyncConflict[] = [];
    const syncTime = new Date();

    for (const change of changes) {
      try {
        await this.applyChange(userId, change, conflicts);
      } catch (error) {
        console.error('Failed to apply change:', error);
      }
    }

    // 记录同步日志
    await prisma.syncLog.create({
      data: {
        id: generateId(),
        userId,
        clientId,
        syncType: 'push',
        changesCount: changes.length,
        conflictsCount: conflicts.length,
        createdAt: syncTime,
      },
    });

    return {
      syncTime,
      conflicts,
    };
  }

  /**
   * 应用单个变更
   */
  private static async applyChange(
    userId: string,
    change: SyncChange,
    conflicts: SyncConflict[],
  ): Promise<void> {
    switch (change.type) {
      case 'work':
        await this.applyWorkChange(userId, change, conflicts);
        break;
      case 'chapter':
        await this.applyChapterChange(userId, change, conflicts);
        break;
      case 'character':
        await this.applyCharacterChange(userId, change, conflicts);
        break;
    }
  }

  /**
   * 应用作品变更
   */
  private static async applyWorkChange(
    userId: string,
    change: SyncChange,
    conflicts: SyncConflict[],
  ): Promise<void> {
    if (change.action === 'create') {
      await prisma.work.create({
        data: {
          id: change.id,
          userId,
          ...change.data,
          version: 1,
        },
      });
    } else if (change.action === 'update') {
      const remote = await prisma.work.findUnique({
        where: { id: change.id },
      });

      if (!remote) {
        // 远程不存在，直接创建
        await prisma.work.create({
          data: {
            id: change.id,
            userId,
            ...change.data,
            version: 1,
          },
        });
      } else if (remote.version > change.version) {
        // 版本冲突
        conflicts.push({
          type: 'work',
          id: change.id,
          localVersion: change.version,
          remoteVersion: remote.version,
          localData: change.data,
          remoteData: remote,
        });
      } else {
        // 更新
        await prisma.work.update({
          where: { id: change.id },
          data: {
            ...change.data,
            version: { increment: 1 },
            updatedAt: new Date(),
          },
        });
      }
    } else if (change.action === 'delete') {
      await prisma.work.update({
        where: { id: change.id },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  /**
   * 应用章节变更
   */
  private static async applyChapterChange(
    userId: string,
    change: SyncChange,
    conflicts: SyncConflict[],
  ): Promise<void> {
    // 类似作品变更的逻辑
    if (change.action === 'create') {
      await prisma.chapter.create({
        data: {
          id: change.id,
          ...change.data,
          version: 1,
        },
      });
    } else if (change.action === 'update') {
      const remote = await prisma.chapter.findUnique({
        where: { id: change.id },
      });

      if (!remote) {
        await prisma.chapter.create({
          data: {
            id: change.id,
            ...change.data,
            version: 1,
          },
        });
      } else if (remote.version > change.version) {
        conflicts.push({
          type: 'chapter',
          id: change.id,
          localVersion: change.version,
          remoteVersion: remote.version,
          localData: change.data,
          remoteData: remote,
        });
      } else {
        await prisma.chapter.update({
          where: { id: change.id },
          data: {
            ...change.data,
            version: { increment: 1 },
            updatedAt: new Date(),
          },
        });
      }
    } else if (change.action === 'delete') {
      await prisma.chapter.update({
        where: { id: change.id },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  /**
   * 应用角色变更
   */
  private static async applyCharacterChange(
    userId: string,
    change: SyncChange,
    conflicts: SyncConflict[],
  ): Promise<void> {
    // 类似的实现
  }

  /**
   * 拉取云端变更
   */
  static async pullChanges(
    userId: string,
    clientId: string,
    lastSyncTime: Date,
    tables?: string[],
  ): Promise<{
    syncTime: Date;
    changes: SyncChange[];
  }> {
    const changes: SyncChange[] = [];
    const syncTime = new Date();

    // 获取作品变更
    if (!tables || tables.includes('works')) {
      const works = await prisma.work.findMany({
        where: {
          userId,
          updatedAt: { gt: lastSyncTime },
        },
      });

      for (const work of works) {
        changes.push({
          type: 'work',
          action: work.deletedAt ? 'delete' : work.version === 1 ? 'create' : 'update',
          id: work.id,
          data: work,
          timestamp: work.updatedAt.toISOString(),
          version: work.version,
        });
      }
    }

    // 获取章节变更
    if (!tables || tables.includes('chapters')) {
      const chapters = await prisma.chapter.findMany({
        where: {
          updatedAt: { gt: lastSyncTime },
          work: { userId },
        },
      });

      for (const chapter of chapters) {
        changes.push({
          type: 'chapter',
          action: chapter.deletedAt ? 'delete' : chapter.version === 1 ? 'create' : 'update',
          id: chapter.id,
          data: chapter,
          timestamp: chapter.updatedAt.toISOString(),
          version: chapter.version,
        });
      }
    }

    // 获取角色变更
    if (!tables || tables.includes('characters')) {
      const characters = await prisma.character.findMany({
        where: {
          updatedAt: { gt: lastSyncTime },
          work: { userId },
        },
      });

      for (const character of characters) {
        changes.push({
          type: 'character',
          action: character.deletedAt ? 'delete' : character.version === 1 ? 'create' : 'update',
          id: character.id,
          data: character,
          timestamp: character.updatedAt.toISOString(),
          version: character.version,
        });
      }
    }

    // 记录同步日志
    await prisma.syncLog.create({
      data: {
        id: generateId(),
        userId,
        clientId,
        syncType: 'pull',
        changesCount: changes.length,
        createdAt: syncTime,
      },
    });

    return {
      syncTime,
      changes,
    };
  }
}
