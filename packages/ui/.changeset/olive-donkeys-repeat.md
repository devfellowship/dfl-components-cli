---
"@devfellowship/components": minor
---

Add the `Roadmap` contract — `RoadmapDocument` `roadmap/v1`, its zod schema and
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
