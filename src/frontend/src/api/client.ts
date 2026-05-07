/**
 * API 客户端
 * 封装所有后端 API 调用
 */

import { getApiConfig } from '../config/api';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  token?: string;
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp: number;
}

class ApiClient {
  private getToken: () => string | null = () => null;
  private onUnauthorized: () => void = () => {};

  setTokenGetter(getter: () => string | null) {
    this.getToken = getter;
  }

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { baseUrl, timeout } = getApiConfig();
    const { method = 'GET', body, headers = {}, token } = options;

    const authToken = token || this.getToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await tauriFetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.status === 401) {
        this.onUnauthorized();
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        return {
          code: -1,
          message: '请求超时',
          timestamp: Date.now(),
        };
      }

      return {
        code: -1,
        message: error.message || '网络错误',
        timestamp: Date.now(),
      };
    }
  }

  // 认证 API
  async login(email: string, password: string) {
    return this.request<{ accessToken: string; refreshToken: string; userId: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(email: string, password: string, nickname: string) {
    return this.request<{ accessToken: string; refreshToken: string; userId: string }>('/auth/register', {
      method: 'POST',
      body: { email, password, nickname },
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
  }

  async logout(refreshToken?: string) {
    return this.request('/auth/logout', {
      method: 'POST',
      body: { refreshToken },
    });
  }

  // 用户 API
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateUser(data: { nickname?: string; avatar?: string }) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: data,
    });
  }

  // 作品 API
  async getWorks(page = 1, pageSize = 20) {
    return this.request(`/works?page=${page}&pageSize=${pageSize}`);
  }

  async getWork(workId: string) {
    return this.request(`/works/${workId}`);
  }

  async createWork(data: { title: string; genre?: string; description?: string }) {
    return this.request('/works', {
      method: 'POST',
      body: data,
    });
  }

  async updateWork(workId: string, data: Partial<{ title: string; genre: string; description: string }>) {
    return this.request(`/works/${workId}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteWork(workId: string) {
    return this.request(`/works/${workId}`, {
      method: 'DELETE',
    });
  }

  // 章节 API
  async getChapters(workId: string) {
    return this.request(`/works/${workId}/chapters`);
  }

  async getChapter(workId: string, chapterId: string) {
    return this.request(`/works/${workId}/chapters/${chapterId}`);
  }

  async createChapter(workId: string, data: { title: string; content: string; order: number }) {
    return this.request(`/works/${workId}/chapters`, {
      method: 'POST',
      body: data,
    });
  }

  async updateChapter(workId: string, chapterId: string, data: Partial<{ title: string; content: string }>) {
    return this.request(`/works/${workId}/chapters/${chapterId}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteChapter(workId: string, chapterId: string) {
    return this.request(`/works/${workId}/chapters/${chapterId}`, {
      method: 'DELETE',
    });
  }

  // 同步 API
  async pushChanges(clientId: string, changes: any[], lastSyncTime?: string) {
    return this.request('/sync/push', {
      method: 'POST',
      body: { clientId, changes, lastSyncTime },
    });
  }

  async pullChanges(clientId: string, lastSyncTime: string, tables?: string[]) {
    return this.request('/sync/pull', {
      method: 'POST',
      body: { clientId, lastSyncTime, tables },
    });
  }

  // AI API
  async spellCheck(text: string, options?: { useLocal?: boolean }) {
    return this.request('/ai/spell-check', {
      method: 'POST',
      body: { text, options },
    });
  }

  async generateOutline(workId: string, chapterId: string, chapterTitle: string, chapterContent: string) {
    return this.request('/ai/outline', {
      method: 'POST',
      body: { workId, chapterId, chapterTitle, chapterContent },
    });
  }

  async generateCover(workId: string, workTitle: string, genre: string, style: string) {
    return this.request('/ai/cover', {
      method: 'POST',
      body: { workId, workTitle, genre, style },
    });
  }

  // 健康检查
  async healthCheck() {
    return this.request('/health');
  }
}

export const api = new ApiClient();
export default api;
