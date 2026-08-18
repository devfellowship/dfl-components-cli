import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
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

export default defineConfig({
  // NOTE: entries are an explicit allow-list. Do NOT add any
  // design-playground module here — see the IGNORE GLOB comment above.
  entry: {
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
  },
  format: ['esm', 'cjs'],
  target: 'es2020',
  clean: true,
  dts: true,
  splitting: false,
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
    // Copy CSS files to dist
    mkdirSync('dist/styles', { recursive: true });
    copyFileSync('src/styles/theme.css', 'dist/styles/theme.css');
    copyFileSync('src/styles/theme-mappings.css', 'dist/styles/theme-mappings.css');
    copyFileSync('src/styles/shadcn.css', 'dist/styles/shadcn.css');
    copyFileSync('src/styles/tailwind.css', 'dist/styles/tailwind.css');
    copyFileSync('src/styles/tokens.css', 'dist/styles/tokens.css');
    copyFileSync('src/styles/fonts.css', 'dist/styles/fonts.css');
    // Canvas chrome skin — only meaningful on a page that renders <FlowCanvas>,
    // so it is a separate sheet rather than part of theme.css.
    copyFileSync('src/styles/canvas.css', 'dist/styles/canvas.css');
    console.log('CSS files copied to dist/styles/');
  },
});
