import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/error';
import { initRedis, closeRedis } from './middleware/redis';
import { authMiddleware } from './middleware/auth';
import { registerRoutes } from './routes';
import { checkDatabase, closeDatabase } from './models';
import pino from 'pino';

// 创建 Fastify 实例
const app = Fastify({
  logger: pino({
    level: config.log.level,
    transport:
      config.app.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  }),
});

// JWT 认证装饰器
app.decorate('authenticate', authMiddleware);

// ============================================
// 插件注册
// ============================================

// CORS
app.register(cors, {
  origin: config.cors.origin,
  credentials: true,
});

// 安全头
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});

// JWT
app.register(jwt, {
  secret: config.jwt.secret,
});

// 限流
app.register(rateLimit, {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.windowMs,
});

// API 文档
app.register(swagger, {
  swagger: {
    info: {
      title: '网文作者码字软件 API',
      description: '网文作者码字软件后端 API 文档',
      version: '1.0.0',
    },
    host: `localhost:${config.app.port}`,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
});

app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: true,
  },
  staticCSP: true,
});

// ============================================
// 错误处理
// ============================================

app.setErrorHandler(errorHandler);
app.setNotFoundHandler(notFoundHandler);

// ============================================
// 路由注册
// ============================================

registerRoutes(app);

// ============================================
// 启动服务器
// ============================================

async function start() {
  try {
    // 检查数据库连接
    const dbOk = await checkDatabase();
    if (!dbOk) {
      app.log.error('❌ Database connection failed');
      process.exit(1);
    }
    app.log.info('✅ Database connected');

    // 初始化 Redis
    await initRedis();
    app.log.info('✅ Redis connected');

    // 启动服务器
    await app.listen({
      port: config.app.port,
      host: config.app.host,
    });

    app.log.info(`
🚀 Server is running!
📍 Local:    http://localhost:${config.app.port}
📍 API:      http://localhost:${config.app.port}${config.app.apiPrefix}
📚 Docs:     http://localhost:${config.app.port}/docs
🌍 Environment: ${config.app.nodeEnv}
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// 优雅关闭
async function close() {
  app.log.info('Shutting down...');

  try {
    await app.close();
    await closeRedis();
    await closeDatabase();
    app.log.info('Server closed');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// 信号处理
process.on('SIGTERM', close);
process.on('SIGINT', close);

// 启动
start();

export default app;
