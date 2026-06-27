# SkillSwap Market — Agents Guide

> This document defines every AI agent task for building SkillSwap Market.
> Each agent has a bounded scope, clear inputs, expected outputs, and hard constraints.
> Agents must never exceed their defined scope without explicit instruction.

---

## How to Use This File

Each agent entry contains:
- **Role** — What this agent is responsible for building
- **Scope** — Exact files and directories it owns
- **Inputs** — What it receives before starting (context, schemas, env vars)
- **Output Contract** — Exactly what it must produce
- **Constraints** — Hard rules it must follow
- **Acceptance Criteria** — How to verify the agent succeeded

Agents communicate via shared types in `/packages/types/src/`. No agent may break a type contract defined by another agent.

---

## Agent 0 — Scaffold Agent

**Role:** Bootstrap the monorepo. This agent runs first and creates the project skeleton that all other agents build inside.

**Scope:**
```
/
├── turbo.json
├── package.json                  # root workspace
├── .gitignore
├── .env.example                  # all env vars with empty values
├── docker-compose.dev.yml        # local MongoDB + PostgreSQL + Redis
├── apps/web/                     # empty Next.js 14 Pages Router project
├── apps/api/                     # empty Express + TypeScript project
└── packages/types/               # empty shared types package
```

**Inputs:** plan.md (this codebase), agents.md

**Output Contract:**
- Turborepo monorepo with `apps/web`, `apps/api`, `packages/types`
- `apps/web`: Next.js 14 Pages Router, TypeScript, Tailwind CSS, shadcn/ui configured
- `apps/api`: Express, TypeScript, `ts-node-dev` for dev mode, `tsconfig.json` with path aliases
- `packages/types`: Exports empty typed interfaces for `User`, `Listing`, `Order`, `Wallet`, `Transaction`
- Root `package.json` with workspaces configured
- Docker Compose with services: `mongo`, `postgres`, `redis` (for local dev only)
- CI/CD scaffold: `.github/workflows/ci.yml` (lint → type-check → test → deploy)
- `.env.example` with all variables from plan.md Section: Environment Variables

**Constraints:**
- Use `pnpm` as package manager with workspace protocol
- Node.js version: 20 LTS
- All TypeScript configs must use `strict: true`
- No placeholder content — empty files/folders are fine; fake implementations are not
- `docker-compose.dev.yml` must NOT be used in production

**Acceptance Criteria:**
- `pnpm install` runs without errors from repo root
- `pnpm run dev` starts both apps concurrently via Turborepo
- `pnpm run type-check` passes with zero errors on the empty scaffold
- `packages/types` is importable from both `apps/web` and `apps/api`

---

## Agent 1 — Types Agent

**Role:** Define and maintain all shared TypeScript types and Zod validation schemas across the entire codebase.

**Scope:**
```
packages/types/src/
├── user.ts
├── listing.ts
├── order.ts
├── wallet.ts
├── review.ts
├── swap.ts
├── admin.ts
└── index.ts
```

**Inputs:** All MongoDB collection schemas and PostgreSQL table definitions from plan.md

**Output Contract:**

```ts
// user.ts
export interface IUser { ... }
export interface IPublicProfile { ... }
export interface IAuthPayload { ... }  // JWT payload shape

// listing.ts
export interface IListing { ... }
export type ListingCategory = 'Development' | 'Design' | 'Marketing' | 'Writing' | 'Business' | 'Education' | 'Other'
export type DeliveryFormat = 'async' | 'live_call' | 'document'
export type ListingVisibility = 'public' | 'credits_only' | 'cash_only'

// order.ts
export interface IOrder { ... }
export type OrderStatus = 'pending' | 'active' | 'delivered' | 'completed' | 'disputed' | 'refunded'
export type PaymentType = 'cash' | 'credits'

// wallet.ts
export interface IWallet { ... }
export interface ITransaction { ... }
export type TransactionType = 'earn' | 'spend' | 'escrow' | 'release' | 'purchase' | 'payout'
export type Currency = 'cash' | 'credits'

// All Zod schemas mirror TypeScript types exactly
export const CreateListingSchema = z.object({ ... })
export const BookingRequestSchema = z.object({ ... })
// etc.
```

**Constraints:**
- Every type must have a corresponding Zod schema with identical shape
- Use `z.infer<typeof Schema>` to derive TypeScript types from Zod schemas where possible — avoid duplication
- No `any` types permitted anywhere
- All monetary amounts stored as **integers (cents)** — never floats
- Export everything from `index.ts`

**Acceptance Criteria:**
- `pnpm run type-check` passes in `packages/types`
- Both `apps/web` and `apps/api` can import types without errors
- Zod schemas correctly reject invalid inputs in unit tests

---

## Agent 2 — Auth Agent

**Role:** Build the complete authentication and session management system.

**Scope:**
```
apps/api/src/
├── routes/auth.ts
├── controllers/authController.ts
├── middleware/auth.ts             # JWT verification middleware
├── services/authService.ts
└── models/mongo/User.ts          # Mongoose model

apps/web/pages/auth/
├── login.tsx
└── register.tsx

apps/web/components/auth/
├── LoginForm.tsx
├── RegisterForm.tsx
└── OAuthButtons.tsx

apps/web/lib/auth.ts              # client-side auth helpers
apps/web/store/authStore.ts       # Zustand auth store
```

**Inputs:** `IUser`, `IAuthPayload` from Types Agent output

**Output Contract:**

Backend routes:
- `POST /auth/register` — validates with Zod, hashes password (bcrypt, 12 rounds), creates user + wallet, returns `{ accessToken, user: IPublicProfile }`
- `POST /auth/login` — verifies credentials, returns `{ accessToken }`, sets `refreshToken` as `httpOnly` cookie
- `POST /auth/refresh` — reads `refreshToken` cookie, rotates it, returns new `accessToken`
- `POST /auth/logout` — clears cookie, invalidates refresh token in Redis
- `GET /auth/google` + `GET /auth/github` — OAuth 2.0 flow via Passport.js

Frontend:
- Login and Register forms with React Hook Form + Zod client-side validation
- Error states displayed inline (not via alert())
- OAuth buttons for Google and GitHub
- Zustand `authStore` with `{ user, accessToken, login(), logout(), refresh() }`
- Axios interceptor in `apps/web/lib/api.ts` that automatically refreshes access token on 401

**Constraints:**
- Access token TTL: 15 minutes
- Refresh token TTL: 7 days, stored in Redis with user ID as key
- Passwords must be ≥ 8 characters — enforced at Zod level
- Never return `passwordHash` in any API response
- OAuth users have no `passwordHash` — handle gracefully
- Rate limit: 5 login attempts per IP per 15 minutes (Redis-based)
- New user creation must also create a `wallets` row in PostgreSQL (3 credit bonus) — wrap in a transaction

**Acceptance Criteria:**
- Register → Login → access protected route works end-to-end
- Refresh token rotation works (new token on refresh, old one invalidated)
- OAuth flow completes and creates user if they don't exist
- Supertest: all auth endpoints covered
- Zustand store persists auth state across page refreshes (localStorage or cookie)

---

## Agent 3 — Listing Agent

**Role:** Build the complete skill listing creation, editing, browsing, and search system.

**Scope:**
```
apps/api/src/
├── routes/listings.ts
├── controllers/listingController.ts
├── models/mongo/Listing.ts
└── services/listingService.ts

apps/web/pages/listings/
├── index.tsx                     # Browse + search page
├── [id].tsx                      # Listing detail (SSR for SEO)
└── new.tsx                       # Create listing form

apps/web/components/listings/
├── ListingCard.tsx
├── ListingGrid.tsx
├── ListingForm.tsx
├── ListingFilters.tsx
├── CategoryBadge.tsx
└── PortfolioUpload.tsx           # Cloudinary upload UI
```

**Inputs:** `IListing`, `ListingCategory`, `CreateListingSchema` from Types Agent; auth middleware from Auth Agent

**Output Contract:**

Backend routes (see plan.md API Endpoints — Listings section):
- Full-text search using MongoDB text index on `title`, `description`, `skillTags`
- Filter support: `category`, `minPrice`, `maxPrice`, `minRating`, `availability`, `paymentType`
- Trending endpoint: aggregate by order count in last 7 days
- Cloudinary signed upload endpoint: `POST /listings/upload` returns secure URL

Frontend:
- Browse page: grid of `ListingCard` components with filter sidebar
- Listing detail: SSR via `generateStaticParams`, shows price in both USD and credits
- Create form: all required fields, portfolio upload (up to 5 files), dual-price inputs
- Optimistic updates on listing creation via React Query

**Constraints:**
- Listings must have BOTH `cashPrice` (min $5) and `creditPrice` (min 1) — both required fields
- Maximum 5 portfolio samples per listing
- Listing `userId` must match authenticated user — never trust client-supplied `userId`
- `isActive: false` on delete (soft delete only — preserve order history)
- Cloudinary uploads: validate file type (images, PDFs only) and max size (10MB)
- Listing detail page must be server-rendered for SEO (`generateMetadata` for title/description)

**Acceptance Criteria:**
- Create → browse → filter → view detail works end-to-end
- Full-text search returns relevant results
- Cloudinary file appears in listing after upload
- Trending endpoint returns correct results based on order count
- Supertest: all listing endpoints covered

---

## Agent 4 — Order Agent

**Role:** Build the complete booking, delivery, confirmation, dispute, and review flow.

**Scope:**
```
apps/api/src/
├── routes/orders.ts
├── controllers/orderController.ts
├── models/mongo/Order.ts
├── models/mongo/Review.ts
└── services/orderService.ts

apps/api/src/jobs/
├── autoConfirm.ts                # BullMQ job: confirm delivery after 72h
└── emailQueue.ts                 # BullMQ job: send transactional emails

apps/web/pages/dashboard/orders/
├── index.tsx                     # Order dashboard
└── [id].tsx                      # Order detail + delivery UI

apps/web/components/orders/
├── OrderCard.tsx
├── OrderDashboard.tsx
├── DeliveryUpload.tsx
├── ReviewForm.tsx
└── DisputeForm.tsx
```

**Inputs:** `IOrder`, `IReview`, `OrderStatus`, `BookingRequestSchema` from Types Agent; Wallet Agent escrow functions; auth middleware from Auth Agent

**Output Contract:**

Backend — complete order lifecycle:
1. `POST /orders` — creates order with status `pending`, locks escrow (calls Wallet Agent's `lockEscrow()`)
2. `PATCH /orders/:id/accept` — seller only, sets status `active`, schedules auto-confirm BullMQ job
3. `PATCH /orders/:id/decline` — seller only, refunds escrow
4. `POST /orders/:id/deliver` — seller only, sets status `delivered`, resets auto-confirm timer
5. `PATCH /orders/:id/confirm` — buyer only, sets status `completed`, calls Wallet Agent's `releaseEscrow()`
6. `POST /orders/:id/dispute` — sets status `disputed`, pauses escrow, creates admin queue entry
7. `POST /orders/:id/review` — creates review, updates seller reputation score

BullMQ jobs:
- `autoConfirmJob`: fires 72 hours after delivery, calls `confirm` if status is still `delivered`
- `emailQueue`: processes email events (booking received, delivery made, confirmation, dispute opened)

Frontend:
- Order dashboard with tabs: Active / Completed / Disputed
- Real-time status updates via Socket.io
- Delivery upload UI (file or link)
- Review form (1–5 stars + text) shown after completion

**Constraints:**
- Buyer cannot confirm their own order as seller (enforce `buyerId !== sellerId`)
- Only the listing seller can deliver; only the buyer can confirm
- Dispute resolution is manual (admin only) — no auto-resolution
- Review is one-time only per order — check before creating
- Auto-confirm job must be idempotent — re-running it must not double-release escrow
- Email queue must use retry with exponential backoff (3 retries max)

**Acceptance Criteria:**
- Full order lifecycle (book → accept → deliver → confirm → review) works end-to-end
- Auto-confirm fires correctly at 72h in test environment (use mocked timers)
- Escrow is locked on booking and released on confirmation
- Dispute opens correctly and blocks escrow release
- Real-time status update arrives via Socket.io on order status change
- Supertest: all order endpoints covered

---

## Agent 5 — Wallet Agent

**Role:** Build the dual-currency wallet system — cash balances, Skill Credits, escrow, Stripe payouts, and credit purchases.

**Scope:**
```
apps/api/src/
├── routes/wallet.ts
├── controllers/walletController.ts
├── services/walletService.ts     # ALL financial logic lives here
└── services/stripeService.ts     # Stripe Connect integration

apps/api/src/jobs/
└── creditExpiry.ts               # BullMQ job: expire credits after 12mo inactivity

apps/web/pages/dashboard/
└── wallet.tsx

apps/web/components/wallet/
├── WalletBalance.tsx             # Shows both balances
├── TransactionHistory.tsx
├── WithdrawForm.tsx
├── CreditPurchaseForm.tsx
└── StripeOnboarding.tsx          # Connect Express onboarding
```

**Inputs:** `IWallet`, `ITransaction`, `TransactionType` from Types Agent; Stripe Connect credentials from env

**Output Contract:**

`walletService.ts` must export these functions (used by other agents):
```ts
lockEscrow(orderId: string, buyerUserId: string, amount: number, currency: 'cash' | 'credits'): Promise<void>
releaseEscrow(orderId: string, rating: number): Promise<void>  // only releases credits if rating >= 4
refundEscrow(orderId: string): Promise<void>
creditEarned(userId: string, amount: number, orderId: string): Promise<void>
deductPlatformFee(orderId: string): Promise<void>  // 10% of cash transaction
```

Backend routes:
- `GET /wallet/me` — returns `{ cashBalance, creditBalance, escrowCash, escrowCredits }`
- `GET /wallet/me/transactions` — paginated, filterable by type and currency
- `POST /wallet/withdraw` — validates min $20, calls Stripe Transfers API, creates payout record
- `POST /wallet/credits/purchase` — creates Stripe Payment Intent ($10/credit), webhook confirms purchase

Stripe:
- Stripe Connect Express onboarding flow for sellers (KYC handled by Stripe)
- Webhook handler at `POST /webhooks/stripe` for `payment_intent.succeeded`, `transfer.created`, `account.updated`

BullMQ:
- `creditExpiryJob`: daily cron, checks `lastActivityAt`, expires credits for 12-month inactive users

Frontend:
- Wallet page shows both balances prominently
- Transaction history with type icons and filters
- Withdraw form with fee calculator (standard vs instant)
- Credit purchase modal with Stripe Elements

**Constraints:**
- ALL financial operations must use PostgreSQL transactions — no partial updates
- Credits can NEVER be converted to cash — enforce at DB and service layer
- Platform fee (10%) deducted at sale completion, not at withdrawal
- Minimum withdrawal: $20 (2000 cents)
- Standard payout fee: $0.25 flat; Instant: 1.5%
- Credits release only when `rating >= 4` — if disputed or low-rated, escrow is held for admin review
- `lastActivityAt` must update on ANY platform activity (login, listing creation, order action)

**Acceptance Criteria:**
- `lockEscrow` and `releaseEscrow` are atomic (PostgreSQL transactions)
- Credits are blocked from conversion to cash at all layers
- Stripe Connect onboarding completes and account is stored
- Withdraw creates a real Stripe Transfer in test mode
- Credit purchase via Stripe completes via webhook flow
- Credit expiry job runs and correctly marks expired credits
- Supertest: all wallet endpoints covered

---

## Agent 6 — AI Swap Suggester Agent

**Role:** Build the OpenAI embedding-based swap matching system and the Looking-For board.

**Scope:**
```
apps/api/src/
├── routes/swap.ts
├── controllers/swapController.ts
└── services/aiService.ts         # OpenAI embeddings + similarity scoring

apps/web/pages/
└── looking-for.tsx

apps/web/components/swap/
├── SwapSuggester.tsx             # Shows top 3 match cards
├── MatchCard.tsx
└── LookingForBoard.tsx
```

**Inputs:** `IUser`, `IListing` from Types Agent; OpenAI API key; existing user and listing data

**Output Contract:**

`aiService.ts`:
```ts
generateUserEmbedding(userId: string): Promise<number[]>
// Embeds: user bio + skill tags + listing titles/descriptions

findSwapMatches(userId: string, lookingForText: string): Promise<MatchResult[]>
// Returns top 3 users who:
//   1. Need what the requesting user offers (skill tag overlap)
//   2. Offer what the requesting user needs (lookingForText similarity)
//   3. Have sufficient credit balance for a swap
//   4. Are available (availabilityToggle = true)
// Match score = weighted cosine similarity

interface MatchResult {
  userId: string
  matchScore: number             // 0–100
  explanation: string            // Human-readable: "They need React dev, you offer React dev. They offer SEO, which you're looking for."
  listingId: string              // Their most relevant listing
}
```

Backend:
- `POST /swap/suggest` — body: `{ lookingForText: string }`, returns top 3 `MatchResult[]`
- `POST /looking-for` — creates public need post
- `GET /looking-for` — paginated board of open needs

Fallback (before 500 users):
- Rule-based matching using skill tag overlap only (no embeddings)
- Switch to embeddings once user count exceeds 500 (feature flag in PostHog)

Frontend:
- Swap Suggester triggered from dashboard — user types what they need
- Shows 3 match cards with score, explanation, and one-click "Propose Swap" button
- "Propose Swap" initiates a mutual booking request

**Constraints:**
- Cache embeddings in Redis (TTL: 24 hours) — do not call OpenAI on every request
- Embeddings must regenerate when user updates their profile or listings
- Never surface users with `availabilityToggle: false`
- Never surface users the requesting user has already swapped with in last 30 days
- Match explanation must be generated by GPT-4o, not hardcoded templates
- Feedback loop: store `accepted | rejected | ignored` per suggestion for future model improvement

**Acceptance Criteria:**
- `POST /swap/suggest` returns 3 results with valid scores and explanations
- Fallback rule-based matching works when OpenAI is unavailable
- Embeddings are cached and not regenerated on every call
- Looking-For board displays and accepts new posts
- One-click swap proposal creates a real mutual booking request

---

## Agent 7 — Reputation Agent

**Role:** Build the reputation scoring algorithm, badge system, community vouching, and Skill Challenges.

**Scope:**
```
apps/api/src/
├── routes/reputation.ts
├── controllers/reputationController.ts
├── models/mongo/Vouch.ts
└── services/reputationService.ts

apps/web/components/profile/
├── ReputationScore.tsx           # 0–100 score display
├── SwapBadge.tsx                 # Bronze/Silver/Gold/Platinum
├── VouchButton.tsx
├── SkillChallengeCard.tsx
└── VerifiedSkillTag.tsx
```

**Inputs:** `IReview`, `IOrder` (completed count) from Types Agent; Order Agent review data

**Output Contract:**

`reputationService.ts`:
```ts
calculateReputationScore(userId: string): Promise<number>
// Formula:
//   - Completion rate: 30% weight (completed orders / accepted orders)
//   - Average rating: 40% weight (avg of all received reviews, normalized to 0–100)
//   - Swap count: 20% weight (log scale, capped at 100 swaps = 20 points)
//   - Vouches received: 10% weight (capped at 10 vouches = 10 points)

awardBadge(userId: string): Promise<SwapBadge | null>
// Bronze: 5 completed swaps
// Silver: 20 completed swaps
// Gold: 50 completed swaps
// Platinum: 100+ completed swaps

submitVouch(voucherId: string, recipientId: string, skillTag: string, message: string): Promise<void>
// Requires: voucherId must have 10+ completed swaps
// Requires: max 3 vouches per skill per recipient

createSkillChallenge(listingId: string): Promise<Challenge>
// Creates a 15-minute peer-graded task for skill verification
```

Backend routes:
- `POST /vouches` — submit a vouch (caller must have 10+ swaps)
- `GET /users/:id/vouches` — get vouches for a user
- `POST /challenges` — create skill challenge for a listing
- `POST /challenges/:id/grade` — submit peer grade (must be a user with 10+ swaps in that skill)

**Constraints:**
- Reputation score must recalculate after every review, order completion, and vouch
- Recalculation must be async (BullMQ job) — never block the order confirmation response
- Vouching requires the voucher to have 10+ completed swaps — enforce at service layer
- Skill challenge grading requires 3 peer grades minimum before a result is computed
- Verified Skill tag is stored on the `Listing` document, not the user

**Acceptance Criteria:**
- Reputation score updates after each review (eventually consistent via queue)
- Badge awards correctly at 5, 20, 50, 100 swaps
- Vouch fails if voucher has < 10 swaps
- Skill challenge correctly awaits 3 peer grades before displaying result
- Score formula weights verified in unit tests with known inputs

---

## Agent 8 — Discovery & Search Agent

**Role:** Build the full-text search system, Explore page, activity feed, and follow system.

**Scope:**
```
apps/api/src/
├── routes/search.ts
├── routes/explore.ts
├── routes/feed.ts
├── controllers/searchController.ts
└── services/searchService.ts

apps/web/pages/
└── explore.tsx

apps/web/components/discovery/
├── SearchBar.tsx
├── ExploreGrid.tsx               # Curated collections
├── TrendingListings.tsx
├── ActivityFeed.tsx
└── SkillGraph.tsx                # Visual: most paired skills
```

**Inputs:** `IListing`, `IUser` from Types Agent; MongoDB Atlas Search (or text index)

**Output Contract:**

Backend:
- `GET /search?q=&category=&minPrice=&maxPrice=&rating=&availability=` — unified search across listings, profiles, skill tags
- `GET /explore` — curated collections: Top Rated, Quick Turnaround, New This Week
- `GET /listings/trending` — 7-day request volume sort
- `GET /feed/me` — activity feed for followed users (new listings, completed swaps, vouches)
- `POST /users/:id/follow` / `DELETE /users/:id/follow` — follow/unfollow
- `GET /skills/graph` — aggregation: top 20 skill pairs from completed swaps

Frontend:
- Search bar with real-time suggestions (debounced, 300ms)
- Explore page with horizontal scroll collections
- Activity feed with infinite scroll
- Skill graph visualization (optional: D3 force graph)

**Constraints:**
- Search must use MongoDB Atlas Search OR a text index with `$text` operator — no in-memory filtering
- Activity feed must be paginated (cursor-based, not offset) — follow counts can be large
- Follow actions must update `activity_feed` collection for all followers
- Trending calculation must be cached in Redis (TTL: 1 hour) — do not aggregate on every request
- Search response time < 300ms for indexed queries

**Acceptance Criteria:**
- Search returns results in < 300ms on test dataset
- Trending cache correctly invalidates after 1 hour
- Activity feed shows correct events from followed users
- Follow/unfollow updates feed correctly
- Skill graph aggregation returns top pairs from completed swaps

---

## Agent 9 — Admin Agent

**Role:** Build the admin dashboard — dispute resolution, user management, content moderation, and platform analytics.

**Scope:**
```
apps/api/src/
├── routes/admin.ts
├── controllers/adminController.ts
└── middleware/adminAuth.ts       # Role check: user.role === 'admin'

apps/web/pages/admin/
├── index.tsx                     # Overview dashboard
├── disputes.tsx
├── users.tsx
└── analytics.tsx

apps/web/components/admin/
├── DisputeQueue.tsx
├── UserManagement.tsx
├── PlatformMetrics.tsx
└── FraudAlerts.tsx
```

**Inputs:** All agent outputs (reads from all collections and tables)

**Output Contract:**

Backend:
- `GET /admin/disputes` — queue of `status: 'disputed'` orders, sorted by age
- `PATCH /admin/disputes/:id/resolve` — body: `{ winner: 'buyer' | 'seller', reason: string }` — releases or refunds escrow
- `GET /admin/users` — paginated user list with search, filter by status
- `PATCH /admin/users/:id/ban` — sets user to `banned`, cancels active orders
- `GET /admin/analytics` — aggregated: GMV (daily/weekly/monthly), credit circulation volume, swap velocity, retention cohorts
- `GET /admin/fraud-alerts` — users with abnormal credit accumulation (earned > 50 credits in 7 days with < 4-star average)

Frontend:
- Admin-only route protection (redirect non-admins to 404)
- Dispute queue with order details, buyer/seller info, timeline
- Resolve dispute modal with winner selection and reason field
- Platform metrics chart (GMV over time, user growth)

**Constraints:**
- Admin routes require `user.role === 'admin'` — checked in middleware, NOT just frontend
- Dispute resolution must be atomic: winner gets funds, loser gets refund, order status updated in one operation
- Banning a user must cancel all their `pending` and `active` orders and refund buyers
- Analytics queries must run against a read replica or be cached — never run heavy aggregations on the primary write DB
- Fraud alerts are informational only — no auto-ban

**Acceptance Criteria:**
- Non-admin users cannot access any `/admin/*` routes (401/403 returned)
- Dispute resolution releases correct escrow to the winner
- Ban cancels all active orders and refunds buyers
- Analytics page loads in < 2s (cached or indexed)

---

## Agent 10 — Realtime & Notifications Agent

**Role:** Build Socket.io real-time updates and the Resend transactional email system.

**Scope:**
```
apps/api/src/
├── sockets/
│   ├── index.ts                  # Socket.io server setup
│   ├── orderEvents.ts            # Order status change emitters
│   └── notificationEvents.ts    # Booking request, review received
└── services/emailService.ts     # Resend integration + templates

apps/web/
├── lib/socket.ts                 # Socket.io client singleton
└── components/shared/
    ├── NotificationToast.tsx
    └── NotificationBell.tsx      # Unread count badge
```

**Inputs:** Order Agent events; Auth Agent user sessions; Resend API key

**Output Contract:**

Socket.io events emitted by server:
```ts
// Order events (emitted to order room: `order:${orderId}`)
'order:accepted'      // seller accepted booking
'order:delivered'     // seller submitted delivery
'order:confirmed'     // buyer confirmed + escrow released
'order:disputed'      // dispute opened
'order:auto_confirmed' // auto-confirmed after 72h

// Notification events (emitted to user room: `user:${userId}`)
'notification:booking_request'   // you received a booking request
'notification:review_received'   // someone reviewed your service
'notification:credit_earned'     // credits added to wallet
'notification:match_found'       // AI Swap Suggester found a match
```

Email templates (via Resend):
- `booking_request.html` — sent to seller when booking created
- `booking_accepted.html` — sent to buyer when seller accepts
- `delivery_made.html` — sent to buyer when delivery submitted
- `delivery_confirmed.html` — sent to seller when buyer confirms
- `dispute_opened.html` — sent to both parties
- `weekly_digest.html` — weekly summary of activity (BullMQ cron, every Monday)

**Constraints:**
- Socket.io rooms must use authenticated user ID — never allow client to self-assign a room
- Emails must use BullMQ queue (emailQueue job) — never send synchronously in a request handler
- Weekly digest must be opt-out (user preference) — check `emailPreferences.weeklyDigest` before sending
- Socket connections must authenticate via JWT middleware on connection handshake
- Notification count stored in Redis (TTL: 30 days) — not in MongoDB

**Acceptance Criteria:**
- Order status change fires correct Socket.io event and appears as toast on client
- Transactional email arrives in test inbox (Resend test mode)
- Weekly digest cron fires correctly and skips users who opted out
- Socket.io handshake rejects unauthenticated connections
- Notification count badge increments on new notification

---

## Agent 11 — Performance & DevOps Agent

**Role:** Final hardening — performance audit, error monitoring, analytics setup, and production deployment.

**Scope:**
```
.github/workflows/ci.yml          # Final CI/CD configuration
apps/api/src/middleware/
├── rateLimit.ts                  # Redis-based rate limiting
└── requestLogger.ts              # Morgan + Sentry integration
sentry.client.config.ts
sentry.server.config.ts
posthog.ts
```

**Inputs:** All other agents' completed output

**Output Contract:**

- Sentry initialized in both `apps/web` and `apps/api` — captures all unhandled errors
- PostHog initialized in `apps/web` — tracks: `user_signed_up`, `listing_created`, `order_completed`, `credits_purchased`, `swap_suggested`
- Rate limiting applied to: auth routes (5/15min), swap suggest (10/hour), search (60/min)
- All API responses include proper cache headers (listings: 60s, trending: 3600s, user profiles: 300s)
- GitHub Actions CI pipeline: lint → type-check → unit tests → integration tests → deploy to Vercel + Railway on push to `main`
- `README.md` with: local setup instructions, environment variable guide, architecture diagram link

**Constraints:**
- Sentry DSN must come from env vars — never hardcoded
- PostHog must respect user privacy (no PII in event properties)
- Rate limiting must use Redis — not in-memory (would break across multiple Railway replicas)
- CI must fail on any TypeScript error or ESLint warning (non-zero exit)
- Deploy must only run if all tests pass

**Acceptance Criteria:**
- Sentry receives test error from both frontend and backend
- PostHog receives test events from frontend
- Rate limiting blocks excess requests with 429 status
- CI pipeline fails on a deliberately introduced TypeScript error
- Production deploy succeeds from a clean `main` push

---

## Inter-Agent Dependencies

```
Agent 0 (Scaffold)
  └── Agent 1 (Types) — must complete before all others
        ├── Agent 2 (Auth)
        │     └── Agent 3 (Listing)
        │           └── Agent 4 (Order)
        │                 ├── Agent 5 (Wallet) ← Order calls lockEscrow/releaseEscrow
        │                 ├── Agent 7 (Reputation) ← triggers after order completion
        │                 └── Agent 10 (Realtime) ← fires Socket.io events
        ├── Agent 6 (AI Swap) ← depends on Users + Listings
        ├── Agent 8 (Discovery) ← depends on Listings + Users
        ├── Agent 9 (Admin) ← reads from all agents
        └── Agent 11 (DevOps) ← wraps everything, runs last
```

**Parallel execution is safe for:**
- Agent 5 (Wallet) + Agent 6 (AI Swap) — no shared writes
- Agent 7 (Reputation) + Agent 8 (Discovery) — no shared writes
- Agent 9 (Admin) can start after Agent 4 (Order) completes

---

## Global Coding Constraints (All Agents)

1. **TypeScript strict mode** — `noImplicitAny`, `strictNullChecks` on everywhere
2. **No `any` types** — use `unknown` + type guards if type is truly unknown
3. **Zod validation on every API input** — no raw `req.body` access in controllers
4. **All monetary amounts in cents (integers)** — never use floats for money
5. **No synchronous file I/O** — always `async/await`
6. **No console.log in production code** — use a logger (Winston or Pino)
7. **Error handling** — all async Express routes wrapped in try/catch or `asyncHandler`
8. **SQL injection prevention** — use parameterized queries; never string-interpolate SQL
9. **No secrets in code** — all from `process.env`, validated on startup
10. **Soft deletes** — never hard-delete user data; use `deletedAt` or `isActive: false`
11. **API versioning** — all routes prefixed with `/api/v1/`
12. **CORS** — restrict to known frontend origins in production
13. **Helmet.js** — on all Express apps for security headers