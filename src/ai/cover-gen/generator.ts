/**
 * 封面生成器
 * 使用 Stable Diffusion API 生成小说封面
 */

import type { CoverGenerateRequest, CoverGenerateResult, CoverImage, CoverStyle } from '../types';
import { buildCoverPrompt, buildNegativePrompt } from './prompts';

/**
 * 封面生成器配置
 */
export interface CoverGeneratorConfig {
  provider: 'stability' | 'replicate' | 'volcengine';
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  cache?: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string, ttl?: number) => Promise<void>;
  };
}

/**
 * 封面生成器类
 */
export class CoverGenerator {
  private config: CoverGeneratorConfig;

  constructor(config: CoverGeneratorConfig) {
    this.config = config;
  }

  /**
   * 生成封面
   */
  async generate(request: CoverGenerateRequest): Promise<CoverGenerateResult> {
    const startTime = Date.now();

    // 检查缓存
    if (this.config.cache) {
      const cacheKey = this.getCacheKey(request);
      const cached = await this.config.cache.get(cacheKey);
      if (cached) {
        console.log('Using cached cover');
        const cachedResult = JSON.parse(cached);
        return {
          ...cachedResult,
          processingTime: Date.now() - startTime,
        };
      }
    }

    const images = await this.callAPI(request);
    const processingTime = Date.now() - startTime;

    const result: CoverGenerateResult = {
      workId: request.workId,
      images,
      generatedAt: new Date().toISOString(),
      processingTime,
    };

    // 缓存结果（24小时）
    if (this.config.cache) {
      const cacheKey = this.getCacheKey(request);
      await this.config.cache.set(cacheKey, JSON.stringify(result), 86400);
    }

    return result;
  }

  /**
   * 调用 API
   */
  private async callAPI(request: CoverGenerateRequest): Promise<CoverImage[]> {
    const maxRetries = this.config.maxRetries || 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.executeAPICall(request);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`Cover generation attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          await this.sleep(2000 * attempt);
        }
      }
    }

    throw lastError || new Error('Cover generation failed');
  }

  /**
   * 执行 API 调用
   */
  private async executeAPICall(request: CoverGenerateRequest): Promise<CoverImage[]> {
    switch (this.config.provider) {
      case 'stability':
        return this.callStabilityAI(request);
      case 'replicate':
        return this.callReplicate(request);
      case 'volcengine':
        return this.callVolcengine(request);
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  /**
   * 调用 Stability AI API
   */
  private async callStabilityAI(request: CoverGenerateRequest): Promise<CoverImage[]> {
    const prompt = buildCoverPrompt({
      workTitle: request.workTitle,
      author: request.author,
      genre: request.genre,
      style: request.style,
      tags: request.tags,
      description: request.description,
    });

    const negativePrompt = buildNegativePrompt(request.style);

    const response = await fetch(
      this.config.baseUrl ||
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          text_prompts: [
            { text: prompt, weight: 1 },
            { text: negativePrompt, weight: -1 },
          ],
          cfg_scale: 7,
          height: request.options?.height || 1536,
          width: request.options?.width || 1024,
          samples: request.options?.samples || 4,
          steps: 30,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stability AI API error: ${response.statusText} - ${error}`);
    }

    const data = await response.json();

    return data.artifacts.map(
      (artifact: any, i: number): CoverImage => ({
        versionId: `v${i + 1}`,
        imageUrl: `data:image/png;base64,${artifact.base64}`,
        seed: artifact.seed,
        width: request.options?.width || 1024,
        height: request.options?.height || 1536,
      }),
    );
  }

  /**
   * 调用 Replicate API
   */
  private async callReplicate(request: CoverGenerateRequest): Promise<CoverImage[]> {
    const prompt = buildCoverPrompt({
      workTitle: request.workTitle,
      author: request.author,
      genre: request.genre,
      style: request.style,
      tags: request.tags,
      description: request.description,
    });

    // 创建预测
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        version:
          'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: {
          prompt,
          negative_prompt: buildNegativePrompt(request.style),
          width: request.options?.width || 1024,
          height: request.options?.height || 1536,
          num_outputs: request.options?.samples || 4,
        },
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Replicate API error: ${createResponse.statusText}`);
    }

    const prediction = await createResponse.json();

    // 轮询结果
    const result = await this.pollReplicateResult(prediction.urls.get);

    return result.output.map(
      (url: string, i: number): CoverImage => ({
        versionId: `v${i + 1}`,
        imageUrl: url,
        width: request.options?.width || 1024,
        height: request.options?.height || 1536,
      }),
    );
  }

  /**
   * 轮询 Replicate 结果
   */
  private async pollReplicateResult(url: string): Promise<any> {
    const maxAttempts = 60;
    const interval = 2000;

    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Replicate polling error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'succeeded') {
        return result;
      } else if (result.status === 'failed') {
        throw new Error('Replicate prediction failed');
      }

      await this.sleep(interval);
    }

    throw new Error('Replicate prediction timeout');
  }

  /**
   * 调用火山引擎 API
   */
  private async callVolcengine(request: CoverGenerateRequest): Promise<CoverImage[]> {
    // TODO: 实现火山引擎 API 调用
    throw new Error('Volcengine API not implemented yet');
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(request: CoverGenerateRequest): string {
    const content = `${request.workId}:${request.workTitle}:${request.style}:${request.genre}`;
    return `cover:${this.hashString(content)}`;
  }

  /**
   * 简单哈希函数
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
