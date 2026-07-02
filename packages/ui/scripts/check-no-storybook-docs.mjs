#!/usr/bin/env node
/**
 * check-no-storybook-docs.mjs
 *
 * CI guard: the Storybook at storybook.devfellowship.com must have ZERO
 * "Docs" pages. Tainan directive — Docs pages were removed and must NEVER
 * come back (see repo CLAUDE.md → "Storybook — NO Docs pages").
 *
 * In Storybook 9 the "Docs" surface comes from THREE sources; this guard
 * fails (exit 1) if ANY reappears:
 *
 *   1. The string `autodocs` anywhere under `.storybook/` or `src/` — that's
 *      the per-story docs tag (`tags: ["autodocs"]`) or an `autodocs` config.
 *   2. Any `*.mdx` file under `src/` — free-form Docs pages.
 *   3. `@storybook/addon-docs` listed in this package's package.json — the
 *      Storybook-9 docs addon (its predecessor `@storybook/addon-essentials`
 *      also bundled docs, so it's flagged too).
 *   4. `.storybook/main.ts` referencing `@storybook/addon-docs` (docs addon
 *      re-enabled) OR containing `autodocs` (autodocs re-enabled).
 *
 * Deterministic, dependency-free (Node built-ins only). Runs from packages/ui.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname, relative } from "node:path";

// packages/ui — this script lives in packages/ui/scripts/
const UI = dirname(dirname(fileURLToPath(import.meta.url)));
const SB = join(UI, ".storybook");
const SRC = join(UI, "src");
const PKG = join(UI, "package.json");

const IGNORE_DIRS = new Set(["node_modules", "storybook-static", "dist"]);
const errors = [];

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (IGNORE_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// ── Check 1: no `autodocs` anywhere under .storybook/ or src/ ────────────────
for (const root of [SB, SRC]) {
  for (const f of walk(root)) {
    if (!/\.(ts|tsx|js|jsx|mjs|cjs|json|mdx)$/.test(f)) continue;
    const src = readFileSync(f, "utf8");
    if (src.includes("autodocs")) {
      errors.push(
        `[autodocs] ${relative(UI, f)} contains "autodocs". ` +
          `Remove the docs tag / autodocs config — Docs pages are banned.`,
      );
    }
  }
}

// ── Check 2: no *.mdx docs files under src/ ──────────────────────────────────
for (const f of walk(SRC)) {
  if (f.endsWith(".mdx")) {
    errors.push(
      `[mdx-docs] ${relative(UI, f)} is an MDX Docs page. ` +
        `MDX docs are banned — delete it.`,
    );
  }
}

// ── Check 3: docs addon must not be a dependency ─────────────────────────────
if (existsSync(PKG)) {
  const pkg = JSON.parse(readFileSync(PKG, "utf8"));
  const deps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
    ...(pkg.peerDependencies || {}),
    ...(pkg.optionalDependencies || {}),
  };
  for (const banned of ["@storybook/addon-docs", "@storybook/addon-essentials"]) {
    if (banned in deps) {
      errors.push(
        `[docs-addon] package.json depends on "${banned}" — the Storybook ` +
          `docs addon must not be installed (it re-enables Docs pages).`,
      );
    }
  }
}

// ── Check 4: main.ts must not wire the docs addon or autodocs ────────────────
const mainTs = join(SB, "main.ts");
if (existsSync(mainTs)) {
  const src = readFileSync(mainTs, "utf8");
  if (src.includes("@storybook/addon-docs")) {
    errors.push(
      `[main-docs-addon] .storybook/main.ts references "@storybook/addon-docs" — ` +
        `the docs addon must stay OFF.`,
    );
  }
  if (src.includes("autodocs")) {
    errors.push(
      `[main-autodocs] .storybook/main.ts references "autodocs" — ` +
        `autodocs must stay disabled.`,
    );
  }
}

if (errors.length > 0) {
  console.error("❌ No-Storybook-Docs guard FAILED:\n");
  for (const e of errors) console.error("  • " + e);
  console.error(
    "\nstorybook.devfellowship.com must have ZERO Docs pages. Do not add " +
      "`tags: [\"autodocs\"]`, `.mdx` docs, `@storybook/addon-docs`, or an " +
      "`autodocs` config. See repo CLAUDE.md → 'Storybook — NO Docs pages'.",
  );
  process.exit(1);
}

console.log(
  "✅ No-Storybook-Docs guard passed — zero Docs pages (no autodocs, no mdx, no docs addon).",
);
