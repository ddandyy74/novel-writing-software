import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { register, httpRequestDuration, httpRequestCounter } from './metrics';

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
