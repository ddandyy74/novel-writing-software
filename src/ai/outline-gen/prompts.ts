/**
 * 大纲生成 Prompt 模板
 */

import type { OutlineChapter } from '../types';

/**
 * 构建大纲生成 Prompt
 */
export function buildOutlinePrompt(params: {
  chapterTitle: string;
  chapterContent: string;
  previousOutlines?: OutlineChapter[];
}): string {
  const { chapterTitle, chapterContent, previousOutlines } = params;

  return `你是一个专业的网文大纲编辑，请分析以下章节内容，生成结构化大纲。

## 章节内容
标题：${chapterTitle}
内容：
${chapterContent.slice(0, 5000)}${chapterContent.length > 5000 ? '...(内容过长，已截断)' : ''}

## 前文大纲
${previousOutlines && previousOutlines.length > 0
  ? previousOutlines.map(o => `- 第${o.chapter}章《${o.title}》：${o.summary}`).join('\n')
  : '无（这是第一章）'
}

## 任务要求
1. 提取章节标题（去除章节号，如"第一章 风起云涌"提取为"风起云涌"）
2. 生成 50-100 字的剧情摘要
3. 列出出场人物（仅列出有名字或重要角色）
4. 列出关键事件（3-5 个，简明扼要）
5. 标记伏笔（如有暗示后续发展的情节）
6. 提取时间线（如"第三天清晨"、"半年后"等）

## 输出格式（JSON）
{
  "chapter": 章节序号,
  "title": "章节标题",
  "summary": "剧情摘要",
  "characters": ["人物1", "人物2"],
  "events": ["事件1", "事件2", "事件3"],
  "foreshadowing": ["伏笔1", "伏笔2"],
  "timeline": "时间线描述"
}

## 注意事项
- 只输出 JSON，不要添加任何解释
- summary 应简洁明了，突出核心冲突或发展
- characters 只列出真正有出场的角色
- events 按时间顺序排列
- foreshadowing 可以留空数组`;
}

/**
 * 构建大纲更新 Prompt
 */
export function buildOutlineUpdatePrompt(params: {
  currentOutline: OutlineChapter;
  newContent: string;
}): string {
  const { currentOutline, newContent } = params;

  return `你是一个专业的网文大纲编辑，章节内容有更新，请更新大纲。

## 当前大纲
${JSON.stringify(currentOutline, null, 2)}

## 新增内容
${newContent.slice(0, 3000)}${newContent.length > 3000 ? '...(内容过长，已截断)' : ''}

## 任务要求
1. 根据新增内容更新摘要
2. 添加新出场的人物
3. 添加新的关键事件
4. 添加新的伏笔（如有）
5. 更新时间线

## 输出格式（JSON）
返回完整的更新后大纲，格式同上。`;
}

/**
 * 构建批量大纲生成 Prompt
 */
export function buildBatchOutlinePrompt(params: {
  chapters: Array<{ title: string; content: string }>;
}): string {
  const { chapters } = params;

  const chapterSummaries = chapters
    .map(
      (ch, i) =>
        `第${i + 1}章《${ch.title}》：${ch.content.slice(0, 200)}...`,
    )
    .join('\n\n');

  return `你是一个专业的网文大纲编辑，请分析以下多个章节的内容，生成结构化大纲。

## 章节列表
${chapterSummaries}

## 任务要求
为每个章节生成大纲，包括：
1. 章节标题
2. 剧情摘要（50-100字）
3. 出场人物
4. 关键事件（3-5个）
5. 伏笔标记

## 输出格式（JSON数组）
[
  {
    "chapter": 1,
    "title": "章节标题",
    "summary": "剧情摘要",
    "characters": ["人物1", "人物2"],
    "events": ["事件1", "事件2"],
    "foreshadowing": ["伏笔1"]
  },
  ...
]`;
}
