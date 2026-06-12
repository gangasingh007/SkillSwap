# SkillSwap Market — Project Plan

> **The Skill-Barter + Micro-Monetization Marketplace**
> Stack: MERN + TypeScript + Redis + PostgreSQL | Solo Developer Build

---

## Project Overview

SkillSwap Market is a dual-currency eCommerce platform where professional expertise is both the product and the currency. Users list their skills as services priced in either **USD cash** or **platform-native Skill Credits**. Credits are earned exclusively by delivering services — creating a self-sustaining circular economy that rewards participation, not spending.

**Core differentiation:** No existing marketplace combines a dual-currency economy, AI-powered bilateral swap matching, and community-driven quality vouching.

---

## Repository Structure

```
skillswap-market/
├── apps/
│   ├── web/                        # Next.js 14 frontend (App Router)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── orders/
│   │   │   │   └── wallet/
│   │   │   ├── listings/
│   │   │   │   ├── [id]/
│   │   │   │   └── new/
│   │   │   ├── profile/
│   │   │   │   └── [userId]/
│   │   │   ├── explore/
│   │   │   ├── looking-for/
│   │   │   └── admin/
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui primitives
│   │   │   ├── listings/
│   │   │   ├── orders/
│   │   │   ├── wallet/
│   │   │   ├── auth/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   └── store/                  # Zustand stores
│   │
│   └── api/                        # Node.js + Express backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── users.ts
│       │   │   ├── listings.ts
│       │   │   ├── orders.ts
│       │   │   ├── wallet.ts
│       │   │   ├── swap.ts
│       │   │   └── admin.ts
│       │   ├── controllers/
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   ├── validate.ts
│       │   │   └── rateLimit.ts
│       │   ├── models/
│       │   │   ├── mongo/          # Mongoose models
│       │   │   └── pg/             # PostgreSQL schemas (Prisma/raw)
│       │   ├── services/
│       │   │   ├── walletService.ts
│       │   │   ├── stripeService.ts
│       │   │   ├── emailService.ts
│       │   │   ├── swapService.ts
│       │   │   └── aiService.ts
│       │   ├── jobs/               # BullMQ background jobs
│       │   │   ├── autoConfirm.ts
│       │   │   ├── creditExpiry.ts
│       │   │   └── emailQueue.ts
│       │   ├── sockets/            # Socket.io handlers
│       │   └── utils/
│       └── tests/
│
├── packages/
│   └── types/                      # Shared TypeScript types
│       └── src/
│           ├── user.ts
│           ├── listing.ts
│           ├── order.ts
│           ├── wallet.ts
│           └── index.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # Lint → Type-check → Test → Deploy
│
├── .env.example
├── docker-compose.dev.yml
└── turbo.json                      # Turborepo monorepo config
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | SSR/SSG for SEO on public profiles and listings |
| TypeScript | End-to-end type safety |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible component primitives |
| Zustand | Global state — wallet balance, auth context, notifications |
| React Query (TanStack) | Server state — caching, background refetch, optimistic updates |
| Socket.io Client | Real-time order status updates and notification toasts |
| Framer Motion | Page transitions and micro-animations |
| Stripe.js | PCI-compliant payment input via Stripe Elements |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| TypeScript | Shared types via `/packages/types` |
| Mongoose (MongoDB ODM) | Schema and queries for listings, reviews, feeds |
| MongoDB Atlas | Document storage — listings, reviews, activity feeds |
| PostgreSQL (Supabase) | ACID-compliant storage for all financial data |
| Redis (Upstash) | Session store, rate limiting, BullMQ job queue, hot-data cache |
| BullMQ | Background jobs — auto-confirm, credit expiry, emails |
| Socket.io | WebSocket server for real-time updates |
| Stripe Connect | Marketplace payments — escrow, payouts, seller onboarding |
| OpenAI API (GPT-4o) | Embedding-based AI Swap Suggester |
| Nodemailer + Resend | Transactional email |
| Zod | Runtime request validation |
| JWT + bcrypt | Stateless auth with refresh token rotation |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Next.js hosting + edge CDN |
| Railway.app | Backend Node.js + Redis |
| MongoDB Atlas | Managed MongoDB cluster |
| Supabase | Managed PostgreSQL with row-level security |
| Upstash Redis | Serverless Redis |
| Cloudinary | Image/video CDN for portfolio samples |
| GitHub Actions | CI/CD pipeline |
| Sentry | Error monitoring |
| PostHog | Product analytics + feature flags |

---

## Database Architecture

### MongoDB Collections (Flexible / Document Data)

```ts
// users
{
  _id: ObjectId,
  email: string,
  passwordHash: string,
  name: string,
  bio: string,
  skillTags: string[],          // max 10
  avatarUrl: string,
  reputationScore: number,      // 0–100
  oauthProviders: { google?: string, github?: string },
  isVerified: boolean,          // after 3 completed swaps
  completenessScore: number,
  timezone: string,
  availabilityToggle: boolean,
  createdAt: Date
}

// listings
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  description: string,
  category: 'Development' | 'Design' | 'Marketing' | 'Writing' | 'Business' | 'Education' | 'Other',
  cashPrice: number,            // USD cents
  creditPrice: number,          // Skill Credits
  deliveryFormat: 'async' | 'live_call' | 'document',
  turnaroundDays: number,
  revisionsIncluded: number,
  samples: { type: 'image' | 'pdf' | 'link', url: string }[],
  visibility: 'public' | 'credits_only' | 'cash_only',
  isActive: boolean,
  analytics: { views: number, requests: number, conversions: number },
  isPromoted: boolean,
  createdAt: Date
}

// orders
{
  _id: ObjectId,
  listingId: ObjectId,
  buyerId: ObjectId,
  sellerId: ObjectId,
  status: 'pending' | 'active' | 'delivered' | 'completed' | 'disputed' | 'refunded',
  paymentType: 'cash' | 'credits',
  amount: number,
  deliverable: { type: 'file' | 'link' | 'text', url?: string, content?: string },
  proposedTimeline: Date,
  agreedTimeline: Date,
  revisionsUsed: number,
  deliveredAt: Date,
  confirmedAt: Date,
  autoConfirmAt: Date,          // deliveredAt + 72h
  createdAt: Date
}

// reviews
{
  _id: ObjectId,
  orderId: ObjectId,
  reviewerId: ObjectId,
  revieweeId: ObjectId,
  rating: 1 | 2 | 3 | 4 | 5,
  text: string,
  createdAt: Date
}

// vouches
{
  _id: ObjectId,
  voucherId: ObjectId,
  recipientId: ObjectId,
  skillTag: string,
  message: string,
  createdAt: Date
}

// activity_feed
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'new_listing' | 'completed_swap' | 'new_vouch' | 'new_follower',
  referenceId: ObjectId,
  message: string,
  createdAt: Date
}
```

### PostgreSQL Tables (Financial / Transactional Data)

```sql
-- wallets
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL UNIQUE,
  cash_balance_cents INTEGER NOT NULL DEFAULT 0,
  credit_balance INTEGER NOT NULL DEFAULT 3,    -- new user bonus
  escrow_cash_cents INTEGER NOT NULL DEFAULT 0,
  escrow_credits INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id),
  type VARCHAR NOT NULL,  -- earn|spend|escrow|release|purchase|payout
  amount INTEGER NOT NULL,
  currency VARCHAR NOT NULL,  -- cash|credits
  order_id VARCHAR,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id),
  amount_cents INTEGER NOT NULL,
  fee_type VARCHAR NOT NULL,  -- standard|instant
  fee_cents INTEGER NOT NULL,
  status VARCHAR NOT NULL,    -- pending|processing|paid|failed
  stripe_transfer_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- credit_purchases
CREATE TABLE credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id),
  credit_amount INTEGER NOT NULL,
  paid_cents INTEGER NOT NULL,
  stripe_payment_intent_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- escrow_locks
CREATE TABLE escrow_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR NOT NULL,
  buyer_wallet_id UUID REFERENCES wallets(id),
  type VARCHAR NOT NULL,      -- cash|credits
  amount INTEGER NOT NULL,
  status VARCHAR NOT NULL,    -- locked|released|refunded
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create account — email + password |
| POST | `/auth/login` | Returns access token + sets refresh cookie |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Invalidate session |
| GET | `/auth/google` | OAuth redirect |
| GET | `/auth/github` | OAuth redirect |

### Users & Profiles
| Method | Route | Description |
|---|---|---|
| GET | `/users/:id` | Public profile + listings |
| PATCH | `/users/me` | Update profile |
| GET | `/users/me/followers` | Follower list |
| POST | `/users/:id/follow` | Follow a user |

### Listings
| Method | Route | Description |
|---|---|---|
| GET | `/listings` | Browse + filter (`?category=&minPrice=&maxPrice=&rating=`) |
| GET | `/listings/:id` | Listing detail |
| POST | `/listings` | Create listing (auth required) |
| PATCH | `/listings/:id` | Edit listing (owner only) |
| DELETE | `/listings/:id` | Soft-delete listing |
| GET | `/listings/trending` | Listings sorted by 7-day request volume |
| GET | `/listings/search?q=` | Full-text search |

### Orders
| Method | Route | Description |
|---|---|---|
| POST | `/orders` | Create booking request |
| GET | `/orders/me` | My orders (buyer + seller) |
| GET | `/orders/:id` | Order detail |
| PATCH | `/orders/:id/accept` | Seller accepts booking |
| PATCH | `/orders/:id/decline` | Seller declines booking |
| POST | `/orders/:id/deliver` | Submit delivery (file/link/text) |
| PATCH | `/orders/:id/confirm` | Buyer confirms — releases escrow |
| POST | `/orders/:id/dispute` | Open a dispute |
| POST | `/orders/:id/review` | Submit review after completion |

### Wallet
| Method | Route | Description |
|---|---|---|
| GET | `/wallet/me` | Authenticated user's balances |
| GET | `/wallet/me/transactions` | Transaction history with filters |
| POST | `/wallet/withdraw` | Initiate payout via Stripe |
| POST | `/wallet/credits/purchase` | Buy Skill Credits via Stripe |

### AI Swap Suggester
| Method | Route | Description |
|---|---|---|
| POST | `/swap/suggest` | Returns top 3 swap partner matches |
| POST | `/looking-for` | Post a public need |
| GET | `/looking-for` | Browse the looking-for board |

### Admin
| Method | Route | Description |
|---|---|---|
| GET | `/admin/disputes` | Dispute resolution queue |
| PATCH | `/admin/disputes/:id/resolve` | Resolve a dispute |
| GET | `/admin/users` | User management |
| PATCH | `/admin/users/:id/ban` | Ban a user |
| GET | `/admin/analytics` | Platform metrics |

---

## Environment Variables

```env
# Databases
MONGODB_URI=
DATABASE_URL=                        # Supabase PostgreSQL
REDIS_URL=                           # Upstash Redis

# Auth
JWT_SECRET=                          # 256-bit random
JWT_REFRESH_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AI
OPENAI_API_KEY=

# Media
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_API_URL=
NODE_ENV=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## Build Phases

### Phase 1 — MVP (Weeks 1–12)
Ship the smallest version where two strangers can complete a real cash transaction.

| Week | Deliverables |
|---|---|
| 1–2 | Monorepo scaffold, auth (JWT + refresh), user profile CRUD, CI/CD to Vercel + Railway |
| 3–4 | Skill listing CRUD, Cloudinary uploads, browse + full-text search, category filters |
| 5–6 | Stripe Connect onboarding, booking flow, order dashboard, async delivery, 72h auto-confirm (BullMQ) |
| 7–8 | Star ratings + reviews, reputation score algorithm, cash wallet UI, payout flow (standard + instant) |
| 9–10 | Skill Credits in PostgreSQL, credit escrow, dual-price listings, credit purchase via Stripe, expiry jobs |
| 11 | OpenAI embeddings, Looking-For board, AI Swap Suggester (top 3 matches), mutual booking |
| 12 | Community vouching (basic), admin dashboard, Sentry, PostHog, beta launch to 50 users |

### Phase 2 — Credit Economy (Months 3–6)
- Full dual-currency system live
- AI Swap Suggester v2 with feedback loop
- Referral program (2 credits per referred user)
- Target: 500 active users, 40% of transactions using credits

### Phase 3 — Community (Months 6–12)
- Skill Groups (niche communities, $9/month)
- Public swap testimonial cards (viral sharing)
- Skill Challenges with peer grading
- Promoted listings
- Mobile-responsive PWA
- Target: 2,000 active users, $50K GMV

### Phase 4 — Scale (Year 2)
- Company Accounts (B2B)
- Skill Challenge API
- Multi-currency (INR, EUR, GBP)
- React Native mobile app
- Target: $500K ARR

---

## Monetization

| Stream | Model |
|---|---|
| Transaction fee (primary) | 10% of all completed cash transactions |
| Credit sales | $10 per Skill Credit purchased |
| Instant payout fee | 1.5% on instant withdrawals |
| Skill Groups (v2) | $9/month per group subscription |
| Promoted listings | Credits spent to boost visibility |
| B2B API (Year 2) | SaaS pricing for company access |

**Year 1 Projection (Month 12):** ~$30K MRR from 2,000 MAUs, 2 transactions/user/month at $55 avg.

---

## Definition of Done (Per Feature)

- [ ] TypeScript types defined in `/packages/types`
- [ ] Zod schema validates all API inputs
- [ ] Unit test written for core business logic (Vitest)
- [ ] API endpoint tested with Supertest
- [ ] UI component renders in both light and dark mode
- [ ] Feature works end-to-end in staging
- [ ] Zero TypeScript errors, zero ESLint warnings
- [ ] Socket.io events fire correctly for real-time updates (where applicable)

---

## Testing Strategy

| Tool | Scope |
|---|---|
| Vitest | Unit tests — wallet math, credit calculations, fee deductions |
| React Testing Library | Component tests — wallet display, order flow, auth forms |
| Playwright | E2E — signup, create listing, complete swap flow |
| Supertest | API integration — all REST endpoints against test DB |

---

## Key Business Rules

1. **Credits are non-withdrawable, non-transferable, platform-only.** They are not legal tender.
2. **Platform fee is 10%** — deducted at sale completion, not at withdrawal.
3. **Minimum withdrawal is $20.** Standard payout: 2–3 days, $0.25 flat. Instant: 1.5% fee.
4. **Credit expiry:** 12-month inactivity timer. Resets on any platform activity.
5. **New user bonus:** 3 free credits on signup.
6. **Auto-confirm:** 72 hours after delivery if buyer does not respond — escrow releases automatically.
7. **Dispute window:** 72-hour mediation. Platform decides on day 4.
8. **Credits release only on 4+ star rating** — fraud prevention.
9. **Verified Skill badge** requires passing a 15-minute peer-graded challenge.
10. **Account Verification badge** granted after 3 completed swaps.