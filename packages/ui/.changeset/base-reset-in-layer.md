---
"@devfellowship/components": patch
---

fix(styles): put the base resets of `theme.css` inside `@layer base`, so Tailwind v4 utilities win over them.

`theme.css` (`@devfellowship/components/styles`) shipped `*, *::before, *::after { border-color: var(--s-border-subtle) }`, plus `html` and `body` rules, outside any cascade layer. An unlayered rule beats every layered rule, whatever its specificity, and Tailwind v4 utilities are in `@layer utilities`. So `border-transparent`, `border-input` and the ghost Button variant still drew a 1px border in every consumer app (found on the dfl-financing refactor-ui preview: every ghost button and row menu had a border).

The resets now sit in `@layer base`. Their values do not change. A consumer's own `html`/`body` style or utility (`bg-*`, `font-*`) now wins over them as it should.

New test `src/__tests__/styles-layers.test.ts` fails when a shipped stylesheet has a universal or element-level rule outside a layer. `tokens.v2.css` is a generated mirror of the brand site and still has an unlayered base block. The test pins that block as a known gap, so a new unlayered rule fails; the fix belongs in the brand record.
