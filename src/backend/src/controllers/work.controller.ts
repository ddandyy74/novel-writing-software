import { FastifyRequest, FastifyReply } from 'fastify';
import { WorkService } from '../services/work.service';
import { successResponse, errorResponse, paginatedResponse, ErrorCodes } from '../utils/response';
import {
  createWorkSchema,
  updateWorkSchema,
  getWorksQuerySchema,
  createChapterSchema,
  updateChapterSchema,
  reorderChaptersSchema,
  idParamSchema,
} from '../models/schemas';

// ============================================
// 作品相关
// ============================================

/**
 * 创建作品
 */
export async function createWork(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  if (!userId) {
    return reply.status(401).send(errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证'));
  }

  const data = createWorkSchema.parse(request.body);

  const work = await WorkService.create(userId, data);

  return reply.status(201).send(successResponse({
    workId: work.id,
    title: work.title,
    genre: work.genre,
    description: work.description,
    tags: work.tags,
    status: work.status,
    createdAt: work.createdAt,
    updatedAt: work.updatedAt,
  }));
}

/**
 * 获取作品列表
 */
export async function getWorks(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  if (!userId) {
    return reply.status(401).send(errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证'));
  }

  const query = getWorksQuerySchema.parse(request.query);

  const result = await WorkService.findByUser(userId, {
    page: query.page,
    pageSize: query.pageSize,
    status: query.status,
  });

  return reply.send(
    paginatedResponse(result.items, result.page, result.pageSize, result.total)
  );
}

/**
 * 获取作品详情
 */
export async function getWorkById(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const { id } = idParamSchema.parse(request.params);

  const work = await WorkService.findById(id, userId);

  if (!work) {
    return reply.status(404).send(errorResponse(ErrorCodes.WORK_NOT_FOUND, '作品不存在'));
  }

  return reply.send(successResponse(work));
}

/**
 * 更新作品
 */
export async function updateWork(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const { id } = idParamSchema.parse(request.params);

  const data = updateWorkSchema.parse(request.body);

  try {
    const work = await WorkService.update(id, userId!, data);
    return reply.send(successResponse(work));
  } catch (error: any) {
    if (error.message === '作品不存在') {
      return reply.status(404).send(errorResponse(ErrorCodes.WORK_NOT_FOUND, error.message));
    }
    throw error;
  }
}

/**
 * 删除作品
 */
export async function deleteWork(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const { id } = idParamSchema.parse(request.params);

  try {
    await WorkService.softDelete(id, userId!);
    return reply.send(successResponse(null, '删除成功'));
  } catch (error: any) {
    if (error.message === '作品不存在') {
      return reply.status(404).send(errorResponse(ErrorCodes.WORK_NOT_FOUND, error.message));
    }
    throw error;
  }
}

// ============================================
// 章节相关
// ============================================

/**
 * 创建章节
 */
export async function createChapter(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const { workId } = request.params as any;

  const data = createChapterSchema.parse(request.body);

  try {
    const chapter = await WorkService.createChapter(workId, userId!, data);

    return reply.status(201).send(successResponse({
      chapterId: chapter.id,
      workId: chapter.workId,
      title: chapter.title,
      content: chapter.content,
      wordCount: chapter.wordCount,
      order: chapter.order,
      status: chapter.status,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    }));
  } catch (error: any) {
    if (error.message === '作品不存在') {
      return reply.status(404).send(errorResponse(ErrorCodes.WORK_NOT_FOUND, error.message));
    }
    throw error;
  }
}

/**
 * 获取章节列表
 */
export async function getChapters(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const { workId } = request.params as any;

  try {
    const chapters = await WorkService.getChapters(workId, userId);
    return reply.send(successResponse({ items: chapters }));
  } catch (error: any) {
    if (error.message === '作品不存在') {
      return reply.status(404).send(errorResponse(ErrorCodes.WORK_NOT_FOUND, error.message));
    }
    throw error;
  }
}

/**
 * 获取章节详情
 */
export async function getChapterById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = idParamSchema.parse(request.params);

  const chapter = await WorkService.getChapterById(id);

  if (!chapter) {
    return reply.status(404).send(errorResponse(ErrorCodes.CHAPTER_NOT_FOUND, '章节不存在'));
  }

  return reply.send(successResponse(chapter));
}

/**
 * 更新章节
 */
export async function updateChapter(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const { id } = idParamSchema.parse(request.params);

  const data = updateChapterSchema.parse(request.body);

  try {
    const chapter = await WorkService.updateChapter(id, userId!, data);
    return reply.send(successResponse(chapter));
  } catch (error: any) {
    if (error.message === '章节不存在') {
      return reply.status(404).send(errorResponse(ErrorCodes.CHAPTER_NOT_FOUND, error.message));
    }
    if (error.message === '权限不足') {
      return reply.status(403).send(errorResponse(ErrorCodes.USER_PERMISSION_DENIED, error.message));
    }
    throw error;
  }
}

/**
 * 删除章节
 */
export async function deleteChapter(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const { id } = idParamSchema.parse(request.params);

  try {
    await WorkService.deleteChapter(id, userId!);
    return reply.send(successResponse(null, '删除成功'));
  } catch (error: any) {
    if (error.message === '章节不存在') {
      return reply.status(404).send(errorResponse(ErrorCodes.CHAPTER_NOT_FOUND, error.message));
    }
    throw error;
  }
}

/**
 * 章节排序
 */
export async function reorderChapters(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.userId;
  const { workId } = request.params as any;

  const data = reorderChaptersSchema.parse(request.body);

  try {
    await WorkService.reorderChapters(workId, userId!, data.orders);
    return reply.send(successResponse(null, '排序成功'));
  } catch (error: any) {
    if (error.message === '作品不存在') {
      return reply.status(404).send(errorResponse(ErrorCodes.WORK_NOT_FOUND, error.message));
    }
    throw error;
  }
}

/**
 * 作品路由
 */
export async function workRoutes(app: FastifyInstance) {
  // 作品 CRUD
  app.post('/', { onRequest: [app.authenticate], handler: createWork });
  app.get('/', { onRequest: [app.authenticate], handler: getWorks });
  app.get('/:id', { onRequest: [app.authenticate], handler: getWorkById });
  app.put('/:id', { onRequest: [app.authenticate], handler: updateWork });
  app.delete('/:id', { onRequest: [app.authenticate], handler: deleteWork });

  // 章节 CRUD
  app.post('/:workId/chapters', { onRequest: [app.authenticate], handler: createChapter });
  app.get('/:workId/chapters', { onRequest: [app.authenticate], handler: getChapters });
  app.put('/:workId/chapters/reorder', { onRequest: [app.authenticate], handler: reorderChapters });
  app.get('/chapters/:id', { onRequest: [app.authenticate], handler: getChapterById });
  app.put('/chapters/:id', { onRequest: [app.authenticate], handler: updateChapter });
  app.delete('/chapters/:id', { onRequest: [app.authenticate], handler: deleteChapter });
}

import { FastifyInstance } from 'fastify';
