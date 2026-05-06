/**
 * 错别字检测 API 入口
 */

import { SpellCheckDetector } from './detector';
import { CustomDictionary, defaultDictionary } from './dict';
import type { SpellCheckRequest, SpellCheckResult, SpellCheckOptions } from './types';

// 导出类型和类
export * from './types';
export { SpellCheckDetector, CustomDictionary, defaultDictionary };

/**
 * 创建错别字检测器实例
 */
export function createSpellChecker(options?: {
  customDict?: CustomDictionary;
  openaiApiKey?: string;
  anthropicApiKey?: string;
}): SpellCheckDetector {
  const cloudConfig = options?.openaiApiKey
    ? {
        provider: 'openai' as const,
        apiKey: options.openaiApiKey,
      }
    : options?.anthropicApiKey
      ? {
          provider: 'anthropic' as const,
          apiKey: options.anthropicApiKey,
        }
      : undefined;

  return new SpellCheckDetector({
    customDict: options?.customDict || defaultDictionary,
    cloudConfig,
  });
}

/**
 * 快速检测函数
 */
export async function checkSpelling(
  text: string,
  options?: SpellCheckOptions & {
    openaiApiKey?: string;
    anthropicApiKey?: string;
  },
): Promise<SpellCheckResult> {
  const detector = createSpellChecker({
    openaiApiKey: options?.openaiApiKey,
    anthropicApiKey: options?.anthropicApiKey,
  });

  return detector.detect(text, options);
}

/**
 * 批量检测函数
 */
export async function batchCheckSpelling(
  texts: string[],
  options?: SpellCheckOptions & {
    openaiApiKey?: string;
    anthropicApiKey?: string;
    concurrency?: number;
  },
): Promise<SpellCheckResult[]> {
  const concurrency = options?.concurrency || 5;
  const detector = createSpellChecker({
    openaiApiKey: options?.openaiApiKey,
    anthropicApiKey: options?.anthropicApiKey,
  });

  const results: SpellCheckResult[] = [];

  // 分批处理
  for (let i = 0; i < texts.length; i += concurrency) {
    const batch = texts.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((text) => detector.detect(text, options)),
    );
    results.push(...batchResults);
  }

  return results;
}
