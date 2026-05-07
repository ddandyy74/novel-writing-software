/**
 * 大纲生成 API 入口
 */

import { OutlineGenerator, type OutlineGeneratorConfig } from './generator';
import type { OutlineGenerateRequest, OutlineGenerateResult, OutlineChapter } from '../types';

export { OutlineGenerator } from './generator';
export * from './prompts';
export type { OutlineGenerateRequest, OutlineGenerateResult, OutlineChapter };

/**
 * 创建大纲生成器实例
 */
export function createOutlineGenerator(config: {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  baseUrl?: string;
  model?: string;
  cache?: OutlineGeneratorConfig['cache'];
}): OutlineGenerator {
  const provider = config.openaiApiKey ? 'openai' : 'anthropic';
  const apiKey = config.openaiApiKey || config.anthropicApiKey;

  if (!apiKey) {
    throw new Error('Either openaiApiKey or anthropicApiKey is required');
  }

  return new OutlineGenerator({
    provider,
    apiKey,
    baseUrl: config.baseUrl,
    model: config.model,
    cache: config.cache,
  });
}

/**
 * 快速生成大纲函数
 */
export async function generateOutline(
  request: OutlineGenerateRequest,
  config: {
    openaiApiKey?: string;
    anthropicApiKey?: string;
  },
): Promise<OutlineGenerateResult> {
  const generator = createOutlineGenerator(config);
  return generator.generate(request);
}

/**
 * 大纲转 Markdown
 */
export function outlineToMarkdown(outline: OutlineChapter): string {
  let markdown = `## 第${outline.chapter}章 ${outline.title}\n\n`;
  markdown += `### 剧情摘要\n${outline.summary}\n\n`;
  
  if (outline.characters.length > 0) {
    markdown += `### 出场人物\n`;
    outline.characters.forEach((char) => {
      markdown += `- ${char}\n`;
    });
    markdown += '\n';
  }

  if (outline.events.length > 0) {
    markdown += `### 关键事件\n`;
    outline.events.forEach((event, i) => {
      markdown += `${i + 1}. ${event}\n`;
    });
    markdown += '\n';
  }

  if (outline.foreshadowing.length > 0) {
    markdown += `### 伏笔标记\n`;
    outline.foreshadowing.forEach((f) => {
      markdown += `- ${f}\n`;
    });
    markdown += '\n';
  }

  if (outline.timeline) {
    markdown += `### 时间线\n${outline.timeline}\n`;
  }

  return markdown;
}

/**
 * 批量大纲转 Markdown
 */
export function outlinesToMarkdown(outlines: OutlineChapter[]): string {
  return outlines.map(outlineToMarkdown).join('\n---\n\n');
}
