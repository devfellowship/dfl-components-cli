import { Command } from 'commander';
import { init } from './commands/init.js';
import { add } from './commands/add.js';

const program = new Command();

program
  .name('dfl-components')
  .description('Add DevFellowship components to your project')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize your project with dfl-components configuration')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-c, --cwd <path>', 'Working directory', process.cwd())
  .action(init);

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Components to add')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-c, --cwd <path>', 'Working directory', process.cwd())
  .option('-a, --all', 'Add all available components')
  .action(add);

program.parse();
