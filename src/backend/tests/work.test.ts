import { FastifyInstance } from 'fastify';
import { buildApp } from './test-utils';
import { UserService } from '../src/services/user.service';
import { AuthService } from '../src/services/auth.service';

describe('Works', () => {
  let app: FastifyInstance;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await buildApp();

    // Create test user
    const result = await AuthService.register({
      email: 'work@example.com',
      password: 'password123',
      nickname: 'Work Test',
    });

    userId = result.user.id;
    accessToken = result.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/works', () => {
    it('should create a work successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/works',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'Test Novel',
          genre: '玄幻',
          description: 'A test novel',
          tags: ['玄幻', '修仙'],
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(0);
      expect(body.data.title).toBe('Test Novel');
      expect(body.data.status).toBe('draft');
    });

    it('should fail without authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/works',
        payload: {
          title: 'Test Novel',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should fail with invalid title', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/works',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: '', // Empty title
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/works', () => {
    beforeAll(async () => {
      // Create test works
      await app.inject({
        method: 'POST',
        url: '/api/v1/works',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'Novel 1',
        },
      });

      await app.inject({
        method: 'POST',
        url: '/api/v1/works',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'Novel 2',
        },
      });
    });

    it('should get works list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/works',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(0);
      expect(body.data.items.length).toBeGreaterThan(0);
    });

    it('should support pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/works?page=1&pageSize=1',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.items.length).toBe(1);
      expect(body.data.pagination.pageSize).toBe(1);
    });
  });
});
