import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const rateLimitResponse = (message: string) => (_req: Request, res: Response) => {
  res.status(429).json({ message });
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitResponse('Too many requests, please try again later.'),
  skip: () => process.env.NODE_ENV === 'test',
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitResponse('Too many authentication attempts, please try again in 15 minutes.'),
  skip: () => process.env.NODE_ENV === 'test',
});

export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitResponse('Too many write operations, please slow down.'),
  skip: () => process.env.NODE_ENV === 'test',
});

export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitResponse('Too many search requests, please slow down.'),
  skip: () => process.env.NODE_ENV === 'test',
});
