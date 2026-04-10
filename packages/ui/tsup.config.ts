import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
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
    copyFileSync('src/styles/tailwind.css', 'dist/styles/tailwind.css');
    console.log('CSS files copied to dist/styles/');
  },
});
