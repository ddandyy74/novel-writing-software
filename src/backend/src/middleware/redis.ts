import { FastifyRequest, FastifyReply } from 'fastify';
import Redis from 'ioredis';
import { config } from '../config';
import { errorResponse, ErrorCodes, ErrorMessages } from '../utils/response';

// Redis 客户端
let redis: Redis | null = null;

/**
 * 初始化 Redis 客户端
 */
export async function initRedis(): Promise<Redis> {
  if (!redis) {
    redis = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: true,
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    await redis.connect();
  }

  return redis;
}

/**
 * 获取 Redis 客户端
 */
export function getRedis(): Redis {
  if (!redis) {
    throw new Error('Redis not initialized');
  }
  return redis;
}

/**
 * 关闭 Redis 连接
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

/**
 * 限流中间件工厂
 */
export function rateLimitMiddleware(limit: number, windowSeconds: number) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const redis = getRedis();
      const userId = request.user?.userId || request.ip;
      const key = `rate-limit:${userId}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }

      const ttl = await redis.ttl(key);

      // 设置响应头
      reply.header('X-RateLimit-Limit', limit);
      reply.header('X-RateLimit-Remaining', Math.max(0, limit - current));
      reply.header('X-RateLimit-Reset', Date.now() + ttl * 1000);

      if (current > limit) {
        return reply.status(429).send(
          errorResponse(ErrorCodes.SYSTEM_RATE_LIMIT_EXCEEDED, ErrorMessages[ErrorCodes.SYSTEM_RATE_LIMIT_EXCEEDED], {
            retryAfter: ttl,
          })
        );
      }
    } catch (error) {
      // Redis 错误不应该阻止请求
      request.log.error('Rate limit error:', error);
    }
  };
}

/**
 * 检查 Nonce（防重放攻击）
 */
export async function checkNonce(nonce: string, timestamp: number): Promise<boolean> {
  const redis = getRedis();
  const key = `nonce:${nonce}`;

  // 检查时间戳（5 分钟内有效）
  if (Math.abs(Date.now() - timestamp) > 5 * 60 * 1000) {
    return false;
  }

  // 检查 nonce 是否已使用
  const exists = await redis.exists(key);
  if (exists) {
    return false;
  }

  // 标记 nonce 为已使用（过期时间 10 分钟）
  await redis.setex(key, 600, '1');
  return true;
}
