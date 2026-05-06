import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  // 应用配置
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    apiPrefix: process.env.API_PREFIX || '/api/v1',
  },

  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/novel_writer',
  },

  // Redis 配置
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // 加密配置
  encryption: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
    aesKey: process.env.AES_ENCRYPTION_KEY || 'your-32-byte-encryption-key-here',
  },

  // 限流配置
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  },

  // 日志配置
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // CORS 配置
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },

  // AI 服务配置
  ai: {
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

    // 本地模型配置
    localModelPath: process.env.LOCAL_MODEL_PATH,

    // 限流配置
    rateLimit: {
      spellCheck: parseInt(process.env.AI_SPELL_CHECK_RATE_LIMIT || '100', 10),
      outlineGen: parseInt(process.env.AI_OUTLINE_GEN_RATE_LIMIT || '50', 10),
      coverGen: parseInt(process.env.AI_COVER_GEN_RATE_LIMIT || '10', 10),
    },
  },
};

export type Config = typeof config;
