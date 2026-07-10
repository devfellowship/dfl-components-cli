# RETIRED — original `dfl-components` registry-CLI plan

> **Status: RETIRED (v3.0.0).**
>
> This file was the original implementation plan for a shadcn/ui-style component
> **registry** distributed via a `dfl-components add <component>` CLI (with an
> `init` command that scaffolded a `dfl-components.json` config).
>
> **That entire surface was removed in v3.0.0.** A fleet-wide audit found **zero
> consumers** (no `dfl-components.json` config files anywhere in the org). The
> `registry/` directory, the `add`/`init` commands, and their registry utils
> were deleted.
>
> Components are now consumed as **library imports** —
> `import { Button } from "@devfellowship/components"` — see the top-level
> `README.md`. The `dfl-components` CLI now exists purely for the `ux-paths`
> subcommand group (versioned per-app UX-path mapping) plus the
> `check-style-imports` guard.
>
> The original plan content is preserved in git history if needed.
