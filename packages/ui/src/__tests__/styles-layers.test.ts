import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Cascade-layer guard for the shipped stylesheets.
 *
 * Tailwind v4 utilities live in `@layer utilities`. ANY unlayered rule beats
 * every layered rule, whatever its specificity. A shipped `* { border-color }`
 * outside a layer therefore overrides `border-transparent`, `border-input` and
 * the ghost Button variant in every consumer app (dfl-financing refactor-ui
 * preview: every ghost button and row menu showed a 1px border).
 *
 * Rule: a top-level rule may be unlayered only when its selectors are scoped to
 * a DFL/own class, `:root`, or a `[data-*]` attribute. Element-level and
 * universal selectors (`*`, `html`, `body`, `button`, `::selection`, ...) must
 * sit inside `@layer base`.
 */

const here = dirname(fileURLToPath(import.meta.url));
const stylesDir = resolve(here, "../styles");
// Built copies (tsup copies the files verbatim). Checked when a build exists.
const distStylesDir = resolve(here, "../../dist/styles");

const SAFE_SELECTOR = /^(\.|:root\b|\[data-)/;
// At-rules whose body is plain rules that stay unlayered.
const TRANSPARENT_AT = /^@(media|container|supports|scope)\b/;

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Index of the `}` that closes the block opened at `open` (a `{`). */
function closeOf(css: string, open: number): number {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    const c = css[i];
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i;
  }
  throw new Error("unbalanced braces in stylesheet");
}

/** Split a selector list on top-level commas (not the ones inside `:where(...)`). */
function splitSelectorList(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) {
      out.push(list.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(list.slice(start).trim());
  return out.filter(Boolean);
}

/** Selectors of rules that sit outside every `@layer`, nested @media included. */
export function unlayeredElementSelectors(source: string): string[] {
  const css = stripComments(source);
  const found: string[] = [];

  const walk = (text: string): void => {
    let i = 0;
    while (i < text.length) {
      const open = text.indexOf("{", i);
      const semi = text.indexOf(";", i);
      // Statement without a block (`@import ...;`, `@layer a, b;`): skip it.
      if (semi !== -1 && (open === -1 || semi < open)) {
        i = semi + 1;
        continue;
      }
      if (open === -1) return;
      const prelude = text.slice(i, open).trim();
      const close = closeOf(text, open);
      const body = text.slice(open + 1, close);
      i = close + 1;

      if (prelude.startsWith("@")) {
        if (TRANSPARENT_AT.test(prelude)) walk(body);
        // @layer (safe), @keyframes, @font-face, @theme, @variant, @property: skip.
        continue;
      }
      for (const selector of splitSelectorList(prelude)) {
        if (selector && !SAFE_SELECTOR.test(selector)) found.push(selector);
      }
    }
  };

  walk(css);
  return found;
}

describe("unlayeredElementSelectors (the scanner itself)", () => {
  it("flags the old universal border reset", () => {
    expect(
      unlayeredElementSelectors("*, *::before, *::after { border-color: red; }"),
    ).toEqual(["*", "*::before", "*::after"]);
  });

  it("flags element rules inside an @media block", () => {
    expect(
      unlayeredElementSelectors("@media (min-width: 1px) { button { border: 0 } }"),
    ).toEqual(["button"]);
  });

  it("accepts the same rules inside @layer base", () => {
    expect(
      unlayeredElementSelectors(
        "@layer base { *, *::before { border-color: red; } html { color: red } }",
      ),
    ).toEqual([]);
  });

  it("accepts class, :root and data-attribute scopes, keyframes and imports", () => {
    expect(
      unlayeredElementSelectors(
        `@import './x.css'; @layer a, b;
         :root { --a: 1 } .btn:hover { color: red } [data-surface='x'] { color: red }
         @keyframes k { from { opacity: 0 } to { opacity: 1 } }
         @font-face { font-family: X; src: url(x.woff2) }`,
      ),
    ).toEqual([]);
  });
});

// Files imported by `@devfellowship/components/styles` and its siblings.
const SHIPPED = [
  "theme.css",
  "tokens.css",
  "theme-mappings.css",
  "fonts.css",
  "shadcn.css",
  "tailwind.css",
  "canvas.css",
  "decision-card.css",
];

// `tokens.v2.css` is a GENERATED mirror of the brand site (scripts/
// sync-brand-tokens.mjs; CI compares it with brand.lock.json), so it cannot be
// edited here. Its unlayered base block is a known gap that has to be fixed in
// the brand record. The list is exact: a NEW unlayered rule still fails.
const GENERATED_MIRROR_KNOWN_UNLAYERED: Record<string, string[]> = {
  "tokens.v2.css": [
    "html",
    "body",
    "*",
    "::selection",
    "::-webkit-scrollbar",
    "::-webkit-scrollbar-track",
    "::-webkit-scrollbar-thumb",
    "::-webkit-scrollbar-thumb:hover",
    "button",
    "input",
    "select",
    "textarea",
    "button",
    "input",
    "select",
    "textarea",
    ":where(button, a, input, textarea, select, [role=\"button\"]):focus-visible",
  ],
};

describe("shipped stylesheets keep element-level rules inside a cascade layer", () => {
  const dirs = [stylesDir, ...(existsSync(distStylesDir) ? [distStylesDir] : [])];

  for (const dir of dirs) {
    const label = dir === stylesDir ? "src/styles" : "dist/styles";

    for (const file of SHIPPED) {
      it(`${label}/${file}`, () => {
        expect(unlayeredElementSelectors(readFileSync(resolve(dir, file), "utf8"))).toEqual([]);
      });
    }

    for (const [file, known] of Object.entries(GENERATED_MIRROR_KNOWN_UNLAYERED)) {
      it(`${label}/${file} has no NEW unlayered element rule (known gap: generated mirror)`, () => {
        expect(unlayeredElementSelectors(readFileSync(resolve(dir, file), "utf8"))).toEqual(known);
      });
    }
  }

  it("theme.css wraps the universal border-color reset in @layer base", () => {
    const css = stripComments(readFileSync(resolve(stylesDir, "theme.css"), "utf8"));
    const layer = css.indexOf("@layer base");
    expect(layer).toBeGreaterThanOrEqual(0);
    const open = css.indexOf("{", layer);
    const block = css.slice(open, closeOf(css, open));
    expect(block).toMatch(/\*\s*,\s*\*::before\s*,\s*\*::after\s*\{[^}]*border-color/);
  });

  it("every shipped stylesheet is on the list (a new file must be classified)", () => {
    const onDisk = readdirSync(stylesDir).filter((f) => f.endsWith(".css")).sort();
    const listed = [...SHIPPED, ...Object.keys(GENERATED_MIRROR_KNOWN_UNLAYERED)].sort();
    expect(onDisk).toEqual(listed);
  });
});
