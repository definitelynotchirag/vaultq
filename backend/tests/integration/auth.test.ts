import request from 'supertest';
import app from '../../src/app';

describe('Auth Routes', () => {
  describe('GET /auth/me', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/auth/me');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app).post('/auth/logout');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /auth/google', () => {
    it('should redirect to Google OAuth', async () => {
      const response = await request(app).get('/auth/google');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('accounts.google.com');
    });
  });
});

