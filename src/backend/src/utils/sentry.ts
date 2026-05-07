/**
 * Sentry 工具函数（已禁用）
 * 当 SENTRY_DSN_BACKEND 配置后可启用
 */

export function initSentry(): void {
  console.log('Sentry disabled - SENTRY_DSN_BACKEND not configured');
}

export function sentryErrorHandler() {
  return (err: any, req: any, res: any, next: any) => {
    next(err);
  };
}

export function sentryRequestHandler() {
  return (req: any, res: any, next: any) => {
    next();
  };
}

export function captureError(error: Error, context?: Record<string, any>): void {
  console.error('Error:', error.message, context || '');
}

export function captureMessage(message: string, level: string = 'info'): void {
  console.log(`[${level}] ${message}`);
}

export function setUserContext(user: { id: string; email?: string; username?: string }): void {
  // No-op
}

export function clearUserContext(): void {
  // No-op
}

export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, any>
): void {
  // No-op
}
