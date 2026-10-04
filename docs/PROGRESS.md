# Progress

Status legend: `todo` / `doing` / `done`. Times in UTC. Update this file as part of every `/phase-done` run.

| Phase | Status | Start | End | Notes / known gaps |
|---|---|---|---|---|
| 0. Foundation | done | 2026-10-04T04:03:08Z | 2026-10-04T05:02:53Z | Next.js 16+TS+Tailwind+shadcn scaffolded; Prisma 6.19.3 (pinned stable, not the 7.x RC that defaults in and changes config to `prisma.config.ts`+driver adapters) wired with placeholder `url`/`directUrl` schema; `npm run verify` green; deployed live on Vercel with Neon `DATABASE_URL`/`DIRECT_URL` set. Caught and fixed a real secret accidentally placed in the tracked `.env.example` before it was committed — moved to gitignored `.env.local`. No real data model yet (Phase 1). |
| 1. Data layer | todo | | | |
| 2. Global chrome | todo | | | |
| 3. Browse & search | todo | | | |
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
