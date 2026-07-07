import { Command } from 'commander';
import { registerUxPaths } from './ux-paths/index.js';
import { registerCheckStyleImports } from './check-style-imports/index.js';

const program = new Command();

program
  .name('dfl-components')
  .description(
    'DevFellowship components CLI — map app UX paths (folds the dfl-ux-paths CLI). Shipped as the `dfl-components` bin of @devfellowship/components. The component set is consumed as a library import (`import { Button } from "@devfellowship/components"`), not scaffolded.',
  )
  .version('3.0.0');

registerUxPaths(program);
registerCheckStyleImports(program);

program.parse();
