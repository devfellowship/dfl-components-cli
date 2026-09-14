import type { Command } from 'commander';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, relative, resolve } from 'node:path';
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
    .option('--check', 'Write nothing; exit 1 if the app is out of date (for CI).')
    .action(
      (
        maybeDir: string | undefined,
        opts: { publicDir: string; html: string; base: string; check?: boolean },
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

        let sources: string[];
        try {
          sources = brandAssetPaths(resolveBrandDir());
        } catch (error) {
          console.error(chalk.red((error as Error).message));
          process.exit(2);
          return;
        }

        const publicDir = resolve(root, opts.publicDir);
        const stale = sources.filter((source) => {
          const target = resolve(publicDir, basename(source));
          return !existsSync(target) || !readFileSync(target).equals(readFileSync(source));
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
          for (const source of stale) {
            console.error(`    ${relative(root, resolve(publicDir, basename(source)))}`);
          }
          if (patched.changed) console.error(`    ${opts.html} (icon <link> block)`);
          process.exit(1);
        }

        mkdirSync(publicDir, { recursive: true });
        for (const source of sources) copyFileSync(source, resolve(publicDir, basename(source)));
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
