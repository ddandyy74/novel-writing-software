// @ts-nocheck
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import client from 'prom-client';

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

/**
 * Prometheus Metrics 中间件
 */
export async function metricsMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const start = Date.now();

  // 请求完成后记录指标
  reply.raw.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = request.routerPath || request.url;
    const method = request.method;
    const status = reply.statusCode;

    // 记录请求持续时间
    httpRequestDuration.observe({ method, route, status }, duration);

    // 记录请求计数
    httpRequestCounter.inc({ method, route, status });
  });
}

/**
 * 注册 /metrics 端点
 */
export async function registerMetricsEndpoint(app: FastifyInstance): Promise<void> {
  app.get('/metrics', async (request, reply) => {
    reply.type('text/plain');
    return register.metrics();
  });
}
