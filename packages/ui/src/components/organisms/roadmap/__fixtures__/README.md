# Roadmap fixtures

Every file here is a `RoadmapDocument` (`roadmap/v1`) or a `RoadmapStateOverlay`
(`roadmap-state/v1`). The tests parse them; the Storybook stories of rounds R2 to
R4 render them. They are NOT part of the published package: nothing under
`__fixtures__/` is reachable from `src/index.ts`, so tsup never bundles them.

| File | What it is |
|---|---|
| `vocabulary.json` | The compact example of the plan. It carries every vocabulary item once — a sequence, a 1-to-n fan-out, a titled group, a dark-toned group, all eight node tones, an edge with a label, an edge without one, dashed, dotted, an icon on the left and on the right with different tones, a node with text and a button, and a legend. |
| `vocabulary.state.json` | The progress overlay for `vocabulary.json`. It also carries one id that no node has, to prove an unknown id is ignored and not an error. |
| `long-5000.json` | The tall map: 120 rows, 219 nodes, 6 groups. **Generated** — do not edit by hand. Run `node scripts/gen-roadmap-long-fixture.mjs`, or `--check` to prove the committed file matches the generator. |
| `roadmapsh-frontend.json` | The roadmap.sh `/frontend` map, converted by `convert/fromRoadmapSh.ts`. The fidelity fixture. **Generated** — see below. |
| `malformed/*.json` | Six documents that MUST be rejected, one invariant each. |

## `roadmapsh-frontend.json` — provenance

- **Source:** <https://roadmap.sh/frontend.json>, fetched 2026-09-07.
- **Licence:** the roadmap.sh map content carries `NOASSERTION`. The file is
  committed as a rendering fidelity fixture only. It is not published in `dist`
  and it is not redistributed as roadmap.sh content. Plan question Q4 decides
  whether it stays committed; option B (fetch at test time) and option C (author
  a DFL map of the same size) both replace this one file and nothing else.
- The same provenance is inside the file, in `meta.source` and `meta.license`.

To regenerate it, point the converter at a local copy of the corpus:

```bash
ROADMAPSH_CORPUS_DIR=/path/to/roadmapsh/json \
ROADMAP_WRITE_FIXTURES=1 \
npx vitest run src/components/organisms/roadmap
```

Without `ROADMAP_WRITE_FIXTURES` the same test ASSERTS the committed file still
matches the converter, so a change to `fromRoadmapSh.ts` cannot silently drift
away from the fixture. Without `ROADMAPSH_CORPUS_DIR` — which is the case in CI —
that test and the 92-map round trip are skipped, and the committed fixture is
still parsed and checked for its provenance fields.

Write the corpus report of the round trip with:

```bash
ROADMAPSH_CORPUS_DIR=… ROADMAP_CORPUS_REPORT=/tmp/corpus-report.md npx vitest run src/components/organisms/roadmap
```
