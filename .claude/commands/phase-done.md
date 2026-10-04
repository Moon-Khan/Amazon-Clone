---
description: Close out the current phase - verify, fix, update progress, commit, report
---

Run the project's verification suite and close out the current phase:

1. Run `npm run verify` (typecheck + lint + vitest + build). If a Playwright smoke test exists, run that too.
2. If anything fails, fix the underlying issue and re-run until it passes. Do not skip, disable, or weaken a check just to force a pass.
3. Update `docs/PROGRESS.md` for the phase just finished: set its status to `done` (or `doing` with a clear note if something had to be stubbed), fill in start/end time, and add a one-line "notes / known gaps" entry.
4. Create a git commit with message `phase N: <name>` (use the actual phase number and name from `docs/PROGRESS.md`).
5. If the current branch is a `phase-N-*` branch (per CLAUDE.md's Git workflow - skip this step if already on `main`, e.g. for Phases 0-2): push the phase branch to `origin`, then `git checkout main`, `git merge --no-ff phase-N-*`, resolve anything that comes up, re-run `npm run verify` on `main` to confirm the merge itself is clean, then push `main`. `main` is what Vercel deploys, so it must build after this step.
6. Report back in exactly 3 lines: what works, what is stubbed/deferred, and what the next phase is.
