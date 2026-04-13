#!/usr/bin/env node

/**
 * Scans src/components/ui/ and generates src/data/designSystemData.json
 * with the list of all available components and their status.
 *
 * Usage: node scripts/generate-design-data.mjs
 */

import { readdirSync, writeFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uiDir = join(__dirname, '..', 'src', 'components', 'ui');
const outputPath = join(__dirname, '..', 'src', 'data', 'designSystemData.json');

function toDisplayName(filename) {
  return filename
    .replace(/\.tsx?$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const files = readdirSync(uiDir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
  .sort();

const components = files.map(file => ({
  name: toDisplayName(file),
  file,
  category: 'UI',
  available: true,
}));

const data = {
  totalComponents: components.length,
  components,
};

writeFileSync(outputPath, JSON.stringify(data, null, 2) + '\n');

console.log(`Generated ${outputPath} with ${components.length} components.`);
