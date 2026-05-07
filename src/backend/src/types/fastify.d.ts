import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: import('./index').UserPayload;
  }
}
