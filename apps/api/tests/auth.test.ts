import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import User from '../src/models/mongo/User';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Endpoints', () => {
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.header['set-cookie']).toBeDefined();
    });

    // Edge Case 1: Missing fields
    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });

    // Edge Case 2: Invalid email format
    it('should fail if email is invalid', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toBe('Invalid email address');
    });

    // Edge Case 3: Email already exists
    it('should fail if email is already registered', async () => {
      await User.create({
        email: 'test@example.com',
        passwordHash: 'hashed',
        name: 'Existing User',
      });

      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);
      await User.create({
        email: 'test@example.com',
        passwordHash,
        name: 'Test User',
      });
    });

    it('should login successfully', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.header['set-cookie']).toBeDefined();
    });

    // Edge Case 1: Wrong password
    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    // Edge Case 2: Non-existent user
    it('should fail if user does not exist', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    // Edge Case 3: Missing fields
    it('should fail if fields are missing', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      const refreshToken = registerRes.header['set-cookie'][0].split(';')[0].split('=')[1];

      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', [`refreshToken=${refreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    // Edge Case 1: No refresh token
    it('should fail if no refresh token is provided', async () => {
      const res = await request(app).post('/auth/refresh');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No refresh token');
    });

    // Edge Case 2: Invalid refresh token
    it('should fail with invalid refresh token', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', ['refreshToken=invalidtoken']);
      
      expect(res.status).toBe(401);
    });

    // Edge Case 3: Token doesn't match database
    it('should fail if refresh token does not match DB', async () => {
      const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      const refreshToken = registerRes.header['set-cookie'][0].split(';')[0].split('=')[1];
      
      // Manually change token in DB
      await User.findOneAndUpdate({ email: 'test@example.com' }, { refreshToken: 'different-token' });

      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', [`refreshToken=${refreshToken}`]);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid refresh token');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout and clear cookie', async () => {
      const res = await request(app).post('/auth/logout');
      expect(res.status).toBe(200);
      expect(res.header['set-cookie'][0]).toContain('refreshToken=;');
    });

    // Edge Case 1: Logout without being logged in (should still succeed)
    it('should return 200 even if not logged in', async () => {
      const res = await request(app).post('/auth/logout');
      expect(res.status).toBe(200);
    });

    // Edge Case 2: Logout clears the token in the DB
    it('should clear refresh token in database', async () => {
       const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: 'logout@example.com',
          password: 'password123',
          name: 'Logout User',
        });

      const refreshToken = registerRes.header['set-cookie'][0].split(';')[0].split('=')[1];

      await request(app)
        .post('/auth/logout')
        .set('Cookie', [`refreshToken=${refreshToken}`]);

      const user = await User.findOne({ email: 'logout@example.com' });
      expect(user?.refreshToken).toBeUndefined();
    });
  });
});
