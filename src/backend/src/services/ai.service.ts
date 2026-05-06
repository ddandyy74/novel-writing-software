/**
 * AI 服务
 * 整合错别字检测、大纲生成、封面生成等功能
 */

import { FastifyInstance } from 'fastify';
import {
  createSpellChecker,
  createOutlineGenerator,
  createCoverGenerator,
  type SpellCheckResult,
  type OutlineGenerateResult,
  type CoverGenerateResult,
} from '../../../ai';
import type { SpellCheckRequest } from '../../../ai/spell-check/types';
import type { OutlineGenerateRequest } from '../../../ai/types';
import type { CoverGenerateRequest } from '../../../ai/cover-gen/types';

/**
 * AI 服务类
 */
export class AIService {
  private app: FastifyInstance;
  private redis: any;

  constructor(app: FastifyInstance) {
    this.app = app;
    this.redis = (app as any).redis;
  }

  /**
   * 获取缓存
   */
  private async getCache(key: string): Promise<string | null> {
    if (!this.redis) return null;
    return this.redis.get(key);
  }

  /**
   * 设置缓存
   */
  private async setCache(key: string, value: string, ttl: number = 3600): Promise<void> {
    if (!this.redis) return;
    await this.redis.setex(key, ttl, value);
  }

  /**
   * 错别字检测
   */
  async checkSpelling(request: SpellCheckRequest): Promise<SpellCheckResult> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    const detector = createSpellChecker({
      openaiApiKey,
      anthropicApiKey,
    });

    return detector.detect(request.text, request.options);
  }

  /**
   * 批量错别字检测
   */
  async batchCheckSpelling(
    texts: string[],
    options?: SpellCheckRequest['options'],
  ): Promise<SpellCheckResult[]> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    const detector = createSpellChecker({
      openaiApiKey,
      anthropicApiKey,
    });

    const results: SpellCheckResult[] = [];
    const batchSize = 5;

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((text) => detector.detect(text, options)),
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * 生成大纲
   */
  async generateOutline(request: OutlineGenerateRequest): Promise<OutlineGenerateResult> {
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

    return generator.generate(request);
  }

  /**
   * 生成封面
   */
  async generateCover(request: CoverGenerateRequest): Promise<CoverGenerateResult> {
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

    return generator.generate(request);
  }

  /**
   * 记录 AI 使用统计
   */
  async logUsage(params: {
    userId: string;
    service: string;
    tokens?: number;
    cost: number;
  }): Promise<void> {
    // TODO: 实现使用统计记录到数据库
    console.log('AI Usage:', params);
  }

  /**
   * 检查用户配额
   */
  async checkQuota(userId: string, service: string): Promise<boolean> {
    // TODO: 实现配额检查
    // 免费用户：每日限制次数
    // 付费用户：无限制
    return true;
  }
}
