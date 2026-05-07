// @ts-nocheck
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse, ErrorCodes } from '../utils/response';
import { registerSchema, loginSchema, refreshTokenSchema } from '../models/schemas';
import { validateBody } from '../middleware/validation';
import { rateLimitMiddleware } from '../middleware/redis';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = registerSchema.parse(request.body);
    
    const metadata = {
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip,
    };

    const result = await AuthService.register(data, request.server, metadata);

    return reply.status(201).send(
      successResponse({
        userId: result.user.id,
        email: result.user.email,
        nickname: result.user.nickname,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        sessionId: result.sessionId,
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

export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = loginSchema.parse(request.body);
    
    const metadata = {
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip,
    };

    const result = await AuthService.login(data.email, data.password, request.server, metadata);

    return reply.send(
      successResponse({
        userId: result.user.id,
        email: result.user.email,
        nickname: result.user.nickname,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
        sessionId: result.sessionId,
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

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = refreshTokenSchema.parse(request.body);
    
    const metadata = {
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip,
    };

    const result = await AuthService.refreshToken(data.refreshToken, request.server, metadata);

    return reply.send(
      successResponse({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
        sessionId: result.sessionId,
      })
    );
  } catch (error: any) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, error.message)
    );
  }
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const sessionId = request.user?.sessionId;
  const body = request.body as { refreshToken?: string } | undefined;

  if (userId) {
    await AuthService.logout(userId, sessionId, body?.refreshToken);
  }

  return reply.send(successResponse(null, '登出成功'));
}

export async function getSessions(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证')
    );
  }

  const sessions = await AuthService.getSessions(userId);

  return reply.send(successResponse(sessions));
}

export async function revokeSession(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const params = request.params as { sessionId: string };

  if (!userId) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证')
    );
  }

  const success = await AuthService.revokeSession(userId, params.sessionId);

  if (!success) {
    return reply.status(404).send(
      errorResponse(ErrorCodes.SYSTEM_NOT_FOUND, '会话不存在')
    );
  }

  return reply.send(successResponse(null, '会话已撤销'));
}

export async function revokeAllSessions(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const currentSessionId = request.user?.sessionId;

  if (!userId) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证')
    );
  }

  const count = await AuthService.logoutAll(userId, currentSessionId);

  return reply.send(successResponse({ revokedCount: count }, '所有其他会话已撤销'));
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', {
    preHandler: [rateLimitMiddleware(5, 60)],
    handler: register,
  });

  app.post('/login', {
    preHandler: [rateLimitMiddleware(5, 60)],
    handler: login,
  });

  app.post('/refresh', {
    handler: refreshToken,
  });

  app.post('/logout', {
    onRequest: [app.authenticate],
    handler: logout,
  });

  app.get('/sessions', {
    onRequest: [app.authenticate],
    handler: getSessions,
  });

  app.delete('/sessions/:sessionId', {
    onRequest: [app.authenticate],
    handler: revokeSession,
  });

  app.delete('/sessions', {
    onRequest: [app.authenticate],
    handler: revokeAllSessions,
  });
}
