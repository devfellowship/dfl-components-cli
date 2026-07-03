# @devfellowship/components

The **DevFellowship design system** — React UI components, design tokens, a live
Storybook, and the `dfl-components` CLI (component scaffolding **+** `ux-paths`
app-flow mapping). Shipped as a single published npm package.

[![npm version](https://img.shields.io/npm/v/@devfellowship/components)](https://www.npmjs.com/package/@devfellowship/components)
[![npm downloads](https://img.shields.io/npm/dm/@devfellowship/components)](https://www.npmjs.com/package/@devfellowship/components)
![license](https://img.shields.io/npm/l/@devfellowship/components)

- 📦 **npm:** https://www.npmjs.com/package/@devfellowship/components
- 📖 **Storybook (live):** https://storybook.devfellowship.com/
- 🎨 **DS v0 static reference:** https://devfellowship.s3.amazonaws.com/media/1779275454681-1779273267327-AgADbwUAAn7PaEQ.html

---

## What's in the box

- **~55 UI components** — dark-themed, DS-v0-tokenized primitives + molecules +
  organisms + app-shell templates (built on Radix + `class-variance-authority`,
  shadcn-compatible). Real exports include `Button`, `Alert`, `Avatar`, `Badge`,
  `Card`, `Dialog`, `Input`, `Select`, `Table`, `Sidebar`, `Toaster`, …
- **Design tokens** — a 3-layer CSS-variable system (primitives → semantic →
  component) shipped as importable stylesheets.
- **Hooks, utils & providers** — `useToast`, `useAuth`, `useIsMobile`, `cn`,
  `formatCurrency`, `formatDate`, `AuthProvider`, `FeatureFlagProvider`, …
- **The `dfl-components` CLI** — scaffold components into an app **and** map/validate
  each app's UX paths (`ux-paths`), folding the former `dfl-ux-paths` CLI into one bin.

---

## Install

```bash
# pnpm
pnpm add @devfellowship/components

# npm
npm install @devfellowship/components

# yarn
yarn add @devfellowship/components

# bun
bun add @devfellowship/components
```

**Peer dependencies** (bring your own): `react >=18`, `react-dom >=18`,
`tailwindcss >=4`, and — only if you use `AuthProvider` / data hooks —
`@supabase/supabase-js >=2`.

---

## Usage

Import a component and the design-token stylesheet:

```tsx
import { Button } from "@devfellowship/components";
import "@devfellowship/components/styles"; // DS v0 tokens + theme (dark)

export function Example() {
  return <Button variant="default">Ship it</Button>;
}
```

Sub-path exports (tree-shakeable, typed):

```ts
import { useToast, useAuth, useIsMobile } from "@devfellowship/components/hooks";
import { cn, formatCurrency, formatDate }  from "@devfellowship/components/utils";
import { AuthProvider, FeatureFlagProvider } from "@devfellowship/components/providers";

import "@devfellowship/components/styles";   // semantic vars as HEX (DS-native apps)
import "@devfellowship/components/tailwind";  // Tailwind v4 utility layer
```

### Consuming the DS styles — pick ONE stylesheet

The DS is **dark-only**. Which stylesheet you import depends on how your app's
Tailwind theme references its CSS vars:

| App type | What your theme does | Import this |
| --- | --- | --- |
| **DS-native / hex-var** | reads `var(--background)` directly, or uses the DS Tailwind preset (`bg-background`) | `@devfellowship/components/styles` (+ `.../tailwind` for utilities) |
| **shadcn-slate** | wraps vars as `hsl(var(--background))`, `hsl(var(--primary))`, … | `@devfellowship/components/shadcn` then set `.dark` |

> ⚠️ **Import EXACTLY ONE — NEVER both `/styles` and `/shadcn`.** They declare
> the same semantic vars in incompatible formats: `/styles` ships them as **hex**
> (`#0A0908`), `/shadcn` ships them as bare **HSL channels** (`30 11% 4%`). Whichever
> lands later in the cascade clobbers the other → broken colors. The `/shadcn`
> bridge (added v1.2.0) is additive/opt-in and does not touch the hex layer.

Available style exports: `/styles` (theme), `/shadcn` (shadcn bridge), `/tokens`
(raw token vars), `/tailwind` (Tailwind v4 preset).

### Design-token architecture

Tokens live in [`packages/ui/src/styles/tokens.css`](packages/ui/src/styles/tokens.css). Three layers:

| Layer          | Prefix   | Role                                       | Count |
| -------------- | -------- | ------------------------------------------ | ----- |
| **Primitives** | `--p-*`  | Raw atoms (color stops, type, spacing)     | 112   |
| **Semantic**   | `--s-*`  | Intent-mapped (surface-page, ink-muted, …) | 40    |
| **Component**  | `--c-*`  | Per-component knobs (5–10 each)            | 64    |

Brand color is `#E07A4A` (DS v0 amber-500). The legacy `#F39325` was retired in v1.0.0.

---

## Storybook

The live Storybook is the browsable catalog of every component and its states:

**https://storybook.devfellowship.com/**

Stories follow a strict **one-state-per-story** convention — each story export
renders **exactly one** state/variant (no galleries), organized under
`Components/{Atoms,Molecules,Organisms}/<Name>` plus a `Templates/` track. See
[`CLAUDE.md`](CLAUDE.md) for the full authoring rules.

Run it locally:

```bash
npm run storybook        # dev server on :6006 (proxies packages/ui)
npm run build-storybook  # static build
```

---

## CLI — `dfl-components`

The package ships a `dfl-components` bin. Run it via `npx` (no install needed) or
after adding the package globally:

```bash
npx @devfellowship/components <command>
# or
pnpm add -g @devfellowship/components && dfl-components <command>
```

### Top-level commands

| Command | Description |
| --- | --- |
| `init` | Initialize a project with `dfl-components` configuration |
| `add [components...]` | Add shared component(s) to your project (`--all`, `--overwrite`) |
| `ux-paths <cmd>` | Versioned, schema-validated per-app UX-path mapping (below) |
| `check-style-imports` | Guard against importing both `/styles` and `/shadcn` |

### `ux-paths` subcommands

Maps an app's screens/actions/flows into a versioned `.dfl-ux-paths/flows.json`
(schema in [`devfellowship/dfl-ux-paths`](https://github.com/devfellowship/dfl-ux-paths)).

| Command | Description |
| --- | --- |
| `ux-paths init` | Scaffold a `.dfl-ux-paths/flows.json` stub |
| `ux-paths validate [path]` | Validate a `flows.json` against the canonical JSON Schema |
| `ux-paths generate-mermaid [path]` | Emit the sibling `flows.mmd` (Mermaid) from the JSON |
| `ux-paths diff <a> <b>` | Diff two `flows.json` files (missing screens/actions — migration audits) |
| `ux-paths stamp [path]` | Stamp `app_version` (`YYYY-MM-DD-<git-sha>`) into `flows.json` |

```bash
npx @devfellowship/components ux-paths init
npx @devfellowship/components ux-paths validate .dfl-ux-paths/flows.json
```

---

## Repository structure

```
.
├── packages/
│   └── ui/                     # ← the published @devfellowship/components package
│       ├── src/
│       │   ├── components/     # UI components (atoms / molecules / organisms / templates)
│       │   ├── hooks/          # useToast, useAuth, useIsMobile, …
│       │   ├── providers/      # AuthProvider, FeatureFlagProvider
│       │   ├── utils/ · lib/   # cn, formatCurrency, formatDate
│       │   ├── styles/         # tokens.css, theme, shadcn bridge, tailwind preset
│       │   ├── stories/        # Storybook (one-state-per-story)
│       │   └── cli/            # dfl-components CLI (init, add, ux-paths, check-style-imports)
│       └── package.json        # published package manifest + `dfl-components` bin
├── src/                        # component-showcase micro-app (Vite/React, not published)
├── registry/                   # component registry served to the `add` CLI
├── scripts/                    # release + guard scripts
└── .github/workflows/          # CI, publish-npm, deploy-storybook, guards
```

`packages/ui` is a standalone package with its **own lockfile** (not an npm
workspace of the root). The root app is the local component showcase.

---

## Development

Requires **Node.js 20+**.

```bash
git clone https://github.com/devfellowship/dfl-components-cli.git
cd dfl-components-cli
npm install            # root showcase app deps
npm run dev            # Vite showcase on http://localhost:8080

# Work on the library itself:
cd packages/ui
npm install
npm run build          # tsup: library + CLI bundles
npm run storybook      # Storybook on :6006
npm test               # Vitest
```

### Releasing to npm

Publishing is **automated** via the `Publish @dfl/components to NPM` GitHub Actions
workflow ([`.github/workflows/publish-npm.yml`](.github/workflows/publish-npm.yml)) —
`workflow_dispatch` with a `version` input (`patch` | `minor` | `major` | explicit).
It computes the next version from the **live npm** latest, builds, `npm publish`es,
pushes the `v<version>` tag, and opens+admin-merges a source-bump PR back to `main`.
Prefer this workflow over a manual `npm publish`.

---

## License

Internal DevFellowship design system. No open-source license is currently declared
in the package manifest — treat as proprietary to DevFellowship unless stated otherwise.
