# Managed merge scaffold for dfl-components-cli/CLAUDE.md
# Human edits belong only inside MANUAL blocks.

<!-- BEGIN GENERATED:claude/base -->
<!-- render-meta: repo=dfl-components-cli; mode=merge; hash=94693dea164222f3fd6c73ef7d8df6d8e66bab56d91f4815e51b37332a636ada -->
# CLAUDE.md — dfl-components-cli

## Quick Context
Component Hub + CLI — browse, preview, and install shared DFL frontend components.
Two parts: (1) Vite React showcase app, (2) CLI tool (`packages/cli/`) for `npx dfl-components add`.
Uses a JSON registry pattern (like shadcn/ui CLI).

## Architecture
```
src/                          # Showcase web app
├── components/
│   ├── ComponentHubApp.tsx   # Main hub: grid browser + detail modal
│   ├── ComponentCard.tsx     # Card with preview + copy-to-clipboard
│   ├── ComponentDetailModal.tsx # Full preview + source code
│   ├── auth/                 # LoginPage, RegisterPage (placeholders)
│   ├── observability/        # OTel tracing
│   └── ui/                   # shadcn/ui primitives
├── data/registryComponents.ts # Component catalog (auto-generated from registry/)
├── types/component.ts        # Component type definition
packages/cli/                 # CLI tool
├── src/
│   ├── index.ts              # Entry point (Commander.js)
│   ├── commands/add.ts       # `add` command — install component from registry
│   ├── commands/init.ts      # `init` command — setup project config
│   ├── types/                # config.ts, registry.ts
│   └── utils/                # get-config, get-registry, resolve-alias, logger
├── tsup.config.ts            # CLI build config
registry/                     # JSON component registry
├── registry.json             # Master index
├── components/               # button.json, card.json, input.json
├── hooks/                    # use-hybrid-auth.json
├── providers/                # auth-provider, feature-flag-provider, observability-provider
└── pages/                    # auth-pages.json
```

## How to Work Here
- `npm run dev` — showcase app (Vite)
- CLI: `cd packages/cli && npm run build` (tsup)
- Registry JSON files define components with: name, type, files, dependencies
- CLI reads registry.json, resolves aliases, copies files into target project
- Showcase app reads from registry — data auto-generated from `registry/` JSON files via `src/data/registryComponents.ts`

## Contracts
- **Registry format**: `{ name, type, files: [{ path, content }], dependencies }` per component
- **CLI config**: `dfl-components.json` in target project (aliases, paths, style)
- **Component types**: UI, Hooks, Providers, Pages
- **CLI commands**: `init` (create config), `add <component>` (install from registry)

## Ecosystem Context
- Provides shared components to ALL DFL apps
- Registry includes: auth-provider, observability-provider, feature-flag-provider
- Pattern inspired by shadcn/ui CLI
- Consumers: dfl-learn, dfl-tracks, dfl-dbms, dfl-ventures, etc.

## Rules
- Don't touch `src/components/ui/` — shadcn/ui managed
- New shared components: add to `registry/` + update `registry.json`
- CLI must remain zero-dependency-at-runtime (bundle with tsup)
- Test CLI commands manually: `npx tsx packages/cli/src/index.ts add button`
<!-- END GENERATED:claude/base -->

<!-- BEGIN MANUAL:repo/local-notes -->
## Adding a New Component or Hook

When adding a new component or hook to @dfl/components:

1. **Add the component source** — create `registry/components/<name>.json` (or `hooks/`, `providers/`, `pages/`) following the existing JSON schema: `{ name, type, title, description, category, version, tags, dependencies, registryDependencies, files: [{ path, content }] }`
2. **Update the registry index** — add an entry to `registry/registry.json` items array with: name, type, title, description, category, version, registryDependencies, dependencies
3. **Update the Component Hub data** — re-generate `src/data/designSystemData.json` by running: `node scripts/generate-design-data.mjs`
4. **Verify the Component Hub** — `npm run dev` and confirm the new component appears on the hub listing AND detail page
5. **Verify after deploy** — confirm it appears on components.devfellowship.com
6. **If it doesn't appear** — check that the individual JSON file, the registry.json entry, AND the designSystemData.json all include the component

## Storybook: atomic hierarchy + one-state-per-story

The Storybook stories in `packages/ui/src/stories/*.tsx` are organized into an
**atomic hierarchy** with a strict **one-state-per-story** convention. There are
two top-level sections and they mean very different things:

### `Components/{Atoms,Molecules,Organisms}/<Name>` — the REAL exported library

- These are the **actual `@devfellowship/components` library** components,
  **distributed via the registry (`registry/registry.json`) and the
  `dfl-components add <name>` CLI**. What you see in this section ships to
  consumers.
- **Tier map** (which component is Atom vs Molecule vs Organism):
  - **Atoms** — smallest primitives: Button, IconButton, Badge, Kbd, Input,
    Textarea, Label, Checkbox, Switch, RadioGroup, Slider, Toggle, Avatar,
    Progress, Skeleton, Separator, AspectRatio, Alert, ScrollArea, Toaster, Sonner.
  - **Molecules** — small compositions: Card, Accordion, Tabs, Breadcrumb,
    Pagination, Tooltip, HoverCard, Popover, Collapsible, ToggleGroup, InputOTP,
    Select, PasswordInput, UserAvatar.
  - **Organisms** — larger/assembled: Dialog, AlertDialog, Drawer, Sheet,
    DropdownMenu, ContextMenu, Menubar, NavigationMenu, Command, Table, Form,
    Calendar, Carousel, Chart, Sidebar, Resizable, Toast, AppNavbar, AppSidebar,
    Gantt, PublishDrawer, ConfirmDialog, LoginPage, LoginScreen, UserMenu.
- **Title convention (ENFORCE):** every story's Meta `title` is
  `Components/<Tier>/<Name>` — e.g. `Components/Atoms/Button`,
  `Components/Molecules/Card`, `Components/Organisms/Dialog`.

### `DesignPlayground/<Experiment>` — experimentation SANDBOX (NOT exported)

- Lives in `packages/ui/src/design-playground/` (e.g.
  `DesignPlayground/ButtonLab`, `DesignPlayground/ThemeTokens`). It shows up in
  Storybook but is **NEVER exported** — not from `src/index.ts`, not in
  `registry/registry.json`, not via the CLI.
- It **shares the same theme / CSS / design tokens** as production (playground
  stories import the real components + real `src/styles/*` tokens) — the only
  difference is distribution.
- **Enforced by CI:** `scripts/check-no-playground-export.mjs`
  (workflow `.github/workflows/guard-playground-export.yml`, plus
  `npm run guard:playground`) **fails the build** if any `design-playground`
  module leaks into the public export surface, the registry manifest, or the
  tsup build entries — and if any non-story/non-README module is added under
  `src/design-playground/`.

### `Templates/<Name>` — page-level compositions of Components

- Lives in `packages/ui/src/stories/templates/*.stories.tsx` (auto-discovered by
  the existing `../src/**/*.stories.*` glob). Each file is a **DEMONSTRATION**
  that COMPOSES the real exported `@devfellowship/components` organisms/molecules
  (AppNavbar, AppSidebar, Table, Card, Badge, Button, Select, Input, Skeleton,
  Chart, Pagination, …) into a page-level archetype with realistic mock data.
- **These are NOT new exported components** — no `src/index.ts` entry, no
  registry, no CLI. They only show how to assemble a page from primitives, and
  share the same theme / CSS / tokens as production.
- **Title convention:** `Templates/<Name>`. Current tracks: **AppShell**
  (AppSidebar + AppNavbar + `<main>`), **ListPage** (PageHeader + FilterBar +
  sortable Table + Pagination; `WithData`/`Loading`/`Empty`), **Dashboard**
  (StatCard grid + Chart + recent-activity), **Kanban** (columns with count
  Badges + static "draggable" Cards — no dnd lib added).
- **One primary story per template** (a template is a page composition, so it
  gets a `Default`/`WithData` plus a small number of meaningful states — e.g.
  AppShell `Default`/`Collapsed`, ListPage `WithData`/`Loading`/`Empty`). **No
  giant gallery mixing all 4** — each template is its own `*.stories.tsx` file.

### Pods graduation flow (experiment → promote to Components)

1. **Experiment** in `DesignPlayground/<Experiment>` — iterate on new
   treatments/variants freely.
2. **Promote** the winner into the real library: add the variant/props to the
   component's `class-variance-authority` config in `src/components/<name>.tsx`,
   add one-state-per-story exports under `Components/{Atoms,Molecules,Organisms}/<Name>`,
   and (if new) register it in `registry/registry.json` for CLI distribution.
3. **Trim** the playground experiment once it has graduated.

### One-state-per-story rule (NON-NEGOTIABLE)

- **EACH story export = EXACTLY ONE state/variant.** No galleries.
- **Do NOT author `AllVariants` / `Showcase` / grid-of-everything stories.** If a
  render-based gallery exists, **SPLIT it into individual named `StoryObj`
  exports (one per state)** and delete the gallery.
- Keep `argTypes.options` in sync with the component's real `cva` config (a
  drifted control is a bug — e.g. Button's real variants are
  `primary|secondary|outline|ghost|destructive|success|link` and sizes are
  `sm|default|lg|icon|icon-sm|icon-lg`).
- Reference for the desired per-component scenarios/states style:
  `https://components.devfellowship.com/components`.
<!-- END MANUAL:repo/local-notes -->
