/**
 * RoadmapDocument — the versioned JSON contract of the `Roadmap` organism.
 *
 * The component takes a document, not coordinates. A knowledge map is authored
 * (or emitted by a learning engine) as a list of nodes that each name a COLUMN
 * and a ROW, plus edges, groups and a legend. The renderer places them in a
 * 3-column CSS grid. No absolute pixel travels in this shape.
 *
 * Why the shape looks like this (plan ADR-2): roadmap.sh stores `position {x,y}`
 * and scales one fixed canvas, so a 17 px label renders at 6.2 px on a 390 px
 * phone. Absolute coordinates cannot reflow. `column` + `order` can. A layout
 * engine (dagre, ELK) cannot pin a node to a lane, so there is no layout engine
 * either — the author owns the placement, and the grid owns the pixels.
 *
 * Colour is a TOKEN, never a hex (plan ADR-6). `tone` is one of eight names and
 * the schema REJECTS any other string, `"#fdff00"` included. That closed
 * vocabulary is what keeps the dark design system, the editorial surface and a
 * downstream `--s-*` rebrand all working from one document.
 *
 * The live progress state does NOT live in the document (plan ADR-8). A document
 * is shared; a learner's state is not. `RoadmapStateOverlay` carries it, and the
 * overlay wins over an authored `node.state`.
 *
 * Versioning rule: `version` is a literal. An additive OPTIONAL field is a minor
 * release and does not change the literal. A removed field, a renamed field or a
 * changed DEFAULT becomes `roadmap/v2`, ships with `upgradeV1toV2()` next to this
 * schema, and `parseRoadmapDocument()` accepts both for one major release of the
 * package. `meta` is never versioned.
 */
import { z } from "zod";

// ─── Enumerations ────────────────────────────────────────────────────────────

export const ROADMAP_COLUMNS = ["left", "center", "right"] as const;
export const ROADMAP_TONES = [
  "primary",
  "secondary",
  "accent",
  "muted",
  "success",
  "info",
  "danger",
  "neutral",
] as const;
export const ROADMAP_NODE_KINDS = [
  "topic",
  "subtopic",
  "label",
  "title",
  "paragraph",
  "button",
  "legend",
] as const;
export const ROADMAP_NODE_STATES = ["todo", "done", "learning", "skipped", "locked"] as const;
export const ROADMAP_EDGE_STYLES = ["solid", "dashed", "dotted"] as const;
export const ROADMAP_EDGE_ROUTES = ["auto", "straight", "elbow", "curve"] as const;
export const ROADMAP_ARROWS = ["none", "end", "both"] as const;
export const ROADMAP_LEGEND_PLACEMENTS = ["top", "bottom", "inline"] as const;

export type RoadmapColumn = (typeof ROADMAP_COLUMNS)[number];
export type RoadmapTone = (typeof ROADMAP_TONES)[number];
export type RoadmapNodeKind = (typeof ROADMAP_NODE_KINDS)[number];
export type RoadmapNodeState = (typeof ROADMAP_NODE_STATES)[number];
export type RoadmapEdgeStyle = (typeof ROADMAP_EDGE_STYLES)[number];
export type RoadmapEdgeRoute = (typeof ROADMAP_EDGE_ROUTES)[number];
export type RoadmapArrow = (typeof ROADMAP_ARROWS)[number];
export type RoadmapLegendPlacement = (typeof ROADMAP_LEGEND_PLACEMENTS)[number];

// ─── Types ───────────────────────────────────────────────────────────────────

/** A glyph drawn half inside and half outside the node border. */
export interface RoadmapIcon {
  /** A `lucide-react` icon name, kebab-case. */
  name: string;
  side: "left" | "right";
  tone?: RoadmapTone;
}

/** A button INSIDE a node. Exactly one of `href` or `actionId`. */
export interface RoadmapAction {
  label: string;
  href?: string;
  /** Handed back to `onAction(actionId, node)`; the component never reads it. */
  actionId?: string;
  tone?: RoadmapTone;
}

export interface RoadmapLink {
  label: string;
  href: string;
}

export interface RoadmapNode {
  /** `/^[A-Za-z0-9_-]{1,64}$/`, unique in the document. */
  id: string;
  column: RoadmapColumn;
  /** Integer >= 0 — the grid ROW. Unique per `(column, order)` cell. */
  order: number;
  /** Default 1. `3` = full width and the `column` is ignored. */
  span?: 1 | 2 | 3;
  kind: RoadmapNodeKind;
  label: string;
  /** Paragraph body, or the tooltip of a topic. */
  description?: string;
  /** Default: topic -> primary, subtopic -> secondary, button -> primary, else neutral. */
  tone?: RoadmapTone;
  icon?: RoadmapIcon;
  /** Id of a legend entry; draws that entry's icon and tone on the node. */
  badge?: string;
  /** Authored default. A `RoadmapStateOverlay` wins over it. */
  state?: RoadmapNodeState;
  action?: RoadmapAction;
  /** The whole node becomes a link. */
  href?: string;
  /** `paragraph` or `label`: a list of links (the roadmap.sh `linksgroup`). */
  links?: RoadmapLink[];
  /** Opaque; passed back on click, never read by the component. */
  meta?: Record<string, unknown>;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  /** Default `dashed` — plan ADR-5. 2 719 of 4 411 roadmap.sh edges are dashed. */
  style?: RoadmapEdgeStyle;
  /** <= 40 chars. A NEW capability: roadmap.sh has no edge labels at all. */
  label?: string;
  /** Default `auto`. */
  route?: RoadmapEdgeRoute;
  /** Default `none`. */
  arrow?: RoadmapArrow;
  tone?: RoadmapTone;
}

/**
 * A group is an inclusive RANGE over `order`, not a box (plan ADR-3). A rect
 * cannot reflow; a range spans the same rows at every width.
 */
export interface RoadmapGroup {
  id: string;
  title?: string;
  /** Default `neutral`. */
  tone?: RoadmapTone;
  from: number;
  to: number;
  /** Default: all three columns. */
  columns?: RoadmapColumn[];
  description?: string;
}

export interface RoadmapLegendEntry {
  id: string;
  label: string;
  tone: RoadmapTone;
  /** A `lucide-react` icon name, kebab-case. */
  icon?: string;
}

export interface RoadmapLegend {
  entries: RoadmapLegendEntry[];
  /** `inline` = drawn where a node of kind `legend` sits. Default `top`. */
  placement?: RoadmapLegendPlacement;
}

export interface RoadmapDocument {
  version: "roadmap/v1";
  title?: string;
  /** v1 accepts only `down`. */
  direction: "down";
  /** v1 accepts only 3. */
  columns: 3;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  groups: RoadmapGroup[];
  legend?: RoadmapLegend;
  meta?: Record<string, unknown>;
}

/** The live state, kept OUT of the document — plan ADR-8. Unknown ids are ignored. */
export interface RoadmapStateOverlay {
  version: "roadmap-state/v1";
  nodes: Record<string, RoadmapNodeState>;
}

// ─── Documented defaults ─────────────────────────────────────────────────────
//
// The schema does NOT write these into the parsed object: `parseRoadmapDocument`
// returns exactly what the author wrote, so a round trip through the parser is
// byte-stable and a document stays diffable. The renderer and the layout helpers
// read the defaults through the `resolve*` functions below.

export const DEFAULT_NODE_SPAN = 1 as const;
export const DEFAULT_EDGE_STYLE: RoadmapEdgeStyle = "dashed";
export const DEFAULT_EDGE_ROUTE: RoadmapEdgeRoute = "auto";
export const DEFAULT_EDGE_ARROW: RoadmapArrow = "none";
export const DEFAULT_GROUP_TONE: RoadmapTone = "neutral";
export const DEFAULT_LEGEND_PLACEMENT: RoadmapLegendPlacement = "top";
export const DEFAULT_NODE_STATE: RoadmapNodeState = "todo";

/** Per-kind tone default. Every kind that is not listed falls back to `neutral`. */
export const NODE_KIND_DEFAULT_TONE: Record<RoadmapNodeKind, RoadmapTone> = {
  topic: "primary",
  subtopic: "secondary",
  button: "primary",
  label: "neutral",
  title: "neutral",
  paragraph: "neutral",
  legend: "neutral",
};

export const resolveNodeSpan = (node: RoadmapNode): 1 | 2 | 3 => node.span ?? DEFAULT_NODE_SPAN;
export const resolveNodeTone = (node: RoadmapNode): RoadmapTone =>
  node.tone ?? NODE_KIND_DEFAULT_TONE[node.kind];
export const resolveEdgeStyle = (edge: RoadmapEdge): RoadmapEdgeStyle =>
  edge.style ?? DEFAULT_EDGE_STYLE;
export const resolveEdgeRoute = (edge: RoadmapEdge): RoadmapEdgeRoute =>
  edge.route ?? DEFAULT_EDGE_ROUTE;
export const resolveEdgeArrow = (edge: RoadmapEdge): RoadmapArrow =>
  edge.arrow ?? DEFAULT_EDGE_ARROW;
export const resolveGroupTone = (group: RoadmapGroup): RoadmapTone =>
  group.tone ?? DEFAULT_GROUP_TONE;
export const resolveGroupColumns = (group: RoadmapGroup): RoadmapColumn[] =>
  group.columns && group.columns.length > 0 ? group.columns : [...ROADMAP_COLUMNS];
export const resolveLegendPlacement = (legend: RoadmapLegend): RoadmapLegendPlacement =>
  legend.placement ?? DEFAULT_LEGEND_PLACEMENT;

/** The overlay wins over the authored `node.state` — plan ADR-8. */
export const resolveNodeState = (
  node: RoadmapNode,
  overlay?: RoadmapStateOverlay,
): RoadmapNodeState => overlay?.nodes[node.id] ?? node.state ?? DEFAULT_NODE_STATE;

// ─── Schema ──────────────────────────────────────────────────────────────────

export const ROADMAP_NODE_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
export const ROADMAP_EDGE_LABEL_MAX = 40;
export const ROADMAP_LABEL_MAX = 200;

const columnSchema = z.enum(ROADMAP_COLUMNS);
const toneSchema = z.enum(ROADMAP_TONES);
const idSchema = z.string().regex(ROADMAP_NODE_ID_PATTERN, "must match /^[A-Za-z0-9_-]{1,64}$/");
const metaSchema = z.record(z.unknown());

export const roadmapIconSchema = z
  .object({
    name: z.string().min(1).max(64),
    side: z.enum(["left", "right"]),
    tone: toneSchema.optional(),
  })
  .strict();

export const roadmapActionSchema = z
  .object({
    label: z.string().min(1).max(80),
    href: z.string().min(1).optional(),
    actionId: z.string().min(1).optional(),
    tone: toneSchema.optional(),
  })
  .strict()
  .superRefine((action, ctx) => {
    const given = [action.href, action.actionId].filter((v) => v !== undefined).length;
    if (given !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["href"],
        message: "an action needs exactly one of `href` or `actionId`",
      });
    }
  });

export const roadmapLinkSchema = z
  .object({ label: z.string().min(1).max(120), href: z.string().min(1) })
  .strict();

export const roadmapNodeStateSchema = z.enum(ROADMAP_NODE_STATES);

export const roadmapNodeSchema = z
  .object({
    id: idSchema,
    column: columnSchema,
    order: z.number().int().min(0),
    span: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    kind: z.enum(ROADMAP_NODE_KINDS),
    label: z.string().min(1).max(ROADMAP_LABEL_MAX),
    description: z.string().max(2000).optional(),
    tone: toneSchema.optional(),
    icon: roadmapIconSchema.optional(),
    badge: z.string().min(1).optional(),
    state: roadmapNodeStateSchema.optional(),
    action: roadmapActionSchema.optional(),
    href: z.string().min(1).optional(),
    links: z.array(roadmapLinkSchema).optional(),
    meta: metaSchema.optional(),
  })
  .strict();

export const roadmapEdgeSchema = z
  .object({
    id: idSchema,
    source: z.string().min(1),
    target: z.string().min(1),
    style: z.enum(ROADMAP_EDGE_STYLES).optional(),
    label: z.string().min(1).max(ROADMAP_EDGE_LABEL_MAX).optional(),
    route: z.enum(ROADMAP_EDGE_ROUTES).optional(),
    arrow: z.enum(ROADMAP_ARROWS).optional(),
    tone: toneSchema.optional(),
  })
  .strict();

export const roadmapGroupSchema = z
  .object({
    id: idSchema,
    title: z.string().min(1).max(ROADMAP_LABEL_MAX).optional(),
    tone: toneSchema.optional(),
    from: z.number().int().min(0),
    to: z.number().int().min(0),
    columns: z.array(columnSchema).min(1).max(3).optional(),
    description: z.string().max(2000).optional(),
  })
  .strict();

export const roadmapLegendEntrySchema = z
  .object({
    id: idSchema,
    label: z.string().min(1).max(ROADMAP_LABEL_MAX),
    tone: toneSchema,
    icon: z.string().min(1).max(64).optional(),
  })
  .strict();

export const roadmapLegendSchema = z
  .object({
    entries: z.array(roadmapLegendEntrySchema).min(1),
    placement: z.enum(ROADMAP_LEGEND_PLACEMENTS).optional(),
  })
  .strict();

/** Which grid tracks a node occupies. `span: 3` ignores `column` and takes all three. */
export function columnsCovered(node: {
  column: RoadmapColumn;
  span?: 1 | 2 | 3;
}): RoadmapColumn[] {
  const span = node.span ?? DEFAULT_NODE_SPAN;
  if (span === 3) return [...ROADMAP_COLUMNS];
  const start = ROADMAP_COLUMNS.indexOf(node.column);
  return ROADMAP_COLUMNS.slice(start, start + span) as unknown as RoadmapColumn[];
}

const roadmapDocumentBaseSchema = z
  .object({
    version: z.literal("roadmap/v1"),
    title: z.string().min(1).max(ROADMAP_LABEL_MAX).optional(),
    direction: z.literal("down"),
    columns: z.literal(3),
    nodes: z.array(roadmapNodeSchema),
    edges: z.array(roadmapEdgeSchema),
    groups: z.array(roadmapGroupSchema),
    legend: roadmapLegendSchema.optional(),
    meta: metaSchema.optional(),
  })
  .strict();

/**
 * The document schema, with every cross-field invariant the plan lists.
 *
 * Each issue carries a PATH into the document, so a caller can point an author
 * at the exact node, edge or group that is wrong.
 */
export const roadmapDocumentSchema = roadmapDocumentBaseSchema.superRefine((doc, ctx) => {
  // 1. Node ids are unique.
  const nodeIndexById = new Map<string, number>();
  doc.nodes.forEach((node, i) => {
    if (nodeIndexById.has(node.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nodes", i, "id"],
        message: `duplicate node id "${node.id}" (first seen at nodes[${nodeIndexById.get(node.id)}])`,
      });
      return;
    }
    nodeIndexById.set(node.id, i);
  });

  // 2. One node per (column, order) cell — a spanning node occupies every track
  //    it covers. 3. A `span: 2` node must have a next track to cover.
  const cellOwner = new Map<string, number>();
  doc.nodes.forEach((node, i) => {
    const span = node.span ?? DEFAULT_NODE_SPAN;
    if (span === 2 && node.column === "right") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nodes", i, "span"],
        message: 'a `span: 2` node at column "right" runs past the last track',
      });
      return;
    }
    for (const column of columnsCovered(node)) {
      const key = `${column}:${node.order}`;
      const owner = cellOwner.get(key);
      if (owner !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nodes", i, "order"],
          message: `cell (${column}, ${node.order}) is already taken by nodes[${owner}] ("${doc.nodes[owner].id}")`,
        });
        continue;
      }
      cellOwner.set(key, i);
    }
  });

  // 4. Edge ids are unique; both endpoints exist; no self-loop.
  const edgeIds = new Set<string>();
  doc.edges.forEach((edge, i) => {
    if (edgeIds.has(edge.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["edges", i, "id"],
        message: `duplicate edge id "${edge.id}"`,
      });
    }
    edgeIds.add(edge.id);
    if (!nodeIndexById.has(edge.source)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["edges", i, "source"],
        message: `edge source "${edge.source}" is not a node in this document`,
      });
    }
    if (!nodeIndexById.has(edge.target)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["edges", i, "target"],
        message: `edge target "${edge.target}" is not a node in this document`,
      });
    }
    if (edge.source === edge.target) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["edges", i, "target"],
        message: `edge "${edge.id}" is a self-loop`,
      });
    }
  });

  // 5. Groups: unique ids, `from <= to`, and no two groups overlap the same rows
  //    on the same column (plan ADR-3).
  const groupIds = new Set<string>();
  doc.groups.forEach((group, i) => {
    if (groupIds.has(group.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["groups", i, "id"],
        message: `duplicate group id "${group.id}"`,
      });
    }
    groupIds.add(group.id);
    if (group.from > group.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["groups", i, "to"],
        message: `group "${group.id}" has from (${group.from}) greater than to (${group.to})`,
      });
    }
  });
  for (let i = 0; i < doc.groups.length; i += 1) {
    const a = doc.groups[i];
    if (a.from > a.to) continue;
    const aColumns = new Set(resolveGroupColumns(a));
    for (let j = i + 1; j < doc.groups.length; j += 1) {
      const b = doc.groups[j];
      if (b.from > b.to) continue;
      const rowsOverlap = a.from <= b.to && b.from <= a.to;
      if (!rowsOverlap) continue;
      const shared = resolveGroupColumns(b).filter((c) => aColumns.has(c));
      if (shared.length === 0) continue;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["groups", j, "from"],
        message: `group "${b.id}" overlaps rows ${a.from}..${a.to} of group "${a.id}" on column(s) ${shared.join(", ")}`,
      });
    }
  }

  // 6. A `badge` names a legend entry; legend entry ids are unique.
  const legendIds = new Set<string>();
  doc.legend?.entries.forEach((entry, i) => {
    if (legendIds.has(entry.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["legend", "entries", i, "id"],
        message: `duplicate legend entry id "${entry.id}"`,
      });
    }
    legendIds.add(entry.id);
  });
  doc.nodes.forEach((node, i) => {
    if (node.badge === undefined) return;
    if (!legendIds.has(node.badge)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nodes", i, "badge"],
        message: `badge "${node.badge}" is not a legend entry of this document`,
      });
    }
  });
});

export const roadmapStateOverlaySchema = z
  .object({
    version: z.literal("roadmap-state/v1"),
    nodes: z.record(roadmapNodeStateSchema),
  })
  .strict();

/** Kept as an alias: the plan names this schema `roadmapStateSchema`. */
export const roadmapStateSchema = roadmapStateOverlaySchema;

// The schema and the hand-written interfaces must not drift. These two lines
// fail `tsc --noEmit` the moment one side gains or loses a field.
type _DocumentMatchesSchema = [
  z.infer<typeof roadmapDocumentBaseSchema> extends RoadmapDocument ? true : never,
  RoadmapDocument extends z.infer<typeof roadmapDocumentBaseSchema> ? true : never,
];
type _OverlayMatchesSchema = [
  z.infer<typeof roadmapStateOverlaySchema> extends RoadmapStateOverlay ? true : never,
  RoadmapStateOverlay extends z.infer<typeof roadmapStateOverlaySchema> ? true : never,
];
const _typeGuards: [_DocumentMatchesSchema, _OverlayMatchesSchema] | undefined = undefined;
void _typeGuards;

// ─── Parsers ─────────────────────────────────────────────────────────────────

/** Throws a `ZodError` whose issues carry a path into the document. */
export function parseRoadmapDocument(input: unknown): RoadmapDocument {
  return roadmapDocumentSchema.parse(input) as RoadmapDocument;
}

export function safeParseRoadmapDocument(
  input: unknown,
): z.SafeParseReturnType<unknown, RoadmapDocument> {
  return roadmapDocumentSchema.safeParse(input) as z.SafeParseReturnType<unknown, RoadmapDocument>;
}

export function parseRoadmapStateOverlay(input: unknown): RoadmapStateOverlay {
  return roadmapStateOverlaySchema.parse(input) as RoadmapStateOverlay;
}

export function safeParseRoadmapStateOverlay(
  input: unknown,
): z.SafeParseReturnType<unknown, RoadmapStateOverlay> {
  return roadmapStateOverlaySchema.safeParse(input) as z.SafeParseReturnType<
    unknown,
    RoadmapStateOverlay
  >;
}
