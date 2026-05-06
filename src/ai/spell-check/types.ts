/**
 * 错别字检测类型定义
 */

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

export interface SpellCheckOptions {
  useLocal?: boolean; // 是否使用本地模型
  customDict?: string[]; // 自定义词典
  ignoreTypes?: SpellCheckError['type'][]; // 忽略的错误类型
  maxRetries?: number; // 最大重试次数
}

export interface SpellCheckRequest {
  text: string; // 待检测文本
  options?: SpellCheckOptions;
}

// 本地模型配置
export interface LocalModelConfig {
  modelPath: string; // 模型路径
  vocabPath: string; // 词表路径
  maxSeqLength: number; // 最大序列长度
}

// 云端 API 配置
export interface CloudAPIConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
