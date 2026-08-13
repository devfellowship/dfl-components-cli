import { defineConfig } from 'tsup';

/**
 * Dedicated build for the `dfl-components` CLI bin.
 *
 * The UX-Paths CLI (formerly the standalone `@devfellowship/components-cli`
 * package) was folded INTO `@devfellowship/components` so DFL apps only ever
 * depend on ONE published package. This config emits a single self-contained
 * Node executable at `dist/cli.js`, wired as the package `bin`:
 *
 *   npx @devfellowship/components ux-paths <init|validate|stamp|diff|generate-mermaid>
 *
 * Key choices:
 *  - CLI deps (commander, ajv, chalk, fs-extra, …) stay EXTERNAL (tsup default)
 *    and are declared as runtime `dependencies` of @devfellowship/components.
 *    Bundling them inline (`noExternal`) breaks at runtime because several use
 *    CommonJS `require()` of node builtins, which an ESM bundle can't satisfy
 *    ("Dynamic require of 'events' is not supported"). A `bin` carrying a few
 *    extra runtime deps does NOT change the library's import surface — React
 *    consumers still import from `dist/index.js`; they merely install a handful
 *    of small CJS deps alongside.
 *  - ONE exception to that rule: `@devfellowship/ux-paths-spec` is `noExternal`,
 *    so the v1 JSON Schema is INLINED into `dist/cli.js`. It is pure ESM with
 *    ZERO runtime dependencies, so none of the CJS-`require()` breakage above
 *    applies to it. Inlining is deliberate, not incidental: the schema used to
 *    be fetched from raw.githubusercontent at validate-time, and
 *    `scripts/check-cli-bundle-offline.mjs` asserts on the built artifact that
 *    the schema is present in it and that no network primitive is. Leaving the
 *    package external would satisfy neither half of that guard.
 *  - `dts: false` — a bin needs no type declarations.
 *  - ESM only + node shebang banner.
 *  - This runs as a SEPARATE tsup invocation from the library build so the
 *    library's `dts` generation never sees the CLI's Node-only code.
 */
export default defineConfig({
  entry: { cli: 'src/cli/index.ts' },
  // See the note above: the schema package, and only it, is bundled in.
  noExternal: ['@devfellowship/ux-paths-spec'],
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  clean: false, // the library build (tsup.config.ts) owns `clean`; run it first
  dts: false,
  splitting: false,
  sourcemap: false,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
