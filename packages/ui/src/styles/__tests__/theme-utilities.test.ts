import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Guard tests for the v1.2.1 chrome regression fixes.
 *
 * 1) The `@theme inline` token→utility mappings (--color-popover: var(--popover),
 *    --color-sidebar: var(--sidebar-background), …) MUST be reachable from the
 *    `/styles` (theme.css) export — not only from `/tailwind`. Otherwise apps
 *    that import `tailwindcss` + `@devfellowship/components/styles` (the common
 *    case) get DEAD bg-popover / bg-sidebar utilities → transparent popovers and
 *    a backgroundless sidebar. theme.css must @import the shared mappings file.
 *
 * 2) sidebar.tsx must NOT use bare custom-property arbitrary values like
 *    `w-[--sidebar-width]`. Under Tailwind v4 that compiles to the INVALID
 *    `width:--sidebar-width` (no var() wrapper) → width collapses to 0 → the
 *    sidebar reserves no layout space and main content spans the full viewport.
 *    They must be `w-[var(--sidebar-width)]`.
 */

const stylesDir = resolve(__dirname, '..');

describe('theme.css wires the shadcn-style utility mappings', () => {
  const themeCss = readFileSync(resolve(stylesDir, 'theme.css'), 'utf8');
  const mappings = readFileSync(resolve(stylesDir, 'theme-mappings.css'), 'utf8');

  it('theme.css imports theme-mappings.css', () => {
    expect(themeCss).toMatch(/@import\s+['"]\.\/theme-mappings\.css['"]/);
  });

  it('mappings register the popover + sidebar Tailwind color tokens', () => {
    expect(mappings).toMatch(/--color-popover:\s*var\(--popover\)/);
    expect(mappings).toMatch(/--color-popover-foreground:\s*var\(--popover-foreground\)/);
    expect(mappings).toMatch(/--color-sidebar:\s*var\(--sidebar-background\)/);
    expect(mappings).toMatch(/--color-sidebar-border:\s*var\(--sidebar-border\)/);
    expect(mappings).toMatch(/--color-sidebar-accent:\s*var\(--sidebar-accent\)/);
  });
});

describe('sidebar.tsx uses var()-wrapped custom-prop arbitrary values', () => {
  const sidebar = readFileSync(
    resolve(stylesDir, '..', 'components', 'sidebar.tsx'),
    'utf8',
  );

  it('has no bare [--custom-prop] arbitrary values (Tailwind v4 needs var())', () => {
    // Matches `[--foo]` that is NOT `[var(--foo)]` or part of `var(--foo)`.
    const bare = sidebar.match(/\[(--[a-z-]+)\]/g) ?? [];
    expect(bare).toEqual([]);
  });

  it('still references the sidebar width vars (wrapped in var())', () => {
    expect(sidebar).toMatch(/w-\[var\(--sidebar-width\)\]/);
    expect(sidebar).toMatch(/w-\[var\(--sidebar-width-icon\)\]/);
  });
});
