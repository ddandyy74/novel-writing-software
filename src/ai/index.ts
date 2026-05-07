/**
 * AI 功能模块统一导出
 */

// 错别字检测
export { createSpellChecker, checkSpelling, batchCheckSpelling } from './spell-check';

// 大纲生成
export { createOutlineGenerator, generateOutline, outlineToMarkdown, outlinesToMarkdown } from './outline-gen';

// 封面生成
export { createCoverGenerator, generateCover, COVER_STYLES } from './cover-gen';

// 类型导出
export type {
  SpellCheckError,
  SpellCheckResult,
  SpellCheckRequest,
  OutlineChapter,
  OutlineGenerateResult,
  OutlineGenerateRequest,
  CoverStyle,
  CoverGenerateRequest,
  CoverGenerateResult,
  CoverImage,
  AIErrorResponse,
  AIServiceConfig,
  AIUsageStats,
  AICostEstimate,
} from './types';

/**
 * 创建 AI 服务配置
 */
export function createAIServiceConfig() {
  return {
    // OpenAI API
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiBaseUrl: process.env.OPENAI_BASE_URL,

    // Anthropic API
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,

    // Stable Diffusion API
    stabilityApiKey: process.env.STABILITY_API_KEY,
    stabilityBaseUrl: process.env.STABILITY_BASE_URL,

    // 火山引擎 API
    volcengineApiKey: process.env.VOLCENGINE_API_KEY,

    // Redis 缓存
    redisUrl: process.env.REDIS_URL,

    // 本地模型路径
    localModelPath: process.env.LOCAL_MODEL_PATH,
  };
}
