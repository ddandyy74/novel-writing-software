import { FastifyRequest, FastifyReply } from 'fastify';
import { errorResponse, ErrorCodes, ErrorMessages } from '../utils/response';

/**
 * 认证中间件
 * 验证 JWT Token
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // 从请求头获取 token
    const authorization = request.headers.authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return reply.status(401).send(
        errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, ErrorMessages[ErrorCodes.AUTH_TOKEN_INVALID])
      );
    }

    const token = authorization.substring(7);

    // 验证 token
    const decoded = await request.server.jwt.verify(token);
    
    // 将用户信息附加到请求对象
    request.user = decoded as any;
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

/**
 * 可选认证中间件
 * 如果提供了 token 则验证，否则继续
 */
export async function optionalAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authorization = request.headers.authorization;
  
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.substring(7);
      const decoded = await request.server.jwt.verify(token);
      request.user = decoded as any;
    } catch (error) {
      // 忽略错误，继续执行
    }
  }
}

/**
 * 权限检查中间件工厂
 */
export function requirePermission(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      return reply.status(401).send(
        errorResponse(ErrorCodes.AUTH_TOKEN_INVALID, ErrorMessages[ErrorCodes.AUTH_TOKEN_INVALID])
      );
    }

    // 权限定义
    const permissions: Record<string, string[]> = {
      user: ['work:create', 'work:edit', 'work:delete', 'chapter:*', 'ai:basic'],
      author: ['work:*', 'chapter:*', 'ai:*', 'publish'],
      admin: ['*'],
    };

    const userPermissions = permissions[user.role] || [];
    
    // 检查权限
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
