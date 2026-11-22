# @devfellowship/components

DFL Design System — UI components, hooks, utils and providers.

## tokens.v2.css

`tokens.v2.css` is an opt-in, generated MIRROR of the published DFL brand design system v2
(`https://brand.devfellowship.com/design-system/dfl/v2/tokens.css`). Do not edit it by hand:
CI compares it with `brand.lock.json` and fails on any difference.

Opt in:

```css
@import "@devfellowship/components/tokens.v2";
```

Refresh after a new brand publish:

```bash
npm run sync:brand-tokens   # fetches the upstream, rewrites the file and the lock
npm run check:brand-tokens  # offline check + strict token lint
```

The package build writes the file that apps import (`dist/styles/tokens.v2.css`) through
`scripts/layer-base-rules.mjs`: the element-level base rules (`button`, `*`, `html`, `body`, ...) are
unlayered upstream, and an unlayered rule beats every Tailwind v4 utility, so the shipped copy has them
inside `@layer base`. The source file in `src/styles` stays byte-identical to the brand.

`tokens.css` (the hand-written token file, `@devfellowship/components/tokens`) is unchanged.
