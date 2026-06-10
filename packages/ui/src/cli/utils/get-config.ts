import { cosmiconfig } from 'cosmiconfig';
import { configSchema, type Config } from '../types/config.js';

export async function getConfig(cwd: string): Promise<Config | null> {
  const explorer = cosmiconfig('dfl-components', {
    searchPlaces: ['dfl-components.json'],
  });

  const result = await explorer.search(cwd);

  if (!result) {
    return null;
  }

  return configSchema.parse(result.config);
}
