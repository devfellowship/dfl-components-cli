import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { getConfig } from '../utils/get-config.js';
import { getRegistry, getComponent, getComponentFolderByCategory } from '../utils/get-registry.js';
import { getTargetPath } from '../utils/resolve-alias.js';
import { logger } from '../utils/logger.js';
import type { RegistryItem, RegistryComponent } from '../types/registry.js';

interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  cwd: string;
  all?: boolean;
}

export async function add(components: string[], options: AddOptions) {
  const cwd = path.resolve(options.cwd);

  // 1. Read config
  const config = await getConfig(cwd);
  if (!config) {
    logger.error('No dfl-components.json found.');
    console.log('Run', chalk.cyan('npx dfl-components init'), 'first.');
    return;
  }

  const spinner = ora('Fetching registry...').start();

  try {
    // 2. Fetch registry index
    const registry = await getRegistry(config.registry);

    // 3. Determine which components to install
    let toInstall: string[];

    if (options.all) {
      toInstall = registry.items.map((item) => item.name);
    } else if (components.length === 0) {
      spinner.stop();
      // Interactive selection
      const { selected } = await prompts({
        type: 'multiselect',
        name: 'selected',
        message: 'Which components would you like to add?',
        choices: registry.items.map((item) => ({
          title: `${item.title} (${item.category})`,
          value: item.name,
          description: item.description,
        })),
        min: 1,
      });

      if (!selected || selected.length === 0) {
        logger.warn('No components selected.');
        return;
      }

      toInstall = selected;
      spinner.start('Fetching components...');
    } else {
      toInstall = components;
    }

    // Validate components exist
    const validComponents: string[] = [];
    for (const name of toInstall) {
      const item = registry.items.find((i) => i.name === name);
      if (!item) {
        logger.warn(`Component "${name}" not found in registry. Skipping.`);
      } else {
        validComponents.push(name);
      }
    }

    if (validComponents.length === 0) {
      spinner.fail('No valid components to install.');
      return;
    }

    // 4. Resolve dependencies
    const allComponents = new Set<string>();

    function resolveDeps(name: string) {
      if (allComponents.has(name)) return;
      allComponents.add(name);

      const item = registry.items.find((i) => i.name === name);
      if (item?.registryDependencies) {
        for (const dep of item.registryDependencies) {
          resolveDeps(dep);
        }
      }
    }

    for (const component of validComponents) {
      resolveDeps(component);
    }

    spinner.text = `Installing ${allComponents.size} component(s)...`;

    // 5. Fetch and write each component
    const installed: string[] = [];
    const errors: string[] = [];

    for (const componentName of allComponents) {
      const registryItem = registry.items.find((i) => i.name === componentName);
      if (!registryItem) continue;

      try {
        // Determine folder based on category
        const folder = getComponentFolderByCategory(registryItem.category);
        const url = `${config.registry}/${folder}/${componentName}.json`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const componentData: RegistryComponent = await response.json();

        // Write files
        for (const file of componentData.files) {
          const targetDir = file.target
            ? path.dirname(path.join(cwd, 'src', file.target))
            : path.join(cwd, getTargetPath(registryItem.category, config.aliases));

          const targetPath = file.target
            ? path.join(cwd, 'src', file.target)
            : path.join(targetDir, file.path);

          // Check if file exists
          if (await fs.pathExists(targetPath)) {
            if (!options.overwrite && !options.yes) {
              spinner.stop();
              const { overwrite } = await prompts({
                type: 'confirm',
                name: 'overwrite',
                message: `${path.relative(cwd, targetPath)} already exists. Overwrite?`,
                initial: false,
              });
              if (!overwrite) {
                logger.info(`Skipping ${path.basename(targetPath)}`);
                continue;
              }
              spinner.start();
            } else if (!options.overwrite) {
              logger.info(`Skipping ${path.basename(targetPath)} (use --overwrite to replace)`);
              continue;
            }
          }

          // Ensure directory exists
          await fs.ensureDir(path.dirname(targetPath));

          // Write file
          await fs.writeFile(targetPath, file.content);
          installed.push(targetPath);
        }
      } catch (error) {
        errors.push(`${componentName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    spinner.succeed(`Installed ${installed.length} file(s)`);

    // 6. Show summary
    if (installed.length > 0) {
      logger.break();
      console.log(chalk.green('Files created:'));
      for (const file of installed) {
        console.log(chalk.gray('  -'), path.relative(cwd, file));
      }
    }

    if (errors.length > 0) {
      logger.break();
      console.log(chalk.red('Errors:'));
      for (const error of errors) {
        console.log(chalk.gray('  -'), error);
      }
    }

    logger.break();
  } catch (error) {
    spinner.fail('Failed to add components');
    throw error;
  }
}
