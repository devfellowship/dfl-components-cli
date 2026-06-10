import { describe, it, expect } from 'vitest';
import { flowsDiff } from '../flows-diff.js';
import type { UxPathsDoc } from '../types.js';

function makeDoc(partial: Partial<UxPathsDoc>): UxPathsDoc {
  return {
    schema_version: '1.0.0',
    app_id: 'demo',
    app_version: '2026-05-23-0000000',
    screens: [],
    flows: [],
    ...partial,
  };
}

describe('flowsDiff', () => {
  it('reports added screens that exist only in b', () => {
    const a = makeDoc({ screens: [{ id: 'home', name: 'Home' }] });
    const b = makeDoc({
      screens: [
        { id: 'home', name: 'Home' },
        { id: 'profile', name: 'Profile' },
      ],
    });
    const result = flowsDiff(a, b);
    expect(result.screens.added).toEqual(['profile']);
    expect(result.screens.removed).toEqual([]);
    expect(result.screens.common).toEqual(['home']);
  });

  it('reports removed screens that exist only in a', () => {
    const a = makeDoc({
      screens: [
        { id: 'home', name: 'Home' },
        { id: 'legacy', name: 'Legacy' },
      ],
    });
    const b = makeDoc({ screens: [{ id: 'home', name: 'Home' }] });
    const result = flowsDiff(a, b);
    expect(result.screens.removed).toEqual(['legacy']);
    expect(result.screens.added).toEqual([]);
  });

  it('diffs actions by screenId.actionId composite keys', () => {
    const a = makeDoc({
      screens: [
        {
          id: 'home',
          name: 'Home',
          actions: [
            { id: 'tap_lessons', label: 'Lessons' },
            { id: 'tap_settings', label: 'Settings' },
          ],
        },
      ],
    });
    const b = makeDoc({
      screens: [
        {
          id: 'home',
          name: 'Home',
          actions: [{ id: 'tap_lessons', label: 'Lessons' }],
        },
      ],
    });
    const result = flowsDiff(a, b);
    expect(result.actions.removed).toEqual(['home.tap_settings']);
    expect(result.actions.added).toEqual([]);
  });

  it('reports added and removed flows by name', () => {
    const a = makeDoc({ flows: [{ name: 'onboarding', start: 'home', steps: [] }] });
    const b = makeDoc({ flows: [{ name: 'checkout', start: 'cart', steps: [] }] });
    const result = flowsDiff(a, b);
    expect(result.flows.added).toEqual(['checkout']);
    expect(result.flows.removed).toEqual(['onboarding']);
  });

  it('detects changed flows when start or steps differ', () => {
    const a = makeDoc({
      flows: [{ name: 'onboarding', start: 'home', steps: ['home', 'welcome'] }],
    });
    const b = makeDoc({
      flows: [{ name: 'onboarding', start: 'splash', steps: ['splash', 'welcome', 'done'] }],
    });
    const result = flowsDiff(a, b);
    expect(result.flows.changed).toHaveLength(1);
    expect(result.flows.changed[0].name).toBe('onboarding');
    expect(result.flows.changed[0].reason).toContain('start');
    expect(result.flows.changed[0].reason).toContain('steps changed');
  });
});
