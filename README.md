# @devfellowship/components

The **DevFellowship design system** — React UI components, design tokens, a live
Storybook, and the `dfl-components` CLI (`ux-paths` app-flow mapping). Shipped as
a single published npm package. Components are consumed as **library imports**
(`import { Button } from "@devfellowship/components"`).

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
- **The `dfl-components` CLI** — map/validate each app's UX paths (`ux-paths`),
  folding the former `dfl-ux-paths` CLI into one bin. (Components themselves are
  used as library imports, not scaffolded.)
- **`FlowCanvas`** — a shared, auto-laid-out graph canvas behind its own
  `@devfellowship/components/canvas` entry. One canvas, N lenses: see
  [The canvas — one canvas, N lenses](#the-canvas--one-canvas-n-lenses).

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
`@supabase/supabase-js >=2`. Only if you use `FlowCanvas`:
`@xyflow/react >=12` and `@dagrejs/dagre >=3`.

---

## The canvas — one canvas, N lenses

`FlowCanvas` draws a directed graph of cards, laid out automatically. It is the
component a "map of screens" view is built from, and it is deliberately
**domain-free**.

```tsx
import { FlowCanvas } from "@devfellowship/components/canvas";
```

```css
/* Both sheets, in this order. The second overrides the first. */
@import "@xyflow/react/dist/style.css";
@import "@devfellowship/components/canvas.css";
```

### The split

| The canvas owns | The lens owns |
| --- | --- |
| Ranking and positioning (dagre), `LR` or `TB` | What a card **shows** — `renderCard` |
| Smoothstep edge routing, label chips, reciprocal-pair de-collision | What a click **does** — `onNodeClick` |
| The card frame, the caption, the handles | Optionally, the caption — `renderCaption` |
| MiniMap, Controls, Background, `fitView` | The mapping from its own data to nodes and edges |

The canvas reads only `id`, `title` and `subtitle`. Everything else travels in
`node.data`, which it **never inspects** — it only hands it back to the slots.

That is the whole design. A card can draw a low-fidelity wireframe, a captured
screenshot, a coverage figure or a diff badge, and the canvas cannot tell the
difference. So a new view is a new render function, not a new canvas.
**Duplicate the lens; never duplicate the canvas.**

### Minimal use

```tsx
<FlowCanvas
  nodes={screens.map((s) => ({ id: s.id, title: s.name, subtitle: s.route, data: s }))}
  edges={transitions.map((t) => ({ id: t.key, source: t.from, target: t.to, label: t.action }))}
  renderCard={(node) => <WireframePreview screen={node.data} />}
  onNodeClick={(node) => select(node.id)}
/>
```

Swap `renderCard` for `<img src={node.data.screenshot} />` and the same graph
becomes an observed-reality view. Nothing else changes.

### Why its own entry point

`@xyflow/react` and `@dagrejs/dagre` are **optional peer dependencies**, and
`FlowCanvas` is **not** re-exported from the main entry. A consumer that draws no
graph installs nothing new and bundles nothing new. `npm run check:canvas-isolated`
asserts that against the built bundles, and CI runs it as a hard gate.

### Test ids

Every id the canvas emits is prefixed by `testIdPrefix` (default `flow`):
`<prefix>-canvas`, `<prefix>-node`, `<prefix>-node-content`,
`<prefix>-node-caption`, `<prefix>-edge-label`. Each card also carries
`data-node-id`. Two canvases on one page get two prefixes.

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

### `/testing` — assertions that fail when emptiness proves nothing

Supabase RLS hides unauthorized rows as **HTTP 200 with an empty body**, not
`403`. So a gated page viewed by the shared level-0 smoke identity renders "no
results", and `expect(rows).toHaveCount(0)` passes **vacuously** — satisfied by
absence of permission rather than by the state under test. (Measured: the
spec-builder `/history` page showed "0 registros" while the table held 17 rows.)

PostgREST cannot tell "RLS hid it" from "genuinely empty" — this entry does not
pretend otherwise. It **names the ambiguity** and requires an *independent*
authorization signal before believing an empty result.

```ts
import {
  assertNotVacuouslyEmpty,
  iamMemberProbe,
  classifyEmptiness,
  VacuousVerificationError,
} from "@devfellowship/components/testing";

// Layer 2 — e2e adapter. Throws VacuousVerificationError instead of going green.
await assertNotVacuouslyEmpty(page, {
  surface: "spec-builder /history",
  countText: /^(\d+) registros?$/,             // capture group 1 = the count
  rowSelector: "[data-testid='spec-row']",      // …or count elements instead
  deniedSelector: '[data-testid="access-denied"]',
  viewerIsAuthorized: () => iamMemberProbe(supabase), // independent signal
});

// Layer 1 — pure decision, no I/O, unit-testable on its own.
classifyEmptiness({ rowCount: 0, deniedSignalPresent: false, viewerIsAuthorized: false });
// → { verdict: "vacuous", reason: "…indistinguishable from lack of access…" }
```

| Verdict | When | Meaning |
| --- | --- | --- |
| `populated` | rows > 0 | nothing to disambiguate |
| `denied` | empty **+** denied signal | the app failed loud — asserting emptiness is meaningful |
| `genuinely-empty` | empty, no denial, viewer **provably** authorized | the emptiness is real |
| `vacuous` | empty, no denial, authorization `false` or `'unknown'` | **throws** — the check proves nothing |

`iamMemberProbe()` calls the `get_my_iam_role()` RPC and resolves `level >= 50`;
an errored/empty RPC resolves `'unknown'`, **never** `true`. `'unknown'` is
treated exactly as harshly as `false`.

> **Zero runtime dependencies.** The entry duck-types the `Page` / `Locator` /
> `rpc` surfaces it needs (`PageLike`, `LocatorLike`, `SupabaseRpcClientLike`)
> rather than importing `@playwright/test` or `@supabase/supabase-js`, so it
> never lands in an app bundle and is testable with a plain object literal.

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

> **Note (v3.0.0):** the shadcn-style component **registry** and the `add` / `init`
> scaffolding commands were **removed**. Components are consumed as **library
> imports** (`import { Button } from "@devfellowship/components"`) — see [Usage](#usage)
> above. The CLI now exists purely for `ux-paths` (plus the `check-style-imports`
> guard).

### Top-level commands

| Command | Description |
| --- | --- |
| `ux-paths <cmd>` | Versioned, schema-validated per-app UX-path mapping (below) |
| `check-style-imports` | Guard against importing both `/styles` and `/shadcn` |

### `ux-paths` subcommands

Maps an app's screens/actions/flows into a versioned `.dfl-ux-paths/flows.json`.

The schema is authored in `devfellowship/dfl-ux-paths`, which is **private** as
of 2026-08-04 — that link resolves only for org members. You do not need access
to run these commands. The schema arrives as a **public npm package**,
[`@devfellowship/ux-paths-spec`](https://www.npmjs.com/package/@devfellowship/ux-paths-spec),
which `dfl-ux-paths` generates from its one canonical `schema/v1.json`. The
package has zero runtime dependencies and does no I/O, and `tsup.cli.config.ts`
inlines it into `dist/cli.js`, so `ux-paths validate` still works fully offline.

This package therefore holds **no copy of the schema**. It used to: a vendored
`src/cli/ux-paths/lib/v1.schema.json` that a comment asked a human to mirror "in
the same round". A promise is not a mechanism, and a stale copy fails silently —
`validate` keeps exiting 0 against a schema that no longer exists upstream. To
take a schema change, bump the `@devfellowship/ux-paths-spec` version. That is a
visible line in a diff, and Renovate raises it for you.

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
│       │   ├── testing/        # e2e assertion helpers (dependency-free)
│       │   ├── styles/         # tokens.css, theme, shadcn bridge, tailwind preset
│       │   ├── stories/        # Storybook (one-state-per-story)
│       │   └── cli/            # dfl-components CLI (ux-paths, check-style-imports)
│       └── package.json        # published package manifest + `dfl-components` bin
├── scripts/                    # release + guard scripts
└── .github/workflows/          # CI, publish-npm, deploy-storybook, guards
```

`packages/ui` is a standalone package with its **own lockfile** (not an npm
workspace of the root).

---

## Development

Requires **Node.js 20+**.

```bash
git clone https://github.com/devfellowship/dfl-components-cli.git
cd dfl-components-cli/packages/ui
npm install
npm run build          # tsup: library + CLI bundles
npm run storybook      # Storybook on :6006
npm test               # Vitest
```

### Releasing to npm — Changesets (automated, deterministic SemVer)

Releases are driven by **[Changesets](https://github.com/changesets/changesets)**.
The published version is a **pure function of the accumulated changeset files** — no
commit-message heuristics, no manual `npm publish`.

**Per PR that changes `packages/ui`:** add a changeset declaring the bump.

```bash
cd packages/ui
npx changeset            # pick patch | minor | major + write a one-line summary
git add .changeset && git commit -m "chore: changeset"
```

Semver intent:
- **patch** — bug fix, no API change
- **minor** — new backwards-compatible component/prop/export
- **major** — a breaking change (removed/renamed export, changed signature)

**On merge to `main`**, the [`Release`](.github/workflows/release.yml) workflow
(`changesets/action@v1`, `ubuntu-latest`) does one of two things:
1. If unreleased changesets exist → it opens/updates a **"Version Packages" PR** that
   bumps `packages/ui/package.json` + writes `CHANGELOG.md`.
2. When that **Version Packages PR is merged** → it builds `dist/` and runs
   `changeset publish` → `npm publish` + pushes the `v<version>` git tag.

So **publishing only ever happens by merging the Version Packages PR** — the single,
reviewable, irreversible step. A soft [`Changeset Check`](.github/workflows/changeset-check.yml)
job *warns* (non-blocking) on PRs touching `packages/ui/**` that lack a changeset.

> The old `workflow_dispatch` manual publish (`publish-npm.yml`) has been **retired** in
> favor of this flow to avoid two competing publish paths. The npm token is the existing
> `NPM_TOKEN` repo secret (consumed as `NODE_AUTH_TOKEN`).

---

## License

Internal DevFellowship design system. No open-source license is currently declared
in the package manifest — treat as proprietary to DevFellowship unless stated otherwise.
