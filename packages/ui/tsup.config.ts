import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

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
  },
  format: ['esm', 'cjs'],
  target: 'es2020',
  clean: true,
  dts: true,
  splitting: false,
  sourcemap: false,
  external: ['react', 'react-dom', 'tailwindcss'],
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
    console.log('CSS files copied to dist/styles/');
  },
});
