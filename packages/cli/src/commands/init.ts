import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { configSchema, type Config } from '../types/config.js';
import { logger } from '../utils/logger.js';

interface InitOptions {
  yes?: boolean;
  cwd: string;
}

export async function init(options: InitOptions) {
  const cwd = path.resolve(options.cwd);

  logger.info('Initializing dfl-components configuration...');
  logger.break();

  // Check if config already exists
  const configPath = path.join(cwd, 'dfl-components.json');
  if (await fs.pathExists(configPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'dfl-components.json already exists. Overwrite?',
      initial: false,
    });

    if (!overwrite) {
      logger.warn('Aborted.');
      return;
    }
  }

  let config: Config;

  if (options.yes) {
    // Use defaults
    config = configSchema.parse({
      aliases: {},
    });
  } else {
    // Interactive prompts
    const answers = await prompts([
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Would you like to use TypeScript?',
        initial: true,
      },
      {
        type: 'text',
        name: 'componentsPath',
        message: 'Where would you like to install components?',
        initial: '@/components/dfl',
      },
      {
        type: 'text',
        name: 'hooksPath',
        message: 'Where would you like to install hooks?',
        initial: '@/hooks',
      },
      {
        type: 'text',
        name: 'providersPath',
        message: 'Where would you like to install providers?',
        initial: '@/providers',
      },
      {
        type: 'text',
        name: 'pagesPath',
        message: 'Where would you like to install pages?',
        initial: '@/pages',
      },
    ]);

    if (!answers.typescript) {
      logger.warn('Aborted.');
      return;
    }

    config = configSchema.parse({
      typescript: answers.typescript,
      aliases: {
        components: answers.componentsPath,
        hooks: answers.hooksPath,
        providers: answers.providersPath,
        pages: answers.pagesPath,
      },
    });
  }

  const spinner = ora('Writing configuration...').start();

  try {
    await fs.writeJson(configPath, config, { spaces: 2 });
    spinner.succeed('Configuration saved to dfl-components.json');

    logger.break();
    logger.success('Project initialized successfully!');
    logger.break();
    console.log('You can now add components:');
    console.log(chalk.cyan('  npx dfl-components add button'));
    console.log(chalk.cyan('  npx dfl-components add card input'));
    console.log(chalk.cyan('  npx dfl-components add auth-pages'));
    logger.break();
  } catch (error) {
    spinner.fail('Failed to write configuration');
    throw error;
  }
}
