import pino, { Logger } from 'pino';

/**
 * 结构化日志配置
 */
export function createLogger(serviceName: string): Logger {
  const isDev = process.env.NODE_ENV === 'development';

  return pino({
    level: process.env.LOG_LEVEL || 'info',
    name: serviceName,
    
    // 开发环境使用 pino-pretty 格式化
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,

    // 生产环境使用结构化日志
    formatters: {
      level: (label) => ({ level: label }),
      bindings: () => ({}), // 移除 pid 和 hostname
    },

    // 基础字段
    base: {
      service: serviceName,
      env: process.env.NODE_ENV,
    },

    // 序列化错误
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },

    // 时间戳格式
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  });
}

/**
 * 日志工具类
 */
export class LoggerUtil {
  private logger: Logger;

  constructor(serviceName: string) {
    this.logger = createLogger(serviceName);
  }

  info(message: string, data?: Record<string, any>): void {
    this.logger.info(data || {}, message);
  }

  warn(message: string, data?: Record<string, any>): void {
    this.logger.warn(data || {}, message);
  }

  error(message: string, error?: Error, data?: Record<string, any>): void {
    this.logger.error({ err: error, ...data }, message);
  }

  debug(message: string, data?: Record<string, any>): void {
    this.logger.debug(data || {}, message);
  }

  trace(message: string, data?: Record<string, any>): void {
    this.logger.trace(data || {}, message);
  }

  // HTTP 请求日志
  httpRequest(
    method: string,
    url: string,
    status: number,
    duration: number,
    userId?: string
  ): void {
    this.logger.info(
      {
        method,
        url,
        status,
        duration,
        userId,
        type: 'http_request',
      },
      'HTTP Request'
    );
  }

  // 数据库操作日志
  dbQuery(operation: string, table: string, duration: number): void {
    this.logger.debug(
      {
        operation,
        table,
        duration,
        type: 'db_query',
      },
      'Database Query'
    );
  }

  // AI 功能日志
  aiOperation(
    feature: string,
    userId: string,
    duration: number,
    tokens?: { input: number; output: number }
  ): void {
    this.logger.info(
      {
        feature,
        userId,
        duration,
        tokens,
        type: 'ai_operation',
      },
      'AI Operation'
    );
  }

  // 性能日志
  performance(operation: string, duration: number, metadata?: Record<string, any>): void {
    this.logger.info(
      {
        operation,
        duration,
        ...metadata,
        type: 'performance',
      },
      'Performance Metric'
    );
  }

  // 安全事件日志
  security(event: string, userId?: string, metadata?: Record<string, any>): void {
    this.logger.warn(
      {
        event,
        userId,
        ...metadata,
        type: 'security',
      },
      'Security Event'
    );
  }

  // 业务事件日志
  business(event: string, userId: string, metadata?: Record<string, any>): void {
    this.logger.info(
      {
        event,
        userId,
        ...metadata,
        type: 'business',
      },
      'Business Event'
    );
  }
}

// 导出默认 logger 实例
export const logger = new LoggerUtil('novel-writer-backend');
