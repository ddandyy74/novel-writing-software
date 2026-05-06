import { ApiResponse, ErrorDetail, PaginatedResponse } from '../types';

/**
 * 成功响应
 */
export function successResponse<T>(data: T, message = 'success'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
    timestamp: Date.now(),
  };
}

/**
 * 错误响应
 */
export function errorResponse(
  code: number,
  message: string,
  error?: ErrorDetail,
): ApiResponse {
  const response: ApiResponse = {
    code,
    message,
    timestamp: Date.now(),
  };

  if (error) {
    (response as any).error = error;
  }

  return response;
}

/**
 * 分页响应
 */
export function paginatedResponse<T>(
  items: T[],
  page: number,
  pageSize: number,
  total: number,
): ApiResponse<PaginatedResponse<T>> {
  return successResponse({
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

/**
 * 错误码定义
 */
export const ErrorCodes = {
  // 认证模块 (1xxxx)
  AUTH_INVALID_CREDENTIALS: 10001,
  AUTH_TOKEN_EXPIRED: 10002,
  AUTH_TOKEN_INVALID: 10003,
  AUTH_USER_EXISTS: 10004,
  AUTH_EMAIL_INVALID: 10005,

  // 用户模块 (2xxxx)
  USER_NOT_FOUND: 20001,
  USER_PERMISSION_DENIED: 20002,

  // 作品模块 (3xxxx)
  WORK_NOT_FOUND: 30001,
  WORK_TITLE_EXISTS: 30002,

  // 章节模块 (4xxxx)
  CHAPTER_NOT_FOUND: 40001,
  CHAPTER_CONTENT_EMPTY: 40002,

  // AI 模块 (5xxxx)
  AI_SERVICE_UNAVAILABLE: 50001,
  AI_GENERATION_TIMEOUT: 50002,
  AI_CONTENT_REVIEW_FAILED: 50003,

  // 系统模块 (9xxxx)
  SYSTEM_INTERNAL_ERROR: 90001,
  SYSTEM_INVALID_PARAMS: 90002,
  SYSTEM_RATE_LIMIT_EXCEEDED: 90003,
} as const;

/**
 * 错误消息映射
 */
export const ErrorMessages: Record<number, string> = {
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: '用户名或密码错误',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Token 已过期',
  [ErrorCodes.AUTH_TOKEN_INVALID]: 'Token 无效',
  [ErrorCodes.AUTH_USER_EXISTS]: '用户已存在',
  [ErrorCodes.AUTH_EMAIL_INVALID]: '邮箱格式错误',
  [ErrorCodes.USER_NOT_FOUND]: '用户不存在',
  [ErrorCodes.USER_PERMISSION_DENIED]: '权限不足',
  [ErrorCodes.WORK_NOT_FOUND]: '作品不存在',
  [ErrorCodes.WORK_TITLE_EXISTS]: '作品标题已存在',
  [ErrorCodes.CHAPTER_NOT_FOUND]: '章节不存在',
  [ErrorCodes.CHAPTER_CONTENT_EMPTY]: '章节内容为空',
  [ErrorCodes.AI_SERVICE_UNAVAILABLE]: 'AI 服务不可用',
  [ErrorCodes.AI_GENERATION_TIMEOUT]: '生成超时',
  [ErrorCodes.AI_CONTENT_REVIEW_FAILED]: '内容审核失败',
  [ErrorCodes.SYSTEM_INTERNAL_ERROR]: '服务器内部错误',
  [ErrorCodes.SYSTEM_INVALID_PARAMS]: '请求参数错误',
  [ErrorCodes.SYSTEM_RATE_LIMIT_EXCEEDED]: '请求频率超限',
};
