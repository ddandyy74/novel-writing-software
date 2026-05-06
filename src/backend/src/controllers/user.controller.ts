import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { successResponse, errorResponse, ErrorCodes } from '../utils/response';
import { updateSettingsSchema } from '../models/schemas';
import { maskEmail } from '../utils/helpers';

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证')
    );
  }

  const user = await UserService.findById(userId);

  if (!user) {
    return reply.status(404).send(
      errorResponse(ErrorCodes.USER_NOT_FOUND, '用户不存在')
    );
  }

  const stats = await UserService.getUserStats(userId);

  return reply.send(
    successResponse({
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: user.createdAt,
      settings: user.settings,
      stats,
    })
  );
}

/**
 * 更新用户设置
 */
export async function updateSettings(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证')
    );
  }

  const data = updateSettingsSchema.parse(request.body);

  const user = await UserService.updateSettings(userId, data);

  return reply.send(
    successResponse(user.settings)
  );
}

/**
 * 用户路由
 */
export async function userRoutes(app: FastifyInstance) {
  // 获取当前用户信息
  app.get('/me', {
    onRequest: [app.authenticate],
    handler: getCurrentUser,
  });

  // 更新用户设置
  app.put('/me/settings', {
    onRequest: [app.authenticate],
    handler: updateSettings,
  });
}

import { FastifyInstance } from 'fastify';
