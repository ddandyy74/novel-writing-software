// @ts-nocheck
import { FastifyRequest, FastifyReply } from 'fastify';
import { errorResponse, ErrorCodes, ErrorMessages } from '../utils/response';
import { SessionService } from '../services/session.service';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authorization = request.headers.authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return reply.status(401).send(
        errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, ErrorMessages[ErrorCodes.AUTH_TOKEN_INVALID])
      );
    }

    const token = authorization.substring(7);

    const decoded = await request.server.jwt.verify(token);
    const user = decoded as any;
    
    if (user.sessionId) {
      const isValidSession = await SessionService.validateSession(user.userId, user.sessionId);
      if (!isValidSession) {
        return reply.status(401).send(
          errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, '会话已失效，请重新登录')
        );
      }
      
      await SessionService.updateActivity(user.userId, user.sessionId);
    }
    
    request.user = user;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return reply.status(401).send(
        errorResponse(ErrorCodes.AUTH_TOKEN_EXPIRED, ErrorMessages[ErrorCodes.AUTH_TOKEN_EXPIRED])
      );
    }
    
    return reply.status(401).send(
      errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, ErrorMessages[ErrorCodes.AUTH_TOKEN_INVALID])
    );
  }
}

export async function optionalAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authorization = request.headers.authorization;
  
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.substring(7);
      const decoded = await request.server.jwt.verify(token);
      request.user = decoded as any;
    } catch (error) {
    }
  }
}

export function requirePermission(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      return reply.status(401).send(
        errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, ErrorMessages[ErrorCodes.AUTH_TOKEN_INVALID])
      );
    }

    const permissions: Record<string, string[]> = {
      user: ['work:create', 'work:edit', 'work:delete', 'chapter:*', 'ai:basic'],
      author: ['work:*', 'chapter:*', 'ai:*', 'publish'],
      admin: ['*'],
    };

    const userPermissions = permissions[user.role] || [];
    
    const hasPermission = userPermissions.some(p => 
      p === '*' || p === permission || 
      (p.endsWith(':*') && permission.startsWith(p.slice(0, -1)))
    );

    if (!hasPermission) {
      return reply.status(403).send(
        errorResponse(ErrorCodes.USER_PERMISSION_DENIED, ErrorMessages[ErrorCodes.USER_PERMISSION_DENIED])
      );
    }
  };
}
