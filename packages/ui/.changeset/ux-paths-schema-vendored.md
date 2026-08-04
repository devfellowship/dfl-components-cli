---
'@devfellowship/components': patch
---

ux-paths: vendor the v1 JSON Schema instead of fetching it from raw.githubusercontent.com

`ux-paths validate` fetched the schema from
`raw.githubusercontent.com/devfellowship/dfl-ux-paths/main/schema/v1.json` on
every run. `devfellowship/dfl-ux-paths` was made **private, permanently**, on
2026-08-04, so that URL now returns 404 to an anonymous caller and `validate`
would have failed for every consumer of this package.

The schema is now bundled into `dist/cli.js` at build time. `validate` performs
no network I/O at all, so it also works offline and in air-gapped CI. Only the
schema — DFL infrastructure describing the *shape* of a flows document — is
vendored; no content of any kind travels with it.
