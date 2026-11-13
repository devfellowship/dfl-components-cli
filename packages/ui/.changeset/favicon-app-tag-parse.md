---
"@devfellowship/components": patch
---
`dfl-components favicon` now replaces a whole icon `<link>` even when an attribute value (for example an inline SVG data URI) contains `>`, and inserts the managed block after `<meta charset>` and viewport instead of before them.
