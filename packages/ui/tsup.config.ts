import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'fs';
import { join, relative } from 'path';
// The UX Paths `data-source` stamp. Off unless UX_PATHS_SOURCE_STAMP is set in
// the process environment. See scripts/source-stamp.mjs for the whole rationale.
import { sourceStampEsbuildPlugin } from './scripts/source-stamp.mjs';

// Build ignore-glob — the DesignPlayground sandbox is NEVER bundled/exported.
//   IGNORE GLOB: src/design-playground/**
// That folder is a Storybook-only experimentation surface; it is intentionally
// excluded from every tsup `entry` below (the entry map is an explicit
// allow-list) and is enforced by the CI guard
// scripts/check-no-playground-export.mjs
// (workflow .github/workflows/guard-playground-export.yml).

// ═════════════════════════════════════════════════════════════════════════
// TREE-SHAKING — one output module per source module
// ═════════════════════════════════════════════════════════════════════════
// esbuild puts every module that ONE entry reaches into that entry's file. So
// `dist/index.js` was a single 400 KB file with every component in it. Each
// component is a top-level `React.forwardRef(...)` call plus a
// `X.displayName = "X"` assignment. A bundler cannot prove that these
// statements have no side effects, so a consumer that imports only `Button`
// kept EVERY component, and with them vaul, react-day-picker, cmdk,
// embla-carousel, react-resizable-panels and date-fns. On itera-player's
// /login that was 99 KB gzip of dead code (plan 20261003-itera-player-mobile,
// W4-CUT-A).
//
// `"sideEffects": ["**/*.css"]` in package.json lets a bundler drop a whole
// FILE that nothing uses. It cannot drop a statement inside a file that is
// used. The fix is to give the bundler files: every library module below is
// also an entry (under `dist/_m/`). With `splitting: true`, esbuild then emits
// each module as its own chunk, and `dist/index.js` becomes a list of
// re-exports from those chunks. A consumer bundle keeps only the chunks it
// imports. `dist/_m/` itself is deleted after the build (nothing imports an
// entry file; `scripts/check-esm-treeshake.mjs` asserts that and the result).
//
// The folders are an allow-list: the canvas, testing and CLI entries keep
// their own graphs, and design-playground is never an entry (see above).
const MODULE_ROOTS = ['src/components', 'src/hooks', 'src/lib', 'src/providers', 'src/utils'];
const MODULES_DIR = '_m';

function libraryModules(publicFiles: Set<string>): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) {
        if (!name.startsWith('__')) walk(p); // __tests__, __fixtures__
        continue;
      }
      if (!/\.tsx?$/.test(name) || /\.d\.ts$/.test(name)) continue;
      if (/\.(test|spec|stories)\.tsx?$/.test(name)) continue;
      if (publicFiles.has(p)) continue;
      out[join(MODULES_DIR, relative('src', p).replace(/\.tsx?$/, ''))] = p;
    }
  };
  MODULE_ROOTS.forEach(walk);
  return out;
}

// NOTE: entries are an explicit allow-list. Do NOT add any
// design-playground module here — see the IGNORE GLOB comment above.
const PUBLIC_ENTRIES: Record<string, string> = {
    index: 'src/index.ts',
    hooks: 'src/hooks/index.ts',
    utils: 'src/utils/index.ts',
    providers: 'src/providers/index.ts',
    // e2e assertion helpers. Deliberately dependency-free (no @playwright/test,
    // no @supabase/supabase-js) — it duck-types the Page/Locator/rpc surfaces
    // it needs, so importing it never drags a test runner into an app bundle.
    testing: 'src/testing/index.ts',
    // <FlowCanvas>. Its OWN entry, never re-exported from src/index.ts, because
    // it imports @xyflow/react and @dagrejs/dagre. Folding it into the main
    // bundle would make two optional peer dependencies mandatory for every
    // consumer of the design system, including the ones that draw no graph.
    canvas: 'src/canvas/index.ts',
    // The Decision Card chart limits: no import, so a service reads them without React.
    'chart-limits': 'src/components/organisms/decision-card/chart-limits.ts',
};

export default defineConfig({
  entry: { ...PUBLIC_ENTRIES, ...libraryModules(new Set(Object.values(PUBLIC_ENTRIES))) },
  format: ['esm', 'cjs'],
  target: 'es2020',
  clean: true,
  // Types for the public entries only; the `_m/` entries are a build device.
  dts: { entry: PUBLIC_ENTRIES },
  // One shared chunk per module that two entries import. With `false`, a module
  // reachable from several entries was INLINED into each, so module-level state
  // (use-toast listeners, AuthContext, FeatureFlag context) existed once per
  // entry: `toast()` from `/hooks` reached no `<Toaster>` of the root entry.
  // Guarded by src/__tests__/entry-shared-state.test.tsx.
  splitting: true,
  sourcemap: false,
  // @xyflow/react and @dagrejs/dagre are OPTIONAL PEERS of the canvas entry —
  // externalising them keeps them out of the bundle and out of every consumer
  // that never imports `@devfellowship/components/canvas`.
  external: ['react', 'react-dom', 'tailwindcss', '@xyflow/react', '@dagrejs/dagre'],
  // ═════════════════════════════════════════════════════════════════════════
  // 🚨 THE UX PATHS CAPTURE STAMP — ABSENT FROM EVERY RELEASE BUILD
  // ═════════════════════════════════════════════════════════════════════════
  // `sourceStampEsbuildPlugin()` writes data-source="packages/ui/src/…tsx:<line>"
  // onto every host element this package renders, which is what lets a click on
  // a screenshot region resolve to a DESIGN SYSTEM file instead of to whatever
  // application file mounted the component.
  //
  // It returns `undefined` unless UX_PATHS_SOURCE_STAMP is set in the process
  // environment — never a .env file, never the bundler mode. esbuild rejects
  // `undefined` inside its plugin array (Vite accepts it), so the filter below
  // is wiring and not a second gate.
  //
  // A stamped artifact must NEVER be published to npm. It is dead payload on
  // every element of every screen of every consuming app, and it publishes an
  // internal file layout into the DOM. The stamped build is distributed as a
  // GitHub Release ASSET instead — see .github/workflows/capture-build.yml and
  // the "Capture builds" section of README.md. CI proves the default over the
  // BUILT ARTIFACT in both directions (guard-ux-paths-stamp.yml), because a
  // grep for a normally-absent string passes for free.
  esbuildPlugins: [sourceStampEsbuildPlugin()].filter(Boolean) as NonNullable<
    ReturnType<typeof sourceStampEsbuildPlugin>
  >[],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  async onSuccess() {
    // The `_m/` entry files only exist to make esbuild split per module (see
    // TREE-SHAKING above). Every output imports the chunks, never an entry
    // file; refuse to delete them if that ever stops being true.
    const users = readdirSync('dist').filter(
      (f) => /\.c?js$/.test(f) && readFileSync(join('dist', f), 'utf8').includes(`/${MODULES_DIR}/`),
    );
    if (users.length) throw new Error(`dist files import ${MODULES_DIR}/ entries: ${users.join(', ')}`);
    rmSync(join('dist', MODULES_DIR), { recursive: true, force: true });

    // Copy CSS files to dist
    mkdirSync('dist/styles', { recursive: true });
    copyFileSync('src/styles/theme.css', 'dist/styles/theme.css');
    copyFileSync('src/styles/theme-mappings.css', 'dist/styles/theme-mappings.css');
    copyFileSync('src/styles/shadcn.css', 'dist/styles/shadcn.css');
    copyFileSync('src/styles/tailwind.css', 'dist/styles/tailwind.css');
    copyFileSync('src/styles/tokens.css', 'dist/styles/tokens.css');
    // Opt-in generated mirror of the published brand DS v2 (scripts/sync-brand-tokens.mjs).
    copyFileSync('src/styles/tokens.v2.css', 'dist/styles/tokens.v2.css');
    copyFileSync('src/styles/fonts.css', 'dist/styles/fonts.css');
    // Canvas chrome skin — only meaningful on a page that renders <FlowCanvas>,
    // so it is a separate sheet rather than part of theme.css.
    copyFileSync('src/styles/canvas.css', 'dist/styles/canvas.css');
    // DecisionCard skin — only meaningful on a page that renders <DecisionCard>
    // (or its strip and marks), so it is a separate opt-in sheet like canvas.css.
    copyFileSync('src/styles/decision-card.css', 'dist/styles/decision-card.css');
    console.log('CSS files copied to dist/styles/');

    // Brand icons — the fleet's single favicon source. Apps install them with
    // `npx dfl-components favicon`, which reads this directory out of the
    // installed package; they are also reachable as `…/components/brand/*`
    // subpath exports. Keep in sync with FAVICON_ASSETS in
    // src/cli/favicon/patch-html.ts.
    mkdirSync('dist/brand', { recursive: true });
    for (const asset of [
      'favicon.svg',
      'favicon.ico',
      'apple-touch-icon.png',
      'icon-192.png',
      'icon-512.png',
    ]) {
      copyFileSync(`src/brand/${asset}`, `dist/brand/${asset}`);
    }
    console.log('Brand icons copied to dist/brand/');
  },
});
