import { FastifyInstance } from 'fastify';
import { encrypt, decrypt } from '../utils/crypto';
import { config } from '../config';

interface PlatformCredential {
  userId: string;
  platform: string;
  platformUserId: string;
  platformUsername: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

interface DecryptedCredential {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export class PlatformService {
  private app: FastifyInstance;
  private prisma: any;

  constructor(app: FastifyInstance) {
    this.app = app;
    this.prisma = (app as any).prisma;
  }

  async saveCredential(credential: PlatformCredential): Promise<void> {
    if (!this.prisma) {
      throw new Error('Database not available');
    }

    const encryptedAccess = encrypt(credential.accessToken, config.encryption.aesKey);
    const encryptedRefresh = credential.refreshToken
      ? encrypt(credential.refreshToken, config.encryption.aesKey)
      : null;

    await this.prisma.platformAccount.upsert({
      where: {
        userId_platform: {
          userId: credential.userId,
          platform: credential.platform,
        },
      },
      create: {
        userId: credential.userId,
        platform: credential.platform,
        platformUserId: credential.platformUserId,
        platformUsername: credential.platformUsername,
        accessToken: JSON.stringify(encryptedAccess),
        refreshToken: encryptedRefresh ? JSON.stringify(encryptedRefresh) : null,
        expiresAt: credential.expiresAt,
      },
      update: {
        platformUserId: credential.platformUserId,
        platformUsername: credential.platformUsername,
        accessToken: JSON.stringify(encryptedAccess),
        refreshToken: encryptedRefresh ? JSON.stringify(encryptedRefresh) : null,
        expiresAt: credential.expiresAt,
      },
    });
  }

  async getCredential(userId: string, platform: string): Promise<DecryptedCredential | null> {
    if (!this.prisma) {
      throw new Error('Database not available');
    }

    const account = await this.prisma.platformAccount.findUnique({
      where: {
        userId_platform: {
          userId,
          platform,
        },
      },
    });

    if (!account) {
      return null;
    }

    try {
      const accessToken = decrypt(JSON.parse(account.accessToken), config.encryption.aesKey);
      const refreshToken = account.refreshToken
        ? decrypt(JSON.parse(account.refreshToken), config.encryption.aesKey)
        : undefined;

      return {
        accessToken,
        refreshToken,
        expiresAt: account.expiresAt || undefined,
      };
    } catch (error) {
      this.app.log.error('Failed to decrypt platform credential', { userId, platform, error });
      throw new Error('Failed to decrypt credential');
    }
  }

  async deleteCredential(userId: string, platform: string): Promise<void> {
    if (!this.prisma) {
      throw new Error('Database not available');
    }

    await this.prisma.platformAccount.delete({
      where: {
        userId_platform: {
          userId,
          platform,
        },
      },
    });
  }

  async listUserPlatforms(userId: string): Promise<Array<{ platform: string; platformUsername: string }>> {
    if (!this.prisma) {
      throw new Error('Database not available');
    }

    const accounts = await this.prisma.platformAccount.findMany({
      where: { userId },
      select: {
        platform: true,
        platformUsername: true,
      },
    });

    return accounts;
  }

  isTokenExpired(expiresAt?: Date): boolean {
    if (!expiresAt) return false;
    const bufferMs = 5 * 60 * 1000;
    return new Date().getTime() > expiresAt.getTime() - bufferMs;
  }
}
