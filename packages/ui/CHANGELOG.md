# @devfellowship/components

## 3.0.0

### Major Changes

- [#101](https://github.com/devfellowship/dfl-components-cli/pull/101) [`e070f29`](https://github.com/devfellowship/dfl-components-cli/commit/e070f2924a80c2e4e1f5e1b7b56f1732e76da043) Thanks [@taigfs](https://github.com/taigfs)! - Remove the component registry and the `add` CLI subcommand (PR [#100](https://github.com/devfellowship/dfl-components-cli/issues/100)). Consumers that relied on the `registry/` export or the `dfl-components add <component>` scaffolding command must migrate to importing components directly from `@devfellowship/components`. This is a breaking change, taking the package from 2.0.0 to 3.0.0. This changeset also reconciles the standing drift where `packages/ui/package.json` had been hand-bumped to 3.0.0 while npm was still at 2.0.0 — the first automated Changesets release publishes 3.0.0 deterministically from npm's 2.0.0 baseline.
