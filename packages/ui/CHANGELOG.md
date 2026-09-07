# @devfellowship/components

## 3.5.3

### Patch Changes

- [#134](https://github.com/devfellowship/dfl-components-cli/pull/134) [`c9a8f00`](https://github.com/devfellowship/dfl-components-cli/commit/c9a8f005db80c6079d30ffc673ae57efc8a50113) Thanks [@taigfs](https://github.com/taigfs)! - fix(select): ignore the empty bubble-input echo before the options register

  `Select` no longer clears a controlled value that is set asynchronously.

  Radix keeps a hidden native `<select>` so the component works in a form. When
  the Radix value changes, that input assigns `select.value` and dispatches a real
  `change` event, and reports `event.target.value` back through `onValueChange`.
  The `<option>` list only registers a render later, so the browser resolves the
  assignment to `""`. That empty string reached the consumer and wiped a value the
  app had just set from a fetch or a hydration effect.

  The DS `Select` now drops an `onValueChange("")` call when the component is
  controlled, the current `value` is not empty, and `allowEmptyValue` is not set.
  A user selection can never produce `""`, because Radix requires every
  `SelectItem` to carry a non-empty value.

  Pass the new `allowEmptyValue` prop to opt out and receive every value,
  including `""`. Uncontrolled usage is unchanged.

## 3.5.2

### Patch Changes

- [#132](https://github.com/devfellowship/dfl-components-cli/pull/132) [`c27369e`](https://github.com/devfellowship/dfl-components-cli/commit/c27369e0a49819b4dc916c2dcfdbade72e86d95c) Thanks [@taigfs](https://github.com/taigfs)! - Add permanent browser checks for Roadmap mobile density, group containment, edge anchors, long maps, and resize performance.

## 3.5.1

### Patch Changes

- [#130](https://github.com/devfellowship/dfl-components-cli/pull/130) [`e324bf0`](https://github.com/devfellowship/dfl-components-cli/commit/e324bf0c987f8facd6c06c183c16c773e6c42016) Thanks [@taigfs](https://github.com/taigfs)! - Make Roadmap responsive to its container with three weighted tracks and a 12px font floor. Collapse empty columns by default. Preserve compact mobile spacing and group containment. Hide SVG edges for print. Plain CSS container queries and Tailwind v3-compatible utilities support embedded maps.

## 3.5.0

### Minor Changes

- [#128](https://github.com/devfellowship/dfl-components-cli/pull/128) [`f202115`](https://github.com/devfellowship/dfl-components-cli/commit/f202115fd7f8bf81b90fb2c816876bee40ad8c80) Thanks [@taigfs](https://github.com/taigfs)! - Add the Roadmap SVG edge overlay with border anchors, gutter elbows, arrowheads,
  semantic tones and midpoint label chips. Batch resize, node content and font
  updates with one observer and animation frame. Expose debugPerf measurements.
  Reduce mobile row spacing to 24px between node borders. Tailwind classes use
  bracket syntax compatible with consumers that compile utilities with Tailwind v3.

## 3.4.0

### Minor Changes

- [#126](https://github.com/devfellowship/dfl-components-cli/pull/126) [`9560ec2`](https://github.com/devfellowship/dfl-components-cli/commit/9560ec238f3a0bc00c6487bb892113a3454fcf2b) Thanks [@taigfs](https://github.com/taigfs)! - Add the dark-only Roadmap grid with nodes, groups, legends, actions and learner state overlays. Export Roadmap from the root entry. The grid uses Tailwind v3-compatible utilities and bracket values. Fix the roadmap.sh converter to derive group column subsets from source rectangle extents.

## 3.3.0

### Minor Changes

- [#124](https://github.com/devfellowship/dfl-components-cli/pull/124) [`739a98c`](https://github.com/devfellowship/dfl-components-cli/commit/739a98ced4b628926df76e409dd6e377e47d1e0b) Thanks [@taigfs](https://github.com/taigfs)! - Add the `Roadmap` contract — `RoadmapDocument` `roadmap/v1`, its zod schema and
  the pure layout helpers — on the root entry.

  A knowledge map is now data, not coordinates. A node names a `column`
  (`left | center | right`) and an `order` (the grid row); the renderer owns the
  pixels. Absolute positions cannot reflow, which is why the reference maps on
  roadmap.sh render a 17 px label at 6.2 px on a 390 px phone. This shape reflows.

  What ships:

  - `parseRoadmapDocument()` / `safeParseRoadmapDocument()` and
    `roadmapDocumentSchema`. Beyond the field types the schema holds the
    cross-field invariants: unique node ids, one node per `(column, order)` cell
    (a spanning node occupies every track it covers), every edge endpoint exists,
    no self-loop, `group.from <= group.to`, two groups share rows only when their
    columns are disjoint, a `badge` names a legend entry, and an action carries
    exactly one of `href` or `actionId`. Every issue carries a path into the
    document, so a caller can point an author at the exact node.
  - `tone` is a TOKEN, one of eight names. A hex string is a validation error. That
    closed vocabulary is what keeps the dark design system, the editorial surface
    and a downstream `--s-*` rebrand all working from one document.
  - The progress state is an OVERLAY, `RoadmapStateOverlay` (`roadmap-state/v1`),
    not a document field. A map is shared; a learner's state is not. The overlay
    wins over an authored `node.state`, and an unknown id in it is ignored.
  - Documented defaults, read through `resolveEdgeStyle`, `resolveNodeTone` and
    friends. An edge defaults to `dashed`, because 2 719 of the 4 411 edges in the
    92-map reference corpus are dashed and a `solid` default would make every
    converted map wrong. The parser writes no defaults into the object, so a
    document round-trips byte-stable and stays diffable.
  - Pure, DOM-free layout helpers: `placeNodes`, `rowsOf`, `nodesByRow`,
    `columnsUsed`, `groupRanges`, `groupColumnRuns`, `gridColumnFor`,
    `validateNoOverlap`, `firstFreeRow`.

  Two notes for consumers:

  - **Tailwind v3 stays supported.** This release adds no CSS at all. The
    component of the next release will use utility classes and bracket values
    (`bg-[var(--c-roadmap-node-bg)]`) only — no `@theme`, `@utility`, `@source` or
    `@apply` — so a Tailwind 3.4 app that purges from
    `node_modules/@devfellowship/components/dist/**/*.js` keeps working.
  - **`zod` now reaches the root entry.** It was already a dependency of this
    package. The package is marked side-effect-free outside CSS, so a bundler
    drops the import for an app that never touches the roadmap schema.

  The React component, the tokens and the Storybook stories land in the following
  releases. This one is the contract.

## 3.2.4

### Patch Changes

- [#122](https://github.com/devfellowship/dfl-components-cli/pull/122) [`fb6b55f`](https://github.com/devfellowship/dfl-components-cli/commit/fb6b55f2f22082752b86f0ee91174a534033f3c7) Thanks [@taigfs](https://github.com/taigfs)! - ux-paths: `validate` now enforces the three rules the JSON Schema cannot express

  `ux-paths validate` compiled the v1 schema and reported the result. That is less
  than it appeared to be. JSON Schema has no cross-reference and no uniqueness
  constraint across array items, so four broken documents satisfied it completely:
  a flow that starts at a screen nobody declares, a step that walks one, an
  `action.next_screen` that targets one, and a repeated `screen.id`. Measured on
  2026-09-02 against the published `3.2.3`: all four printed `OK … conforms to
schema v1.` and exited 0.

  `screen.id` is the schema's own "sticky 1:1 join key across apps". Every
  cross-app comparison, every atlas edge and every annotation is built on that
  join, so each of those documents breaks the model in silence.

  `validate` now runs `unique-ids`, `whole-flows` and `action-targets` after the
  schema passes, and exits 1 on any of them. The rules and their names are taken
  from `dfl-ci:scripts/ux-paths-guard.mjs`, which already ran exactly these three
  in CI — so this adds no new policy. It removes a disagreement: the CI job and the
  CLI judged the same file by different rules, and the CLI, the one a person runs,
  was the permissive one.

  MEASURED, NOT ASSUMED. Every `flows.json` in the fleet was run through the
  published CLI and through this build: 31 documents in 23 repositories across
  `devfellowship`, `iterahq` and `taigfs`. All 31 return the same exit code before
  and after. The four that fail today fail on the schema, exactly as they did
  before.

  `validate` remains fully offline. The new checks are pure computation over the
  parsed document, a test asserts they touch no `fetch`, and
  `check-cli-bundle-offline.mjs` passes unchanged.

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
