---
"@devfellowship/components": minor
---

Add `FlowCanvas` — the shared, auto-laid-out graph canvas — behind a new `@devfellowship/components/canvas` entry point.

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
