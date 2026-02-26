export function resolveAlias(aliasPath: string): string {
  // Convert @/ paths to src/
  if (aliasPath.startsWith('@/')) {
    return aliasPath.replace('@/', 'src/');
  }
  return aliasPath;
}

export function getTargetPath(
  category: string,
  aliases: { components: string; hooks: string; providers: string; pages: string }
): string {
  switch (category) {
    case 'Hooks':
      return resolveAlias(aliases.hooks);
    case 'Providers':
      return resolveAlias(aliases.providers);
    case 'Pages':
      return resolveAlias(aliases.pages);
    default:
      return resolveAlias(aliases.components);
  }
}
