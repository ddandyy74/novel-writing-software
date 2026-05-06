import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { config } from '../src/config';
import { registerRoutes } from '../src/routes';
import prisma from '../src/models';

/**
 * 构建测试应用
 */
export async function buildApp() {
  const app = Fastify({
    logger: false, // 禁用日志
  });

  // 注册插件
  await app.register(cors);
  await app.register(helmet);
  await app.register(jwt, {
    secret: config.jwt.secret,
  });

  // 注册路由
  await registerRoutes(app);

  // 准备数据库
  await prisma.$connect();

  return app;
}

/**
 * 清理测试数据
 */
export async function cleanupTestData() {
  const tables = ['chapters', 'works', 'users'];
  
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${table}`);
  }
}
