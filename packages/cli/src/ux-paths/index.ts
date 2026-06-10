import type { Command } from 'commander';
import { registerInit } from './commands/init.js';
import { registerValidate } from './commands/validate.js';
import { registerGenerateMermaid } from './commands/generate-mermaid.js';
import { registerDiff } from './commands/diff.js';
import { registerStamp } from './commands/stamp.js';

/**
 * Register the `ux-paths` subcommand group on the root program.
 *
 * Usage: `dfl-components ux-paths <init|validate|stamp|diff|generate-mermaid> [...]`
 *
 * The DFL UX Paths CLI was folded into this hub so DFL apps only ever need
 * ONE published npm CLI. The JSON Schema stays in devfellowship/dfl-ux-paths
 * (fetched at validate-time from the canonical raw URL).
 */
export function registerUxPaths(program: Command): void {
  const group = program
    .command('ux-paths')
    .description('Versioned, schema-validated per-app user-flow mapping (DFL UX Paths).');

  registerInit(group);
  registerValidate(group);
  registerGenerateMermaid(group);
  registerDiff(group);
  registerStamp(group);
}
