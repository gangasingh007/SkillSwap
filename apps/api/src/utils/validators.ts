import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// ── Listing Schemas ──────────────────────────────────────────────

const LISTING_CATEGORIES = [
  'Development', 'Design', 'Marketing', 'Writing', 'Business', 'Education', 'Other',
] as const;

const DELIVERY_FORMATS = ['async', 'live_call', 'document'] as const;
const VISIBILITY_OPTIONS = ['public', 'credits_only', 'cash_only'] as const;

const sampleSchema = z.object({
  type: z.enum(['image', 'pdf', 'link']),
  url: z.string().url('Sample URL must be a valid URL'),
});

export const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title must be at most 120 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be at most 5000 characters'),
    category: z.enum(LISTING_CATEGORIES, { errorMap: () => ({ message: 'Invalid category' }) }),
    skillTags: z.array(z.string().min(1).max(50)).max(10, 'Maximum 10 skill tags').optional(),
    cashPrice: z.number().int('Cash price must be an integer (cents)').min(500, 'Minimum cash price is $5 (500 cents)'),
    creditPrice: z.number().int('Credit price must be an integer').min(1, 'Minimum credit price is 1'),
    deliveryFormat: z.enum(DELIVERY_FORMATS, { errorMap: () => ({ message: 'Invalid delivery format' }) }),
    turnaroundDays: z.number().int().min(1, 'Minimum 1 day turnaround').max(90, 'Maximum 90 days turnaround'),
    revisionsIncluded: z.number().int().min(0, 'Revisions cannot be negative').max(10, 'Maximum 10 revisions'),
    samples: z.array(sampleSchema).max(5, 'Maximum 5 portfolio samples').optional(),
    visibility: z.enum(VISIBILITY_OPTIONS).optional(),
  }),
});

export const updateListingSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().min(10).max(5000).optional(),
    category: z.enum(LISTING_CATEGORIES).optional(),
    skillTags: z.array(z.string().min(1).max(50)).max(10).optional(),
    cashPrice: z.number().int().min(500).optional(),
    creditPrice: z.number().int().min(1).optional(),
    deliveryFormat: z.enum(DELIVERY_FORMATS).optional(),
    turnaroundDays: z.number().int().min(1).max(90).optional(),
    revisionsIncluded: z.number().int().min(0).max(10).optional(),
    samples: z.array(sampleSchema).max(5).optional(),
    visibility: z.enum(VISIBILITY_OPTIONS).optional(),
  }),
});
