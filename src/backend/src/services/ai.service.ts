import { FastifyInstance } from 'fastify';
import {
  createSpellChecker,
  createOutlineGenerator,
  createCoverGenerator,
  type SpellCheckResult,
  type OutlineGenerateResult,
  type CoverGenerateResult,
  type SpellCheckRequest,
  type OutlineGenerateRequest,
  type CoverGenerateRequest,
} from '../ai';

const QUOTA_LIMITS: Record<string, Record<string, number>> = {
  free: {
    'spell-check': 100,
    'outline-gen': 10,
    'cover-gen': 2,
  },
  pro: {
    'spell-check': 1000,
    'outline-gen': 100,
    'cover-gen': 20,
  },
  enterprise: {
    'spell-check': -1,
    'outline-gen': -1,
    'cover-gen': -1,
  },
};

const COST_PER_UNIT: Record<string, number> = {
  'spell-check': 0.001,
  'outline-gen': 0.01,
  'cover-gen': 0.1,
};

export class AIService {
  private app: FastifyInstance;
  private redis: any;
  private prisma: any;

  constructor(app: FastifyInstance) {
    this.app = app;
    this.redis = (app as any).redis;
    this.prisma = (app as any).prisma;
  }

  private async getCache(key: string): Promise<string | null> {
    if (!this.redis) return null;
    return this.redis.get(key);
  }

  private async setCache(key: string, value: string, ttl: number = 3600): Promise<void> {
    if (!this.redis) return;
    await this.redis.setex(key, ttl, value);
  }

  async checkSpelling(request: SpellCheckRequest & { userId?: string }): Promise<SpellCheckResult> {
    const userId = request.userId || 'anonymous';
    
    if (!await this.checkQuota(userId, 'spell-check')) {
      throw new Error('今日配额已用完，请升级会员或明天再试');
    }
    
    const textLength = request.text.length;
    const estimatedCost = this.estimateCost('spell-check', textLength);
    
    if (estimatedCost > 0.1) {
      this.app.log.warn(`High cost request: userId=${userId}, cost=${estimatedCost}`);
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    const detector = createSpellChecker({
      openaiApiKey,
      anthropicApiKey,
    });

    const result = await detector.detect(request.text, request.options);
    
    await this.logUsage({
      userId,
      service: 'spell-check',
      tokens: textLength,
      cost: estimatedCost,
    });

    return result;
  }

  async batchCheckSpelling(
    texts: string[],
    options?: SpellCheckRequest['options'],
    userId?: string,
  ): Promise<SpellCheckResult[]> {
    const actualUserId = userId || 'anonymous';
    
    if (!await this.checkQuota(actualUserId, 'spell-check')) {
      throw new Error('今日配额已用完，请升级会员或明天再试');
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    const detector = createSpellChecker({
      openaiApiKey,
      anthropicApiKey,
    });

    const results: SpellCheckResult[] = [];
    const batchSize = 3;
    const delayMs = 500;

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((text) => detector.detect(text, options)),
      );
      results.push(...batchResults);
      
      if (i + batchSize < texts.length) {
        await this.sleep(delayMs);
      }
    }

    await this.logUsage({
      userId: actualUserId,
      service: 'spell-check',
      tokens: texts.reduce((sum, t) => sum + t.length, 0),
      cost: this.estimateCost('spell-check', texts.reduce((sum, t) => sum + t.length, 0)),
    });

    return results;
  }

  async generateOutline(request: OutlineGenerateRequest & { userId?: string }): Promise<OutlineGenerateResult> {
    const userId = request.userId || 'anonymous';
    
    if (!await this.checkQuota(userId, 'outline-gen')) {
      throw new Error('今日配额已用完，请升级会员或明天再试');
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    const generator = createOutlineGenerator({
      openaiApiKey,
      anthropicApiKey,
      cache: {
        get: (key) => this.getCache(key),
        set: (key, value, ttl) => this.setCache(key, value, ttl),
      },
    });

    const result = await generator.generate(request);
    
    await this.logUsage({
      userId,
      service: 'outline-gen',
      cost: this.estimateCost('outline-gen', request.chapterContent.length),
    });

    return result;
  }

  async generateCover(request: CoverGenerateRequest & { userId?: string }): Promise<CoverGenerateResult> {
    const userId = request.userId || 'anonymous';
    
    if (!await this.checkQuota(userId, 'cover-gen')) {
      throw new Error('今日配额已用完，请升级会员或明天再试');
    }

    const stabilityApiKey = process.env.STABILITY_API_KEY;
    const replicateApiKey = process.env.REPLICATE_API_KEY;

    const generator = createCoverGenerator({
      stabilityApiKey,
      replicateApiKey,
      cache: {
        get: (key) => this.getCache(key),
        set: (key, value, ttl) => this.setCache(key, value, ttl),
      },
    });

    const result = await generator.generate(request);
    
    await this.logUsage({
      userId,
      service: 'cover-gen',
      cost: COST_PER_UNIT['cover-gen'],
    });

    return result;
  }

  async logUsage(params: {
    userId: string;
    service: string;
    tokens?: number;
    cost: number;
  }): Promise<void> {
    this.app.log.info(params, 'AI Usage');
    
    if (this.prisma) {
      try {
        await this.prisma.aIUsageLog.create({
          data: {
            userId: params.userId,
            service: params.service,
            tokens: params.tokens || 0,
            cost: params.cost,
            createdAt: new Date(),
          },
        });
      } catch (error) {
        this.app.log.error(error, 'Failed to log AI usage');
      }
    }
  }

  async checkQuota(userId: string, service: string): Promise<boolean> {
    if (!this.redis) {
      this.app.log.warn('Redis not available, quota check skipped');
      return true;
    }

    const today = new Date().toISOString().split('T')[0];
    const key = `quota:${userId}:${service}:${today}`;

    let userPlan = 'free';
    if (this.prisma) {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { plan: true },
        });
        userPlan = user?.plan || 'free';
      } catch (error) {
        this.app.log.error(error, 'Failed to get user plan');
      }
    }

    const limits = QUOTA_LIMITS[userPlan] || QUOTA_LIMITS.free;
    const limit = limits[service];
    
    if (limit === -1) {
      return true;
    }

    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, 86400);
    }

    if (current > limit) {
      this.app.log.warn({ userId, service, current, limit }, 'Quota exceeded');
      return false;
    }

    return true;
  }

  private estimateCost(service: string, units: number): number {
    const costPerUnit = COST_PER_UNIT[service] || 0;
    return units * costPerUnit;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
