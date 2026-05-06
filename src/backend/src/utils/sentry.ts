import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

/**
 * Sentry 初始化配置
 */
export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN_BACKEND;

  if (!dsn) {
    console.warn('SENTRY_DSN_BACKEND not set, Sentry disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      // 性能监控
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express(),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 0.1, // 10% 的事务会被记录
    profilesSampleRate: 0.1, // 10% 的性能分析

    // 错误过滤
    beforeSend(event, hint) {
      // 过滤掉健康检查错误
      if (event.request?.url?.includes('/health')) {
        return null;
      }

      // 过滤掉已知的非关键错误
      const error = hint.originalException;
      if (error instanceof Error) {
        // 过滤掉 4xx 错误（客户端错误）
        if (error.message.includes('4')) {
          return null;
        }
      }

      return event;
    },

    // 去重配置
    ignoreErrors: [
      // 忽略网络错误
      'NetworkError',
      'Network request failed',
      // 忽略超时错误
      'TimeoutError',
      'Request timeout',
      // 忽略取消请求
      'AbortError',
      'Request aborted',
    ],
  });
}

/**
 * Sentry 错误处理中间件
 */
export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // 只上报 5xx 错误
      const statusCode = (error as any).statusCode || 500;
      return statusCode >= 500;
    },
  });
}

/**
 * Sentry 请求处理中间件
 */
export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler({
    user: ['id', 'username', 'email'],
    ip: true,
    request: ['method', 'url', 'headers', 'data'],
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
