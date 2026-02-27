export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  category: string;
  version: string;
  registryDependencies: string[];
  dependencies: string[];
}

export interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

export interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content: string;
}

export interface RegistryComponent {
  name: string;
  type: string;
  title: string;
  description: string;
  category: string;
  version: string;
  tags: string[];
  registryDependencies: string[];
  dependencies: string[];
  files: RegistryFile[];
}
