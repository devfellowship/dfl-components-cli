import { danglingScreenIds } from '@devfellowship/ux-paths-spec';
import type { UxPathsDoc } from '@devfellowship/ux-paths-spec';

/**
 * The three rules a JSON Schema CANNOT express, and which `ux-paths validate`
 * therefore used to accept in silence.
 *
 * Measured on 2026-09-02, against the published CLI: a `flows.json` whose flow
 * starts at a screen that does not exist, walks a step that does not exist, and
 * declares the same `screen.id` twice, printed
 *
 *     OK <path> conforms to schema v1.
 *
 * and exited 0. Every one of those documents is broken, and every one of them
 * is broken in a way the schema is structurally unable to see:
 *
 *   - JSON Schema has no cross-reference. `flow.start`, `step.screen` and
 *     `action.next_screen` all name a `screen.id`, and nothing in a schema can
 *     assert that the named screen exists.
 *   - JSON Schema has no uniqueness constraint across array items keyed by a
 *     field, so a repeated `screen.id` validates cleanly.
 *
 * `screen.id` is not an incidental field. The schema's own description calls it
 * "the STICKY 1:1 JOIN KEY across apps" — every cross-app comparison, every
 * atlas edge and every annotation is built on that join. A duplicate silently
 * breaks the join; a dangling reference silently draws an edge into nothing.
 *
 * These are the SAME three checks `dfl-ci:scripts/ux-paths-guard.mjs` already
 * runs in CI (`unique-ids`, `whole-flows`, `action-targets`). This file exists
 * so the CLI a person runs agrees with the CI job that judges them. It adds no
 * new policy: before this change the two surfaces disagreed, and the CLI — the
 * one a human or an agent actually runs — was the permissive one.
 *
 * ⚠️ Only ONE repo in the fleet runs that CI guard (`iterahq/itera-player`,
 * through its vendored copy; measured 2026-09-02 across 185 repositories in
 * `devfellowship`, `iterahq` and `taigfs`). Twenty-two other repositories carry
 * a `flows.json` with no CI check at all. For those, this CLI is the only thing
 * that ever looks at the document.
 *
 * NO NETWORK. Like `loadSchemaV1`, every check here is pure computation over the
 * parsed document.
 */
export interface StructuralProblem {
  /** Stable rule name, shared with `dfl-ci:scripts/ux-paths-guard.mjs`. */
  rule: 'unique-ids' | 'whole-flows' | 'action-targets';
  /** One-line statement of what went wrong. */
  message: string;
  /** Where it went wrong, one entry per offending reference. */
  detail: string[];
}

interface ScreenLike {
  id?: unknown;
  actions?: unknown;
}

interface ActionLike {
  id?: unknown;
  next_screen?: unknown;
}

function screensOf(doc: unknown): ScreenLike[] {
  const screens = (doc as { screens?: unknown })?.screens;
  return Array.isArray(screens) ? (screens as ScreenLike[]) : [];
}

function flowsOf(doc: unknown): Record<string, unknown>[] {
  const flows = (doc as { flows?: unknown })?.flows;
  return Array.isArray(flows) ? (flows as Record<string, unknown>[]) : [];
}

/**
 * Rule `unique-ids` — every `screen.id` appears once.
 */
function checkUniqueIds(doc: unknown): StructuralProblem | null {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const screen of screensOf(doc)) {
    const id = screen?.id;
    if (typeof id !== 'string') continue;
    if (seen.has(id)) duplicates.add(id);
    else seen.add(id);
  }
  if (duplicates.size === 0) return null;
  return {
    rule: 'unique-ids',
    message: `${duplicates.size} duplicate screen id${duplicates.size === 1 ? '' : 's'}`,
    detail: [...duplicates].sort().map((id) => `  - "${id}" is declared more than once`),
  };
}

/**
 * Rule `whole-flows` — every `flow.start` and every `step.screen` names a
 * declared screen.
 *
 * The reference walk is `danglingScreenIds` from `@devfellowship/ux-paths-spec`,
 * not a second copy of it here. A flow step is a bare screen id in v1.0 and a
 * `{ screen, … }` object in v1.1, and reading `.screen` off a string is exactly
 * the mistake the package's `stepScreenId` exists to stop.
 */
function checkWholeFlows(doc: unknown): StructuralProblem | null {
  // `danglingScreenIds` assumes the arrays are arrays — it is written for a
  // document that already passed the schema. These checks must also be TOTAL:
  // a guard that throws on junk input is a guard someone wraps in a try/catch
  // and stops reading. So the walk gets a normalised document, and the package
  // still owns the one rule that is easy to get wrong (a v1.0 step is a bare
  // string, a v1.1 step is an object — `stepScreenId` is what knows that).
  const normalised = {
    screens: screensOf(doc),
    flows: flowsOf(doc).map((flow) => ({
      ...flow,
      steps: Array.isArray((flow as { steps?: unknown })?.steps)
        ? (flow as { steps: unknown[] }).steps
        : [],
    })),
  } as unknown as UxPathsDoc;

  const dangling = danglingScreenIds(normalised);
  if (dangling.length === 0) return null;

  // Locate each one, so the message says which flow to open.
  const flows = flowsOf(doc);
  const where = new Map<string, Set<string>>();
  flows.forEach((flow, i) => {
    const f = flow as { name?: unknown; start?: unknown; steps?: unknown };
    const label = typeof f?.name === 'string' ? f.name : `flows[${i}]`;
    const referenced: unknown[] = [
      f?.start,
      ...(Array.isArray(f?.steps) ? f.steps : []).map((step: unknown) =>
        typeof step === 'string' ? step : (step as { screen?: unknown })?.screen,
      ),
    ];
    for (const id of referenced) {
      if (typeof id !== 'string' || !dangling.includes(id)) continue;
      if (!where.has(id)) where.set(id, new Set());
      where.get(id)?.add(label);
    }
  });

  return {
    rule: 'whole-flows',
    message: `${dangling.length} screen id${dangling.length === 1 ? '' : 's'} referenced by a flow that no screen declares`,
    detail: dangling
      .slice()
      .sort()
      .map((id) => {
        const labels = [...(where.get(id) ?? [])].sort().join(', ');
        return `  - "${id}"${labels ? `   (referenced by: ${labels})` : ''}`;
      }),
  };
}

/**
 * Rule `action-targets` — every `screen.actions[].next_screen` names a declared
 * screen.
 *
 * A flow is a NAMED PATH through the actions, so checking only flows leaves
 * every action no flow happens to walk unchecked — and the atlas draws them all.
 *
 * An EMPTY string is an ABSENT reference, not a dangling one. A repo that writes
 * `next_screen: ""` to mean "the user stays here" is not naming a screen that
 * vanished. Same reading as `dfl-ci:scripts/ux-paths-guard.mjs`.
 */
function checkActionTargets(doc: unknown): StructuralProblem | null {
  const screens = screensOf(doc);
  const declared = new Set(
    screens.map((s) => s?.id).filter((id): id is string => typeof id === 'string'),
  );
  const dangling = new Map<string, Set<string>>();
  for (const screen of screens) {
    const actions = Array.isArray(screen?.actions) ? (screen.actions as ActionLike[]) : [];
    for (const action of actions) {
      const target = action?.next_screen;
      if (typeof target !== 'string' || target.trim() === '') continue;
      if (declared.has(target)) continue;
      const site = `${typeof screen?.id === 'string' ? screen.id : '<screen with no id>'}.${
        typeof action?.id === 'string' ? action.id : '<action with no id>'
      }`;
      if (!dangling.has(target)) dangling.set(target, new Set());
      dangling.get(target)?.add(site);
    }
  }
  if (dangling.size === 0) return null;
  return {
    rule: 'action-targets',
    message: `${dangling.size} action target${dangling.size === 1 ? '' : 's'} that no screen declares`,
    detail: [...dangling.keys()]
      .sort()
      .map((id) => `  - "${id}"   (targeted by: ${[...(dangling.get(id) ?? [])].sort().join(', ')})`),
  };
}

/**
 * Run every structural rule. Returns an empty array when the document is sound.
 *
 * Order is stable and matches `dfl-ci:scripts/ux-paths-guard.mjs`, so the two
 * surfaces report the same problems in the same sequence.
 */
export function checkStructure(doc: unknown): StructuralProblem[] {
  return [checkUniqueIds(doc), checkWholeFlows(doc), checkActionTargets(doc)].filter(
    (p): p is StructuralProblem => p !== null,
  );
}
