# Progress

Status legend: `todo` / `doing` / `done`. Times in UTC. Update this file as part of every `/phase-done` run.

| Phase | Status | Start | End | Notes / known gaps |
|---|---|---|---|---|
| 0. Foundation | todo | | | |
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
