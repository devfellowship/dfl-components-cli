---
"@devfellowship/components": patch
---

fix(styles): ship `tokens.v2.css` with its element-level base rules inside `@layer base`, so Tailwind v4 utilities win over them.

3.17.2 did this for `theme.css`. The brand mirror `tokens.v2.css` (`@devfellowship/components/tokens.v2`) still shipped `button { border: none; background: transparent; cursor: pointer }`, `* { box-sizing }`, `html`, `body`, `::selection`, the scrollbar rules, the `input, select, textarea` font rules and the `:focus-visible` outline outside any cascade layer. An unlayered rule beats every layered rule, so on a `<button>` it overrode `border`, `border-input` and `bg-*` utilities in every app that opts into tokens.v2.

`src/styles/tokens.v2.css` stays byte-identical to the brand (CI still compares it with `brand.lock.json`). The build now writes `dist/styles/tokens.v2.css` through `scripts/layer-base-rules.mjs`, which wraps each element-level top-level rule in `@layer base { ... }` in place. Values and order do not change; class, `:root` and `[data-*]` rules stay unlayered. The wrapper refuses an `@media` block that mixes element rules with class rules.

`src/__tests__/styles-layers.test.ts` now also checks the built `dist/styles/tokens.v2.css`: it must equal the layered source and hold no unlayered element rule.
