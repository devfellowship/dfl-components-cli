---
"@devfellowship/components": minor
---

Decision Card strip: the canvas strip 1 in the package. `DecisionStrip` in mark mode (`appDisplay="mark"`, the default) now draws the app marks plus the app names, and keeps ONE `data-tip` and tab stop on `[data-strip="app"]` ("App · seo + campanhas", "App of the plan · os"), the same as name mode. New `typeForm="labeled"` draws the type glyph before the type word (`TypeForm` gains `"labeled"`; the default stays `"word"`). `AppMark` and `AppMarkStack` gain `tooltip` (default true); the strip passes false so a hover shows one tooltip, not two.
