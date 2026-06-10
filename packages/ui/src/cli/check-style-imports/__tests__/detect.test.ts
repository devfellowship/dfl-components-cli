import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { detectInDir, detectInText, summarize } from '../detect.js';

const FIXTURES = resolve(__dirname, 'fixtures');

describe('detectInDir — DS style co-import collision', () => {
  it('flags an app that @imports BOTH /styles and /shadcn (across two CSS files)', () => {
    const r = detectInDir(join(FIXTURES, 'conflict-app'));
    expect(r.conflict).toBe(true);
    expect(r.styles.length).toBeGreaterThanOrEqual(1);
    expect(r.shadcn.length).toBeGreaterThanOrEqual(1);
    // The two imports live in different files.
    expect(r.styles[0].file).not.toBe(r.shadcn[0].file);
  });

  it('flags an app that imports BOTH via JS/TS side-effect imports', () => {
    const r = detectInDir(join(FIXTURES, 'conflict-js-app'));
    expect(r.conflict).toBe(true);
    expect(r.styles.some((h) => h.file.endsWith('main.tsx'))).toBe(true);
    expect(r.shadcn.some((h) => h.file.endsWith('theme.ts'))).toBe(true);
  });

  it('passes an app importing ONLY /styles', () => {
    const r = detectInDir(join(FIXTURES, 'styles-only-app'));
    expect(r.conflict).toBe(false);
    expect(r.styles.length).toBe(1);
    expect(r.shadcn.length).toBe(0);
  });

  it('passes an app importing ONLY /shadcn (url() form)', () => {
    const r = detectInDir(join(FIXTURES, 'shadcn-only-app'));
    expect(r.conflict).toBe(false);
    expect(r.shadcn.length).toBe(1);
    expect(r.styles.length).toBe(0);
  });

  it('passes a clean app with neither import', () => {
    const r = detectInDir(join(FIXTURES, 'clean-app'));
    expect(r.conflict).toBe(false);
    expect(r.hits.length).toBe(0);
  });
});

describe('detectInDir — node_modules is ignored', () => {
  const tmpRoots: string[] = [];
  afterAll(() => {
    for (const d of tmpRoots) rmSync(d, { recursive: true, force: true });
  });

  it('does NOT treat a /shadcn import inside node_modules as a second import', () => {
    const root = mkdtempSync(join(tmpdir(), 'ds-collision-'));
    tmpRoots.push(root);
    // App source imports only /styles …
    mkdirSync(join(root, 'src'), { recursive: true });
    writeFileSync(join(root, 'src', 'index.css'), "@import '@devfellowship/components/styles';\n");
    // … but the package's own shadcn.css sits in node_modules and must be ignored.
    const nm = join(root, 'node_modules', '@devfellowship', 'components');
    mkdirSync(nm, { recursive: true });
    writeFileSync(join(nm, 'shadcn.css'), "@import '@devfellowship/components/shadcn';\n");

    const r = detectInDir(root);
    expect(r.conflict).toBe(false);
    expect(r.styles.length).toBe(1);
    expect(r.shadcn.length).toBe(0);
  });
});

describe('detectInText — matcher forms', () => {
  it('matches CSS @import (single + double quotes)', () => {
    expect(detectInText(`@import '@devfellowship/components/styles';`)).toHaveLength(1);
    expect(detectInText(`@import "@devfellowship/components/shadcn";`)).toHaveLength(1);
  });

  it('matches CSS @import url() form', () => {
    expect(detectInText(`@import url('@devfellowship/components/styles');`)).toHaveLength(1);
  });

  it('matches JS bare import and require', () => {
    expect(detectInText(`import '@devfellowship/components/shadcn';`)).toHaveLength(1);
    expect(detectInText(`const x = require("@devfellowship/components/styles");`)).toHaveLength(1);
  });

  it('tolerates a trailing .css on the specifier', () => {
    expect(detectInText(`@import '@devfellowship/components/styles.css';`)).toHaveLength(1);
  });

  it('does NOT match unrelated subpaths (/tokens, /tailwind, root)', () => {
    expect(detectInText(`@import '@devfellowship/components/tokens';`)).toHaveLength(0);
    expect(detectInText(`@import '@devfellowship/components/tailwind';`)).toHaveLength(0);
    expect(detectInText(`import { Button } from '@devfellowship/components';`)).toHaveLength(0);
  });

  it('does NOT match a comment mentioning the path without an import', () => {
    expect(detectInText(`/* see @devfellowship/components/shadcn for HSL channels */`)).toHaveLength(
      0,
    );
  });

  it('summarize() reports a conflict only when both exports are present', () => {
    const both = summarize([
      { file: 'a.css', line: 1, export: 'styles', text: '' },
      { file: 'b.css', line: 1, export: 'shadcn', text: '' },
    ]);
    expect(both.conflict).toBe(true);

    const oneSided = summarize([{ file: 'a.css', line: 1, export: 'styles', text: '' }]);
    expect(oneSided.conflict).toBe(false);
  });
});
