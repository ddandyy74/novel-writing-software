/**
 * AI 功能类型定义
 */

// ============= 错别字检测 =============

export interface SpellCheckError {
  position: number; // 错误位置（字符索引）
  original: string; // 原始文本
  suggestion: string; // 建议修改
  type: '错字' | '别字' | '语病' | '标点'; // 错误类型
  reason?: string; // 错误原因
  confidence: number; // 置信度 (0-1)
}

export interface SpellCheckResult {
  text: string; // 原始文本
  errors: SpellCheckError[]; // 错误列表
  processingTime: number; // 处理时间（毫秒）
  source: 'local' | 'cloud'; // 来源：本地模型/云端API
}

export interface SpellCheckRequest {
  text: string; // 待检测文本
  options?: {
    useLocal?: boolean; // 是否使用本地模型
    customDict?: string[]; // 自定义词典
    ignoreTypes?: SpellCheckError['type'][]; // 忽略的错误类型
  };
}

// ============= 大纲生成 =============

export interface OutlineChapter {
  chapter: number; // 章节序号
  title: string; // 章节标题
  summary: string; // 剧情摘要（50-100字）
  characters: string[]; // 出场人物
  events: string[]; // 关键事件（3-5个）
  foreshadowing: string[]; // 伏笔标记
  timeline?: string; // 时间线
}

export interface OutlineGenerateResult {
  workId: string; // 作品ID
  chapterId: string; // 章节ID
  outline: OutlineChapter; // 章节大纲
  generatedAt: string; // 生成时间
  processingTime: number; // 处理时间（毫秒）
}

export interface OutlineGenerateRequest {
  workId: string; // 作品ID
  chapterId: string; // 章节ID
  chapterTitle: string; // 章节标题
  chapterContent: string; // 章节内容
  previousOutlines?: OutlineChapter[]; // 前文大纲
  outputFormat?: 'json' | 'markdown'; // 输出格式
}

// ============= 封面生成 =============

export type CoverStyle = '古风' | '现代' | '玄幻' | '言情' | '科幻' | '悬疑';

export interface CoverGenerateRequest {
  workId: string; // 作品ID
  workTitle: string; // 书名
  author: string; // 作者名
  genre: string; // 题材类型
  style: CoverStyle; // 封面风格
  tags?: string[]; // 标签关键词
  description?: string; // 作品简介（可选，用于生成更精准的封面）
  options?: {
    width?: number; // 宽度（默认1024）
    height?: number; // 高度（默认1536）
    samples?: number; // 生成数量（默认4）
  };
}

export interface CoverGenerateResult {
  workId: string; // 作品ID
  images: CoverImage[]; // 生成的封面图片
  generatedAt: string; // 生成时间
  processingTime: number; // 处理时间（毫秒）
}

export interface CoverImage {
  versionId: string; // 版本ID
  imageUrl: string; // 图片URL（Base64 或 CDN URL）
  seed?: number; // 随机种子
  width: number; // 宽度
  height: number; // 高度
}

// ============= API 响应 =============

export interface AIErrorResponse {
  error: string; // 错误消息
  code: string; // 错误代码
  details?: any; // 错误详情
}

export interface AIServiceConfig {
  // OpenAI API
  openaiApiKey?: string;
  openaiBaseUrl?: string;
  
  // Anthropic API
  anthropicApiKey?: string;
  
  // Stable Diffusion API
  stabilityApiKey?: string;
  stabilityBaseUrl?: string;
  
  // 火山引擎 API（备选）
  volcengineApiKey?: string;
  
  // Redis 缓存
  redisUrl?: string;
  
  // 本地模型路径
  localModelPath?: string;
}

// ============= 统计与监控 =============

export interface AIUsageStats {
  userId: string;
  service: 'spell-check' | 'outline-gen' | 'cover-gen';
  requestCount: number;
  tokenCount?: number;
  cost: number;
  timestamp: string;
}

export interface AICostEstimate {
  service: string;
  unit: string;
  pricePerUnit: number;
  estimatedCost: number;
}
