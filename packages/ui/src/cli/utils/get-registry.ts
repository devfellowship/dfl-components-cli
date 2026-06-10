import fetch from 'node-fetch';
import type { Registry, RegistryComponent } from '../types/registry.js';

export async function getRegistry(registryUrl: string): Promise<Registry> {
  const response = await fetch(`${registryUrl}/registry.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch registry: ${response.statusText}`);
  }

  return response.json() as Promise<Registry>;
}

export async function getComponent(
  registryUrl: string,
  componentName: string,
  componentType: string
): Promise<RegistryComponent> {
  const folder = getComponentFolder(componentType);
  const url = `${registryUrl}/${folder}/${componentName}.json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch component "${componentName}": ${response.statusText}`);
  }

  return response.json() as Promise<RegistryComponent>;
}

function getComponentFolder(type: string): string {
  switch (type) {
    case 'registry:hook':
      return 'hooks';
    case 'registry:block':
      return 'pages';
    default:
      // Check if it's a provider based on category (handled in caller)
      return 'components';
  }
}

export function getComponentFolderByCategory(category: string): string {
  switch (category) {
    case 'Hooks':
      return 'hooks';
    case 'Providers':
      return 'providers';
    case 'Pages':
      return 'pages';
    default:
      return 'components';
  }
}
