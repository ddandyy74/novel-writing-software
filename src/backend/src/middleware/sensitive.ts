import { FastifyRequest, FastifyReply } from 'fastify';
import { errorResponse, ErrorCodes } from '../utils/response';
import { UserService } from '../services/user.service';
import { z } from 'zod';

const passwordConfirmationSchema = z.object({
  currentPassword: z.string().min(1, '请输入当前密码'),
});

export async function requirePasswordConfirmation(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user?.userId;
  
  if (!userId) {
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '未认证')
    );
  }

  try {
    const body = request.body as any;
    const { currentPassword } = passwordConfirmationSchema.parse(body);
    
    const user = await UserService.findById(userId);
    if (!user) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.USER_NOT_FOUND, '用户不存在')
      );
    }

    const isValid = await UserService.validatePassword(user, currentPassword);
    if (!isValid) {
      return reply.status(403).send(
        errorResponse(ErrorCodes.AUTH_INVALID_CREDENTIALS, '密码错误')
      );
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send(
        errorResponse(ErrorCodes.SYSTEM_INVALID_PARAMS, '请输入当前密码进行确认')
      );
    }
    throw error;
  }
}

const confirmationSchema = z.object({
  confirm: z.literal(true, {
    errorMap: () => ({ message: '请确认操作' }),
  }),
});

export async function requireConfirmation(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = request.body as any;
    confirmationSchema.parse(body);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send(
        errorResponse(ErrorCodes.SYSTEM_INVALID_PARAMS, '此操作需要二次确认')
      );
    }
    throw error;
  }
}

export function sensitiveOperation(type: 'password' | 'confirmation' = 'password') {
  return type === 'password' ? requirePasswordConfirmation : requireConfirmation;
}
