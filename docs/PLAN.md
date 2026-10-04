# 8x Assignment — Amazon Clone: Product Analysis & Architecture Plan

## Context

This is the 24-hour "Clone Amazon.com" assignment for the 8x Software Engineer application. Agent-log capture (`.agent-logs/`) is already wired and verified (see `CAPTURE-TEST.md`). The user captured 17 screenshots of the real amazon.com in `screen shots/` (home, search, category/store page, filtered results, PDP, add-to-cart upsell, empty/filled cart, account menu, orders, hamburger mega-menu x2, footer x2, location picker, language picker) while signed in as "Mamoon" in Nashville, 37217. Those screenshots are the primary visual/UX source of truth for this rebuild — no code exists yet in the repo.

The goal of this document is analysis and planning only — no code changes. It will be used to execute the actual 24-hour build afterward, phase by phase, each phase independently demoable.

---

## 1. Core user journeys observed

1. **Land → browse home** — hero deal carousel, category promo tiles, sponsored/you-might-like rails, countdown banner ("3 days until Prime Big Deal Days").
2. **Search** — department-scoped search ("All" dropdown → full department list), free-text query, results grid.
3. **Browse a category/store** — e.g. "Sneaker Shop" landing page with its own hero, sub-nav (Women/Men/Kids), curated rail.
4. **Filter & sort results** — left-rail facets (Category, Prime, Brand, Customer Reviews, Price buckets) over a responsive product grid.
5. **View product detail (PDP)** — image gallery, title, rating + review count, "bought in past month" social proof, price w/ list-price strikethrough + % off + countdown-style "Limited time deal", color/size variant pickers, quantity, Add to Cart / Buy Now, delivery promise, stock, seller/returns info.
6. **Add to cart** — triggers a cross-sell modal ("Select compatible items" — protection plan upsell) before continuing to cart or checkout.
7. **View/edit cart** — line items with image, variant, qty, delete/compare/share, inline add-on (protection plan), subtotal, "Proceed to checkout", saved-for-later / buy-again tabs, promo banner, empty-cart state.
8. **Checkout** (not captured, but required to complete the journey) — address → payment → review → place order.
9. **Account** — avatar dropdown (Lists / Account: Orders, Returns, Addresses, Sign out), dedicated Orders page with time-range filter and empty state.
10. **Global navigation chrome** — sticky header (location, search+dept dropdown, language, account, orders, cart badge), dark secondary nav (hamburger mega-menu, quick category links), footer (back-to-top, 4-column link groups, language/country picker, full sitemap-style link wall, copyright).

---

## 2. UI patterns & visual details to reproduce

- **Header**: `#131921`-style dark bar — logo, "Delivering to {city} {zip} / Update location", search bar with department `<select>` prefix + orange search button, language flag dropdown, "Hello, {name} / Account & Lists" (hover/click dropdown), "Returns & Orders", cart icon with item-count badge.
- **Secondary nav** (`#232F3E`-style): hamburger "All" → slide-in mega-menu (Trending, Digital Content & Devices, Household Essentials, Programs & Features, Help & Settings — each a left-slide panel), quick links (Prime Deals, Prime Video, Buy Again, Groceries, Coupons, Pharmacy, Amazon Home, Livestreams, Audible), right-aligned urgency banner.
- **Product card**: square product image, brand+title (2-line clamp), star rating + review-count link, price block (big current price, small strikethrough list price, red "-X%" badge), Prime badge, "Best Seller"/"Amazon's Choice" ribbon.
- **Filter sidebar**: grouped facets — radio (Category), checkbox (Brand, Prime, Free Shipping), star-rating radio ("4 Stars & Up"), price buckets as checkboxes.
- **PDP layout**: left vertical thumbnail rail + large main image; center column (title, rating, badges, price, variant swatches, delivery info); right sticky buy-box (price, delivery date, stock, qty select, Add to Cart (yellow `#FFD814`) / Buy Now (orange `#FFA41C`), shipper/seller, returns policy, gift checkbox).
- **Add-to-cart modal**: confirmation strip (thumbnail + "Added to cart" + price/qty) above a cross-sell section, sticky footer with running subtotal and Continue to cart / Continue to checkout.
- **Cart page**: gift-card/credit-card promo banner, "Add protection" info banner, line items with checkbox-to-include, inline protection-plan add-on row, right-rail order-summary card (subtotal, Proceed to checkout CTA, Prime trial upsell).
- **Empty states**: empty cart ("Your Amazon Cart is empty" + CTAs), no orders ("Looks like you haven't placed an order...").
- **Modals/popovers**: centered modal (location picker, with zip-code quick-apply), small anchored popover (language switcher).
- **Footer**: "Back to top" bar, 4-column link group, centered logo + language/country selector, dense multi-column sitemap link wall, legal line.
- **Responsive behavior**: not captured in screenshots (all desktop) — will apply standard, well-known Amazon responsive collapses as an inferred/standard pattern: department dropdown and language selector collapse into the hamburger menu; filter sidebar becomes a slide-in drawer triggered by a "Filters" button; buy-box moves below the gallery and becomes non-sticky; product grid goes from 4-5 cols → 2 cols → 1 col.

---

## 3. MVP scope vs explicit skips (24-hour budget)

**Must-have (MVP):**
- Email/password auth (signup, login, logout, persisted session)
- Home page: hero carousel + category/deal rails (seeded data)
- Search with free text + department scope
- Category browsing + filter sidebar (category, brand, Prime, rating, price buckets) + sort + pagination
- PDP: gallery, variant selection (color/size) updating price/image/stock, qty, Add to Cart, Buy Now, related products, read-only seeded reviews/ratings
- Add-to-cart modal with a (visual, non-functional-backend) cross-sell upsell
- Cart: add/update qty/remove, persisted per user, subtotal, empty state
- Checkout: address entry, mock payment (format-validated, not processed), order placement, confirmation
- Order history ("Your Orders") list + detail, empty state
- Account page: profile + address book
- Responsive layout across the whole app
- Global chrome: header, hamburger mega-menu, footer — visually faithful

**Explicitly skipped** (named so it reads as a decision, not an oversight):
- Real payment processing (no Stripe/PayPal integration — a mock "Place Order" validates card-number shape only)
- Multi-seller marketplace, seller dashboards/admin UI (seeding is done via script, not UI)
- Wishlist/registries, Subscribe & Save, Prime membership purchase, device/Alexa ecosystem pages
- ML-driven recommendations (use simple "same category" related products instead)
- Multi-language/multi-currency functionality (the language/location pickers are visually reproduced but non-functional — flagged as UI stubs)
- Review authoring flow (schema supports it; only seeded reviews are shown)
- Live chat/customer service, returns processing workflow, gift cards as real currency, protection plans as real purchasable SKUs
- Search autocomplete/typeahead (stretch only, see Phase 9)
- Transactional email delivery (order confirmation is logged, not emailed)

---

## 4. Architecture & tech stack

**Pragmatic modular monolith**, not microservices:

- **Framework**: Next.js 14+ (App Router, TypeScript) — single deployable for UI + API routes. React Server Components for data-heavy pages (home, PDP, search) to cut client JS and enable caching at the framework level.
- **Styling/components**: Tailwind CSS + shadcn/ui primitives (Dialog, Dropdown, Select, Sheet for mobile filter drawer) — fast to build, consistent, accessible by default.
- **Database**: PostgreSQL (Neon or Supabase free tier — serverless-friendly, built-in pooling). ORM: Prisma.
- **Auth**: Auth.js (NextAuth) with the **JWT session strategy** (not database sessions) — keeps the backend stateless.
- **Cache / rate limiting**: Upstash Redis (serverless-friendly, pay-per-request, no server to manage).
- **Images**: Next/Image with a remote image source (seeded from a free API, see §11) — automatic resizing, WebP/AVIF, CDN-cached.
- **Hosting**: Vercel for the Next.js app (auto horizontal scaling, edge CDN, Vercel Cron for scheduled jobs) — gives a live HTTPS URL immediately with zero infra setup, satisfying the "live link, not localhost" requirement on day one.

This stack is chosen specifically because statelessness and horizontal scaling come for free from the platform (serverless functions), letting the 24-hour budget go almost entirely into product/UX rather than infrastructure.

---

## 5–7. Scalability design (credible path to ~1,000 concurrent users, no premature infra)

| Concern | Decision | Why |
|---|---|---|
| **Stateless backend** | All API routes are stateless; JWT (not server-session) auth; no in-memory state (carts/sessions live in Postgres/Redis, not process memory) | Lets Vercel spin up any number of function instances behind the scenes with zero sticky-session issues |
| **DB connection pooling** | Prisma + Neon/Supabase's built-in pgBouncer (transaction-mode pooler); Prisma client instantiated once per lambda via a cached singleton | Serverless functions open/close connections per invocation — without pooling, ~1000 concurrent users would exhaust Postgres' connection limit in seconds |
| **DB indexes** | See §8 — indexes on all FK columns, unique slugs/emails, GIN/trigram index for text search, composite index on (category_id, price) for filtered sort | Prevents full table scans becoming the bottleneck as product count grows |
| **Caching** | Next.js ISR (`revalidate`) on home/category/PDP pages (edge-cached HTML, revalidated every 30–60s); Upstash Redis for hot aggregate reads (category rails, popular searches) | Converts most read traffic into CDN hits instead of DB round-trips — the single highest-leverage scalability move available in the time budget |
| **API rate limiting** | Upstash Ratelimit (sliding window) middleware on `/api/auth/*`, `/api/cart/*`, `/api/checkout` | Cheap insurance against burst abuse/bots without building custom infra |
| **Pagination** | Every list endpoint (search, orders, reviews) takes `page`/`limit` (default 24/20), server-enforced max page size | Unbounded queries are the easiest way to fall over under load |
| **Efficient queries** | Prisma `select`/`include` scoped to exact fields needed; PDP fetches product+variants+related in one request via `Promise.all`, not client waterfalls; `ratingAvg`/`ratingCount` denormalized onto `Product` (not aggregated per request) | Avoids N+1 and redundant aggregation under load |
| **Static assets/images** | Next/Image + CDN; seeded images referenced from a stable image host, resized on the fly | Images are usually the largest byte cost on a page; CDN + resizing keeps this flat regardless of traffic |
| **Horizontal backend scaling** | Free by construction — Vercel scales function instances per request; the only shared bottleneck is Postgres, which is mitigated by pooling + caching above | No need for a custom load balancer or orchestration layer |
| **Other bottlenecks** | Checkout wrapped in a single DB transaction with a conditional stock decrement (`WHERE stock >= qty`) to prevent oversell races; cart writes are optimistic on the client with debounced server sync to avoid a DB write per keystroke on qty change | These are the two places naive implementations silently break under concurrency |

This explicitly avoids Kubernetes, microservices, message queues, or multi-region complexity — none of that is needed to make 1,000 concurrent users credible on a cached, pooled, indexed monolith; it would only burn the 24-hour budget.

---

## 8. Data model (Prisma, high level)

```
User(id, email UNIQUE, passwordHash, name, createdAt)
Address(id, userId FK→User INDEX, line1, line2, city, state, zip, country, isDefault)
Category(id, name, slug UNIQUE, parentId FK→Category NULLABLE)
Product(id, slug UNIQUE, title, brand, description, categoryId FK INDEX,
        basePrice, listPrice, images Json, ratingAvg, ratingCount,
        stock, isPrimeEligible, createdAt)
  + GIN/trigram index on title (and brand) for search
  + composite index (categoryId, basePrice) for filtered+sorted browse
ProductVariant(id, productId FK INDEX, type [color|size], value, priceDelta, stock, sku)
Review(id, productId FK INDEX, userId FK, rating, title, body, createdAt)
Cart(id, userId FK UNIQUE)
CartItem(id, cartId FK INDEX, productId FK, variantId NULLABLE, quantity, addedAt)
  UNIQUE(cartId, productId, variantId)
Order(id, userId FK INDEX, status [pending|placed|shipped|delivered],
      subtotal, tax, shippingFee, total, addressId, placedAt INDEX)
OrderItem(id, orderId FK INDEX, productId, variantId, quantity, unitPriceAtPurchase)
Deal(id, productId FK, discountPercent, startsAt, endsAt)   -- powers home-page rails
```

---

## 9. Reusable UI components

`Header`, `SecondaryNav`/`MegaMenu`, `Footer`, `SearchBar`+`DepartmentSelect`, `LocationPickerModal`, `LanguagePopover`, `AccountMenu`, `CartBadge`, `Breadcrumbs`, `ProductCard`, `ProductGrid`, `FilterSidebar` (generic facet groups: checkbox/radio/price-bucket), `RatingStars`, `PriceBlock` (price/list-price/discount badge), `ImageGallery`, `VariantSelector`, `QuantitySelector`, `BuyBox`, `AddToCartModal`, `CartLineItem`, `OrderSummaryPanel` (shared by cart + checkout), `EmptyState`, `Modal`/`Dropdown`/`Sheet` primitives (shadcn), `Toast`.

---

## 10. API surface

- **Auth**: `POST /api/auth/signup`, `GET|POST /api/auth/[...nextauth]` (login/logout/session via Auth.js)
- **Catalog**: `GET /api/categories`, `GET /api/products` (`q, category, brand, minPrice, maxPrice, rating, sort, page, limit`), `GET /api/products/[slug]`
- **Cart**: `GET /api/cart`, `POST /api/cart/items`, `PATCH /api/cart/items/[id]`, `DELETE /api/cart/items/[id]`
- **Checkout/Orders**: `POST /api/checkout`, `GET /api/orders`, `GET /api/orders/[id]`
- **Addresses**: `GET|POST /api/addresses`, `PATCH|DELETE /api/addresses/[id]`
- **Account**: `GET|PATCH /api/account`
- **Jobs** (cron-triggered, not user-facing): `POST /api/jobs/recalculate-ratings`

---

## 11. Seeding product data (no paid services)

Primary source: **DummyJSON** (`dummyjson.com/products`) — free, keyless, ~194 products with images, categories, ratings, brands; remap its categories onto an Amazon-style taxonomy (Electronics, Books, Fashion, Home & Kitchen, Beauty, Sports & Outdoors, Toys, Grocery, Automotive, Office). Pad out volume and add Amazon-specific flavor (color/size variants for apparel/shoes, "bought in past month" counts, Prime eligibility, list-price/discount pairs) using **Faker.js** on top. Target ~300–500 products across ~10–12 categories, run via a single idempotent `prisma/seed.ts`. This directly supports the color/size variant picker seen on the PDP screenshot and gives every category/filter facet real data to exercise.

---

## 12. Async / background work (kept lightweight — no queue infra)

- **Order confirmation** — logged (stubbed "email"), fired via `after()`/`waitUntil()` so it never blocks the checkout response.
- **Rating aggregate recompute** — denormalized `ratingAvg`/`ratingCount` on `Product`, refreshed by a Vercel Cron hitting `/api/jobs/recalculate-ratings` on a schedule rather than recomputed per page view.
- **(Stretch) cart abandonment cleanup** — cron-based deletion of stale guest-less empty carts.

No message broker/queue is introduced — at this scale and time budget, cron + fire-and-forget covers every background need identified.

---

## 13. Performance bottlenecks called out (and their mitigation)

- Serverless DB connection exhaustion → pgBouncer pooling (§5–7)
- Unindexed `ILIKE` search → GIN/trigram index on `title`/`brand`
- PDP/N+1 fetch waterfalls → single parallelized query, denormalized rating fields
- Oversized/unoptimized images → Next/Image + CDN
- Per-keystroke cart writes → debounced client sync + optimistic UI
- Home/category pages recomputed every request → ISR with short revalidate window
- Checkout stock oversell under concurrency → transactional conditional stock decrement

---

## 14. Phased implementation plan (each phase independently testable/demoable)

| Phase | Delivers | How to verify independently |
|---|---|---|
| **0. Foundation** | Next.js+TS scaffold, Tailwind/shadcn, Prisma+Postgres (Neon) wired, deployed skeleton on Vercel | Live URL loads a page — proves the whole deploy pipeline works before any feature risk |
| **1. Data layer** | Full Prisma schema + migrations + seed script (DummyJSON+Faker) | `prisma studio` / a temp API route shows real, categorized, variant-bearing product data |
| **2. Global chrome** | Header, hamburger mega-menu, footer, location/language stub modals, design tokens matching Amazon palette | Every route shares consistent, interactive chrome with no page logic yet |
| **3. Browse & search** | Home rails, category pages, search + FilterSidebar + sort + pagination (URL-driven filter state) | Searching/filtering/sorting returns correct paginated results; filters are shareable via URL |
| **4. PDP** | Gallery, variant selector (updates price/image/stock), buy box, related products, seeded reviews | Selecting a variant updates price/stock/image; PDP works for products with and without variants |
| **5. Auth** | Signup/login/logout, JWT session, account page, address CRUD | Create account → reload → still logged in; protected routes redirect when logged out |
| **6. Cart** | Add to cart (+ upsell modal), qty update, remove, persisted per user, empty state | Cart persists across a fresh login; totals recompute correctly on every mutation |
| **7. Checkout & Orders** | Address select, mock payment, transactional order placement + stock decrement, confirmation, Your Orders list/detail | Full path: browse → add to cart → checkout → order appears in Your Orders |
| **8. Scalability & polish** | Upstash Redis caching on hot reads, rate limiting, ISR on product/category pages, Vercel Cron for rating recompute, responsive QA, loading/error/skeleton states | Quick burst test (autocannon/k6) shows acceptable p95 latency; app is usable end-to-end on mobile width |
| **9. Stretch (only if time remains)** | Review authoring, functional language toggle (1–2 locales), wishlist, real protection-plan line item | Each is additive and independently demoable, cut first if time runs short |

**Ordering rationale**: browse → PDP → auth → cart → checkout is the order that produces a visually faithful, navigable storefront (the bulk of "product judgement" and "UX/UI" scoring) as early as possible, before any scalability work — which is deliberately last since it's additive polish that shouldn't block having a demoable product with hours to spare.

---

## Verification approach once implementation starts

- After each phase, `git commit` with `.agent-logs/` entries already flowing automatically (hooks are live).
- Deploy continuously to the same Vercel project from Phase 0 onward, so the "live link" requirement is satisfied throughout, not bolted on at the end.
- Phase 8 includes an explicit burst-test step (autocannon against `/`, `/search`, `/api/products`) to produce a concrete, honest number for the "credible path to ~1,000 concurrent users" claim rather than an assertion.
