import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { errorResponse, ErrorCodes } from '../utils/response';
import { ZodError } from 'zod';

/**
 * 全局错误处理中间件
 */
export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // 记录错误日志
  request.log.error({
    error: {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
    },
    request: {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
    },
  });

  // Zod 验证错误
  if (error instanceof ZodError) {
    const firstError = error.errors[0];
    return reply.status(400).send(
      errorResponse(ErrorCodes.SYSTEM_INVALID_PARAMS, '参数验证失败', {
        field: firstError.path.join('.'),
        reason: firstError.message,
      })
    );
  }

  // JWT 错误
  if (error.message?.includes('jwt') || error.message?.includes('token')) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '认证失败')
    );
  }

  // 数据库错误
  if (error.message?.includes('Prisma') || error.message?.includes('database')) {
    return reply.status(500).send(
      errorResponse(ErrorCodes.SYSTEM_INTERNAL_ERROR, '数据库操作失败')
    );
  }

  // 已知错误（有状态码）
  if (error.statusCode) {
    return reply.status(error.statusCode).send(
      errorResponse(ErrorCodes.SYSTEM_INTERNAL_ERROR, error.message)
    );
  }

  // 未知错误
  return reply.status(500).send(
    errorResponse(ErrorCodes.SYSTEM_INTERNAL_ERROR, '服务器内部错误')
  );
}

/**
 * 404 处理
 */
export async function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(404).send(
    errorResponse(ErrorCodes.SYSTEM_INTERNAL_ERROR, '接口不存在')
  );
}
