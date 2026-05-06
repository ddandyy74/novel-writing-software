import { FastifyInstance } from 'fastify';
import { authRoutes } from '../controllers/auth.controller';
import { userRoutes } from '../controllers/user.controller';
import { workRoutes } from '../controllers/work.controller';
import { syncRoutes } from '../controllers/sync.controller';

/**
 * 注册所有路由
 */
export async function registerRoutes(app: FastifyInstance) {
  // API 前缀
  app.register(
    async (instance) => {
      // 认证路由 /api/v1/auth/*
      instance.register(authRoutes, { prefix: '/auth' });

      // 用户路由 /api/v1/users/*
      instance.register(userRoutes, { prefix: '/users' });

      // 作品路由 /api/v1/works/*
      instance.register(workRoutes, { prefix: '/works' });

      // 同步路由 /api/v1/sync/*
      instance.register(syncRoutes, { prefix: '/sync' });

      // 健康检查
      instance.get('/health', async (request, reply) => {
        return { status: 'ok', timestamp: Date.now() };
      });
    },
    { prefix: '/api/v1' },
  );
}
