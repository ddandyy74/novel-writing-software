import promClient from 'prom-client';

// 创建 Registry
const register = new promClient.Registry();

// 添加默认指标（CPU、内存等）
promClient.collectDefaultMetrics({ register });

// ============================================
// 自定义指标
// ============================================

// HTTP 请求计数器
export const httpRequestCounter = new promClient.Counter({
  name: 'http_request_duration_seconds_count',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// HTTP 请求持续时间直方图
export const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5, 10],
  registers: [register],
});

// 数据库查询计数器
export const dbQueryCounter = new promClient.Counter({
  name: 'db_query_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'table'],
  registers: [register],
});

// 数据库查询持续时间
export const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3],
  registers: [register],
});

// Redis 操作计数器
export const redisOperationCounter = new promClient.Counter({
  name: 'redis_operation_total',
  help: 'Total number of Redis operations',
  labelNames: ['operation'],
  registers: [register],
});

// Redis 操作持续时间
export const redisOperationDuration = new promClient.Histogram({
  name: 'redis_operation_duration_seconds',
  help: 'Duration of Redis operations in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1],
  registers: [register],
});

// AI 功能请求计数器
export const aiRequestCounter = new promClient.Counter({
  name: 'ai_request_total',
  help: 'Total number of AI feature requests',
  labelNames: ['feature', 'userId'],
  registers: [register],
});

// AI 功能请求持续时间
export const aiRequestDuration = new promClient.Histogram({
  name: 'ai_request_duration_seconds',
  help: 'Duration of AI feature requests in seconds',
  labelNames: ['feature'],
  buckets: [1, 3, 5, 10, 15, 20, 30, 60],
  registers: [register],
});

// AI 功能错误计数器
export const aiErrorCounter = new promClient.Counter({
  name: 'ai_request_errors_total',
  help: 'Total number of AI feature errors',
  labelNames: ['feature', 'errorType'],
  registers: [register],
});

// AI Tokens 使用计数器
export const aiTokensCounter = new promClient.Counter({
  name: 'ai_tokens_used_total',
  help: 'Total number of tokens used',
  labelNames: ['type', 'feature'], // type: input/output
  registers: [register],
});

// AI 成本计数器
export const aiCostCounter = new promClient.Counter({
  name: 'ai_cost_dollars_total',
  help: 'Total cost of AI operations in dollars',
  labelNames: ['feature'],
  registers: [register],
});

// 活跃用户计数器
export const activeUsersGauge = new promClient.Gauge({
  name: 'active_users_total',
  help: 'Number of active users',
  registers: [register],
});

// 作品数量计数器
export const worksCountGauge = new promClient.Gauge({
  name: 'works_total',
  help: 'Total number of works',
  labelNames: ['status'],
  registers: [register],
});

// 导出 Registry
export { register };
