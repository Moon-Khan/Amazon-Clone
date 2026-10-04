---
description: Close out the current phase - verify, fix, update progress, commit, report
---

Run the project's verification suite and close out the current phase:

1. Run `npm run verify` (typecheck + lint + vitest + build). If a Playwright smoke test exists, run that too.
2. If anything fails, fix the underlying issue and re-run until it passes. Do not skip, disable, or weaken a check just to force a pass.
3. Update `docs/PROGRESS.md` for the phase just finished: set its status to `done` (or `doing` with a clear note if something had to be stubbed), fill in start/end time, and add a one-line "notes / known gaps" entry.
4. Create a git commit with message `phase N: <name>` (use the actual phase number and name from `docs/PROGRESS.md`).
5. Report back in exactly 3 lines: what works, what is stubbed/deferred, and what the next phase is.
