/**
 * 错别字检测器
 * 支持本地模型和云端 API 混合方案
 */

import type { SpellCheckError, SpellCheckResult, SpellCheckOptions, CloudAPIConfig } from './types';
import { CustomDictionary } from './dict';

/**
 * 错别字检测器类
 */
export class SpellCheckDetector {
  private customDict: CustomDictionary;
  private cloudConfig?: CloudAPIConfig;

  constructor(options?: { customDict?: CustomDictionary; cloudConfig?: CloudAPIConfig }) {
    this.customDict = options?.customDict || new CustomDictionary();
    this.cloudConfig = options?.cloudConfig;
  }

  /**
   * 检测文本中的错别字
   */
  async detect(text: string, options?: SpellCheckOptions): Promise<SpellCheckResult> {
    const startTime = Date.now();

    // 根据选项选择检测方式
    if (options?.useLocal) {
      return this.detectLocal(text, options, startTime);
    } else {
      return this.detectCloud(text, options, startTime);
    }
  }

  /**
   * 使用本地模型检测（轻量级快速检测）
   */
  private async detectLocal(
    text: string,
    options?: SpellCheckOptions,
    startTime?: number,
  ): Promise<SpellCheckResult> {
    // 简单规则检测（演示用，实际应使用 BERT 模型）
    const errors: SpellCheckError[] = [];
    const ignoreTypes = options?.ignoreTypes || [];

    // 常见错别字映射表（示例）
    const commonErrors: Record<string, { correct: string; type: SpellCheckError['type'] }> = {
      的地得: { correct: '的', type: '别字' },
      做作: { correct: '做', type: '别字' },
      在再: { correct: '在', type: '别字' },
      以已: { correct: '以', type: '别字' },
      既然: { correct: '既然', type: '别字' },
    };

    // 检测常见错误
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // 跳过自定义词典中的词
      if (this.customDict.has(char)) {
        continue;
      }

      // 检查常见错误
      const errorInfo = commonErrors[char];
      if (errorInfo && !ignoreTypes.includes(errorInfo.type)) {
        errors.push({
          position: i,
          original: char,
          suggestion: errorInfo.correct,
          type: errorInfo.type,
          confidence: 0.8,
          reason: '常见错别字',
        });
      }
    }

    // 标点符号检查
    if (!ignoreTypes.includes('标点')) {
      const punctuationErrors = this.checkPunctuation(text);
      errors.push(...punctuationErrors);
    }

    // 语病检查
    if (!ignoreTypes.includes('语病')) {
      const grammarErrors = this.checkGrammar(text);
      errors.push(...grammarErrors);
    }

    const processingTime = Date.now() - (startTime || Date.now());

    return {
      text,
      errors,
      processingTime,
      source: 'local',
    };
  }

  /**
   * 使用云端 API 检测（高精度深度检测）
   */
  private async detectCloud(
    text: string,
    options?: SpellCheckOptions,
    startTime?: number,
  ): Promise<SpellCheckResult> {
    if (!this.cloudConfig) {
      // 如果没有配置云端 API，降级到本地检测
      console.warn('Cloud API not configured, falling back to local detection');
      return this.detectLocal(text, options, startTime);
    }

    const maxRetries = options?.maxRetries || 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.callCloudAPI(text, options);
        const processingTime = Date.now() - (startTime || Date.now());

        return {
          text,
          errors: result.errors,
          processingTime,
          source: 'cloud',
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`Cloud API attempt ${attempt} failed:`, error);

        // 如果是最后一次尝试，降级到本地检测
        if (attempt === maxRetries) {
          console.warn('All cloud API attempts failed, falling back to local detection');
          return this.detectLocal(text, options, startTime);
        }

        // 等待一段时间后重试
        await this.sleep(1000 * attempt);
      }
    }

    // 如果所有尝试都失败，降级到本地检测
    return this.detectLocal(text, options, startTime);
  }

  /**
   * 调用云端 API
   */
  private async callCloudAPI(
    text: string,
    options?: SpellCheckOptions,
  ): Promise<{ errors: SpellCheckError[] }> {
    if (!this.cloudConfig) {
      throw new Error('Cloud API config not provided');
    }

    // 根据不同的提供商调用不同的 API
    switch (this.cloudConfig.provider) {
      case 'openai':
        return this.callOpenAI(text, options);
      case 'anthropic':
        return this.callAnthropic(text, options);
      default:
        throw new Error(`Unsupported provider: ${this.cloudConfig.provider}`);
    }
  }

  /**
   * 调用 OpenAI API
   */
  private async callOpenAI(
    text: string,
    options?: SpellCheckOptions,
  ): Promise<{ errors: SpellCheckError[] }> {
    const prompt = this.buildSpellCheckPrompt(text, options);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.cloudConfig!.apiKey}`,
      },
      body: JSON.stringify({
        model: this.cloudConfig!.model || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              '你是一个专业的中文校对助手，擅长检测错别字、语病和标点错误。请以JSON格式返回结果。',
          },
          { role: 'user', content: prompt },
        ],
        temperature: this.cloudConfig!.temperature || 0.3,
        max_tokens: this.cloudConfig!.maxTokens || 2048,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      errors: result.errors || [],
    };
  }

  /**
   * 调用 Anthropic API
   */
  private async callAnthropic(
    text: string,
    options?: SpellCheckOptions,
  ): Promise<{ errors: SpellCheckError[] }> {
    const prompt = this.buildSpellCheckPrompt(text, options);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.cloudConfig!.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.cloudConfig!.model || 'claude-3-sonnet-20240229',
        max_tokens: this.cloudConfig!.maxTokens || 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.content[0].text);

    return {
      errors: result.errors || [],
    };
  }

  /**
   * 构建 Prompt
   */
  private buildSpellCheckPrompt(text: string, options?: SpellCheckOptions): string {
    const customDict = options?.customDict || this.customDict.getAllWords();
    const ignoreTypes = options?.ignoreTypes || [];

    return `请检测以下文本中的错别字、语病和标点错误，并以 JSON 格式返回结果：

文本：
${text}

自定义词典（这些词不应被视为错误）：
${customDict.join('、')}

忽略的错误类型：
${ignoreTypes.length > 0 ? ignoreTypes.join('、') : '无'}

请返回以下格式的 JSON：
{
  "errors": [
    {
      "position": 错误位置（字符索引）,
      "original": "原始文本",
      "suggestion": "建议修改",
      "type": "错误类型（错字/别字/语病/标点）",
      "reason": "错误原因",
      "confidence": 置信度（0-1之间的小数）
    }
  ]
}`;
  }

  /**
   * 检查标点符号错误
   */
  private checkPunctuation(text: string): SpellCheckError[] {
    const errors: SpellCheckError[] = [];
    
    // 检查连续标点
    for (let i = 0; i < text.length - 1; i++) {
      if (/[。，！？；：、]/.test(text[i]) && /[。，！？；：、]/.test(text[i + 1])) {
        errors.push({
          position: i,
          original: text[i] + text[i + 1],
          suggestion: text[i],
          type: '标点',
          confidence: 0.95,
          reason: '连续标点符号',
        });
      }
    }

    // 检查中英文标点混用
    const englishPunctuation = /[,.!?;:]/;
    for (let i = 0; i < text.length; i++) {
      if (englishPunctuation.test(text[i])) {
        errors.push({
          position: i,
          original: text[i],
          suggestion: this.toChinesePunctuation(text[i]),
          type: '标点',
          confidence: 0.85,
          reason: '建议使用中文标点',
        });
      }
    }

    return errors;
  }

  /**
   * 英文标点转中文
   */
  private toChinesePunctuation(char: string): string {
    const map: Record<string, string> = {
      ',': '，',
      '.': '。',
      '!': '！',
      '?': '？',
      ';': '；',
      ':': '：',
    };
    return map[char] || char;
  }

  /**
   * 检查语病（简单规则）
   */
  private checkGrammar(text: string): SpellCheckError[] {
    const errors: SpellCheckError[] = [];

    // 检查常见语病模式
    const grammarPatterns = [
      {
        pattern: /通过.*使.*[让使]/g,
        suggestion: '删除"使"或"让"',
        reason: '成分赘余',
      },
      {
        pattern: /防止.*不再/g,
        suggestion: '删除"不"',
        reason: '否定失当',
      },
    ];

    for (const { pattern, suggestion, reason } of grammarPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        errors.push({
          position: match.index,
          original: match[0],
          suggestion,
          type: '语病',
          confidence: 0.7,
          reason,
        });
      }
    }

    return errors;
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
