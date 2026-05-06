import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { z, ZodSchema } from 'zod';
import { errorResponse, ErrorCodes } from '../utils/response';

/**
 * Zod 验证中间件工厂
 */
export function validateBody(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = await schema.parseAsync(request.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return reply.status(400).send(
          errorResponse(ErrorCodes.SYSTEM_INVALID_PARAMS, '参数验证失败', {
            field: firstError.path.join('.'),
            reason: firstError.message,
          })
        );
      }
      throw error;
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.query = await schema.parseAsync(request.query);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return reply.status(400).send(
          errorResponse(ErrorCodes.SYSTEM_INVALID_PARAMS, '参数验证失败', {
            field: firstError.path.join('.'),
            reason: firstError.message,
          })
        );
      }
      throw error;
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.params = await schema.parseAsync(request.params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return reply.status(400).send(
          errorResponse(ErrorCodes.SYSTEM_INVALID_PARAMS, '参数验证失败', {
            field: firstError.path.join('.'),
            reason: firstError.message,
          })
        );
      }
      throw error;
    }
  };
}
