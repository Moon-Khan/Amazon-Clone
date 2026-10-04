# Amazon Clone

A pragmatic rebuild of amazon.com's core shopping experience — browse, search, product detail, cart, checkout, and orders — built as a Next.js + Prisma + Postgres modular monolith for the 8x Software Engineer assignment. See `docs/PLAN.md` for the original architecture/scope plan and `docs/PROGRESS.md` for what actually got built, phase by phase, including every real bug hit and fixed along the way.

## Stack

- **Next.js 16** (App Router, Turbopack, ISR) + TypeScript + Tailwind
- **Prisma 6** + **Postgres** (Neon), connection-pooled
- **Auth.js v5** (Credentials provider, JWT sessions)
- Deployed continuously to **Vercel**

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll need `DATABASE_URL`/`DIRECT_URL` (Postgres) in `.env.local` — see `.env.example`.

```bash
npm run verify   # typecheck + lint + vitest + build — the single CI-equivalent check
```

## Scalability notes

`docs/PLAN.md` §5–7 laid out a credible path to ~1,000 concurrent users without premature infrastructure. Given the 24-hour budget, some of that was built and some was deliberately cut in favor of product/UX coverage. Honest accounting:

**Implemented:**
- Stateless backend — JWT sessions, no in-memory state, so Vercel can scale function instances freely
- DB connection pooling via Neon's pooled connection string + a cached Prisma client singleton per lambda
- Indexes on every foreign key, plus a composite `(categoryId, basePrice)` index for filtered sort and a `title` index for search (see `prisma/schema.prisma`) — the `CartItem`/`Order`/`OrderItem` FK indexes were a gap found and closed in Phase 8
- ISR (`revalidate = 60`) on the home, category, and product pages — edge-cached HTML instead of a DB round-trip per request
- Server-enforced pagination on every list endpoint (products, search)
- A single DB transaction for checkout with a conditional stock decrement (`WHERE stock >= qty`), verified under a deliberately forced oversell attempt — this is the concurrency bug naive checkouts actually ship with
- Scoped Prisma `select`/`include` (no over-fetching) and `Promise.all` instead of client-side request waterfalls on the PDP and home page
- Next/Image for automatic resizing/CDN caching of product images

**Deferred (not implemented — would be the next additions, not a redesign):**
- **Upstash Redis caching** for hot aggregate reads (category rails, popular searches) — ISR covers the common case today; Redis would matter once per-user personalization makes ISR's shared cache insufficient
- **API rate limiting** (Upstash Ratelimit) on auth/cart/checkout — cheap to add, cut only for time
- **Vercel Cron** for scheduled rating recompute — ratings are denormalized onto `Product` today but updated inline rather than on a schedule
- **Trigram/GIN search index** — search currently uses a plain indexed `title` column; fine at the seeded ~150-product scale, would degrade on relevance quality (not correctness) at real catalog size
- **Load testing (autocannon/k6)** — no measured p95 number exists; the claims above are architectural, not benchmarked
- **Faker-based seed volume padding** — seed data is DummyJSON-only (~150 products), not padded to a larger synthetic catalog

None of this needs Kubernetes, microservices, or multi-region complexity to become credible at the next scale step — it's caching, rate limiting, and a real load test, in that order.

## Known gaps

- Mobile/responsive layout was verified by code review (Tailwind breakpoints: `w-full` base + `sm:`/`lg:` fixed widths throughout chrome, filters, PDP, checkout) rather than a live narrow-viewport screenshot — the browser automation available in this sandbox couldn't actually shrink the viewport (same limitation hit in Phase 2).
