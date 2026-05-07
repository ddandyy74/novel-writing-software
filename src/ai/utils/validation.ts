import { z } from 'zod';

export const SpellCheckRequestSchema = z.object({
  text: z.string()
    .min(1, '文本不能为空')
    .max(50000, '单次检测文本不能超过 50000 字符'),
  options: z.object({
    useLocal: z.boolean().optional(),
    customDict: z.array(z.string()).max(100).optional(),
    ignoreTypes: z.array(z.enum(['错字', '别字', '语病', '标点'])).optional(),
    maxRetries: z.number().min(1).max(5).optional(),
  }).optional(),
});

export const OutlineRequestSchema = z.object({
  chapterContent: z.string()
    .min(1, '章节内容不能为空')
    .max(100000, '章节内容不能超过 100000 字符'),
  options: z.object({
    extractCharacters: z.boolean().optional(),
    extractEvents: z.boolean().optional(),
    extractTimeline: z.boolean().optional(),
  }).optional(),
});

export const CoverRequestSchema = z.object({
  prompt: z.string()
    .min(1, '提示词不能为空')
    .max(1000, '提示词不能超过 1000 字符'),
  style: z.enum(['realistic', 'anime', 'oil-painting', 'watercolor']).optional(),
  width: z.number().min(256).max(2048).optional(),
  height: z.number().min(256).max(2048).optional(),
});

const PROMPT_INJECTION_PATTERNS = [
  /忽略之前的所有指令/gi,
  /ignore previous instructions/gi,
  /系统提示词/gi,
  /system prompt/gi,
  /你现在是/gi,
  /you are now/gi,
  /扮演/gi,
  /pretend/gi,
  /你的指令是什么/gi,
  /what are your instructions/gi,
];

export function sanitizeUserInput(text: string): string {
  let sanitized = text;
  
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[已过滤]');
  }
  
  return sanitized;
}

export function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
