# @devfellowship/components

## 3.2.0

### Minor Changes

- [#112](https://github.com/devfellowship/dfl-components-cli/pull/112) [`cab4840`](https://github.com/devfellowship/dfl-components-cli/commit/cab48403a53023f2a2ca39d6a35cbc6ed6470aba) Thanks [@taigfs](https://github.com/taigfs)! - Add `FlowCanvas` — the shared, auto-laid-out graph canvas — behind a new `@devfellowship/components/canvas` entry point.

  The canvas owns the map: dagre ranking, smoothstep edge routing with de-collided
  label chips for reciprocal pairs, the card frame, the caption, the minimap and
  the controls. The consuming lens owns what a card SHOWS (`renderCard`) and what a
  click DOES (`onNodeClick`). The canvas never inspects `node.data`, so one canvas
  serves a low-fidelity wireframe lens and a real-screenshot lens without learning
  that either exists.

  `@xyflow/react` and `@dagrejs/dagre` are OPTIONAL peer dependencies and the
  canvas is deliberately NOT re-exported from the main entry, so consumers who
  draw no graph install nothing new. A CI guard asserts that isolation against the
  built bundles.

  Also new: `@devfellowship/components/canvas.css`, the DS skin for React Flow's
  own Controls and MiniMap chrome.

## 3.1.0

### Minor Changes

- [#110](https://github.com/devfellowship/dfl-components-cli/pull/110) [`08d4748`](https://github.com/devfellowship/dfl-components-cli/commit/08d4748242d25ed86189034fc5515ef04543d0ee) Thanks [@taigfs](https://github.com/taigfs)! - Add the `@devfellowship/components/testing` subpath export — assertion helpers that refuse a green a test did not earn.

  Supabase RLS hides unauthorized rows as `200 []`, not `403`, so a gated page viewed by the level-0 smoke identity renders "no results" and assertions like `expect(rows).toHaveCount(0)` pass **vacuously** — satisfied by absence of permission rather than by the state under test.

  - `classifyEmptiness()` — pure, I/O-free verdict: `populated` | `denied` | `genuinely-empty` | `vacuous`.
  - `assertNotVacuouslyEmpty(page, opts)` — thin Playwright-facing adapter; throws the exported `VacuousVerificationError` when emptiness is indistinguishable from lack of access.
  - `iamMemberProbe(supabaseClient)` — independent authorization signal via the `get_my_iam_role()` RPC; fails to `'unknown'`, never to `true`.

  Zero new runtime dependencies: the entry duck-types the `Page`/`Locator`/`rpc` surfaces it needs instead of importing `@playwright/test` or `@supabase/supabase-js`.

## 3.0.1

### Patch Changes

- [#105](https://github.com/devfellowship/dfl-components-cli/pull/105) [`7ea8eed`](https://github.com/devfellowship/dfl-components-cli/commit/7ea8eedacaec0abccef38fe50227053693eb0ef4) Thanks [@taigfs](https://github.com/taigfs)! - ux-paths: vendor the v1 JSON Schema instead of fetching it from raw.githubusercontent.com

  `ux-paths validate` fetched the schema from
  `raw.githubusercontent.com/devfellowship/dfl-ux-paths/main/schema/v1.json` on
  every run. `devfellowship/dfl-ux-paths` was made **private, permanently**, on
  2026-08-04, so that URL now returns 404 to an anonymous caller and `validate`
  would have failed for every consumer of this package.

  The schema is now bundled into `dist/cli.js` at build time. `validate` performs
  no network I/O at all, so it also works offline and in air-gapped CI. Only the
  schema — DFL infrastructure describing the _shape_ of a flows document — is
  vendored; no content of any kind travels with it.

## 3.0.0

### Major Changes

- [#101](https://github.com/devfellowship/dfl-components-cli/pull/101) [`e070f29`](https://github.com/devfellowship/dfl-components-cli/commit/e070f2924a80c2e4e1f5e1b7b56f1732e76da043) Thanks [@taigfs](https://github.com/taigfs)! - Remove the component registry and the `add` CLI subcommand (PR [#100](https://github.com/devfellowship/dfl-components-cli/issues/100)). Consumers that relied on the `registry/` export or the `dfl-components add <component>` scaffolding command must migrate to importing components directly from `@devfellowship/components`. This is a breaking change, taking the package from 2.0.0 to 3.0.0. This changeset also reconciles the standing drift where `packages/ui/package.json` had been hand-bumped to 3.0.0 while npm was still at 2.0.0 — the first automated Changesets release publishes 3.0.0 deterministically from npm's 2.0.0 baseline.
