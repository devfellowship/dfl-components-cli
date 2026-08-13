---
"@devfellowship/components": patch
---

ux-paths: re-vendor `v1.schema.json` from `devfellowship/dfl-ux-paths` — `navigation_path` is a SEQUENCE

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
