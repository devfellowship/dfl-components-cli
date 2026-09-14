---
'@devfellowship/components': minor
---

Ship the DFL favicon from the design system.

The brand icons (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`,
`icon-192.png`, `icon-512.png`) now live in the package as `dist/brand/*`,
reachable as `@devfellowship/components/brand/<file>` subpath exports.

New CLI command: `npx dfl-components favicon [dir]` copies them into the app's
public directory and rewrites the icon `<link>` block in `index.html`. It is
idempotent, and `--check` exits 1 on drift so CI can hold an app to the current
mark. Apps stop hard-coding an S3 URL or a hand-made `.ico`; a brand refresh is
a DS bump plus a re-run.
