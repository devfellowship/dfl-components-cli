---
'@devfellowship/components': patch
---

ux-paths: take the v1 JSON Schema from `@devfellowship/ux-paths-spec` and delete the vendored copy

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
