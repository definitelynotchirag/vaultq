import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/models/User';

describe('File Routes', () => {
  beforeEach(async () => {
    await User.create({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  describe('POST /files/upload-url', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/files/upload-url')
        .send({ originalName: 'test.txt', size: 1024 });
      expect(response.status).toBe(401);
    });

    it('should return 400 if size exceeds limit', async () => {
      await User.create({
        googleId: 'test2',
        email: 'test2@example.com',
        name: 'Test User 2',
      });

      const mockReq = request(app)
        .post('/files/upload-url')
        .send({ originalName: 'test.txt', size: 101 * 1024 * 1024 });

      const response = await mockReq;
      expect(response.status).toBe(401);
    });

    it('should return 400 if originalName is missing', async () => {
      const response = await request(app)
        .post('/files/upload-url')
        .send({ size: 1024 });
      expect(response.status).toBe(401);
    });
  });

  describe('POST /files/confirm-upload', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/files/confirm-upload')
        .send({
          originalName: 'test.txt',
          storageName: 'test_storage',
          url: 'https://example.com/test.txt',
          size: 1024,
        });
      expect(response.status).toBe(401);
    });
  });

  describe('GET /files', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/files');
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /files/:id', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put('/files/507f1f77bcf86cd799439011')
        .send({ originalName: 'renamed.txt' });
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /files/:id', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app).delete('/files/507f1f77bcf86cd799439011');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /files/:id/download', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/files/507f1f77bcf86cd799439011/download');
      expect(response.status).toBe(401);
    });
  });
});

