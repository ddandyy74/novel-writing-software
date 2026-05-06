import { FastifyInstance } from 'fastify';
import { buildApp } from './test-utils';
import { UserService } from '../src/services/user.service';
import { AuthService } from '../src/services/auth.service';

describe('Authentication', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'test@example.com',
          password: 'password123',
          nickname: 'Test User',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(0);
      expect(body.data.userId).toBeDefined();
      expect(body.data.email).toBe('test@example.com');
      expect(body.data.accessToken).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'invalid-email',
          password: 'password123',
          nickname: 'Test User',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should fail with duplicate email', async () => {
      // First registration
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'duplicate@example.com',
          password: 'password123',
          nickname: 'Test User',
        },
      });

      // Second registration with same email
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'duplicate@example.com',
          password: 'password123',
          nickname: 'Test User 2',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeAll(async () => {
      // Create test user
      await UserService.create({
        email: 'login@example.com',
        password: 'password123',
        nickname: 'Login Test',
      });
    });

    it('should login successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'login@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(0);
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.refreshToken).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'login@example.com',
          password: 'wrongpassword',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should fail with non-existent user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
