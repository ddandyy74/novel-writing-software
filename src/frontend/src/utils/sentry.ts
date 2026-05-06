import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Sentry 初始化配置（前端）
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN_FRONTEND;

  if (!dsn) {
    console.warn('VITE_SENTRY_DSN_FRONTEND not set, Sentry disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      new BrowserTracing({
        // 追踪特定路由
        tracingOrigins: ['localhost', /^\//],
      }),
    ],

    // 性能监控采样率
    tracesSampleRate: 0.1, // 10% 的事务会被记录

    // 会话重播（可选）
    replaysSessionSampleRate: 0.1, // 10% 的会话会被记录
    replaysOnErrorSampleRate: 1.0, // 错误时 100% 记录

    // 错误过滤
    beforeSend(event, hint) {
      // 过滤掉开发环境的错误
      if (import.meta.env.DEV) {
        return null;
      }

      // 过滤掉已知的非关键错误
      const error = hint.originalException;
      if (error instanceof Error) {
        // 过滤掉网络错误
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          return null;
        }
      }

      return event;
    },

    // 去重配置
    ignoreErrors: [
      // 忽略浏览器扩展错误
      'top.GLOBALS',
      // 忽略随机错误
      'Random string generation failed',
      // 忽略 Facebook 错误
      'fb_xd_fragment',
      // 忽略 Chrome 扩展错误
      'chrome-extension://',
      // 忽略网络错误
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
    ],
  });
}

/**
 * 手动捕获错误
 */
export function captureError(error: Error, context?: Record<string, any>): void {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setExtra(key, context[key]);
      });
    }
    Sentry.captureException(error);
  });
}

/**
 * 手动捕获消息
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
  Sentry.captureMessage(message, level);
}

/**
 * 设置用户上下文
 */
export function setUserContext(user: { id: string; email?: string; username?: string }): void {
  Sentry.setUser(user);
}

/**
 * 清除用户上下文
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}

/**
 * 添加面包屑（Breadcrumb）
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, any>
): void {
  Sentry.addBreadcrumb({
    category,
    message,
    level: 'info',
    data,
  });
}

/**
 * 性能监控：测量操作耗时
 */
export function measurePerformance(name: string, fn: () => Promise<any>): Promise<any> {
  const transaction = Sentry.startTransaction({ name });
  
  return fn()
    .then((result) => {
      transaction.setStatus('ok');
      return result;
    })
    .catch((error) => {
      transaction.setStatus('internal_error');
      throw error;
    })
    .finally(() => {
      transaction.finish();
    });
}
