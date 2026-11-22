import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  LAYER_CLOSE,
  LAYER_OPEN,
  closeOf,
  layerBaseRules,
  maskComments,
  unlayeredElementSelectors,
} from "../../scripts/layer-base-rules.mjs";

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
 *
 * The scanner and the wrapper live in `scripts/layer-base-rules.mjs`, because
 * `tsup.config.ts` applies the wrapper to the generated `tokens.v2.css` mirror.
 */

const here = dirname(fileURLToPath(import.meta.url));
const stylesDir = resolve(here, "../styles");
// Built copies (tsup writes them). Checked when a build exists; CI builds first.
const distStylesDir = resolve(here, "../../dist/styles");

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

describe("layerBaseRules (the build step for the generated mirror)", () => {
  const sample = `/* a comment { with a brace */
:root { --a: 1; }
button { border: none; background: transparent; }
.mono { font-family: x; }
@media (pointer: coarse) {
  input, select { font-size: 16px; }
}
@keyframes k { from { opacity: 0 } to { opacity: 1 } }
:where(button, a):focus-visible { outline: 2px solid red; }
`;

  it("wraps each element-level rule and leaves the others where they are", () => {
    const out = layerBaseRules(sample);
    expect(out).toContain(`${LAYER_OPEN}button { border: none; background: transparent; }${LAYER_CLOSE}`);
    expect(out).toContain(`${LAYER_OPEN}@media (pointer: coarse) {\n  input, select { font-size: 16px; }\n}${LAYER_CLOSE}`);
    expect(out).toContain(`${LAYER_OPEN}:where(button, a):focus-visible { outline: 2px solid red; }${LAYER_CLOSE}`);
    // Scoped rules, keyframes and comments stay unlayered, in their place.
    expect(out.startsWith("/* a comment { with a brace */\n:root { --a: 1; }\n@layer base {\nbutton")).toBe(true);
    expect(out).toContain(`${LAYER_CLOSE}\n.mono { font-family: x; }\n@layer base {\n@media`);
    expect(out).toContain(`${LAYER_CLOSE}\n@keyframes k { from { opacity: 0 } to { opacity: 1 } }\n`);
    expect(unlayeredElementSelectors(out)).toEqual([]);
  });

  it("changes nothing but the wrapper text (values, order and comments survive)", () => {
    // Remove each wrapper by brace matching ("\n}" also ends ordinary blocks).
    let text = layerBaseRules(sample);
    let at = text.indexOf(LAYER_OPEN);
    while (at !== -1) {
      const open = at + LAYER_OPEN.indexOf("{");
      const close = closeOf(maskComments(text), open);
      text = text.slice(0, at) + text.slice(at + LAYER_OPEN.length, close - LAYER_CLOSE.length + 1) + text.slice(close + 1);
      at = text.indexOf(LAYER_OPEN);
    }
    expect(text).toBe(sample);
  });

  it("is idempotent", () => {
    const once = layerBaseRules(sample);
    expect(layerBaseRules(once)).toBe(once);
  });

  it("returns a stylesheet with no element rule unchanged", () => {
    const css = ":root { --a: 1 }\n.btn { color: red }\n";
    expect(layerBaseRules(css)).toBe(css);
  });

  it("refuses an @media that mixes element rules with class rules", () => {
    expect(() => layerBaseRules("@media print { button { color: red } .x { color: blue } }")).toThrow(
      /mixes element selectors/,
    );
  });

  it("keeps the braces balanced", () => {
    const out = layerBaseRules(sample);
    expect(closeOf(maskComments(`{${out}}`), 0)).toBe(out.length + 1);
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
// sync-brand-tokens.mjs; CI compares it with brand.lock.json), so its source
// cannot be edited here. Its base block is unlayered upstream. The package
// build wraps it in `@layer base` (tsup.config.ts), and `dist/styles/
// tokens.v2.css` is the file a consumer imports. The list below pins the
// SOURCE exactly, so a NEW unlayered rule upstream still fails this test.
const GENERATED_MIRROR_UNLAYERED_IN_SOURCE: Record<string, string[]> = {
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
  for (const file of SHIPPED) {
    it(`src/styles/${file}`, () => {
      expect(unlayeredElementSelectors(readFileSync(resolve(stylesDir, file), "utf8"))).toEqual([]);
    });
  }

  for (const [file, known] of Object.entries(GENERATED_MIRROR_UNLAYERED_IN_SOURCE)) {
    it(`src/styles/${file} has no NEW unlayered element rule (generated mirror, wrapped at build)`, () => {
      expect(unlayeredElementSelectors(readFileSync(resolve(stylesDir, file), "utf8"))).toEqual(known);
    });

    it(`the build step layers every element rule of src/styles/${file}`, () => {
      const wrapped = layerBaseRules(readFileSync(resolve(stylesDir, file), "utf8"));
      expect(unlayeredElementSelectors(wrapped)).toEqual([]);
      // The brand rule that drew a border on every ghost button.
      expect(wrapped).toContain(`${LAYER_OPEN}button { border: none; background: transparent; cursor: pointer; }${LAYER_CLOSE}`);
    });
  }

  if (existsSync(distStylesDir)) {
    for (const file of SHIPPED) {
      it(`dist/styles/${file}`, () => {
        expect(unlayeredElementSelectors(readFileSync(resolve(distStylesDir, file), "utf8"))).toEqual([]);
      });
    }

    for (const file of Object.keys(GENERATED_MIRROR_UNLAYERED_IN_SOURCE)) {
      it(`dist/styles/${file} is the source with every element rule in @layer base`, () => {
        const dist = readFileSync(resolve(distStylesDir, file), "utf8");
        expect(unlayeredElementSelectors(dist)).toEqual([]);
        expect(dist).toBe(layerBaseRules(readFileSync(resolve(stylesDir, file), "utf8")));
      });
    }
  }

  it("theme.css wraps the universal border-color reset in @layer base", () => {
    const css = maskComments(readFileSync(resolve(stylesDir, "theme.css"), "utf8"));
    const layer = css.indexOf("@layer base");
    expect(layer).toBeGreaterThanOrEqual(0);
    const open = css.indexOf("{", layer);
    const block = css.slice(open, closeOf(css, open));
    expect(block).toMatch(/\*\s*,\s*\*::before\s*,\s*\*::after\s*\{[^}]*border-color/);
  });

  it("every shipped stylesheet is on the list (a new file must be classified)", () => {
    const onDisk = readdirSync(stylesDir).filter((f) => f.endsWith(".css")).sort();
    const listed = [...SHIPPED, ...Object.keys(GENERATED_MIRROR_UNLAYERED_IN_SOURCE)].sort();
    expect(onDisk).toEqual(listed);
  });
});
