import crypto from 'crypto';
import type { OutlineChapter, OutlineGenerateResult, OutlineGenerateRequest } from '../types';
import { buildOutlinePrompt, buildOutlineUpdatePrompt, buildBatchOutlinePrompt } from './prompts';

export interface OutlineGeneratorConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxRetries?: number;
  cache?: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string, ttl?: number) => Promise<void>;
  };
}

export class OutlineGenerator {
  private config: OutlineGeneratorConfig;

  constructor(config: OutlineGeneratorConfig) {
    this.config = config;
  }

  async generate(request: OutlineGenerateRequest): Promise<OutlineGenerateResult> {
    const startTime = Date.now();

    if (this.config.cache) {
      const cacheKey = this.getCacheKey(request);
      const cached = await this.config.cache.get(cacheKey);
      if (cached) {
        console.log('Using cached outline');
        const cachedResult = JSON.parse(cached);
        return {
          ...cachedResult,
          processingTime: Date.now() - startTime,
        };
      }
    }

    const prompt = buildOutlinePrompt({
      chapterTitle: request.chapterTitle,
      chapterContent: request.chapterContent,
      previousOutlines: request.previousOutlines,
    });

    const outline = await this.callAPI(prompt);
    const processingTime = Date.now() - startTime;

    const result: OutlineGenerateResult = {
      workId: request.workId,
      chapterId: request.chapterId,
      outline,
      generatedAt: new Date().toISOString(),
      processingTime,
    };

    if (this.config.cache) {
      const cacheKey = this.getCacheKey(request);
      await this.config.cache.set(cacheKey, JSON.stringify(result), 3600);
    }

    return result;
  }

  /**
   * 更新章节大纲
   */
  async update(
    currentOutline: OutlineChapter,
    newContent: string,
  ): Promise<OutlineChapter> {
    const prompt = buildOutlineUpdatePrompt({
      currentOutline,
      newContent,
    });

    return this.callAPI(prompt);
  }

  /**
   * 批量生成大纲
   */
  async generateBatch(
    chapters: Array<{ title: string; content: string }>,
  ): Promise<OutlineChapter[]> {
    const prompt = buildBatchOutlinePrompt({ chapters });
    return this.callAPI(prompt);
  }

  /**
   * 调用 API
   */
  private async callAPI(prompt: string): Promise<OutlineChapter | OutlineChapter[]> {
    const maxRetries = this.config.maxRetries || 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.executeAPICall(prompt);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`Outline generation attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          await this.sleep(1000 * attempt);
        }
      }
    }

    throw lastError || new Error('Outline generation failed');
  }

  /**
   * 执行 API 调用
   */
  private async executeAPICall(prompt: string): Promise<OutlineChapter | OutlineChapter[]> {
    if (this.config.provider === 'openai') {
      return this.callOpenAI(prompt);
    } else {
      return this.callAnthropic(prompt);
    }
  }

  /**
   * 调用 OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<OutlineChapter | OutlineChapter[]> {
    const response = await fetch(
      this.config.baseUrl || 'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content:
                '你是一个专业的网文大纲编辑，擅长分析章节内容并生成结构化大纲。请严格按照JSON格式返回。',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 2048,
          response_format: { type: 'json_object' },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // 判断是单个大纲还是数组
    if (Array.isArray(result)) {
      return result as OutlineChapter[];
    }

    return result as OutlineChapter;
  }

  /**
   * 调用 Anthropic API
   */
  private async callAnthropic(prompt: string): Promise<OutlineChapter | OutlineChapter[]> {
    const response = await fetch(
      this.config.baseUrl || 'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-sonnet-20240229',
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.content[0].text);

    // 判断是单个大纲还是数组
    if (Array.isArray(result)) {
      return result as OutlineChapter[];
    }

    return result as OutlineChapter;
  }

  private getCacheKey(request: OutlineGenerateRequest): string {
    const keyData = {
      workId: request.workId,
      chapterId: request.chapterId,
      contentHash: this.hashContent(request.chapterContent),
      title: request.chapterTitle,
      previousCount: request.previousOutlines?.length || 0,
    };
    
    const keyString = JSON.stringify(keyData);
    const hash = crypto.createHash('sha256').update(keyString).digest('hex').slice(0, 32);
    
    return `outline:${request.workId}:${request.chapterId}:${hash}`;
  }

  private hashContent(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
