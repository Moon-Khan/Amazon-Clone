# Progress

Status legend: `todo` / `doing` / `done`. Times in UTC. Update this file as part of every `/phase-done` run.

| Phase | Status | Start | End | Notes / known gaps |
|---|---|---|---|---|
| 0. Foundation | done | 2026-10-04T04:03:08Z | 2026-10-04T05:02:53Z | Next.js 16+TS+Tailwind+shadcn scaffolded; Prisma 6.19.3 (pinned stable, not the 7.x RC that defaults in and changes config to `prisma.config.ts`+driver adapters) wired with placeholder `url`/`directUrl` schema; `npm run verify` green; deployed live on Vercel with Neon `DATABASE_URL`/`DIRECT_URL` set. Caught and fixed a real secret accidentally placed in the tracked `.env.example` before it was committed — moved to gitignored `.env.local`. No real data model yet (Phase 1). |
| 1. Data layer | done | 2026-10-04T05:16:39Z | 2026-10-04T06:03:19Z | Real Prisma schema migrated to Neon (User, Address, Category, Product, ProductVariant, Review, Cart, CartItem, Order, OrderItem, Deal). Seeded from DummyJSON only (no Faker, per scope cut): 150 products, 29 categories (9 top-level + 20 leaves), 40 variants on 10 apparel/shoe products, 449 reviews, 148 deals. Unit-tested the price/discount mapping logic (11 tests). `prisma migrate dev`'s schema-engine binary couldn't reach Neon's direct endpoint from this sandbox (Prisma Client's own connection worked fine) - worked around by hand-writing the one incremental migration's SQL and applying it through the working connection, registering it in `_prisma_migrations` so history stays correct on a normal network. No API routes yet - data verified directly via Prisma Client queries (Phase 3 builds the catalog API). |
| 2. Global chrome | done | 2026-10-04T06:03:19Z | 2026-10-04T06:25:04Z | Header, hamburger mega-menu, secondary nav, footer, location-picker modal, and language popover built and wired into `app/layout.tsx`; Amazon-palette design tokens added. Live-tested every interactive piece in a real browser against the reference screenshots (mega menu, account dropdown, location modal, language popover). Fixed a real bug found only by clicking: `DropdownMenuLabel` used outside a `DropdownMenuGroup` crashed Base UI's menu context. Known gap: the browser-resize tool wouldn't shrink the viewport in this sandbox, so mobile responsiveness was verified by code review (standard Tailwind breakpoints) rather than a live narrow-viewport screenshot - worth a manual check later. Still pre-branch-workflow, shipped directly to `main`. |
| 3. Browse & search | done | 2026-10-04T06:25:04Z | 2026-10-04T06:56:33Z | Shared `lib/catalog.ts` query module (filter/sort/pagination, unit-tested - 34 tests) backs `/api/products`, `/api/categories`, the home page (ISR), `/category/[slug]`, and `/search`. FilterSidebar (category, Prime, brand, rating, price-bucket facets) is URL-driven and shareable. Live-tested search, category browse, brand/price filters, sort, and pagination end to end in a browser against real seeded data - all correct. Fixed two real bugs found only by clicking: (1) brand name duplicating into product titles when the title already started with the brand; (2) a Base UI `Select` crash from passing a function as `children` across the server/client boundary (the search bar and sort select needed `"use client"` plus plain-string labels instead). Known simplification: the brand facet list is scoped by category but not by the active `q`/price/rating filters (approximation, not incorrect). First phase built on its own branch (`phase-3-browse-search`), merged to `main` per the new workflow. |
| 4. PDP | todo | | | |
| 5. Auth | todo | | | |
| 6. Cart | todo | | | |
| 7. Checkout & Orders | todo | | | |
| 8. Scalability & polish | todo | | | |

(Phase 9 — stretch — is only started if time remains after Phase 8; tracked here only once begun.)

## Decisions

- **Scope cuts for this build** (deferred from the full architecture in `docs/PLAN.md`, documented as "scalability notes" in the README instead of implemented): Upstash Redis caching, API rate limiting, Vercel Cron, trigram/GIN search index, load testing (autocannon/k6), Faker-based seed padding, search autocomplete.
- **Seeding**: DummyJSON only, ~100–150 products, color/size variants added to 10–15 products (not Faker-generated at volume).
- **Still in scope despite the cuts**: ISR on public pages, DB connection pooling, indexes on all FK columns, pagination on list endpoints, a transactional stock-safe checkout.
- **Working mode**: one phase at a time, only on the user's explicit "Do Phase N." A short plan (max 10 bullets) is given and approved before each phase starts.
- **Git workflow**: starting with Phase 3, each phase is built on its own `phase-N-<name>` branch, merged into `main` only once that phase's `/phase-done` verify passes (see CLAUDE.md § Git workflow). Phases 0–2 were pushed directly to `main` before this convention was adopted and are not retroactively rebranched.
