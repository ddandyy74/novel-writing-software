/**
 * 封面生成 API 入口
 */

import { CoverGenerator, type CoverGeneratorConfig } from './generator';
import type { CoverGenerateRequest, CoverGenerateResult, CoverImage, CoverStyle } from '../types';

export { CoverGenerator } from './generator';
export * from './prompts';
export type { CoverGenerateRequest, CoverGenerateResult, CoverImage, CoverStyle };

/**
 * 创建封面生成器实例
 */
export function createCoverGenerator(config: {
  stabilityApiKey?: string;
  replicateApiKey?: string;
  volcengineApiKey?: string;
  baseUrl?: string;
  cache?: CoverGeneratorConfig['cache'];
}): CoverGenerator {
  const provider: CoverGeneratorConfig['provider'] = config.stabilityApiKey
    ? 'stability'
    : config.replicateApiKey
      ? 'replicate'
      : 'volcengine';

  const apiKey =
    config.stabilityApiKey || config.replicateApiKey || config.volcengineApiKey;

  if (!apiKey) {
    throw new Error('At least one API key is required (stability, replicate, or volcengine)');
  }

  return new CoverGenerator({
    provider,
    apiKey,
    baseUrl: config.baseUrl,
    cache: config.cache,
  });
}

/**
 * 快速生成封面函数
 */
export async function generateCover(
  request: CoverGenerateRequest,
  config: {
    stabilityApiKey?: string;
    replicateApiKey?: string;
  },
): Promise<CoverGenerateResult> {
  const generator = createCoverGenerator(config);
  return generator.generate(request);
}

/**
 * 预览封面风格
 */
export const COVER_STYLES: Array<{ value: CoverStyle; label: string; description: string }> = [
  {
    value: '古风',
    label: '古风',
    description: '传统水墨风格，适合武侠、仙侠小说',
  },
  {
    value: '现代',
    label: '现代',
    description: '现代都市风格，简洁时尚',
  },
  {
    value: '玄幻',
    label: '玄幻',
    description: '奇幻神秘风格，适合玄幻、奇幻小说',
  },
  {
    value: '言情',
    label: '言情',
    description: '浪漫唯美风格，适合言情小说',
  },
  {
    value: '科幻',
    label: '科幻',
    description: '未来科技风格，适合科幻小说',
  },
  {
    value: '悬疑',
    label: '悬疑',
    description: '神秘黑暗风格，适合悬疑推理小说',
  },
];
