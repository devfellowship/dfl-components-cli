import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Guard tests for the shadcn HSL-channel bridge (shadcn.css).
 *
 * The whole point of the bridge is that shadcn-slate apps wrap these vars as
 * `hsl(var(--background))` — so the values MUST be bare HSL channels
 * (`H S% L%`), never `hsl(...)`-wrapped and never hex. If a hex ever leaks back
 * in, `hsl(#0a0908)` is invalid CSS and the consumer render breaks. These tests
 * lock that contract.
 */

const css = readFileSync(resolve(__dirname, '../shadcn.css'), 'utf8');

// Strip comment blocks so we only assert on real declarations.
const declarations = css.replace(/\/\*[\s\S]*?\*\//g, '');

// The full set of standard shadcn semantic vars the bridge must define.
const REQUIRED_VARS = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring',
  '--radius',
];

// Exact expected DS-v0-dark channel values (converted from tokens.css hex).
const EXPECTED: Record<string, string> = {
  '--background': '30 11% 4%',
  '--foreground': '40 45% 94%',
  '--card': '30 11% 7%',
  '--card-foreground': '40 45% 94%',
  '--popover': '30 13% 9%',
  '--popover-foreground': '40 45% 94%',
  '--primary': '19 71% 58%',
  '--primary-foreground': '30 11% 4%',
  '--secondary': '30 11% 7%',
  '--secondary-foreground': '34 16% 75%',
  '--muted': '30 13% 9%',
  '--muted-foreground': '37 9% 45%',
  '--accent': '34 13% 11%',
  '--accent-foreground': '40 45% 94%',
  '--destructive': '0 62% 68%',
  '--destructive-foreground': '40 45% 94%',
  '--border': '30 11% 15%',
  '--input': '30 11% 15%',
  '--ring': '19 71% 58%',
  '--radius': '0.375rem',
};

function valueOf(name: string): string | undefined {
  const m = declarations.match(new RegExp(`${name}\\s*:\\s*([^;]+);`));
  return m ? m[1].trim() : undefined;
}

describe('shadcn HSL-channel bridge', () => {
  it('defines every required standard shadcn semantic var', () => {
    for (const name of REQUIRED_VARS) {
      expect(valueOf(name), `${name} should be declared`).toBeDefined();
    }
  });

  it('never wraps color vars in hsl() — they are bare channels', () => {
    for (const name of REQUIRED_VARS) {
      if (name === '--radius') continue;
      expect(valueOf(name)).not.toMatch(/hsl\(/i);
    }
  });

  it('never leaks hex into a color channel', () => {
    for (const name of REQUIRED_VARS) {
      if (name === '--radius') continue;
      expect(valueOf(name)).not.toMatch(/#[0-9a-f]/i);
    }
  });

  it('color channels are in the H S% L% shape', () => {
    const channelRe = /^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/;
    for (const name of REQUIRED_VARS) {
      if (name === '--radius') continue;
      expect(valueOf(name), `${name} = "${valueOf(name)}"`).toMatch(channelRe);
    }
  });

  it('maps the exact DS v0 dark palette', () => {
    for (const [name, expected] of Object.entries(EXPECTED)) {
      expect(valueOf(name)).toBe(expected);
    }
  });

  it('exposes the channels under both :root and .dark', () => {
    expect(declarations).toMatch(/:root\s*,\s*\.dark/);
  });
});
