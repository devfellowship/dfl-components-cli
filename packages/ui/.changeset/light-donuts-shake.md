---
"@devfellowship/components": minor
---

Add the `@devfellowship/components/testing` subpath export — assertion helpers that refuse a green a test did not earn.

Supabase RLS hides unauthorized rows as `200 []`, not `403`, so a gated page viewed by the level-0 smoke identity renders "no results" and assertions like `expect(rows).toHaveCount(0)` pass **vacuously** — satisfied by absence of permission rather than by the state under test.

- `classifyEmptiness()` — pure, I/O-free verdict: `populated` | `denied` | `genuinely-empty` | `vacuous`.
- `assertNotVacuouslyEmpty(page, opts)` — thin Playwright-facing adapter; throws the exported `VacuousVerificationError` when emptiness is indistinguishable from lack of access.
- `iamMemberProbe(supabaseClient)` — independent authorization signal via the `get_my_iam_role()` RPC; fails to `'unknown'`, never to `true`.

Zero new runtime dependencies: the entry duck-types the `Page`/`Locator`/`rpc` surfaces it needs instead of importing `@playwright/test` or `@supabase/supabase-js`.
