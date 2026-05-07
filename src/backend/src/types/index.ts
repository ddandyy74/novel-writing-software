export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function getUserId(request: any): string | undefined {
  return request.user?.userId;
}

export function getUser(request: any): UserPayload | undefined {
  return request.user;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorDetail {
  field?: string;
  reason?: string;
}

export interface SyncChange {
  type: string;
  action: string;
  id: string;
  data?: any;
  timestamp: string;
  version: number;
}

export interface SyncConflict {
  type: string;
  id: string;
  localVersion: number;
  remoteVersion: number;
  localData: any;
  remoteData: any;
}
