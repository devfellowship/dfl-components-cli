---
"@devfellowship/components": minor
---

New `DecisionCard` organism: the display part of the fleet Decision Card, moved from dfl-os (the source of truth, Plans App Q 84ba7b63 = A). Five fixed slots with `data-slot`: strip (app marks, type, door, blocking, plan link, question number), headline, visual (a diagram node or a micro-chart), options, answer. Display only: no fetch, no answer state, no app types.

- `contextFacets` takes `plans.plan_questions.context_facets` as stored (`{ kind, door, app_slugs, diagram_id, chart }`, object or JSON string) and fills the strip and the chart. Strip fields win.
- `options` (letter, label, description, optional consequence rows `details`, extra `body`) render as a read-only list (`[data-option]`); `recommended` and `recommendation` mark the choice; `answerHref` adds an "Answer" link.
- An app with its own controls passes `optionsSlot` and `answer`.
- Also exported: `DecisionStrip`, `DecisionChart`, the marks (`TypeGlyph`, `DoorMark`, `BlockingMark`, `looseKind`, labels and tips), `readChart` / `chartLayout`, `readContextFacets`.
- Styles: `import "@devfellowship/components/decision-card.css"` (DS tokens).
