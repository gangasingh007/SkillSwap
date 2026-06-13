import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import User from '../src/models/mongo/User';
import { generateAccessToken } from '../src/utils/tokens';

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

describe('User Endpoints', () => {
  describe('GET /users/me', () => {
    it('should return current user profile', async () => {
      const user = await User.create({
        email: 'me@example.com',
        passwordHash: 'hashed',
        name: 'Me',
      });
      const token = generateAccessToken(user._id.toString());

      const res = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'me@example.com');
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    // Edge Case 1: No token
    it('should fail if no token provided', async () => {
      const res = await request(app).get('/users/me');
      expect(res.status).toBe(401);
    });

    // Edge Case 2: Invalid token
    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.status).toBe(401);
    });

    // Edge Case 3: User not found
    it('should fail if user in token does not exist', async () => {
      const token = generateAccessToken(new mongoose.Types.ObjectId().toString());
      const res = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /users/me', () => {
    it('should update user profile successfully', async () => {
      const user = await User.create({
        email: 'update@example.com',
        passwordHash: 'hashed',
        name: 'Old Name',
      });
      const token = generateAccessToken(user._id.toString());

      const res = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name', bio: 'New Bio' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('New Name');
      expect(res.body.bio).toBe('New Bio');
    });

    // Edge Case 1: Unauthorized
    it('should fail if not logged in', async () => {
      const res = await request(app).patch('/users/me').send({ name: 'New Name' });
      expect(res.status).toBe(401);
    });

    // Edge Case 2: Update with invalid fields (e.g. empty name if we had validation)
    it('should still work with partial updates', async () => {
       const user = await User.create({
        email: 'partial@example.com',
        passwordHash: 'hashed',
        name: 'Partial',
      });
      const token = generateAccessToken(user._id.toString());

      const res = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ bio: 'Only Bio' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Partial');
      expect(res.body.bio).toBe('Only Bio');
    });

    // Edge Case 3: Malformed body (should not crash)
    it('should handle malformed body gracefully', async () => {
      const user = await User.create({
        email: 'malformed@example.com',
        passwordHash: 'hashed',
        name: 'Malformed',
      });
      const token = generateAccessToken(user._id.toString());

      const res = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send('not a json');

      // Express body-parser will usually handle this if it's not JSON
      expect(res.status).toBe(200); // or 400 depending on middleware
    });
  });

  describe('GET /users/:id', () => {
    it('should return public profile by ID', async () => {
       const user = await User.create({
        email: 'public@example.com',
        passwordHash: 'hashed',
        name: 'Public User',
      });

      const res = await request(app).get(`/users/${user._id}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Public User');
      expect(res.body).not.toHaveProperty('email');
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    // Edge Case 1: Invalid ID format
    it('should fail with invalid ID format', async () => {
      const res = await request(app).get('/users/invalidid');
      expect(res.status).toBe(500); // Mongoose cast error
    });

    // Edge Case 2: Non-existent ID
    it('should fail if user ID does not exist', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/users/${id}`);
      expect(res.status).toBe(404);
    });

    // Edge Case 3: Public profile does not expose sensitive info
    it('should NOT return email or refreshToken', async () => {
       const user = await User.create({
        email: 'secret@example.com',
        passwordHash: 'hashed',
        name: 'Secret User',
        refreshToken: 'sometoken',
      });

      const res = await request(app).get(`/users/${user._id}`);
      expect(res.body).not.toHaveProperty('email');
      expect(res.body).not.toHaveProperty('refreshToken');
      expect(res.body).not.toHaveProperty('passwordHash');
    });
  });
});
