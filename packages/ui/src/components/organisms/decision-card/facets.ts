/**
 * The context facets of a decision: `plans.plan_questions.context_facets`
 * (jsonb: kind, door, app_slugs, diagram_id, chart). The field was named
 * `card` before (TG 31555). Pure: no React, no fetch.
 */
import { DECISION_KINDS, MAX_DECISION_APPS, type DecisionDoor, type DecisionKind } from "./marks";

export interface ContextFacets {
  kind: DecisionKind | null;
  door: DecisionDoor | null;
  appSlugs: string[];
  diagramId: string | null;
  /** The raw chart; `readChart` checks it against the options. */
  chart: unknown;
}

// The contract spells the door one_way / two_way; accept the other common spellings.
const DOOR_SPELLINGS: Record<string, DecisionDoor> = {
  one_way: "one_way",
  "one-way": "one_way",
  oneway: "one_way",
  two_way: "two_way",
  "two-way": "two_way",
  twoway: "two_way",
};

/** Trimmed, non-empty, unique strings of an array; anything else gives []. */
export function cleanSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    if (typeof v !== "string") continue;
    const s = v.trim();
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}

/**
 * `context_facets` -> clean facets, or null when there are none (null, not an
 * object). Accepts the jsonb as an object or as a JSON string. An unknown kind
 * or door is dropped, never shown raw.
 */
export function readContextFacets(raw: unknown): ContextFacets | null {
  let c = raw;
  if (typeof c === "string") {
    try {
      c = JSON.parse(c);
    } catch {
      return null;
    }
  }
  if (!c || typeof c !== "object" || Array.isArray(c)) return null;
  const o = c as Record<string, unknown>;
  return {
    kind: (DECISION_KINDS as unknown[]).includes(o.kind) ? (o.kind as DecisionKind) : null,
    door: typeof o.door === "string" ? DOOR_SPELLINGS[o.door.trim().toLowerCase()] ?? null : null,
    appSlugs: cleanSlugs(o.app_slugs).slice(0, MAX_DECISION_APPS),
    diagramId: typeof o.diagram_id === "string" && o.diagram_id.trim() ? o.diagram_id.trim() : null,
    chart: o.chart ?? null,
  };
}
