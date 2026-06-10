import type { Command } from 'commander';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import chalk from 'chalk';
import type { UxPathsDoc } from '../lib/types.js';
import { stampPreserveFormat } from '../lib/preserve-format.js';

export function registerStamp(program: Command): void {
  program
    .command('stamp [path]')
    .description('Refresh app_version to YYYY-MM-DD-<git-sha-short> and bump generated_at.')
    // Negatable boolean: default ON (minimal diff). `--no-preserve-format`
    // opts back into the legacy whole-file reformat. Commander sets
    // `opts.preserveFormat = true` by default and `false` when --no-… is passed.
    .option(
      '--no-preserve-format',
      'Reformat the whole file (legacy). By default, stamp surgically updates only app_version/generated_at, preserving the existing formatting (minimal diff).',
    )
    .action((maybePath: string | undefined, opts: { preserveFormat?: boolean }) => {
      const path = resolve(process.cwd(), maybePath || '.dfl-ux-paths/flows.json');
      if (!existsSync(path)) {
        console.error(chalk.red('File not found:'), path);
        process.exit(1);
      }
      const raw = readFileSync(path, 'utf8');
      const doc = JSON.parse(raw) as UxPathsDoc;

      const today = new Date().toISOString().slice(0, 10);
      let sha = '0000000';
      try {
        sha = execSync('git rev-parse --short=7 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
          .toString()
          .trim();
        if (!sha) sha = '0000000';
      } catch {
        // Not a git repo or git missing — fall back to 0000000.
      }

      const newVersion = `${today}-${sha}`;
      const newGeneratedAt = new Date().toISOString();

      // `--preserve-format` is default-on: surgically replace only the volatile
      // fields against the raw file text so re-stamps produce a minimal diff.
      // `--no-preserve-format` falls back to the legacy full-reformat behavior.
      const preserve = opts.preserveFormat !== false;
      let output: string;
      if (preserve) {
        output = stampPreserveFormat(raw, {
          app_version: newVersion,
          generated_at: newGeneratedAt,
        });
      } else {
        const updated: UxPathsDoc = {
          ...doc,
          app_version: newVersion,
          generated_at: newGeneratedAt,
        };
        output = JSON.stringify(updated, null, 2) + '\n';
      }

      writeFileSync(path, output, 'utf8');
      console.log(chalk.green('Stamped'), path, preserve ? chalk.gray('(minimal diff)') : '');
      console.log(chalk.gray(`  app_version: ${newVersion}`));
      console.log(chalk.gray(`  generated_at: ${newGeneratedAt}`));
    });
}
