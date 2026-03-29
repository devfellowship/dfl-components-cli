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

## Post-Sprint Updates

> Added by dev-dfl agent — reflects post-sprint reality (CI, contracts, Infisical, agent context).

### Testing
- Test framework: **Vitest** is configured in this repo
- Run tests with `npm test` or `npx vitest` (or `npx jest` for Jest repos)
- Write tests alongside source files or in `__tests__/` directories

### CI / Continuous Integration
- CI runs **build + test + verify-docs** via the `dfl-ci` reusable workflow
- Workflow file: `.github/workflows/ci.yml` — uses `devfellowship/dfl-ci/.github/workflows/ci.yml@main`
- PRs must pass CI before merge

### Contracts
- `repo-contract.yaml` exists at repo root — defines the repo's role, ownership, and integration points
- Keep this file in sync when changing the repo's scope or dependencies

### Agent Context
- `AGENTS.md` — instructions for AI agents working in this repo
- `AGENT-PROGRESS.md` — tracks agent task progress and status
- Update these files when making significant architectural changes

### Secrets & Configuration (Infisical)
- Secrets are managed via **Infisical** at `infisical.devfellowship.com`
- Shared secrets path: `/shared/`
- Do NOT commit secrets to the repo — use Infisical for environment variables
- Check `repo-contract.yaml` for required environment variables
