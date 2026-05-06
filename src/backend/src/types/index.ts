import { FastifyRequest } from 'fastify';

// 用户信息（从 JWT Token 解析）
export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// 扩展 FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user?: UserPayload;
  }
}

// 统一响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 错误详情
export interface ErrorDetail {
  field?: string;
  reason?: string;
}

// 同步变更
export interface SyncChange {
  type: string; // work, chapter, character
  action: string; // create, update, delete
  id: string;
  data?: any;
  timestamp: string;
  version: number;
}

// 冲突信息
export interface SyncConflict {
  type: string;
  id: string;
  localVersion: number;
  remoteVersion: number;
  localData: any;
  remoteData: any;
}
