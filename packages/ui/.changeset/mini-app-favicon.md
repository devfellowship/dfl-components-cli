---
"@devfellowship/components": minor
---

`dfl-components favicon --app <slug>` installs a mini-app's own icon set from `https://brand.devfellowship.com/mini-apps` (override with `--source` or `DFL_MINI_APPS_SOURCE`). It checks the size and sha256 of every file against the manifest and writes nothing if one check fails. `--check` works with `--app`. The network code is a separate lazy bundle, so `dist/cli.js` stays offline-safe.

`AppSidebar` gets a `logoMode?: "box" | "tile"` prop (default `"box"`, no change). In `"tile"` mode the logo renders as a bare 32px rounded tile without the amber box.

Adoption: run `npx dfl-components favicon --app <slug>`, then `<AppSidebar logo="/favicon.svg" logoMode="tile" … />`.
