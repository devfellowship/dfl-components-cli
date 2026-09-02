import type { Command } from 'commander';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import chalk from 'chalk';
import { loadSchemaV1 } from '../lib/load-schema.js';
import { checkStructure } from '../lib/structural-checks.js';

export function registerValidate(program: Command): void {
  program
    .command('validate [path]')
    .description('Validate a flows.json against the DFL UX Paths v1 schema.')
    .action(async (maybePath: string | undefined) => {
      const path = resolve(process.cwd(), maybePath || '.dfl-ux-paths/flows.json');
      if (!existsSync(path)) {
        console.error(chalk.red('File not found:'), path);
        process.exit(1);
      }
      let doc: unknown;
      try {
        doc = JSON.parse(readFileSync(path, 'utf8'));
      } catch (err) {
        console.error(chalk.red('Invalid JSON:'), (err as Error).message);
        process.exit(1);
      }

      const ajv = new Ajv2020({ allErrors: true, strict: false });
      addFormats(ajv);
      let schema: unknown;
      try {
        schema = await loadSchemaV1();
      } catch (err) {
        console.error(chalk.red('Schema error:'), (err as Error).message);
        process.exit(1);
      }
      const validate = ajv.compile(schema as object);
      const ok = validate(doc);
      if (!ok) {
        console.error(chalk.red('FAIL'), path);
        for (const err of validate.errors ?? []) {
          console.error(
            chalk.yellow('  -'),
            err.instancePath || '<root>',
            err.message,
            err.params ? JSON.stringify(err.params) : '',
          );
        }
        process.exit(1);
      }

      // The schema is satisfied. That is NOT the same as the document being
      // sound: JSON Schema cannot express a cross-reference and cannot express
      // uniqueness across array items, so a flow that starts at a deleted
      // screen, a step that walks one, an action that targets one, and a
      // repeated `screen.id` all validate cleanly. `screen.id` is the schema's
      // own "sticky 1:1 join key across apps", so each of those breaks the join
      // the whole comparison model rests on — silently, and with an `OK` on
      // screen. See lib/structural-checks.ts for the measurement.
      const problems = checkStructure(doc);
      if (problems.length > 0) {
        console.error(chalk.red('FAIL'), path);
        console.error(
          chalk.yellow('  the document satisfies schema v1 but is not internally consistent:'),
        );
        for (const problem of problems) {
          console.error(chalk.yellow(`  [${problem.rule}]`), problem.message);
          for (const line of problem.detail) console.error(chalk.dim(`  ${line}`));
        }
        process.exit(1);
      }

      console.log(chalk.green('OK'), path, 'conforms to schema v1.');
      process.exit(0);
    });
}
