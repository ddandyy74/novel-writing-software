import { PrismaClient } from '@prisma/client';

// Prisma 客户端单例
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
});

export default prisma;

/**
 * 关闭数据库连接
 */
export async function closeDatabase(): Promise<void> {
  await prisma.$disconnect();
}

/**
 * 健康检查
 */
export async function checkDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
