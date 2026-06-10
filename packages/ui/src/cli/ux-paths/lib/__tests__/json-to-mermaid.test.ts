import { describe, it, expect } from 'vitest';
import { jsonToMermaid, _internal } from '../json-to-mermaid.js';
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

describe('jsonToMermaid', () => {
  it('emits a graph TD header with app metadata', () => {
    const out = jsonToMermaid(makeDoc({}));
    expect(out).toContain('graph TD');
    expect(out).toContain('%% app_id: demo');
    expect(out).toContain('%% app_version: 2026-05-23-0000000');
  });

  it('renders screens as nodes and action edges', () => {
    const out = jsonToMermaid(
      makeDoc({
        screens: [
          {
            id: 'home',
            name: 'Home',
            actions: [{ id: 'go', label: 'Go', next_screen: 'profile' }],
          },
          { id: 'profile', name: 'Profile' },
        ],
      }),
    );
    expect(out).toContain('home["Home"]');
    expect(out).toContain('profile["Profile"]');
    expect(out).toContain('home -->|Go| profile');
  });

  it('prefixes auth-required screens with a lock', () => {
    const out = jsonToMermaid(
      makeDoc({
        screens: [{ id: 'secret', name: 'Secret', prerequisites: { auth_required: true } }],
      }),
    );
    expect(out).toContain('🔒 Secret');
  });

  it('renders flows as subgraphs', () => {
    const out = jsonToMermaid(
      makeDoc({
        screens: [
          { id: 'home', name: 'Home' },
          { id: 'done', name: 'Done' },
        ],
        flows: [{ name: 'finish', start: 'home', steps: ['done'] }],
      }),
    );
    expect(out).toContain('subgraph flow_finish["Flow: finish"]');
    expect(out).toContain('home -.-> done');
  });

  it('sanitizes ids and escapes labels', () => {
    expect(_internal.sanitizeId('foo/bar baz')).toBe('foo_bar_baz');
    expect(_internal.escapeLabel('say "hi"')).toBe('say \\"hi\\"');
  });
});
