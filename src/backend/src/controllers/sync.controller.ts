import { FastifyRequest, FastifyReply } from 'fastify';
import { SyncService } from '../services/sync.service';
import { successResponse, errorResponse, ErrorCodes } from '../utils/response';
import { syncPushSchema, syncPullSchema } from '../models/schemas';

/**
 * 推送本地变更
 */
export async function pushChanges(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  if (!userId) {
    return reply.status(401).send(errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证'));
  }

  const data = syncPushSchema.parse(request.body);

  const result = await SyncService.pushChanges(
    userId,
    data.clientId,
    data.changes,
  );

  return reply.send(successResponse({
    syncTime: result.syncTime,
    conflicts: result.conflicts,
  }));
}

/**
 * 拉取云端变更
 */
export async function pullChanges(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  if (!userId) {
    return reply.status(401).send(errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证'));
  }

  const data = syncPullSchema.parse(request.body);

  const result = await SyncService.pullChanges(
    userId,
    data.clientId,
    new Date(data.lastSyncTime),
    data.tables,
  );

  return reply.send(successResponse({
    syncTime: result.syncTime,
    changes: result.changes,
  }));
}

/**
 * 同步路由
 */
export async function syncRoutes(app: FastifyInstance) {
  app.post('/push', { onRequest: [app.authenticate], handler: pushChanges });
  app.post('/pull', { onRequest: [app.authenticate], handler: pullChanges });
}

import { FastifyInstance } from 'fastify';
