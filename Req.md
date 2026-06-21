# SkillSwap Market — Software Requirements Specification (SRS)

> **Document version:** 1.0
> **Last updated:** June 2026
> **Status:** Draft for MVP development
> **Stack:** MERN + TypeScript + PostgreSQL + Redis

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [User Roles & Personas](#3-user-roles--personas)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Requirements](#6-data-requirements)
7. [External Interface Requirements](#7-external-interface-requirements)
8. [System Constraints & Assumptions](#8-system-constraints--assumptions)
9. [Acceptance Criteria Summary](#9-acceptance-criteria-summary)
10. [Appendix](#10-appendix)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements for **SkillSwap Market**, a dual-currency eCommerce platform enabling professionals to exchange services for either USD cash or platform-native Skill Credits. It is intended to guide solo development, serve as a reference for scope decisions, and define what "done" means for each feature.

### 1.2 Scope

The system covers user authentication, skill listing management, a booking and delivery lifecycle, a dual-currency wallet with escrow, an AI-based bilateral matching engine, a reputation and trust layer, and administrative oversight tools.

Out of scope for this document: native mobile apps, multi-currency support beyond USD, and B2B/enterprise features — these are deferred to the Phase 4 roadmap and will receive a separate SRS addendum.

### 1.3 Intended Audience

Solo developer (primary), future contributors, and any technical reviewer assessing feasibility or auditing security/financial logic.

### 1.4 Definitions & Acronyms

| Term | Definition |
|---|---|
| Skill Credit | Platform-native, non-withdrawable unit of value earned by delivering a service |
| Escrow | Funds or credits held by the platform until delivery is confirmed |
| GMV | Gross Merchandise Value — total value of transactions processed |
| Swap | A completed transaction between a buyer and seller, in cash or credits |
| Vouch | A peer endorsement of a specific skill tag, given by an existing trusted user |
| MVP | Minimum Viable Product — the smallest version that proves the core loop |

---

## 2. Overall Description

### 2.1 Product Perspective

SkillSwap Market is a standalone web application, not an extension of an existing product. It functions as a two-sided marketplace where every user can act as both buyer and seller, distinguishing it from traditional client-to-freelancer platforms.

### 2.2 Product Functions (Summary)

- Account creation, authentication, and profile management
- Skill listing creation with dual pricing (cash + credits)
- Search, browse, and filter listings
- Booking request → acceptance → delivery → confirmation lifecycle
- Dual-currency wallet with escrow, withdrawal, and credit purchase
- AI-driven bilateral swap matching
- Reputation scoring, reviews, badges, and community vouching
- Admin dashboard for dispute resolution and platform oversight

### 2.3 Operating Environment

- **Client:** Modern web browsers (Chrome, Safari, Firefox, Edge — last 2 major versions), responsive from 375px to 2560px viewport width
- **Server:** Node.js 18+ runtime, deployed on Railway
- **Databases:** MongoDB Atlas (document data), Supabase PostgreSQL (financial data), Upstash Redis (cache/queue)

### 2.4 Design & Implementation Constraints

- Must be buildable and maintainable by a single developer
- Must use only services with viable free tiers for MVP (see Section 8)
- All financial logic must be implemented as atomic database transactions — no partial state is acceptable
- Skill Credits must never be convertible to cash, by design, to avoid money-transmission regulatory exposure

---

## 3. User Roles & Personas

| Role | Description | Key Permissions |
|---|---|---|
| **Guest** | Unauthenticated visitor | Browse public listings, view public profiles, cannot transact |
| **Member** | Registered, authenticated user | Create listings, book services, manage wallet, leave reviews, vouch for others |
| **Verified Member** | Member with 3+ completed swaps | Gains "verified" badge, unlocks community vouching eligibility |
| **Admin** | Platform operator (the developer, initially) | Resolve disputes, suspend accounts, view platform analytics, moderate content |

---

## 4. Functional Requirements

Each requirement is labeled with a unique ID (`FR-XX`) and a priority: **P0** (MVP-blocking), **P1** (MVP-important, can ship week 2 of launch), **P2** (post-MVP).

### 4.1 Authentication & Account Management

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The system shall allow a user to register using an email address and password. | P0 |
| FR-02 | The system shall hash all passwords using bcrypt before storage; plaintext passwords shall never be persisted or logged. | P0 |
| FR-03 | The system shall allow login via email/password, returning a short-lived access token (15 min) and a long-lived refresh token (7 days, httpOnly cookie). | P0 |
| FR-04 | The system shall support OAuth login via Google and GitHub. | P1 |
| FR-05 | The system shall rate-limit login attempts to 5 per IP address per 15-minute window. | P0 |
| FR-06 | The system shall allow a user to log out, invalidating their refresh token. | P0 |
| FR-07 | The system shall allow password reset via a time-limited emailed link (valid 1 hour). | P1 |

### 4.2 User Profiles

| ID | Requirement | Priority |
|---|---|---|
| FR-10 | The system shall allow a user to set a display name, username (unique), bio, avatar, timezone, and up to 10 skill tags. | P0 |
| FR-11 | The system shall expose a public profile page at a shareable URL (`/u/:username`) showing listings, reviews, reputation score, and badges. | P0 |
| FR-12 | The system shall calculate and display a profile completeness percentage, prompting users to fill missing fields. | P1 |
| FR-13 | The system shall allow users to upload a profile avatar (max 5MB, JPG/PNG/WEBP) via Cloudinary. | P0 |
| FR-14 | The system shall display a "Verified" badge once a user has completed 3+ swaps with no disputes. | P1 |

### 4.3 Skill Listings

| ID | Requirement | Priority |
|---|---|---|
| FR-20 | The system shall allow a user to create a listing with title, description, category, delivery format, turnaround time, and portfolio samples (max 5 files). | P0 |
| FR-21 | The system shall require every listing to specify both a cash price (USD) and a Skill Credit price. | P0 |
| FR-22 | The system shall allow a listing to be set to one of three visibility modes: public, credits-only, or cash-only. | P1 |
| FR-23 | The system shall allow a listing owner to edit or soft-delete (deactivate) their own listings. | P0 |
| FR-24 | The system shall support full-text search across listing titles and descriptions. | P0 |
| FR-25 | The system shall support filtering listings by category, price range, delivery format, and minimum rating. | P0 |
| FR-26 | The system shall display a "Trending" feed of listings ranked by booking volume in the last 7 days, refreshed via cache every 5 minutes. | P1 |
| FR-27 | The system shall track and display view count and booking count per listing. | P2 |

### 4.4 Booking & Order Lifecycle

| ID | Requirement | Priority |
|---|---|---|
| FR-30 | The system shall allow a buyer to send a booking request specifying payment type (cash or credits) and an optional message. | P0 |
| FR-31 | The system shall lock the buyer's funds or credits into escrow at the moment a booking request is created. | P0 |
| FR-32 | The system shall allow a seller to accept, decline, or propose a counter-timeline for a booking request. | P0 |
| FR-33 | The system shall release escrowed funds back to the buyer immediately if a booking is declined. | P0 |
| FR-34 | The system shall allow a seller to submit a deliverable as an uploaded file, an external link, or a text message. | P0 |
| FR-35 | The system shall allow a buyer to confirm delivery, triggering release of escrowed funds/credits to the seller. | P0 |
| FR-36 | The system shall automatically confirm delivery and release escrow after 72 hours of buyer inactivity following delivery submission. | P0 |
| FR-37 | The system shall automatically refund escrow to the buyer if a seller does not accept a booking within 48 hours. | P1 |
| FR-38 | The system shall support a defined number of revision requests per listing (set by the seller at listing creation). | P1 |
| FR-39 | The system shall allow either party to flag an order as disputed, freezing escrow release pending admin review. | P1 |

### 4.5 Wallet & Payments

| ID | Requirement | Priority |
|---|---|---|
| FR-40 | The system shall maintain two independent balances per user: cash balance (withdrawable) and Skill Credit balance (non-withdrawable). | P0 |
| FR-41 | The system shall deduct a 10% platform fee from cash transactions at the moment of order completion, not at withdrawal. | P0 |
| FR-42 | The system shall integrate Stripe Connect Express for seller onboarding and payout processing. | P0 |
| FR-43 | The system shall support standard bank withdrawal (2–3 business days, $0.25 flat fee) and instant withdrawal (minutes, 1.5% fee). | P0 |
| FR-44 | The system shall enforce a minimum withdrawal amount of $20. | P0 |
| FR-45 | The system shall grant 3 free Skill Credits to every new user upon registration. | P0 |
| FR-46 | The system shall allow users to purchase additional Skill Credits at a fixed rate of $10 per credit via Stripe. | P1 |
| FR-47 | The system shall expire unused Skill Credits after 12 months of account inactivity; any platform activity resets the expiry timer. | P2 |
| FR-48 | The system shall maintain an immutable, append-only transaction log for every wallet event (earn, spend, escrow lock/release, purchase, payout). | P0 |

### 4.6 AI Swap Matching

| ID | Requirement | Priority |
|---|---|---|
| FR-50 | The system shall allow a user to post a public "Looking For" request describing a needed skill. | P1 |
| FR-51 | The system shall generate vector embeddings for every listing and "Looking For" post using an LLM embedding model. | P2 |
| FR-52 | The system shall surface the top 3 potential bilateral swap matches for a given user, ranked by embedding similarity, reputation, and availability. | P2 |
| FR-53 | The system shall allow a user to accept a suggested match with a single action, auto-initiating a mutual booking flow for both parties. | P2 |

### 4.7 Reputation & Trust

| ID | Requirement | Priority |
|---|---|---|
| FR-60 | The system shall require a star rating (1–5) and allow an optional written review after every completed order. | P0 |
| FR-61 | The system shall calculate a composite Reputation Score (0–100) from rating average, completion rate, and swap volume. | P1 |
| FR-62 | The system shall award swap badges (Bronze ≥5, Silver ≥20, Gold ≥50, Platinum ≥100 completed swaps). | P1 |
| FR-63 | The system shall allow any user with 10+ completed swaps to vouch for another user's specific skill tag. | P2 |
| FR-64 | The system shall require 3 vouches (or a passed skill challenge) before a listing displays a "Community Verified" tag. | P2 |

### 4.8 Notifications

| ID | Requirement | Priority |
|---|---|---|
| FR-70 | The system shall send a transactional email for: new booking request, booking accepted/declined, delivery submitted, order completed, and dispute opened. | P0 |
| FR-71 | The system shall deliver real-time in-app notifications for order status changes via WebSocket. | P1 |
| FR-72 | The system shall send a weekly digest email summarizing trending listings in a user's skill categories. | P2 |

### 4.9 Administration

| ID | Requirement | Priority |
|---|---|---|
| FR-80 | The system shall provide an admin interface to view, suspend, or reinstate user accounts. | P1 |
| FR-81 | The system shall provide an admin queue for reviewing and resolving disputed orders. | P1 |
| FR-82 | The system shall provide a platform analytics view showing GMV, credit circulation volume, and active user counts. | P2 |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement |
|---|---|
| NFR-01 | Listing browse pages shall achieve a Lighthouse performance score of 90+ on desktop and 80+ on mobile. |
| NFR-02 | API response time for read endpoints (listing browse, profile fetch) shall be under 300ms at the 95th percentile under normal load. |
| NFR-03 | Trending listing queries shall be served from Redis cache with a TTL of 5 minutes to avoid repeated database load. |

### 5.2 Security

| ID | Requirement |
|---|---|
| NFR-10 | All API traffic shall be served exclusively over HTTPS. |
| NFR-11 | All financial state changes (escrow lock, release, refund, payout) shall execute within a single atomic database transaction — partial states are not permitted. |
| NFR-12 | All user-submitted input shall be validated server-side using schema validation (Zod), regardless of client-side validation. |
| NFR-13 | Authentication tokens shall never be stored in localStorage; refresh tokens shall be httpOnly, secure cookies. |
| NFR-14 | The system shall implement rate limiting on all authentication and wallet-mutating endpoints. |

### 5.3 Reliability & Availability

| ID | Requirement |
|---|---|
| NFR-20 | The platform shall target 99.5% uptime post-launch (excludes scheduled maintenance). |
| NFR-21 | Background jobs (auto-confirm, auto-refund, credit expiry) shall be retried up to 3 times on failure before alerting via error monitoring. |
| NFR-22 | All errors in production shall be captured and surfaced via Sentry within 60 seconds of occurrence. |

### 5.4 Usability

| ID | Requirement |
|---|---|
| NFR-30 | The interface shall be fully responsive from 375px (mobile) to 2560px (large desktop) viewport widths. |
| NFR-31 | Every form shall display inline validation errors before submission is attempted. |
| NFR-32 | Every async action (booking, delivery, withdrawal) shall display a loading state and a success/error confirmation. |

### 5.5 Maintainability

| ID | Requirement |
|---|---|
| NFR-40 | All shared data types shall be defined once in a shared `packages/types` module and imported by both frontend and backend — no duplicate type definitions. |
| NFR-41 | The codebase shall maintain zero TypeScript errors (`tsc --noEmit` passes) and zero ESLint warnings on every merge to main. |
| NFR-42 | Every service-layer function containing financial or scoring logic shall have an accompanying unit test. |

### 5.6 Scalability

| ID | Requirement |
|---|---|
| NFR-50 | The system architecture shall support horizontal scaling of the API layer without code changes (stateless JWT auth, no in-memory session state). |
| NFR-51 | The database design shall support a transition from free-tier MongoDB Atlas/Supabase instances to paid tiers without schema migration. |

---

## 6. Data Requirements

### 6.1 Data Storage Split

| Data Category | Storage | Rationale |
|---|---|---|
| Users, listings, orders, reviews, vouches | MongoDB | Flexible schema, fast iteration during early development |
| Wallets, transactions, escrow, payouts | PostgreSQL | ACID compliance required for financial correctness |
| Sessions, rate-limit counters, job queue | Redis | High-speed ephemeral data, no durability requirement |

### 6.2 Data Retention

| Data Type | Retention Policy |
|---|---|
| Transaction logs | Retained indefinitely (immutable audit trail) |
| User accounts | Retained until explicit deletion request; anonymized on deletion |
| Disputed order records | Retained 2 years minimum for dispute history reference |
| Skill Credits | Expire after 12 months of inactivity (see FR-47) |

### 6.3 Data Integrity Rules

- A wallet's `cash_balance_cents` and `credit_balance` shall never go negative under any code path.
- Every `escrow_locks` row must resolve to either `released` or `refunded` — no order may remain in `locked` status indefinitely (enforced via the 72-hour auto-confirm job).
- Every financial mutation must produce a corresponding row in the `transactions` table (audit trail is mandatory, not optional).

---

## 7. External Interface Requirements

### 7.1 Third-Party Services

| Service | Purpose | Integration Point |
|---|---|---|
| Stripe Connect | Payment processing, seller payouts | Wallet & order completion |
| OpenAI API | Generating embeddings for AI Swap Suggester | Listing creation, "Looking For" posts |
| Cloudinary | File and image storage/CDN | Avatar uploads, listing samples, deliverables |
| Resend | Transactional email delivery | Booking, delivery, dispute notifications |
| Sentry | Error monitoring | All backend and frontend runtime errors |
| PostHog | Product analytics | Page views, funnel tracking, feature flags |

### 7.2 API Style

- RESTful JSON API under `/api/v1`
- All responses follow a standardized envelope: `{ success, data, meta }` or `{ success: false, error }`
- Authentication via `Authorization: Bearer <token>` header

### 7.3 Real-Time Interface

- WebSocket connection via Socket.io for order status updates and in-app notifications
- Connection authenticated using the same JWT access token

---

## 8. System Constraints & Assumptions

### 8.1 Constraints

- Must be deliverable by a single developer within a 12-week MVP timeline
- Must operate within free-tier limits of all third-party services during MVP phase (see cost table below)
- Skill Credits must remain legally non-equivalent to currency (non-withdrawable, non-transferable to cash) to avoid money-transmitter licensing requirements

### 8.2 Assumptions

- Initial user base will be sourced from indie developer and freelancer communities (Indie Hackers, Twitter/X, Product Hunt)
- Initial transaction volume will remain within free-tier API rate limits for the first 3–6 months
- USD is the only required currency for MVP; international users will convert manually until multi-currency support ships

### 8.3 Free-Tier Cost Ceiling (MVP)

| Service | Free Tier Limit |
|---|---|
| MongoDB Atlas (M0) | 512MB storage |
| Supabase | 500MB database |
| Upstash Redis | 10,000 commands/day |
| Cloudinary | 25GB storage/bandwidth |
| Resend | 3,000 emails/month |
| Sentry | 5,000 errors/month |
| PostHog | 1,000,000 events/month |

---

## 9. Acceptance Criteria Summary

The MVP is considered ready for beta launch when all of the following hold true:

- [ ] A new user can register, verify their email, and complete their profile
- [ ] A user can create a listing with both cash and credit pricing
- [ ] A second user can discover that listing via browse or search
- [ ] A booking request can be created, accepted, delivered, and confirmed end-to-end
- [ ] Escrow correctly locks and releases funds with zero discrepancy across 50 test transactions
- [ ] A completed cash order results in the correct 10% fee deduction and Stripe payout
- [ ] A completed credit order results in correct credit balance changes for both parties
- [ ] All P0 functional requirements in Section 4 are implemented and tested
- [ ] No critical or high-severity bugs remain open in the issue tracker
- [ ] Lighthouse performance score exceeds 90 on the listing browse page

---

## 10. Appendix

### 10.1 Related Documents

- `plan.md` — Full development roadmap, sprint breakdown, and folder structure
- `agents.md` — Agent protocols for AI-assisted development (if applicable)
- Design system reference — Podia Clean Commerce visual language spec

### 10.2 Revision History

| Version | Date | Change |
|---|---|---|
| 1.0 | June 2026 | Initial SRS draft covering MVP scope (Phases 1–2) |

### 10.3 Open Questions for Future Revision

- Should disputed-order resolution timelines be configurable per category, or fixed platform-wide?
- Should the AI Swap Suggester eventually support 3-way or N-way swap chains, not just bilateral matches?
- At what user volume does the 12-month credit expiry policy need re-evaluation to avoid penalizing low-frequency professional users?

---
