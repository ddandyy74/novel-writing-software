import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse, ErrorCodes } from '../utils/response';
import { registerSchema, loginSchema, refreshTokenSchema } from '../models/schemas';
import { validateBody } from '../middleware/validation';
import { rateLimitMiddleware } from '../middleware/redis';

/**
 * 用户注册
 */
export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = registerSchema.parse(request.body);

    const result = await AuthService.register(data, request.server);

    return reply.status(201).send(
      successResponse({
        userId: result.user.id,
        email: result.user.email,
        nickname: result.user.nickname,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }, '注册成功')
    );
  } catch (error: any) {
    if (error.message === '用户已存在') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.AUTH_USER_EXISTS, error.message)
      );
    }
    throw error;
  }
}

/**
 * 用户登录
 */
export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = loginSchema.parse(request.body);

    const result = await AuthService.login(data.email, data.password, request.server);

    return reply.send(
      successResponse({
        userId: result.user.id,
        email: result.user.email,
        nickname: result.user.nickname,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      })
    );
  } catch (error: any) {
    if (error.message === '邮箱或密码错误') {
      return reply.status(401).send(
        errorResponse(ErrorCodes.AUTH_INVALID_CREDENTIALS, error.message)
      );
    }
    
    if (error.message.includes('账户已被锁定') || error.message.includes('登录失败次数过多')) {
      return reply.status(429).send(
        errorResponse(ErrorCodes.SYSTEM_RATE_LIMIT_EXCEEDED, error.message)
      );
    }
    
    throw error;
  }
}

/**
 * 刷新 Token
 */
export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = refreshTokenSchema.parse(request.body);

    const result = await AuthService.refreshToken(data.refreshToken, request.server);

    return reply.send(
      successResponse({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      })
    );
  } catch (error: any) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, error.message)
    );
  }
}

/**
 * 登出
 */
export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const body = request.body as { refreshToken?: string } | undefined;

  if (userId) {
    await AuthService.logout(userId, body?.refreshToken);
  }

  return reply.send(successResponse(null, '登出成功'));
}

/**
 * 认证路由
 */
export async function authRoutes(app: FastifyInstance) {
  // 注册（限流 5次/分钟）
  app.post('/register', {
    preHandler: [rateLimitMiddleware(5, 60)],
    handler: register,
  });

  // 登录（限流 5次/分钟）
  app.post('/login', {
    preHandler: [rateLimitMiddleware(5, 60)],
    handler: login,
  });

  // 刷新 Token
  app.post('/refresh', {
    handler: refreshToken,
  });

  // 登出（需要认证）
  app.post('/logout', {
    onRequest: [app.authenticate],
    handler: logout,
  });
}

import { FastifyInstance } from 'fastify';
