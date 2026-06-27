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
      },
      {
        email: 'diana@example.com',
        passwordHash: 'hashed_password',
        name: 'Diana Marketer',
        bio: 'Digital marketing strategist focusing on ROI and growth.',
        skillTags: ['Social Media', 'Facebook Ads', 'Marketing'],
        reputationScore: 92,
        isVerified: true,
      },
      {
        email: 'ethan@example.com',
        passwordHash: 'hashed_password',
        name: 'Ethan Video',
        bio: 'Freelance video editor and motion graphics artist.',
        skillTags: ['Video Editing', 'Premiere Pro', 'After Effects'],
        reputationScore: 88,
        isVerified: false,
      },
      {
        email: 'fiona@example.com',
        passwordHash: 'hashed_password',
        name: 'Fiona Business',
        bio: 'Ex-consultant helping startups build scalable models.',
        skillTags: ['Business Strategy', 'Financial Modeling', 'Excel'],
        reputationScore: 96,
        isVerified: true,
      },
      {
        email: 'george@example.com',
        passwordHash: 'hashed_password',
        name: 'George Tutor',
        bio: 'Passionate language tutor specializing in conversational fluency.',
        skillTags: ['English', 'Spanish', 'Language Tutoring'],
        reputationScore: 99,
        isVerified: true,
      },
      {
        email: 'hannah@example.com',
        passwordHash: 'hashed_password',
        name: 'Hannah Data',
        bio: 'Data scientist helping you make sense of your numbers.',
        skillTags: ['Data Analysis', 'Python', 'SQL', 'Machine Learning'],
        reputationScore: 94,
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
        analytics: { views: 1200, requests: 50, conversions: 45 }
      },
      // Quick Turnaround (1-3 days) - Alice
      {
        userId: users[0]._id,
        title: 'High-Converting Landing Page Design in Figma',
        description: 'I will design a beautiful, conversion-optimized landing page for your SaaS or product within 48 hours.',
        category: 'Design',
        skillTags: ['Figma', 'Landing Page', 'UI/UX'],
        cashPrice: 20000,
        creditPrice: 20,
        deliveryFormat: 'async',
        turnaroundDays: 2,
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
        cashPrice: 8000,
        creditPrice: 8,
        deliveryFormat: 'document',
        turnaroundDays: 4,
        revisionsIncluded: 1,
        createdAt: threeDaysAgo,
        analytics: { views: 150, requests: 5, conversions: 2 }
      },
      // Top Rated - Alice
      {
        userId: users[0]._id,
        title: 'Brand Identity & Logo Design',
        description: 'Complete brand identity including logo, typography, and color palette.',
        category: 'Design',
        skillTags: ['Branding', 'Logo', 'Illustrator'],
        cashPrice: 35000,
        creditPrice: 35,
        deliveryFormat: 'async',
        turnaroundDays: 7,
        revisionsIncluded: 5,
        createdAt: twoWeeksAgo,
        analytics: { views: 2500, requests: 80, conversions: 75 }
      },
      // Quick Turnaround - Bob
      {
        userId: users[1]._id,
        title: '1-Hour Code Review & Pair Programming',
        description: 'Stuck on a bug? I will review your code and pair program with you to solve it.',
        category: 'Development',
        skillTags: ['React', 'Debugging', 'Pair Programming'],
        cashPrice: 5000,
        creditPrice: 5,
        deliveryFormat: 'live_call',
        turnaroundDays: 1,
        revisionsIncluded: 0,
        createdAt: twoWeeksAgo,
        analytics: { views: 400, requests: 30, conversions: 28 }
      },
      // Marketing - Diana
      {
        userId: users[3]._id,
        title: 'Comprehensive Social Media Strategy',
        description: 'A complete 30-day social media plan tailored to your target audience to drive growth.',
        category: 'Marketing',
        skillTags: ['Social Media', 'Strategy', 'Marketing'],
        cashPrice: 25000,
        creditPrice: 25,
        deliveryFormat: 'document',
        turnaroundDays: 6,
        revisionsIncluded: 2,
        createdAt: twoWeeksAgo,
        analytics: { views: 950, requests: 40, conversions: 35 }
      },
      // Ads - Diana
      {
        userId: users[3]._id,
        title: 'Facebook & Instagram Ad Campaign Setup',
        description: 'I will set up and launch highly targeted Facebook and Instagram ad campaigns.',
        category: 'Marketing',
        skillTags: ['Facebook Ads', 'PPC', 'Marketing'],
        cashPrice: 18000,
        creditPrice: 18,
        deliveryFormat: 'async',
        turnaroundDays: 3,
        revisionsIncluded: 1,
        createdAt: threeDaysAgo,
        analytics: { views: 300, requests: 12, conversions: 8 }
      },
      // Video Editing - Ethan
      {
        userId: users[4]._id,
        title: 'YouTube Video Editing (Up to 15 mins)',
        description: 'Professional video editing for YouTube including cuts, transitions, b-roll, and audio mixing.',
        category: 'Design',
        skillTags: ['Video Editing', 'Premiere Pro', 'YouTube'],
        cashPrice: 12000,
        creditPrice: 12,
        deliveryFormat: 'async',
        turnaroundDays: 4,
        revisionsIncluded: 2,
        createdAt: twoWeeksAgo,
        analytics: { views: 1100, requests: 60, conversions: 50 }
      },
      // Business - Fiona
      {
        userId: users[5]._id,
        title: 'Startup Financial Model & Projections',
        description: 'Detailed 3-year financial model with revenue projections, cash flow, and key metrics.',
        category: 'Business',
        skillTags: ['Financial Modeling', 'Excel', 'Startups'],
        cashPrice: 40000,
        creditPrice: 40,
        deliveryFormat: 'document',
        turnaroundDays: 7,
        revisionsIncluded: 3,
        createdAt: twoWeeksAgo,
        analytics: { views: 600, requests: 25, conversions: 20 }
      },
      // Tutoring - George
      {
        userId: users[6]._id,
        title: '1-Hour Conversational Spanish Lesson',
        description: 'Improve your fluency with a native speaker through guided conversation and live feedback.',
        category: 'Education',
        skillTags: ['Spanish', 'Language Tutoring', 'Speaking'],
        cashPrice: 3000,
        creditPrice: 3,
        deliveryFormat: 'live_call',
        turnaroundDays: 2,
        revisionsIncluded: 0,
        createdAt: threeDaysAgo,
        analytics: { views: 200, requests: 15, conversions: 12 }
      },
      // Data Science - Hannah
      {
        userId: users[7]._id,
        title: 'Data Cleaning & Visualization in Python',
        description: 'I will clean your dataset and create an interactive dashboard highlighting key insights.',
        category: 'Development',
        skillTags: ['Python', 'Data Analysis', 'Visualization'],
        cashPrice: 22000,
        creditPrice: 22,
        deliveryFormat: 'async',
        turnaroundDays: 5,
        revisionsIncluded: 2,
        createdAt: new Date(),
        analytics: { views: 80, requests: 4, conversions: 1 }
      },
      // New This Week - Charlie
      {
        userId: users[2]._id,
        title: 'Email Marketing Welcome Sequence',
        description: 'A 5-part email sequence to nurture your new subscribers and turn them into customers.',
        category: 'Writing',
        skillTags: ['Email Marketing', 'Copywriting', 'Sales'],
        cashPrice: 12000,
        creditPrice: 12,
        deliveryFormat: 'document',
        turnaroundDays: 5,
        revisionsIncluded: 2,
        createdAt: new Date(),
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
