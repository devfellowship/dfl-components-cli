/**
 * The marks of a decision: seven type glyphs, two door marks and two blocking
 * marks, from the legend of the approved Decision Card canvas.
 *
 * Moved from dfl-os `ui/src/components/decision-card/marks.tsx` (plan
 * 20261115-dc-p2-one-decision-card T4). ONE glyph source for the fleet: the
 * Decision Card strip and any queue row draw from this file.
 *
 * Every mark has a tooltip on hover (`title`), tap and keyboard focus
 * (`data-tip`, `tabIndex=0`; `decision-card.css` shows it inside the strip).
 * A mark whose value is absent renders NOTHING: pass `null`, get `null`.
 *
 * The type renders in three forms by one prop: `word`, `icon`, or `labeled` (the glyph
 * and the word, strip 1 of the approved canvas).
 */
import type { ReactNode } from "react";

export type DecisionKind =
  | "strategy"
  | "product_ux"
  | "schema_data"
  | "architecture"
  | "security_access"
  | "money"
  | "process";
export type DecisionDoor = "one_way" | "two_way";
export type TypeForm = "word" | "icon" | "labeled";

/** The seven decision types (contract in dfl-os-commands). */
export const DECISION_KINDS: DecisionKind[] = [
  "strategy",
  "product_ux",
  "schema_data",
  "architecture",
  "security_access",
  "money",
  "process",
];

export const KIND_LABELS: Record<DecisionKind, string> = {
  strategy: "Strategy",
  product_ux: "Product/UX",
  schema_data: "Schema/Data",
  architecture: "Architecture",
  security_access: "Security/Access",
  money: "Money",
  process: "Process",
};

/** What each type means, one short line (shown after the name in the tooltip). */
export const KIND_MEANINGS: Record<DecisionKind, string> = {
  strategy: "direction, market, positioning",
  product_ux: "what users see and do",
  schema_data: "tables, columns, data shape",
  architecture: "services, libraries, structure",
  security_access: "who can read or change what",
  money: "cost, price, budget",
  process: "how the team and agents work",
};

export const DOORS: DecisionDoor[] = ["one_way", "two_way"];
export const DOOR_LABELS: Record<DecisionDoor, string> = { one_way: "One-way door", two_way: "Two-way door" };
export const DOOR_TIPS: Record<DecisionDoor, string> = {
  one_way: "One-way door · expensive to undo",
  two_way: "Two-way door · cheap to undo",
};
export const BLOCKING_TIPS = { on: "Blocks firing · agents wait on this answer", off: "Not blocking" } as const;

/** At most three apps on a card (contract: 0 to 3 slugs). */
export const MAX_DECISION_APPS = 3;

// The canvas glyphs, 16x16 viewBox, filled (a few use a stroke).
export const KIND_GLYPHS: Record<DecisionKind, ReactNode> = {
  strategy: <><path d="M2.5 1.5h2v13h-2z" /><path d="M4.5 2h9l-2.5 3.5 2.5 3.5h-9z" /></>,
  product_ux: <path d="M3 1.2l10.5 6.6-4.6 1.2 2.8 4.8-2 1.2-2.8-4.8L3.6 13.6z" />,
  schema_data: <path fillRule="evenodd" d="M8 1.2c3.4 0 6 1.1 6 2.7v8.2c0 1.6-2.6 2.7-6 2.7s-6-1.1-6-2.7V3.9C2 2.3 4.6 1.2 8 1.2zm0 1.7c-2.6 0-4.1.6-4.1 1s1.5 1 4.1 1 4.1-.6 4.1-1-1.5-1-4.1-1zM3.9 7.6v1.2c.9.5 2.3.8 4.1.8s3.2-.3 4.1-.8V7.6c-1 .5-2.5.8-4.1.8s-3.1-.3-4.1-.8z" />,
  architecture: <><rect x="1.5" y="9.5" width="13" height="5" rx="1" /><rect x="1.5" y="2" width="5.5" height="6" rx="1" /><rect x="9" y="2" width="5.5" height="6" rx="1" /></>,
  security_access: <><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M5 7.2V5a3 3 0 0 1 6 0v2.2" /><rect x="2.5" y="7" width="11" height="8" rx="1.5" /></>,
  money: <path fillRule="evenodd" d="M2 3.5h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM8 5.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z" />,
  process: <><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M13 8a5 5 0 0 1-8.7 3.4" /><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M3 8a5 5 0 0 1 8.7-3.4" /><path d="M13.6 1.4v5h-5z" /><path d="M2.4 14.6v-5h5z" /></>,
};

const DOOR_GLYPHS: Record<DecisionDoor, ReactNode> = {
  one_way: <><path d="M1 6.8h6.5V3.5L12 8l-4.5 4.5V9.2H1z" /><rect x="13" y="2" width="2" height="12" rx=".6" /></>,
  two_way: <path d="M1 5l3.5-3.5V4H15v2H4.5v2.5zM15 11l-3.5 3.5V12H1v-2h10.5V7.5z" />,
};

const BLOCKING_GLYPHS = {
  on: <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM4 7h8v2H4z" />,
  off: <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 8 3z" />,
};

/** Loose spellings of a type (a queue reads `card.kind` as free text) mapped to the closed list. */
const KIND_SPELLINGS: Array<[RegExp, DecisionKind]> = [
  [/^strateg/, "strategy"],
  [/^(ux|product)/, "product_ux"],
  [/^(schema|data)/, "schema_data"],
  [/^(arch|tech|lib)/, "architecture"],
  [/^(sec|access|auth)/, "security_access"],
  [/^(money|cost|finan)/, "money"],
  [/^(process|ops)/, "process"],
];

/** The closed-list kind for a loose value, or null when the value is empty or unknown. */
export function looseKind(value: string | null | undefined): DecisionKind | null {
  const key = (value ?? "").trim().toLowerCase();
  if (!key) return null;
  if ((DECISION_KINDS as string[]).includes(key)) return key as DecisionKind;
  return KIND_SPELLINGS.find(([re]) => re.test(key))?.[1] ?? null;
}

/** The tooltip of a type: name and meaning. */
export function kindTip(kind: DecisionKind): string {
  return `Decision type · ${KIND_LABELS[kind]} · ${KIND_MEANINGS[kind]}`;
}

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  );
}

export interface DecisionMarkProps {
  className?: string;
  testId?: string;
  /** Extra data attributes of the host element (the strip keeps `data-strip="type"`). */
  attrs?: Record<string, string>;
}

/**
 * A decision type. `kind` is the closed-list value; `null` renders nothing. `raw` is an unknown,
 * non-empty value a queue still shows (a neutral dot, never a guessed glyph).
 */
export function TypeGlyph({
  kind,
  form = "icon",
  raw = null,
  className,
  testId,
  attrs,
}: DecisionMarkProps & { kind: DecisionKind | null; form?: TypeForm; raw?: string | null }) {
  if (!kind && !raw) return null;
  const label = kind ? KIND_LABELS[kind] : (raw as string);
  const tip = kind ? kindTip(kind) : `Decision type · ${label}`;
  if (form === "word") {
    return (
      <span className={className} tabIndex={0} title={tip} data-tip={tip} data-testid={testId} data-glyph-form="word" data-kind={kind ?? undefined} {...attrs}>
        {label}
      </span>
    );
  }
  if (form === "labeled") {
    return (
      <span className={className} tabIndex={0} title={tip} data-tip={tip} data-testid={testId} data-glyph-form="labeled" data-kind={kind ?? undefined} {...attrs}>
        <Svg>{kind ? KIND_GLYPHS[kind] : <circle cx="8" cy="8" r="3.5" />}</Svg>
        {label}
      </span>
    );
  }
  return (
    <span
      className={className}
      role="img"
      tabIndex={0}
      aria-label={tip}
      title={tip}
      data-tip={tip}
      data-testid={testId}
      data-glyph-form="icon"
      data-kind={kind ?? undefined}
      {...attrs}
    >
      <Svg>{kind ? KIND_GLYPHS[kind] : <circle cx="8" cy="8" r="3.5" />}</Svg>
    </span>
  );
}

/** The door of a decision. `null` renders nothing. */
export function DoorMark({ door, className, testId, attrs }: DecisionMarkProps & { door: DecisionDoor | null }) {
  if (!door) return null;
  return (
    <span
      className={className}
      role="img"
      tabIndex={0}
      aria-label={DOOR_TIPS[door]}
      title={DOOR_TIPS[door]}
      data-tip={DOOR_TIPS[door]}
      data-testid={testId}
      data-door={door}
      {...attrs}
    >
      <Svg>{DOOR_GLYPHS[door]}</Svg>
    </span>
  );
}

/** Blocks firing (a filled bar in a disc) or not (an empty ring). Always rendered: not blocking is a state. */
export function BlockingMark({ on, className, testId, attrs }: DecisionMarkProps & { on: boolean }) {
  const tip = on ? BLOCKING_TIPS.on : BLOCKING_TIPS.off;
  return (
    <span
      className={className}
      role="img"
      tabIndex={0}
      aria-label={tip}
      title={tip}
      data-tip={tip}
      data-testid={testId}
      data-blocking={on ? "true" : "false"}
      {...attrs}
    >
      <Svg>{on ? BLOCKING_GLYPHS.on : BLOCKING_GLYPHS.off}</Svg>
    </span>
  );
}
