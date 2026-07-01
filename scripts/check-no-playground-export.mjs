#!/usr/bin/env node
/**
 * check-no-playground-export.mjs
 *
 * CI guard: a `DesignPlayground/` experiment can NEVER enter the exported
 * registry / npm package. The `packages/ui/src/design-playground/**` folder is a
 * pure Storybook sandbox — it must stay invisible to the library's public
 * export surface and to the shadcn registry.
 *
 * Fails (exit 1) if ANY of these hold:
 *   1. A non-story, non-README file exists under src/design-playground/
 *      (only `*.stories.tsx` + README.md are allowed — no shippable modules).
 *   2. Any public-surface source file (src/index.ts, or anything under
 *      src/{components,hooks,utils,providers}) imports from `design-playground`.
 *   3. registry/registry.json references `design-playground` anywhere.
 *   4. The tsup build entry config references `design-playground`.
 *
 * Deterministic, dependency-free (Node built-ins only). Runs from repo root.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const UI = join(ROOT, "packages", "ui");
const PLAYGROUND = join(UI, "src", "design-playground");
const PLAYGROUND_TOKEN = "design-playground";

const errors = [];

/**
 * Strip `//` line comments and block comments so a doc-comment that merely
 * MENTIONS the playground path (e.g. the ignore-glob docs in tsup.config.ts)
 * doesn't trip the guard. We only want to catch REAL code references.
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1"); // line comments (keep http:// etc.)
}

/** True if the stripped source actually imports/requires/wires the playground. */
function referencesPlayground(src) {
  const code = stripComments(src);
  // Any string literal that points at a design-playground path in an import/
  // require/dynamic-import/entry position. We match a quoted specifier that
  // contains the token — after comment-stripping, the only remaining mentions
  // are real code references (bare side-effect imports, `from '...'`,
  // `require('...')`, `import('...')`, or an entry-map value).
  return new RegExp(`['"\`][^'"\`]*${PLAYGROUND_TOKEN}[^'"\`]*['"\`]`).test(code);
}

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// ── Check 1: only stories + README live in the playground ────────────────────
if (existsSync(PLAYGROUND)) {
  for (const f of walk(PLAYGROUND)) {
    const base = f.split("/").pop();
    const allowed = base.endsWith(".stories.tsx") || base === "README.md";
    if (!allowed) {
      errors.push(
        `[shippable-module] ${relative(ROOT, f)} — only *.stories.tsx and README.md are allowed under design-playground/. ` +
          `Shippable modules here would risk leaking into the export surface.`,
      );
    }
  }
}

// ── Check 2: no public-surface source imports the playground ─────────────────
const publicRoots = [
  join(UI, "src", "index.ts"),
  join(UI, "src", "components"),
  join(UI, "src", "hooks"),
  join(UI, "src", "utils"),
  join(UI, "src", "providers"),
];

const publicFiles = [];
for (const r of publicRoots) {
  if (!existsSync(r)) continue;
  if (statSync(r).isDirectory()) publicFiles.push(...walk(r));
  else publicFiles.push(r);
}

for (const f of publicFiles) {
  if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  // catch any import/require/re-export that references the playground path
  if (referencesPlayground(src)) {
    errors.push(
      `[export-leak] ${relative(ROOT, f)} imports from "${PLAYGROUND_TOKEN}". ` +
        `Public-surface modules must never import from the design-playground sandbox.`,
    );
  }
}

// ── Check 3: the registry manifest must not reference the playground ─────────
const registryPath = join(ROOT, "registry", "registry.json");
if (existsSync(registryPath)) {
  const reg = readFileSync(registryPath, "utf8");
  if (reg.includes(PLAYGROUND_TOKEN)) {
    errors.push(
      `[registry-leak] registry/registry.json references "${PLAYGROUND_TOKEN}". ` +
        `Playground experiments must never be added to the distributable registry.`,
    );
  }
}

// ── Check 4: the tsup build entry config must not reference the playground ────
for (const cfg of ["tsup.config.ts", "tsup.cli.config.ts"]) {
  const p = join(UI, cfg);
  if (!existsSync(p)) continue;
  const src = readFileSync(p, "utf8");
  if (referencesPlayground(src)) {
    errors.push(
      `[build-entry-leak] packages/ui/${cfg} bundles a "${PLAYGROUND_TOKEN}" module. ` +
        `The bundler must not emit design-playground modules.`,
    );
  }
}

if (errors.length > 0) {
  console.error("❌ DesignPlayground export guard FAILED:\n");
  for (const e of errors) console.error("  • " + e);
  console.error(
    "\nDesignPlayground/ is a Storybook-only sandbox. Promote an experiment into " +
      "src/components + the registry before it can be exported (see " +
      "packages/ui/src/design-playground/README.md).",
  );
  process.exit(1);
}

console.log("✅ DesignPlayground export guard passed — no playground module leaks into the export surface or registry.");
