# 8x Amazon Clone

This repo is a 24-hour rebuild of amazon.com's core shopping experience (browse, search, product detail, cart, checkout, orders) for the 8x Software Engineer assignment, built as a pragmatic Next.js + Prisma + Postgres modular monolith, following `screen shots/` as the visual/UX reference and deployed continuously to a live Vercel URL.

@docs/PLAN.md
@docs/PROGRESS.md

## Rules

1. Work on ONE phase at a time, only when the user explicitly says so (e.g. "Do Phase 3").
2. At the start of any session, read `docs/PROGRESS.md` first and state which phase we're on before doing anything else.
3. Before starting a phase, give a short plan (max 10 bullets) and wait for the user's OK — do not start implementation until they confirm.
3a. Once approved, create and check out a branch named `phase-N-<kebab-case-name>` (e.g. `phase-3-browse-search`) off the latest `main` before writing any code for that phase. All of that phase's commits live on this branch — see "Git workflow" below for how it gets back to `main`.
4. Keep it simple: no microservices, no message queues, no extra libraries/dependencies beyond what's in `docs/PLAN.md` without asking first.
5. For UI, follow the screenshots in `screen shots/` as the visual source of truth.
6. Never leave a phase half-broken. If something is taking too long, stub it, note the gap in `docs/PROGRESS.md`, and move on rather than blocking.
7. Do not touch `.agent-logs/` or its hooks (`.claude/settings.json`, `.claude/hooks/log_prompt.js`, `.claude/hooks/log_response.js`) — capture is already verified and working.

## Scope cuts for this build (deferred, not part of MVP)

Deferred from the full architecture in `docs/PLAN.md` to fit the 24-hour budget — documented as "scalability notes" in the README rather than implemented: Upstash Redis caching, API rate limiting, Vercel Cron, trigram/GIN search index, load testing, Faker-based seed padding, search autocomplete. Seed data comes from DummyJSON only (~100–150 products), with color/size variants added to 10–15 products.

Still implemented despite the cuts: ISR on public pages, DB connection pooling, indexes on all foreign keys, pagination on list endpoints, and a transactional, stock-safe checkout.

## Testing

`npm run verify` is the single check command (typecheck + lint + vitest + build). Write unit/API tests only for risky logic: cart totals, checkout/stock decrement, search/filter queries. Maintain one Playwright smoke test for the main flow (browse → PDP → cart → checkout), extended each phase.

## Git workflow

Branch per phase, starting from Phase 3 (Phases 0–2 shipped directly to `main` before this convention existed — not rewritten retroactively).

- Phase start (after plan approval): `git checkout main && git pull && git checkout -b phase-N-<name>`.
- All of that phase's commits land on `phase-N-<name>`, pushed to `origin` as work progresses (so the branch itself is also a backup, not just a local staging area).
- `/phase-done` closes the loop: verify → update `docs/PROGRESS.md` → commit on the phase branch → merge into `main` (`git checkout main && git merge --no-ff phase-N-<name>`) → push `main`.
- `main` is what Vercel's production deployment tracks, so it must always build and reflect the last *completed* phase — never merge a phase into `main` before its `/phase-done` verify has passed.
- The phase branch is kept (not deleted) after merging, for history/traceability.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
