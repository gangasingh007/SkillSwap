import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import User from '../src/models/mongo/User';
import Listing from '../src/models/mongo/Listing';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../src/utils/tokens';

let mongo: MongoMemoryServer;

// ── Test Data Helpers ───────────────────────────────────────────

let testUserId: string;
let testAccessToken: string;
let otherUserId: string;
let otherAccessToken: string;

const validListingData = {
  title: 'Full-Stack React Development',
  description: 'I will build a modern full-stack React application with Next.js, TypeScript, and Tailwind CSS.',
  category: 'Development',
  skillTags: ['React', 'Next.js', 'TypeScript'],
  cashPrice: 5000, // $50 in cents
  creditPrice: 5,
  deliveryFormat: 'async',
  turnaroundDays: 7,
  revisionsIncluded: 2,
  samples: [
    { type: 'link', url: 'https://example.com/portfolio/project1' },
  ],
  visibility: 'public',
};

const createTestUser = async (email: string, name: string) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const user = await User.create({ email, passwordHash, name });
  const accessToken = generateAccessToken(user._id.toString());
  return { user, accessToken };
};

// ── Lifecycle ───────────────────────────────────────────────────

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
  await Listing.deleteMany({});

  // Create primary test user
  const primary = await createTestUser('seller@example.com', 'Test Seller');
  testUserId = primary.user._id.toString();
  testAccessToken = primary.accessToken;

  // Create another user for ownership tests
  const other = await createTestUser('other@example.com', 'Other User');
  otherUserId = other.user._id.toString();
  otherAccessToken = other.accessToken;
});

// ── Tests ───────────────────────────────────────────────────────

describe('Listing Endpoints', () => {
  // ════════════════════════════════════════════════════════════════
  // POST /listings — Create Listing
  // ════════════════════════════════════════════════════════════════

  describe('POST /listings', () => {
    it('should create a listing successfully', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send(validListingData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(validListingData.title);
      expect(res.body.category).toBe('Development');
      expect(res.body.cashPrice).toBe(5000);
      expect(res.body.creditPrice).toBe(5);
      expect(res.body.isActive).toBe(true);
      expect(res.body.userId).toBe(testUserId);
      expect(res.body.analytics.views).toBe(0);
    });

    it('should reject if not authenticated', async () => {
      const res = await request(app)
        .post('/listings')
        .send(validListingData);

      expect(res.status).toBe(401);
    });

    it('should reject if title is missing', async () => {
      const { title, ...data } = validListingData;
      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should reject if title is too short', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ ...validListingData, title: 'Hi' });

      expect(res.status).toBe(400);
    });

    it('should reject if cashPrice is below minimum (500 cents = $5)', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ ...validListingData, cashPrice: 499 });

      expect(res.status).toBe(400);
    });

    it('should reject if creditPrice is below minimum (1)', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ ...validListingData, creditPrice: 0 });

      expect(res.status).toBe(400);
    });

    it('should reject invalid category', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ ...validListingData, category: 'InvalidCategory' });

      expect(res.status).toBe(400);
    });

    it('should reject if more than 5 samples', async () => {
      const samples = Array.from({ length: 6 }, (_, i) => ({
        type: 'link',
        url: `https://example.com/sample${i}`,
      }));

      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ ...validListingData, samples });

      expect(res.status).toBe(400);
    });

    it('should reject invalid delivery format', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ ...validListingData, deliveryFormat: 'carrier_pigeon' });

      expect(res.status).toBe(400);
    });

    it('should create listing with only required fields', async () => {
      const minimalData = {
        title: 'Minimal Listing',
        description: 'A short but valid description for a minimal listing.',
        category: 'Design',
        cashPrice: 500,
        creditPrice: 1,
        deliveryFormat: 'document',
        turnaroundDays: 1,
        revisionsIncluded: 0,
      };

      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send(minimalData);

      expect(res.status).toBe(201);
      expect(res.body.samples).toHaveLength(0);
      expect(res.body.visibility).toBe('public');
    });
  });

  // ════════════════════════════════════════════════════════════════
  // GET /listings — Browse Listings
  // ════════════════════════════════════════════════════════════════

  describe('GET /listings', () => {
    beforeEach(async () => {
      // Seed some listings
      await Listing.create([
        { ...validListingData, userId: testUserId, title: 'React Development', category: 'Development', cashPrice: 5000 },
        { ...validListingData, userId: testUserId, title: 'Logo Design', category: 'Design', cashPrice: 3000 },
        { ...validListingData, userId: otherUserId, title: 'SEO Marketing Strategy', category: 'Marketing', cashPrice: 7000 },
        { ...validListingData, userId: otherUserId, title: 'Technical Writing', category: 'Writing', cashPrice: 4000, isActive: false },
      ]);
    });

    it('should return paginated active listings', async () => {
      const res = await request(app).get('/listings');

      expect(res.status).toBe(200);
      expect(res.body.listings).toHaveLength(3); // 4 total, 1 inactive
      expect(res.body.total).toBe(3);
      expect(res.body.page).toBe(1);
      expect(res.body).toHaveProperty('totalPages');
    });

    it('should not return inactive listings', async () => {
      const res = await request(app).get('/listings');

      const titles = res.body.listings.map((l: { title: string }) => l.title);
      expect(titles).not.toContain('Technical Writing');
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/listings?category=Design');

      expect(res.status).toBe(200);
      expect(res.body.listings).toHaveLength(1);
      expect(res.body.listings[0].title).toBe('Logo Design');
    });

    it('should filter by minimum price', async () => {
      const res = await request(app).get('/listings?minPrice=5000');

      expect(res.status).toBe(200);
      res.body.listings.forEach((listing: { cashPrice: number }) => {
        expect(listing.cashPrice).toBeGreaterThanOrEqual(5000);
      });
    });

    it('should filter by maximum price', async () => {
      const res = await request(app).get('/listings?maxPrice=4000');

      expect(res.status).toBe(200);
      res.body.listings.forEach((listing: { cashPrice: number }) => {
        expect(listing.cashPrice).toBeLessThanOrEqual(4000);
      });
    });

    it('should filter by price range', async () => {
      const res = await request(app).get('/listings?minPrice=3000&maxPrice=5000');

      expect(res.status).toBe(200);
      res.body.listings.forEach((listing: { cashPrice: number }) => {
        expect(listing.cashPrice).toBeGreaterThanOrEqual(3000);
        expect(listing.cashPrice).toBeLessThanOrEqual(5000);
      });
    });

    it('should paginate results', async () => {
      const res = await request(app).get('/listings?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.listings).toHaveLength(2);
      expect(res.body.total).toBe(3);
      expect(res.body.totalPages).toBe(2);
    });

    it('should return empty results for page beyond data', async () => {
      const res = await request(app).get('/listings?page=100&limit=12');

      expect(res.status).toBe(200);
      expect(res.body.listings).toHaveLength(0);
    });

    it('should sort by cashPrice ascending', async () => {
      const res = await request(app).get('/listings?sortBy=cashPrice&sortOrder=asc');

      expect(res.status).toBe(200);
      const prices = res.body.listings.map((l: { cashPrice: number }) => l.cashPrice);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    it('should populate seller info', async () => {
      const res = await request(app).get('/listings');

      expect(res.status).toBe(200);
      // userId should be populated with seller profile data
      const listing = res.body.listings[0];
      expect(listing.userId).toHaveProperty('name');
    });
  });

  // ════════════════════════════════════════════════════════════════
  // GET /listings/search — Full-Text Search
  // ════════════════════════════════════════════════════════════════

  describe('GET /listings/search', () => {
    beforeEach(async () => {
      await Listing.create([
        { ...validListingData, userId: testUserId, title: 'React Native App Development', description: 'Build mobile apps with React Native and Expo.' },
        { ...validListingData, userId: testUserId, title: 'WordPress Website Design', description: 'Custom WordPress themes and plugins.', category: 'Design' },
        { ...validListingData, userId: otherUserId, title: 'Python Backend Development', description: 'Django and FastAPI backend services.', skillTags: ['Python', 'Django'] },
      ]);
      // Wait for text indexes to build
      await Listing.ensureIndexes();
    });

    it('should return search results matching query', async () => {
      const res = await request(app).get('/listings/search?q=React');

      expect(res.status).toBe(200);
      expect(res.body.listings.length).toBeGreaterThanOrEqual(1);
    });

    it('should return 400 if search query is missing', async () => {
      const res = await request(app).get('/listings/search');
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('required');
    });

    it('should return 400 if search query is empty', async () => {
      const res = await request(app).get('/listings/search?q=');
      expect(res.status).toBe(400);
    });

    it('should filter search results by category', async () => {
      const res = await request(app).get('/listings/search?q=Development&category=Design');

      expect(res.status).toBe(200);
      // Should only return Design category matches
      res.body.listings.forEach((listing: { category: string }) => {
        expect(listing.category).toBe('Design');
      });
    });

    it('should paginate search results', async () => {
      const res = await request(app).get('/listings/search?q=Development&page=1&limit=1');

      expect(res.status).toBe(200);
      expect(res.body.listings.length).toBeLessThanOrEqual(1);
      expect(res.body).toHaveProperty('totalPages');
    });
  });

  // ════════════════════════════════════════════════════════════════
  // GET /listings/trending — Trending Listings
  // ════════════════════════════════════════════════════════════════

  describe('GET /listings/trending', () => {
    beforeEach(async () => {
      await Listing.create([
        { ...validListingData, userId: testUserId, title: 'Trending Listing 1', analytics: { views: 100, requests: 50, conversions: 10 } },
        { ...validListingData, userId: testUserId, title: 'Trending Listing 2', analytics: { views: 200, requests: 30, conversions: 5 } },
        { ...validListingData, userId: otherUserId, title: 'Low Activity Listing', analytics: { views: 5, requests: 1, conversions: 0 } },
      ]);
    });

    it('should return trending listings sorted by request count', async () => {
      const res = await request(app).get('/listings/trending');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      // First listing should have the most requests
      expect(res.body[0].analytics.requests).toBeGreaterThanOrEqual(res.body[1].analytics.requests);
    });

    it('should respect limit parameter', async () => {
      const res = await request(app).get('/listings/trending?limit=1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should not return inactive listings', async () => {
      await Listing.create({
        ...validListingData,
        userId: testUserId,
        title: 'Inactive Trending',
        isActive: false,
        analytics: { views: 999, requests: 999, conversions: 999 },
      });

      const res = await request(app).get('/listings/trending');
      const titles = res.body.map((l: { title: string }) => l.title);
      expect(titles).not.toContain('Inactive Trending');
    });
  });

  // ════════════════════════════════════════════════════════════════
  // GET /listings/my — My Listings (Auth Required)
  // ════════════════════════════════════════════════════════════════

  describe('GET /listings/my', () => {
    beforeEach(async () => {
      await Listing.create([
        { ...validListingData, userId: testUserId, title: 'My Active Listing' },
        { ...validListingData, userId: testUserId, title: 'My Inactive Listing', isActive: false },
        { ...validListingData, userId: otherUserId, title: 'Not My Listing' },
      ]);
    });

    it('should return only the authenticated user\'s listings', async () => {
      const res = await request(app)
        .get('/listings/my')
        .set('Authorization', `Bearer ${testAccessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2); // includes inactive
      res.body.forEach((listing: { userId: string }) => {
        expect(listing.userId.toString()).toBe(testUserId);
      });
    });

    it('should include inactive listings for the owner', async () => {
      const res = await request(app)
        .get('/listings/my')
        .set('Authorization', `Bearer ${testAccessToken}`);

      const titles = res.body.map((l: { title: string }) => l.title);
      expect(titles).toContain('My Inactive Listing');
    });

    it('should reject if not authenticated', async () => {
      const res = await request(app).get('/listings/my');
      expect(res.status).toBe(401);
    });
  });

  // ════════════════════════════════════════════════════════════════
  // GET /listings/:id — Get Listing Detail
  // ════════════════════════════════════════════════════════════════

  describe('GET /listings/:id', () => {
    it('should return listing detail and increment view count', async () => {
      const listing = await Listing.create({
        ...validListingData,
        userId: testUserId,
      });

      const res = await request(app).get(`/listings/${listing._id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(validListingData.title);
      expect(res.body.analytics.views).toBe(1); // incremented from 0
    });

    it('should increment view count on each request', async () => {
      const listing = await Listing.create({
        ...validListingData,
        userId: testUserId,
      });

      await request(app).get(`/listings/${listing._id}`);
      const res = await request(app).get(`/listings/${listing._id}`);

      expect(res.body.analytics.views).toBe(2);
    });

    it('should return 404 for non-existent listing', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/listings/${fakeId}`);
      expect(res.status).toBe(404);
    });

    it('should return 404 for invalid ObjectId', async () => {
      const res = await request(app).get('/listings/invalid-id');
      expect(res.status).toBe(404);
    });

    it('should return 404 for inactive listing', async () => {
      const listing = await Listing.create({
        ...validListingData,
        userId: testUserId,
        isActive: false,
      });

      const res = await request(app).get(`/listings/${listing._id}`);
      expect(res.status).toBe(404);
    });

    it('should populate seller info in detail view', async () => {
      const listing = await Listing.create({
        ...validListingData,
        userId: testUserId,
      });

      const res = await request(app).get(`/listings/${listing._id}`);

      expect(res.status).toBe(200);
      expect(res.body.userId).toHaveProperty('name');
      expect(res.body.userId).toHaveProperty('avatarUrl');
      expect(res.body.userId).toHaveProperty('reputationScore');
    });
  });

  // ════════════════════════════════════════════════════════════════
  // PATCH /listings/:id — Update Listing
  // ════════════════════════════════════════════════════════════════

  describe('PATCH /listings/:id', () => {
    let listingId: string;

    beforeEach(async () => {
      const listing = await Listing.create({
        ...validListingData,
        userId: testUserId,
      });
      listingId = listing._id.toString();
    });

    it('should update listing title', async () => {
      const res = await request(app)
        .patch(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ title: 'Updated Title For Listing' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title For Listing');
    });

    it('should update multiple fields at once', async () => {
      const res = await request(app)
        .patch(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({
          title: 'Updated Multiple Fields',
          cashPrice: 10000,
          category: 'Design',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Multiple Fields');
      expect(res.body.cashPrice).toBe(10000);
      expect(res.body.category).toBe('Design');
    });

    it('should reject if not authenticated', async () => {
      const res = await request(app)
        .patch(`/listings/${listingId}`)
        .send({ title: 'Unauthorized Update' });

      expect(res.status).toBe(401);
    });

    it('should reject if not the listing owner', async () => {
      const res = await request(app)
        .patch(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${otherAccessToken}`)
        .send({ title: 'Hijacked Title' });

      expect(res.status).toBe(404); // not found / unauthorized
    });

    it('should reject if cashPrice goes below minimum', async () => {
      const res = await request(app)
        .patch(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ cashPrice: 100 });

      expect(res.status).toBe(400);
    });

    it('should reject invalid category on update', async () => {
      const res = await request(app)
        .patch(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ category: 'InvalidCategory' });

      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent listing', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .patch(`/listings/${fakeId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ title: 'Ghost Listing Update' });

      expect(res.status).toBe(404);
    });

    it('should preserve unmodified fields', async () => {
      const res = await request(app)
        .patch(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ title: 'Only Title Changed' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Only Title Changed');
      // Other fields remain unchanged
      expect(res.body.cashPrice).toBe(validListingData.cashPrice);
      expect(res.body.category).toBe(validListingData.category);
      expect(res.body.description).toBe(validListingData.description);
    });
  });

  // ════════════════════════════════════════════════════════════════
  // DELETE /listings/:id — Soft-Delete Listing
  // ════════════════════════════════════════════════════════════════

  describe('DELETE /listings/:id', () => {
    let listingId: string;

    beforeEach(async () => {
      const listing = await Listing.create({
        ...validListingData,
        userId: testUserId,
      });
      listingId = listing._id.toString();
    });

    it('should soft-delete a listing (set isActive to false)', async () => {
      const res = await request(app)
        .delete(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Listing deleted');

      // Verify listing still exists in DB but is inactive
      const listing = await Listing.findById(listingId);
      expect(listing).not.toBeNull();
      expect(listing!.isActive).toBe(false);
    });

    it('should not actually remove the document from DB', async () => {
      await request(app)
        .delete(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`);

      const count = await Listing.countDocuments({ _id: listingId });
      expect(count).toBe(1);
    });

    it('should reject if not authenticated', async () => {
      const res = await request(app).delete(`/listings/${listingId}`);
      expect(res.status).toBe(401);
    });

    it('should reject if not the listing owner', async () => {
      const res = await request(app)
        .delete(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${otherAccessToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 404 when trying to delete already-deleted listing', async () => {
      // First delete
      await request(app)
        .delete(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`);

      // Second delete
      const res = await request(app)
        .delete(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent listing', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/listings/${fakeId}`)
        .set('Authorization', `Bearer ${testAccessToken}`);

      expect(res.status).toBe(404);
    });

    it('should not appear in browse results after soft delete', async () => {
      await request(app)
        .delete(`/listings/${listingId}`)
        .set('Authorization', `Bearer ${testAccessToken}`);

      const browseRes = await request(app).get('/listings');
      const ids = browseRes.body.listings.map((l: { _id: string }) => l._id);
      expect(ids).not.toContain(listingId);
    });
  });

  // ════════════════════════════════════════════════════════════════
  // Edge Cases — Ownership & Security
  // ════════════════════════════════════════════════════════════════

  describe('Ownership & Security', () => {
    it('should always set userId from auth token, not from request body', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({
          ...validListingData,
          userId: otherUserId, // Try to spoof userId
        });

      expect(res.status).toBe(201);
      // The listing should be owned by the authenticated user, not the spoofed one
      expect(res.body.userId).toBe(testUserId);
    });

    it('should handle expired token gracefully', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', 'Bearer expired.token.here')
        .send(validListingData);

      expect(res.status).toBe(401);
    });

    it('should handle malformed Authorization header', async () => {
      const res = await request(app)
        .post('/listings')
        .set('Authorization', 'NotBearer token')
        .send(validListingData);

      expect(res.status).toBe(401);
    });
  });
});
