import { describe, it, expect } from 'vitest';
import { stampPreserveFormat, replaceTopLevelStringField } from '../preserve-format.js';

describe('preserve-format stamp (minimal diff)', () => {
  // A flows.json whose arrays use COMPACT formatting — exactly the kind of
  // formatting a naive JSON.stringify(doc, null, 2) re-stamp would destroy.
  const compact = `{
  "schema_version": "1.2.0",
  "app_id": "dfl-learn",
  "app_version": "2026-05-01-aaaaaaa",
  "generated_at": "2026-05-01T00:00:00.000Z",
  "tech_stack": ["react", "vite"],
  "screens": [
    { "id": "home", "name": "Home", "components": ["Header", "Nav"] }
  ],
  "flows": [{ "name": "onboarding", "start": "home", "steps": ["home"] }]
}
`;

  it('updates ONLY app_version and generated_at, preserving all other formatting', () => {
    const out = stampPreserveFormat(compact, {
      app_version: '2026-06-10-bbbbbbb',
      generated_at: '2026-06-10T12:00:00.000Z',
    });

    // Volatile fields changed.
    expect(out).toContain('"app_version": "2026-06-10-bbbbbbb"');
    expect(out).toContain('"generated_at": "2026-06-10T12:00:00.000Z"');

    // Everything else is byte-identical — compact arrays were NOT expanded.
    expect(out).toContain('"tech_stack": ["react", "vite"]');
    expect(out).toContain('{ "id": "home", "name": "Home", "components": ["Header", "Nav"] }');
    expect(out).toContain('"flows": [{ "name": "onboarding", "start": "home", "steps": ["home"] }]');

    // The diff is exactly two lines (the two volatile fields).
    const before = compact.split('\n');
    const after = out.split('\n');
    expect(after.length).toBe(before.length);
    const changed = before.filter((line, i) => line !== after[i]);
    expect(changed).toEqual([
      '  "app_version": "2026-05-01-aaaaaaa",',
      '  "generated_at": "2026-05-01T00:00:00.000Z",',
    ]);
  });

  it('is idempotent — restamping the same values yields byte-identical text', () => {
    const fields = { app_version: '2026-06-10-bbbbbbb', generated_at: '2026-06-10T12:00:00.000Z' };
    const once = stampPreserveFormat(compact, fields);
    const twice = stampPreserveFormat(once, fields);
    expect(twice).toBe(once);
  });

  it('leaves text unchanged when the key is absent', () => {
    const noGen = `{ "app_version": "x" }`;
    const out = replaceTopLevelStringField(noGen, 'generated_at', '2026-06-10T12:00:00.000Z');
    expect(out).toBe(noGen);
  });

  it('escapes special characters in replacement values', () => {
    const raw = `{ "app_version": "x" }`;
    const out = replaceTopLevelStringField(raw, 'app_version', 'a"b\\c');
    expect(out).toBe('{ "app_version": "a\\"b\\\\c" }');
    // Round-trips through JSON.parse.
    expect(JSON.parse(out).app_version).toBe('a"b\\c');
  });
});
