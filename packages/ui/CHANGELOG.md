# @devfellowship/components

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
