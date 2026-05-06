/**
 * 封面生成 Prompt 模板
 */

import type { CoverStyle } from '../types';

/**
 * 风格关键词映射
 */
const STYLE_KEYWORDS: Record<CoverStyle, string> = {
  古风: 'ancient Chinese style, traditional painting, ink wash, elegant, classical, historical',
  现代: 'modern, contemporary, urban, clean, minimalist, stylish',
  玄幻: 'fantasy, magical, mystical, ethereal, epic, divine, supernatural',
  言情: 'romantic, soft, dreamy, elegant, beautiful, emotional',
  科幻: 'sci-fi, futuristic, cyberpunk, technological, space, neon',
  悬疑: 'mysterious, dark, thriller, suspense, noir, atmospheric',
};

/**
 * 题材关键词映射
 */
const GENRE_KEYWORDS: Record<string, string> = {
  玄幻: 'cultivation, martial arts, fantasy world, mythical creatures',
  奇幻: 'magic, fantasy, dragons, elves, mystical realm',
  武侠: 'martial arts, swordsman, wuxia, ancient China',
  仙侠: 'immortal cultivation, flying swords, magical realms',
  都市: 'modern city, urban life, skyscrapers, contemporary',
  现实: 'realistic, slice of life, everyday, relatable',
  军事: 'military, soldiers, war, tactical',
  历史: 'historical, ancient times, period drama, historical figures',
  游戏: 'gaming, virtual reality, MMO, fantasy game',
  科幻: 'science fiction, futuristic, space, technology',
  灵异: 'supernatural, ghost, paranormal, mysterious',
  二次元: 'anime style, manga, vibrant colors, kawaii',
  轻小说: 'light novel style, anime inspired, youthful, vibrant',
};

/**
 * 构建封面生成 Prompt（Stable Diffusion）
 */
export function buildCoverPrompt(params: {
  workTitle: string;
  author: string;
  genre: string;
  style: CoverStyle;
  tags?: string[];
  description?: string;
}): string {
  const { workTitle, author, genre, style, tags, description } = params;

  // 组合所有关键词
  const styleKeywords = STYLE_KEYWORDS[style];
  const genreKeywords = GENRE_KEYWORDS[genre] || '';
  const tagKeywords = tags?.join(', ') || '';

  // 构建 Prompt
  let prompt = `novel book cover, ${styleKeywords}, ${genreKeywords}`;
  
  if (tagKeywords) {
    prompt += `, ${tagKeywords}`;
  }

  // 添加描述关键词
  if (description) {
    const descKeywords = extractKeywordsFromDescription(description);
    if (descKeywords) {
      prompt += `, ${descKeywords}`;
    }
  }

  // 添加质量关键词
  prompt += ', high quality, professional, detailed, masterpiece, best quality';

  // 添加负面 Prompt
  const negativePrompt = buildNegativePrompt(style);

  return prompt;
}

/**
 * 构建负面 Prompt
 */
export function buildNegativePrompt(style: CoverStyle): string {
  const commonNegative =
    'low quality, worst quality, bad anatomy, bad proportions, extra digits, missing digits, blurry, watermark, signature, text, logo, username';

  const styleSpecificNegative: Record<CoverStyle, string> = {
    古风: 'modern elements, western style, cars, buildings',
    现代: 'ancient elements, traditional, historical',
    玄幻: 'mundane, ordinary, realistic',
    言情: 'dark, horror, scary, ugly',
    科幻: 'medieval, ancient, fantasy creatures',
    悬疑: 'bright colors, happy, cheerful',
  };

  return `${commonNegative}, ${styleSpecificNegative[style]}`;
}

/**
 * 从描述中提取关键词
 */
function extractKeywordsFromDescription(description: string): string {
  // 简单提取关键词（实际应用中可以使用 NLP）
  const keywords: string[] = [];
  
  // 提取场景关键词
  if (description.includes('山') || description.includes('峰')) {
    keywords.push('mountains');
  }
  if (description.includes('海') || description.includes('湖')) {
    keywords.push('water');
  }
  if (description.includes('城') || description.includes('镇')) {
    keywords.push('cityscape');
  }
  if (description.includes('宫') || description.includes('殿')) {
    keywords.push('palace');
  }
  if (description.includes('林') || description.includes('森')) {
    keywords.push('forest');
  }

  // 提取氛围关键词
  if (description.includes('黑暗') || description.includes('夜')) {
    keywords.push('dark atmosphere');
  }
  if (description.includes('阳光') || description.includes('光明')) {
    keywords.push('bright lighting');
  }
  if (description.includes('神秘')) {
    keywords.push('mysterious atmosphere');
  }

  return keywords.join(', ');
}

/**
 * 构建封面生成请求参数（用于不同 API）
 */
export function buildCoverAPIParams(params: {
  workTitle: string;
  author: string;
  genre: string;
  style: CoverStyle;
  tags?: string[];
  description?: string;
  width?: number;
  height?: number;
  samples?: number;
}) {
  const prompt = buildCoverPrompt(params);
  const negativePrompt = buildNegativePrompt(params.style);

  return {
    prompt,
    negativePrompt,
    width: params.width || 1024,
    height: params.height || 1536,
    samples: params.samples || 4,
    cfg_scale: 7,
    steps: 30,
  };
}
