import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FAVICON_ASSETS } from './patch-html.js';

/**
 * Locate the shipped brand icons.
 *
 * The bin runs as `dist/cli.js`, so the published location is `dist/brand/`
 * (tsup copies `src/brand/` there — see tsup.config.ts `onSuccess`). Running
 * the CLI straight from source (`tsx src/cli/index.ts`) has to find
 * `src/brand/` instead, hence the candidate walk rather than a single path.
 */
export function resolveBrandDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(here, 'brand'), // published: dist/cli.js → dist/brand
    resolve(here, '../../brand'), // from source: src/cli/favicon → src/brand
  ];

  const found = candidates.find((dir) => existsSync(resolve(dir, 'favicon.svg')));
  if (!found) {
    throw new Error(
      `Brand icons not found. Looked in:\n  ${candidates.join('\n  ')}\n` +
        'A published @devfellowship/components ships them in dist/brand/.',
    );
  }
  return found;
}

/** Absolute paths of every asset, in link order. Throws if one is missing. */
export function brandAssetPaths(brandDir = resolveBrandDir()): string[] {
  return FAVICON_ASSETS.map((name) => {
    const path = resolve(brandDir, name);
    if (!existsSync(path)) throw new Error(`Brand asset missing from the package: ${name}`);
    return path;
  });
}
