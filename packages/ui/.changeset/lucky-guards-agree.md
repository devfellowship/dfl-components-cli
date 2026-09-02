---
'@devfellowship/components': patch
---

ux-paths: `validate` now enforces the three rules the JSON Schema cannot express

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
