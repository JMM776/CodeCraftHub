const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User API Integration Tests', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: 'user@example.com', password: 'Password123', name: 'User One' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('user@example.com');
      expect(res.body.data.name).toBe('User One');
      expect(res.body.data).toHaveProperty('id');
    });

    it('should return validation error for invalid email', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: 'invalid-email', password: 'Password123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation error');
    });

    it('should prevent duplicate email registration', async () => {
      await request(app)
        .post('/api/users/register')
        .send({ email: 'dup@example.com', password: 'Password123' });

      const res = await request(app)
        .post('/api/users/register')
        .send({ email: 'dup@example.com', password: 'Password123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email already registered');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/users/register')
        .send({ email: 'login@example.com', password: 'Password123' });
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'login@example.com', password: 'Password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('login@example.com');
    });

    it('should fail login with wrong password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'login@example.com', password: 'WrongPass' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should fail login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'nonexist@example.com', password: 'Password123' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /api/users/profile', () => {
    let token;

    beforeEach(async () => {
      await request(app)
        .post('/api/users/register')
        .send({ email: 'profile@example.com', password: 'Password123' });

      const loginRes = await request(app)
        .post('/api/users/login')
        .send({ email: 'profile@example.com', password: 'Password123' });

      token = loginRes.body.data.token;
    });

    it('should fetch user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('profile@example.com');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
