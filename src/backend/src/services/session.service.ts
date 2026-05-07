// @ts-nocheck
import { getRedis } from '../middleware/redis';

interface Session {
  sessionId: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: number;
  lastActivity: number;
}

export class SessionService {
  private static getSessionKey(userId: string, sessionId: string): string {
    return `session:${userId}:${sessionId}`;
  }

  private static getUserSessionsKey(userId: string): string {
    return `user-sessions:${userId}`;
  }

  static async createSession(
    userId: string,
    sessionId: string,
    metadata?: { userAgent?: string; ipAddress?: string }
  ): Promise<void> {
    try {
      const redis = getRedis();
      const session: Session = {
        sessionId,
        userId,
        userAgent: metadata?.userAgent,
        ipAddress: metadata?.ipAddress,
        createdAt: Date.now(),
        lastActivity: Date.now(),
      };

      const sessionKey = this.getSessionKey(userId, sessionId);
      const userSessionsKey = this.getUserSessionsKey(userId);

      await redis.set(sessionKey, JSON.stringify(session), 'EX', 7 * 24 * 3600);
      
      await redis.sadd(userSessionsKey, sessionId);
      await redis.expire(userSessionsKey, 7 * 24 * 3600);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  static async validateSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      const redis = getRedis();
      const sessionKey = this.getSessionKey(userId, sessionId);
      
      const sessionData = await redis.get(sessionKey);
      if (!sessionData) {
        return false;
      }

      const session: Session = JSON.parse(sessionData);
      session.lastActivity = Date.now();
      
      await redis.set(sessionKey, JSON.stringify(session), 'EX', 7 * 24 * 3600);
      
      return true;
    } catch (error) {
      console.error('Failed to validate session:', error);
      return true;
    }
  }

  static async getUserSessions(userId: string): Promise<Session[]> {
    try {
      const redis = getRedis();
      const userSessionsKey = this.getUserSessionsKey(userId);
      
      const sessionIds = await redis.smembers(userSessionsKey);
      const sessions: Session[] = [];

      for (const sessionId of sessionIds) {
        const sessionKey = this.getSessionKey(userId, sessionId);
        const sessionData = await redis.get(sessionKey);
        
        if (sessionData) {
          sessions.push(JSON.parse(sessionData));
        } else {
          await redis.srem(userSessionsKey, sessionId);
        }
      }

      return sessions.sort((a, b) => b.lastActivity - a.lastActivity);
    } catch (error) {
      console.error('Failed to get user sessions:', error);
      return [];
    }
  }

  static async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      const redis = getRedis();
      const sessionKey = this.getSessionKey(userId, sessionId);
      const userSessionsKey = this.getUserSessionsKey(userId);

      await redis.del(sessionKey);
      await redis.srem(userSessionsKey, sessionId);

      return true;
    } catch (error) {
      console.error('Failed to revoke session:', error);
      return false;
    }
  }

  static async revokeAllSessions(userId: string, exceptSessionId?: string): Promise<number> {
    try {
      const redis = getRedis();
      const userSessionsKey = this.getUserSessionsKey(userId);
      
      const sessionIds = await redis.smembers(userSessionsKey);
      let revokedCount = 0;

      for (const sessionId of sessionIds) {
        if (exceptSessionId && sessionId === exceptSessionId) {
          continue;
        }

        const sessionKey = this.getSessionKey(userId, sessionId);
        await redis.del(sessionKey);
        await redis.srem(userSessionsKey, sessionId);
        revokedCount++;
      }

      return revokedCount;
    } catch (error) {
      console.error('Failed to revoke all sessions:', error);
      return 0;
    }
  }

  static async cleanupExpiredSessions(userId: string): Promise<number> {
    try {
      const redis = getRedis();
      const userSessionsKey = this.getUserSessionsKey(userId);
      
      const sessionIds = await redis.smembers(userSessionsKey);
      let cleanedCount = 0;

      for (const sessionId of sessionIds) {
        const sessionKey = this.getSessionKey(userId, sessionId);
        const exists = await redis.exists(sessionKey);
        
        if (!exists) {
          await redis.srem(userSessionsKey, sessionId);
          cleanedCount++;
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
      return 0;
    }
  }

  static async updateActivity(userId: string, sessionId: string): Promise<void> {
    try {
      const redis = getRedis();
      const sessionKey = this.getSessionKey(userId, sessionId);
      
      const sessionData = await redis.get(sessionKey);
      if (sessionData) {
        const session: Session = JSON.parse(sessionData);
        session.lastActivity = Date.now();
        await redis.set(sessionKey, JSON.stringify(session), 'EX', 7 * 24 * 3600);
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }
}
