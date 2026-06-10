import type { Command } from 'commander';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import chalk from 'chalk';
import { detectInDir } from './detect.js';

const DOC_URL =
  'https://github.com/devfellowship/dfl-components-cli#consuming-the-ds-styles-in-an-app';

/**
 * Register the `check-style-imports` command.
 *
 * Deterministic CI/lint-time guard against importing BOTH
 * `@devfellowship/components/styles` (hex tokens) and
 * `@devfellowship/components/shadcn` (bare HSL channels) in the same app —
 * the co-import that clobbers `--background` and renders surfaces transparent.
 *
 * Usage: `dfl-components check-style-imports [dir]` (defaults to cwd).
 * Exit 0 = clean, exit 1 = collision found, exit 2 = bad args.
 */
export function registerCheckStyleImports(program: Command): void {
  program
    .command('check-style-imports [dir]')
    .description(
      'Fail if an app imports BOTH @devfellowship/components/styles and /shadcn (clobbers --background → transparent surfaces).',
    )
    .option('--json', 'Emit the raw detection result as JSON instead of a human report.')
    .action((maybeDir: string | undefined, opts: { json?: boolean }) => {
      const root = resolve(process.cwd(), maybeDir || '.');
      if (!existsSync(root)) {
        console.error(chalk.red('Directory not found:'), root);
        process.exit(2);
      }

      const result = detectInDir(root);

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.conflict ? 1 : 0);
      }

      if (!result.conflict) {
        if (result.hits.length === 0) {
          console.log(
            chalk.green('OK'),
            'no @devfellowship/components/{styles,shadcn} imports found.',
          );
        } else {
          const which = result.styles.length > 0 ? 'styles' : 'shadcn';
          console.log(
            chalk.green('OK'),
            `app imports only @devfellowship/components/${which} (${result.hits.length} reference${
              result.hits.length === 1 ? '' : 's'
            }).`,
          );
        }
        process.exit(0);
      }

      console.error(
        chalk.red('CONFLICT'),
        'this app imports BOTH @devfellowship/components/styles AND /shadcn.',
      );
      console.error(
        chalk.yellow(
          '\nThese exports define the SAME CSS vars (--background, --primary, …) in INCOMPATIBLE formats:\n' +
            "  - /styles  ships them as HEX        (#0A0908)\n" +
            '  - /shadcn  ships them as HSL CHANNELS (30 11% 4%)\n' +
            'Importing both clobbers --background — e.g. hsl(#0A0908) is invalid CSS → the\n' +
            'declaration drops → surfaces render TRANSPARENT (the transparent-dialog bug).\n',
        ),
      );
      console.error(chalk.bold('  /styles imports:'));
      for (const h of result.styles) console.error(`    ${h.file}:${h.line}  ${h.text}`);
      console.error(chalk.bold('  /shadcn imports:'));
      for (const h of result.shadcn) console.error(`    ${h.file}:${h.line}  ${h.text}`);
      console.error(
        chalk.cyan(
          '\nFIX: keep exactly ONE. A DS-native (hex) app imports /styles only; a\n' +
            'shadcn-slate (HSL-channel) app imports /shadcn only. NEVER both.\n' +
            `See: ${DOC_URL}`,
        ),
      );
      process.exit(1);
    });
}
