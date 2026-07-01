# Managed merge scaffold for dfl-components-cli/AGENTS.md
# Human edits belong only inside MANUAL blocks.

<!-- BEGIN GENERATED:agents/base -->
<!-- render-meta: repo=dfl-components-cli; mode=merge; hash=645b65308d03d83b5b42df25de4d9b52490ed850466909dfbcde2c08ade038d3 -->
# AGENTS.md — Rules for AI Agents in dfl-components-cli

> Read this before touching anything. Non-negotiable.

## Operating Principles

1. **Explore before you act** — Read CLAUDE.md and repo-contract.yaml first
2. **Small atomic commits** — One logical change per commit. `feat:`, `fix:`, `refactor:`, `docs:`
3. **Test your changes** — `npm run build` + `npm run lint` + `npx tsc --noEmit` must pass
4. **Update docs** — Changed API/contract? Update CLAUDE.md and repo-contract.yaml
5. **Leave breadcrumbs** — Non-obvious decisions get code comments explaining WHY
6. **Validate boundaries** — Check repo-contract.yaml before adding cross-repo deps
7. **Progressive disclosure** — Simplest solution that works. Readable > clever.

## DFL-Specific Rules

- **ALL schema changes go through `dfl-schema`** — never write migrations here
- Every env var documented in repo-contract.yaml + .env.example
- Origin tracking: `// Origin: agent` for AI-generated code
- Check `dfl-hq` for ecosystem ADRs before proposing changes

## Forbidden Actions

1. No production environment variable changes
2. No self-merge without review *(exception: transformation weekend if authorized)*
3. No seed data deletion without migration
4. No undocumented cross-repo dependencies
5. No direct database writes — use Supabase client
6. No secrets in code

## When Stuck

1. Re-read CLAUDE.md
2. Check dfl-hq for ADRs
3. Look at similar DFL repos
4. If still stuck, say so clearly — don't guess and ship
<!-- END GENERATED:agents/base -->

<!-- BEGIN MANUAL:repo/agent-notes -->

## Storybook: atomic hierarchy + one-state-per-story

Stories live in `packages/ui/src/stories/*.tsx`. Two top-level sections, very
different meanings (full detail in `CLAUDE.md` → "Storybook: atomic hierarchy"):

- **`Components/{Atoms,Molecules,Organisms}/<Name>`** = the REAL exported
  `@devfellowship/components` library — distributed via `registry/registry.json`
  and the `dfl-components add <name>` CLI. Titles MUST be `Components/<Tier>/<Name>`
  per the tier map in CLAUDE.md.
- **`DesignPlayground/<Experiment>`** (`packages/ui/src/design-playground/`) = an
  experimentation SANDBOX. Shows in Storybook but is **NEVER exported** (not from
  `src/index.ts`, not in the registry, not via the CLI). Shares the same
  theme/CSS/tokens as production. Enforced by CI:
  `scripts/check-no-playground-export.mjs` /
  `.github/workflows/guard-playground-export.yml` (`npm run guard:playground`)
  fails the build on any playground export leak or any non-story/non-README
  module under `src/design-playground/`.
- **`Templates/<Name>`** (`packages/ui/src/stories/templates/*.stories.tsx`) =
  page-level DEMONSTRATIONS that COMPOSE the real exported organisms/molecules
  (AppNavbar, AppSidebar, Table, Card, Badge, Button, Select, Input, Skeleton,
  Chart, Pagination, …) into page archetypes with mock data — **NOT new exported
  components** (no index/registry/CLI). Titles are `Templates/<Name>`. Current:
  AppShell, ListPage, Dashboard, Kanban. One primary story per template (plus a
  few meaningful states); each template is its own file — no all-in-one gallery.

**One-state-per-story (NON-NEGOTIABLE):** each story export = EXACTLY ONE
state/variant. No galleries — never author `AllVariants`/`Showcase`; split any
render-based gallery into individual named `StoryObj` exports. Keep
`argTypes.options` in sync with the component's real `cva`.

**Pods graduation:** experiment in `DesignPlayground/` → promote the winner into
`src/components/<name>.tsx` cva + `Components/{...}/<Name>` stories + the registry.

<!-- END MANUAL:repo/agent-notes -->
