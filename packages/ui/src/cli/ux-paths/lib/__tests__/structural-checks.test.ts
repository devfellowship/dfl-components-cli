import { describe, it, expect, vi, afterEach } from 'vitest';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { SCHEMA_V1 } from '@devfellowship/ux-paths-spec';
import { checkStructure } from '../structural-checks.js';

/**
 * THE POINT OF THESE TESTS.
 *
 * `ux-paths validate` used to be a gate that only ever passed once the schema
 * was reachable. Every document below is SCHEMA-VALID — the first test asserts
 * exactly that, with the real Ajv compile the command uses — and every one of
 * them is broken. Before `checkStructure`, the command printed `OK` for all of
 * them and exited 0.
 *
 * So each case is a mutation test in the strict sense: change one thing in a
 * sound document, and the guard must go from pass to fail. A test that only
 * feeds the guard good input proves nothing about a guard.
 */

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const schemaValidate = ajv.compile(SCHEMA_V1 as object);

/** A sound document. Every mutation below is this, with one field changed. */
function sound() {
  return {
    schema_version: '1.0.0',
    app_id: 'structural-checks-fixture',
    app_version: '2026-09-02-abc1234',
    screens: [
      {
        id: 'home',
        name: 'Home',
        route: '/',
        actions: [{ id: 'go_detail', label: 'Open', next_screen: 'detail' }],
      },
      { id: 'detail', name: 'Detail', route: '/d/:id' },
    ],
    flows: [{ name: 'Open detail', start: 'home', steps: ['home', 'detail'] }],
  };
}

describe('checkStructure — the rules JSON Schema cannot express', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes a sound document', () => {
    expect(checkStructure(sound())).toEqual([]);
  });

  it('does no network I/O', () => {
    // The schema half of this command was a raw.githubusercontent fetch until
    // 3.0.1. Nothing added on top of it may quietly reintroduce a network hop.
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('network access is not allowed from checkStructure'));
    checkStructure(sound());
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  describe('every case below is SCHEMA-VALID and still wrong', () => {
    it('a duplicate screen.id — the sticky join key, declared twice', () => {
      const doc = sound();
      doc.screens.push({ id: 'home', name: 'Home Again', route: '/again' });

      // The half that makes this test worth anything: the schema says yes.
      expect(schemaValidate(doc)).toBe(true);

      const problems = checkStructure(doc);
      expect(problems.map((p) => p.rule)).toEqual(['unique-ids']);
      expect(problems[0].message).toContain('1 duplicate screen id');
      expect(problems[0].detail.join('\n')).toContain('"home"');
    });

    it('a flow that starts at a screen nobody declares', () => {
      const doc = sound();
      doc.flows[0].start = 'nowhere';

      expect(schemaValidate(doc)).toBe(true);

      const problems = checkStructure(doc);
      expect(problems.map((p) => p.rule)).toEqual(['whole-flows']);
      expect(problems[0].detail.join('\n')).toContain('"nowhere"');
      // The message must name the flow, or the author has to grep for it.
      expect(problems[0].detail.join('\n')).toContain('Open detail');
    });

    it('a flow step that walks a screen nobody declares', () => {
      const doc = sound();
      doc.flows[0].steps = ['home', 'ghost_screen'];

      expect(schemaValidate(doc)).toBe(true);
      expect(checkStructure(doc).map((p) => p.rule)).toEqual(['whole-flows']);
    });

    it('a v1.1 step OBJECT that walks a screen nobody declares', () => {
      // Reading `.screen` off a plain string is the classic bug here, so the
      // object form gets its own case rather than riding on the string one.
      const doc = sound() as unknown as {
        flows: { steps: unknown[] }[];
      };
      doc.flows[0].steps = ['home', { screen: 'ghost_screen', action: 'tap' }];

      expect(schemaValidate(doc)).toBe(true);
      expect(checkStructure(doc).map((p) => p.rule)).toEqual(['whole-flows']);
    });

    it('an action whose next_screen targets a screen nobody declares', () => {
      const doc = sound();
      doc.screens[0].actions = [{ id: 'go_detail', label: 'Open', next_screen: 'deleted_screen' }];

      expect(schemaValidate(doc)).toBe(true);

      const problems = checkStructure(doc);
      expect(problems.map((p) => p.rule)).toEqual(['action-targets']);
      expect(problems[0].detail.join('\n')).toContain('home.go_detail');
    });

    it('reports all three rules at once, in a stable order', () => {
      const doc = sound();
      doc.screens.push({ id: 'home', name: 'Dupe', route: '/dupe' });
      doc.flows[0].start = 'nowhere';
      doc.screens[0].actions = [{ id: 'go_detail', label: 'Open', next_screen: 'deleted_screen' }];

      expect(schemaValidate(doc)).toBe(true);
      expect(checkStructure(doc).map((p) => p.rule)).toEqual([
        'unique-ids',
        'whole-flows',
        'action-targets',
      ]);
    });
  });

  describe('what must NOT be reported', () => {
    it('an empty next_screen is an absent reference, not a dangling one', () => {
      // A repo writes `next_screen: ""` to mean "the user stays here". That is
      // not a screen that vanished, and calling it one would make the guard
      // noisy in exactly the place authors would learn to ignore it.
      const doc = sound();
      doc.screens[0].actions = [{ id: 'stay', label: 'Stay', next_screen: '' }];
      expect(checkStructure(doc)).toEqual([]);
    });

    it('a document with no flows and no actions has nothing to resolve', () => {
      const doc = { ...sound(), flows: [], screens: [{ id: 'only', name: 'Only' }] };
      expect(checkStructure(doc)).toEqual([]);
    });

    it('survives a malformed document without throwing', () => {
      // `validate` runs the schema first, so this shape cannot reach the checks
      // in the command. It can reach them from any other caller, and a guard
      // that throws is a guard that gets wrapped in a try/catch and ignored.
      expect(() => checkStructure({ screens: 'nope', flows: 42 })).not.toThrow();
      expect(() => checkStructure(null)).not.toThrow();
      expect(() => checkStructure(undefined)).not.toThrow();
    });
  });
});
