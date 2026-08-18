# @devfellowship/components

## 3.2.3

### Patch Changes

- [#120](https://github.com/devfellowship/dfl-components-cli/pull/120) [`7f13793`](https://github.com/devfellowship/dfl-components-cli/commit/7f13793ff27c22b73f081afe91bdeccf371187a6) Thanks [@taigfs](https://github.com/taigfs)! - Add the UX Paths `data-source` source stamp to the design system build.

  The design system ships compiled, so its JSX was gone before a consuming app's
  bundler ever saw it — a click on a screenshot of a DS button resolved to the
  application file that mounted it, not to the button. The build now writes
  `data-source="packages/ui/src/…tsx:<line>"` onto every host element it renders.

  The gate is `UX_PATHS_SOURCE_STAMP`, absent by default. **The published npm
  artifact is unchanged and carries zero stamps** — verified byte-identical to the
  previous release build. The stamped build is distributed only as a GitHub
  Release asset (`*-capture.tgz`) and is never published to any registry.

## 3.2.2

### Patch Changes

- [#118](https://github.com/devfellowship/dfl-components-cli/pull/118) [`81a841b`](https://github.com/devfellowship/dfl-components-cli/commit/81a841b950d42c63bcc7e092e3c9259f68b407e2) Thanks [@taigfs](https://github.com/taigfs)! - ux-paths: take the v1 JSON Schema from `@devfellowship/ux-paths-spec` and delete the vendored copy

  `src/cli/ux-paths/lib/v1.schema.json` was a hand-synced copy of
  `dfl-ux-paths:schema/v1.json`, kept in step by a code comment that asked a human
  to mirror it "in the same round". That is a promise, not a mechanism, and it
  fails quietly: the copy goes stale and `validate` keeps exiting 0 against rules
  that no longer exist — or refuses a document the real schema admits.

  The schema now arrives as a package. `@devfellowship/ux-paths-spec` is published
  from `dfl-ux-paths`, generated there from the single canonical `schema/v1.json`,
  and gated by `generate --check` in that repo's CI. Taking a schema change is now
  a version bump in a diff instead of a copy nobody notices.

  Behaviour is unchanged, and was measured rather than assumed: the deleted file
  and the published package are byte-identical today, and `ux-paths validate`
  returns the same exit code and the same message for all 27 documents in the
  fleet corpus, before and after.

  `validate` is still fully offline. The spec package has zero runtime
  dependencies, `tsup.cli.config.ts` marks it `noExternal`, and the existing
  `check-cli-bundle-offline.mjs` gate — which asserts the schema is inlined in
  `dist/cli.js` and no network primitive is — passes unchanged.

  The hand-written `src/cli/ux-paths/lib/types.ts` is replaced by the generated
  types from the same package. It had already drifted: its `SchemaVersion` read
  `'1.0.0' | '1.1.0' | '1.2.0'` while the schema had admitted `'1.3.0'`. The file
  is types only, so this cannot change runtime behaviour.

## 3.2.1

### Patch Changes

- [#116](https://github.com/devfellowship/dfl-components-cli/pull/116) [`501bf8d`](https://github.com/devfellowship/dfl-components-cli/commit/501bf8d0aa82604c841a3577ee271942948a1a0f) Thanks [@taigfs](https://github.com/taigfs)! - ux-paths: re-vendor `v1.schema.json` from `devfellowship/dfl-ux-paths` — `navigation_path` is a SEQUENCE

  The upstream description named two different data structures at once: an
  "ordered list of actions to navigate to this screen", and a fallback list where
  "the runner tries them in order and the first matching selector wins". The JSON
  shape is identical under both readings, so a document validated either way while
  two implementations could disagree about what it meant. Tainan settled it on
  2026-08-13: it is a sequence. Every step runs, in array order.

  Documentation only. `validate` accepts and rejects exactly the documents it did
  before — no field, no enum value and no assertion moved. The schema is inlined
  into `dist/cli.js` at build time, so the corrected prose reaches consumers of
  the CLI through a release rather than through a repo they cannot read.

  This copy is kept current by the promise in `load-schema.ts` ("a schema change
  upstream must be mirrored here in the same round") and by nothing else — it is
  the one copy of the five with no digest guard behind it.

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
