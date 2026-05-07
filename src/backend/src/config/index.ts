import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getEnvWithDefault(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

function requireProductionEnv(name: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const value = process.env[name];
  
  if (isProduction && !value) {
    throw new Error(`Missing required environment variable in production: ${name}`);
  }
  
  return value || `dev-${name.toLowerCase()}-not-for-production`;
}

function validateSecret(secret: string, name: string, minLength: number): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && secret.length < minLength) {
    throw new Error(`${name} must be at least ${minLength} characters in production`);
  }
  
  if (isProduction && secret.includes('dev-') || secret.includes('not-for-production')) {
    throw new Error(`${name} contains insecure default value in production`);
  }
}

export const config = {
  // 应用配置
  app: {
    nodeEnv: getEnvWithDefault('NODE_ENV', 'development'),
    port: parseInt(getEnvWithDefault('PORT', '3000'), 10),
    host: getEnvWithDefault('HOST', '0.0.0.0'),
    apiPrefix: getEnvWithDefault('API_PREFIX', '/api/v1'),
  },

  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/novel_writer',
  },

  // Redis 配置
  redis: {
    host: getEnvWithDefault('REDIS_HOST', 'localhost'),
    port: parseInt(getEnvWithDefault('REDIS_PORT', '6379'), 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  // JWT 配置
  jwt: {
    secret: requireProductionEnv('JWT_SECRET'),
    expiresIn: getEnvWithDefault('JWT_EXPIRES_IN', '1h'),
    refreshExpiresIn: getEnvWithDefault('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  // 加密配置
  encryption: {
    bcryptSaltRounds: parseInt(getEnvWithDefault('BCRYPT_SALT_ROUNDS', '10'), 10),
    aesKey: requireProductionEnv('AES_ENCRYPTION_KEY'),
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
      spellCheck: parseInt(getEnvWithDefault('AI_SPELL_CHECK_RATE_LIMIT', '100'), 10),
      outlineGen: parseInt(getEnvWithDefault('AI_OUTLINE_GEN_RATE_LIMIT', '50'), 10),
      coverGen: parseInt(getEnvWithDefault('AI_COVER_GEN_RATE_LIMIT', '10'), 10),
    },
  },
};

// 生产环境验证
if (config.app.nodeEnv === 'production') {
  validateSecret(config.jwt.secret, 'JWT_SECRET', 32);
  validateSecret(config.encryption.aesKey, 'AES_ENCRYPTION_KEY', 32);
  
  if (config.encryption.aesKey.length !== 32) {
    throw new Error('AES_ENCRYPTION_KEY must be exactly 32 characters');
  }
  
  console.log('✅ Production environment validated');
}

export type Config = typeof config;
