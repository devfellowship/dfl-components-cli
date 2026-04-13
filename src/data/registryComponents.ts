
import { Component } from '@/types/component';
import { SampleButton, SampleCard, SampleInput } from '@/components/sample/SampleComponents';
import { LoginPage } from '@/components/auth/LoginPage';
import { RegisterPage } from '@/components/auth/RegisterPage';
import registryIndex from '../../registry/registry.json';

// Eagerly import all registry JSON files by directory
const componentFiles = import.meta.glob('../../registry/components/*.json', { eager: true }) as Record<string, { default: RegistryItem } | RegistryItem>;
const hookFiles = import.meta.glob('../../registry/hooks/*.json', { eager: true }) as Record<string, { default: RegistryItem } | RegistryItem>;
const providerFiles = import.meta.glob('../../registry/providers/*.json', { eager: true }) as Record<string, { default: RegistryItem } | RegistryItem>;
const pageFiles = import.meta.glob('../../registry/pages/*.json', { eager: true }) as Record<string, { default: RegistryItem } | RegistryItem>;

interface RegistryFile {
  path: string;
  type: string;
  content: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  category?: string;
  version?: string;
  tags?: string[];
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
}

// Preview components for the original 3 + auth pages
const previewMap: Record<string, React.ComponentType> = {
  'button': SampleButton,
  'card': SampleCard,
  'input': SampleInput,
};

const pagePreviewMap: Record<string, { name: string; component: React.ComponentType }[]> = {
  'auth-pages': [
    { name: 'Login Page', component: LoginPage },
    { name: 'Register Page', component: RegisterPage },
  ],
};

function resolveModule(mod: { default: RegistryItem } | RegistryItem): RegistryItem {
  return 'default' in mod ? mod.default : mod;
}

function buildFileMap(globResult: Record<string, { default: RegistryItem } | RegistryItem>): Map<string, RegistryItem> {
  const map = new Map<string, RegistryItem>();
  for (const [path, mod] of Object.entries(globResult)) {
    const item = resolveModule(mod);
    map.set(item.name, item);
  }
  return map;
}

function categoryFromType(type: string, explicitCategory?: string): Component['category'] {
  if (explicitCategory) {
    const normalized = explicitCategory as Component['category'];
    if (['UI', 'Hooks', 'Providers', 'Pages'].includes(normalized)) return normalized;
  }
  if (type === 'registry:hook') return 'Hooks';
  if (type === 'registry:block') return 'Pages';
  return 'UI';
}

function buildComponents(): Component[] {
  const allFiles = new Map<string, RegistryItem>();
  for (const globResult of [componentFiles, hookFiles, providerFiles, pageFiles]) {
    const map = buildFileMap(globResult);
    for (const [name, item] of map) {
      allFiles.set(name, item);
    }
  }

  return registryIndex.items.map((indexItem, idx) => {
    const detail = allFiles.get(indexItem.name);
    const category = categoryFromType(indexItem.type, indexItem.category);
    const code = detail?.files?.[0]?.content ?? '// Source code available via CLI: npx dfl-components add ' + indexItem.name;
    const filePath = detail?.files?.[0]?.path
      ? `registry/${category === 'Hooks' ? 'hooks' : category === 'Providers' ? 'providers' : category === 'Pages' ? 'pages' : 'components'}/${detail.files[0].path}`
      : `registry/components/${indexItem.name}.tsx`;

    const component: Component = {
      id: String(idx + 1),
      name: indexItem.title || indexItem.name,
      description: indexItem.description,
      category,
      tags: detail?.tags ?? [indexItem.name],
      version: indexItem.version || detail?.version || '0.1.0',
      filePath,
      code,
      previewComponent: previewMap[indexItem.name],
    };

    // Handle page sub-pages (auth-pages)
    const subPages = pagePreviewMap[indexItem.name];
    if (subPages) {
      component.subPages = subPages.map(sp => ({
        name: sp.name,
        filePath: `src/pages/auth/${sp.name.replace(/\s+/g, '')}.tsx`,
        code: code,
        previewComponent: sp.component,
      }));
    }

    return component;
  });
}

export const registryComponents: Component[] = buildComponents();
