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
├── data/mockComponents.ts    # Component catalog (mock)
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
- Showcase app uses mock data — update `data/mockComponents.ts` to add demos

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
## Component Hub Maintenance

When adding or removing components from `src/components/ui/`:
1. Update `src/data/mockComponents.ts` with the new component entry
2. Re-generate `src/data/designSystemData.json` by running: `node scripts/generate-design-data.mjs`
3. Add a preview example if possible
4. Verify the component appears on components.devfellowship.com after deploy
<!-- END MANUAL:repo/local-notes -->
