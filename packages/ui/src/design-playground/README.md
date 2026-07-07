# DesignPlayground — experimentation sandbox (NOT exported)

This folder is a **sandbox** for design experiments. Everything here shows up in
Storybook under the top-level **`DesignPlayground/`** section, but **none of it is
part of the published `@devfellowship/components` library** — it is never exported
from `src/index.ts`.

## Rules

- **One state per story** — same convention as the real `Components/` stories.
- **Only `*.stories.tsx` files live here.** Do NOT create shippable component
  modules in this folder. If an experiment needs a helper, inline it in the story.
- **Same theme / CSS / tokens as production.** Playground stories import the real
  components and consume the real design tokens (`src/styles/*`), so what you see
  is faithful — the only difference is distribution.
- **Never import a `design-playground` module from `src/index.ts`, a component,
  a hook, or a provider.** The CI guard
  (`scripts/check-no-playground-export.mjs`, workflow
  `.github/workflows/guard-playground-export.yml`) fails the build if anything
  under `src/design-playground/**` is referenced by the public export surface.

## Pods graduation flow (experiment → promote)

1. **Experiment** here (`DesignPlayground/<Experiment>`), iterating on new
   treatments/variants freely.
2. When a treatment is validated, **promote** it into the real library:
   - add the variant/props to the component's `class-variance-authority` config
     in `src/components/<name>.tsx`,
   - add one-state-per-story exports under `Components/{Atoms,Molecules,Organisms}/<Name>`,
   - (if it's a new component) export it from `src/index.ts` so library consumers
     can import it.
3. **Delete or trim** the corresponding playground experiment once it has
   graduated — the sandbox stays lean.

## Current experiments

- `ButtonLab` — prototyping button treatments not yet in the shared cva
  (e.g. the fleet's bespoke `rounded` / `toolbar` / `kanban` / `recording` flavours).
- `ThemeTokens` — eyeballing the shared surface tokens across the 3 themes.
