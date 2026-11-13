import type { Command } from 'commander';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import chalk from 'chalk';

import { brandAssetPaths, resolveBrandDir } from './assets.js';
import { FAVICON_ASSETS, patchHtml } from './patch-html.js';

/**
 * Register the `favicon` command.
 *
 * The DFL favicon is ONE artifact for the whole fleet, versioned in the design
 * system (`src/brand/`, published as `dist/brand/`). Apps do not hand-draw it
 * and do not point `<link rel="icon">` at an S3 URL that nobody can re-upload:
 * they run this command, which copies the icons into their public directory and
 * rewrites the icon block in `index.html`. Re-running it after a DS bump is how
 * an app picks up a new brand mark.
 *
 * Usage: `npx dfl-components favicon [dir]` (defaults to cwd).
 * Exit 0 = written / already current, 1 = `--check` found drift, 2 = bad args.
 */
export function registerFavicon(program: Command): void {
  program
    .command('favicon [dir]')
    .description(
      'Copy the DFL brand icons into an app and point its index.html at them (idempotent).',
    )
    .option('--public-dir <dir>', 'Directory served at the site root.', 'public')
    .option('--html <file>', 'HTML entry to rewrite, relative to [dir].', 'index.html')
    .option('--base <path>', 'URL prefix the icons are served under.', '/')
    .option('--app <slug>', 'Install the icon set of one mini-app from the brand site (verified).')
    .option(
      '--source <url>',
      'Brand site base URL for --app (env DFL_MINI_APPS_SOURCE overrides the default).',
      process.env.DFL_MINI_APPS_SOURCE || 'https://brand.devfellowship.com/mini-apps',
    )
    .option('--check', 'Write nothing; exit 1 if the app is out of date (for CI).')
    .action(
      async (
        maybeDir: string | undefined,
        opts: {
          publicDir: string;
          html: string;
          base: string;
          check?: boolean;
          app?: string;
          source: string;
        },
      ) => {
        const root = resolve(process.cwd(), maybeDir || '.');
        if (!existsSync(root)) {
          console.error(chalk.red('Directory not found:'), root);
          process.exit(2);
        }

        const htmlPath = resolve(root, opts.html);
        if (!existsSync(htmlPath)) {
          console.error(chalk.red('HTML entry not found:'), htmlPath);
          console.error(chalk.yellow('Pass --html <file> if this app does not use index.html.'));
          process.exit(2);
        }

        // name in the app's public dir -> bytes to install
        let assets: Array<{ name: string; data: Buffer }>;
        if (opts.app) {
          try {
            const remote = await loadRemote();
            const icons = await remote.fetchMiniAppIcons({ slug: opts.app, source: opts.source });
            assets = [...icons].map(([name, data]) => ({ name, data }));
          } catch (error) {
            const e = error as Error & { available?: string[] };
            console.error(chalk.red('Refused:'), e.message);
            if (e.name === 'UnknownAppError' || e.name === 'BadSlugError') process.exit(2);
            console.error(chalk.yellow('Nothing was written.'));
            process.exit(1);
          }
        } else {
          try {
            assets = brandAssetPaths(resolveBrandDir()).map((p) => ({
              name: basename(p),
              data: readFileSync(p),
            }));
          } catch (error) {
            console.error(chalk.red((error as Error).message));
            process.exit(2);
            return;
          }
        }

        const publicDir = resolve(root, opts.publicDir);
        const stale = assets.filter(({ name, data }) => {
          const target = resolve(publicDir, name);
          return !existsSync(target) || !readFileSync(target).equals(data);
        });

        const html = readFileSync(htmlPath, 'utf8');
        const patched = patchHtml(html, opts.base);
        const headMissing = !/<head\b/i.test(html);

        if (headMissing) {
          console.error(chalk.red('No <head> in'), htmlPath);
          process.exit(2);
        }

        if (opts.check) {
          if (stale.length === 0 && !patched.changed) {
            console.log(chalk.green('OK'), 'brand icons are current.');
            process.exit(0);
          }
          console.error(chalk.red('OUTDATED'), 'run `npx dfl-components favicon` and commit.');
          for (const { name } of stale) {
            console.error(`    ${relative(root, resolve(publicDir, name))}`);
          }
          if (patched.changed) console.error(`    ${opts.html} (icon <link> block)`);
          process.exit(1);
        }

        mkdirSync(publicDir, { recursive: true });
        for (const { name, data } of assets) writeFileSync(resolve(publicDir, name), data);
        if (patched.changed) writeFileSync(htmlPath, patched.html);

        console.log(
          chalk.green('OK'),
          `${FAVICON_ASSETS.length} icons → ${relative(root, publicDir) || '.'}`,
        );
        for (const link of patched.removed) {
          console.log(chalk.yellow('  replaced'), link);
        }
        if (!patched.changed && stale.length === 0) {
          console.log(chalk.dim('  already current — nothing changed.'));
        }
        process.exit(0);
      },
    );
}

interface RemoteModule {
  fetchMiniAppIcons(opts: {
    slug: string;
    source: string;
  }): Promise<Map<string, Buffer>>;
}

/**
 * Lazy-load the network module (only for `--app`). It is a separate bundle
 * entry so `dist/cli.js` itself holds no network primitive; the import target
 * is a computed URL so esbuild leaves it alone. Same candidate walk as
 * assets.ts: published (next to dist/cli.js), then source (.js, then .ts).
 */
async function loadRemote(): Promise<RemoteModule> {
  const candidates = [
    new URL('./favicon-remote.js', import.meta.url),
    new URL('./remote.js', import.meta.url),
    // Running from TypeScript source (tsx / vitest): the file on disk is .ts.
    new URL('./remote.ts', import.meta.url),
  ];
  const found = candidates.find((u) => existsSync(fileURLToPath(u.href)));
  if (!found) {
    throw new Error(
      `Remote icon module not found. Looked in:\n  ${candidates
        .map((u) => fileURLToPath(u.href))
        .join('\n  ')}`,
    );
  }
  const target = pathToFileURL(fileURLToPath(found.href)).href;
  return (await import(target)) as RemoteModule;
}
