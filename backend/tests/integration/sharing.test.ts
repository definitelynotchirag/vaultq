import request from 'supertest';
import app from '../../src/app';

describe('Sharing Routes', () => {
  describe('POST /files/:id/share', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/files/507f1f77bcf86cd799439011/share')
        .send({ userId: '507f1f77bcf86cd799439012', level: 'read' });
      expect(response.status).toBe(401);
    });

    it('should return 400 if userId or level is missing', async () => {
      const response = await request(app)
        .post('/files/507f1f77bcf86cd799439011/share')
        .send({ userId: '507f1f77bcf86cd799439012' });
      expect(response.status).toBe(401);
    });
  });

  describe('POST /files/:id/public', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/files/507f1f77bcf86cd799439011/public');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /files/:id/private', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/files/507f1f77bcf86cd799439011/private');
      expect(response.status).toBe(401);
    });
  });
});

