import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import User from '../models/mongo/User';
import Listing from '../models/mongo/Listing';

const MONGODB_URI = 'mongodb://root:secretpassword@localhost:27017/';

const seedData = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('🧹 Cleared existing users and listings');

    // Create Mock Users
    const usersData = [
      {
        email: 'alice@example.com',
        passwordHash: 'hashed_password', // Mocked
        name: 'Alice Designer',
        bio: 'Senior UX/UI Designer with 5 years of experience.',
        skillTags: ['Figma', 'UI Design', 'Wireframing'],
        reputationScore: 98,
        isVerified: true,
      },
      {
        email: 'bob@example.com',
        passwordHash: 'hashed_password', // Mocked
        name: 'Bob Developer',
        bio: 'Fullstack React & Node.js Developer.',
        skillTags: ['React', 'Next.js', 'Node.js', 'TypeScript'],
        reputationScore: 85,
        isVerified: false,
      },
      {
        email: 'charlie@example.com',
        passwordHash: 'hashed_password', // Mocked
        name: 'Charlie Copywriter',
        bio: 'Expert conversion copywriter for SaaS companies.',
        skillTags: ['Copywriting', 'SEO', 'Content Strategy'],
        reputationScore: 100,
        isVerified: true,
      }
    ];

    const users = await User.insertMany(usersData);
    console.log(`👤 Created ${users.length} mock users`);

    // Create Mock Listings
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const listingsData = [
      // Top Rated (High conversions) - Bob
      {
        userId: users[1]._id,
        title: 'Fullstack Next.js Application Architecture',
        description: 'I will design and scaffold your Next.js application using App Router, Tailwind, and Supabase.',
        category: 'Development',
        skillTags: ['Next.js', 'React', 'Architecture'],
        cashPrice: 15000, // $150
        creditPrice: 15,
        deliveryFormat: 'async',
        turnaroundDays: 5,
        revisionsIncluded: 2,
        createdAt: twoWeeksAgo,
        analytics: { views: 1200, requests: 50, conversions: 45 } // High conversions for "Top Rated"
      },
      // Quick Turnaround (1-3 days) - Alice
      {
        userId: users[0]._id,
        title: 'High-Converting Landing Page Design in Figma',
        description: 'I will design a beautiful, conversion-optimized landing page for your SaaS or product within 48 hours.',
        category: 'Design',
        skillTags: ['Figma', 'Landing Page', 'UI/UX'],
        cashPrice: 20000, // $200
        creditPrice: 20,
        deliveryFormat: 'async',
        turnaroundDays: 2, // Quick turnaround
        revisionsIncluded: 3,
        createdAt: twoWeeksAgo,
        analytics: { views: 800, requests: 20, conversions: 18 }
      },
      // New This Week (Recent createdAt) - Charlie
      {
        userId: users[2]._id,
        title: 'SEO-Optimized Blog Post (1500 words)',
        description: 'Engaging, SEO-optimized content to rank on Google and convert your readers.',
        category: 'Writing',
        skillTags: ['SEO', 'Content Writing', 'Blog'],
        cashPrice: 8000, // $80
        creditPrice: 8,
        deliveryFormat: 'document',
        turnaroundDays: 4,
        revisionsIncluded: 1,
        createdAt: threeDaysAgo, // New this week
        analytics: { views: 150, requests: 5, conversions: 2 }
      },
      // Another Top Rated - Alice
      {
        userId: users[0]._id,
        title: 'Brand Identity & Logo Design',
        description: 'Complete brand identity including logo, typography, and color palette.',
        category: 'Design',
        skillTags: ['Branding', 'Logo', 'Illustrator'],
        cashPrice: 35000, // $350
        creditPrice: 35,
        deliveryFormat: 'async',
        turnaroundDays: 7,
        revisionsIncluded: 5,
        createdAt: twoWeeksAgo,
        analytics: { views: 2500, requests: 80, conversions: 75 } // High conversions
      },
      // Another Quick Turnaround - Bob
      {
        userId: users[1]._id,
        title: '1-Hour Code Review & Pair Programming',
        description: 'Stuck on a bug? I will review your code and pair program with you to solve it.',
        category: 'Development',
        skillTags: ['React', 'Debugging', 'Pair Programming'],
        cashPrice: 5000, // $50
        creditPrice: 5,
        deliveryFormat: 'live_call',
        turnaroundDays: 1, // Quick turnaround
        revisionsIncluded: 0,
        createdAt: twoWeeksAgo,
        analytics: { views: 400, requests: 30, conversions: 28 }
      },
      // Another New This Week - Charlie
      {
        userId: users[2]._id,
        title: 'Email Marketing Welcome Sequence',
        description: 'A 5-part email sequence to nurture your new subscribers and turn them into customers.',
        category: 'Marketing',
        skillTags: ['Email Marketing', 'Copywriting', 'Sales'],
        cashPrice: 12000, // $120
        creditPrice: 12,
        deliveryFormat: 'document',
        turnaroundDays: 5,
        revisionsIncluded: 2,
        createdAt: new Date(), // Just created today
        analytics: { views: 50, requests: 1, conversions: 0 }
      }
    ];

    const listings = await Listing.insertMany(listingsData);
    console.log(`📦 Created ${listings.length} mock listings`);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
