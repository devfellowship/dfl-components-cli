/**
 * roadmap.sh -> `RoadmapDocument` — a DEV TOOL, not part of the package.
 *
 * Plan ADR-9: this module is imported by tests, fixtures and stories only. It is
 * NOT re-exported from `../index.ts`, so it never reaches `src/index.ts`, never
 * enters `dist`, and adds no runtime dependency. Its job is to turn the 92
 * public roadmap.sh maps into fidelity fixtures and to prove the contract is
 * wide enough for a real corpus (verification row 5 of the plan).
 *
 * What it throws away, and why (plan "Dropped roadmap.sh fields"):
 *
 * - `position {x,y}` and `positionAbsolute` become `column` + `order`. Absolute
 *   pixels are the reason a roadmap.sh label renders at 6.2 px on a phone.
 * - `width`, `height`, `measured`, `style.width/height` go: the DOM measures
 *   itself. They are read here only to bucket a node into a column and a row.
 * - `sourceHandle` / `targetHandle` (`w` top, `x` bottom, `y` left, `z` right)
 *   go: a physical side is wrong the moment a column reflows. The overlay picks
 *   an anchor at runtime.
 * - every colour field becomes a `tone` token (plan ADR-6). roadmap.sh ships
 *   `"backgroundColor": "WHITe"`; a closed vocabulary is what makes an emitted
 *   document valid by construction.
 * - `section` rects become `group` RANGES (plan ADR-3). roadmap.sh carries no
 *   membership link at all — 0 of 14 288 nodes have `parentNode` — so
 *   membership is derived from geometry here, once, and then stated explicitly.
 *
 * Everything the converter cannot represent is COUNTED, never silently lost:
 * `report.dropped` holds the tally and `report.warnings` the detail.
 */
import {
  ROADMAP_COLUMNS,
  columnsCovered,
  parseRoadmapDocument,
  safeParseRoadmapDocument,
} from "../contract";
import type {
  RoadmapColumn,
  RoadmapDocument,
  RoadmapEdge,
  RoadmapEdgeRoute,
  RoadmapEdgeStyle,
  RoadmapGroup,
  RoadmapLegendEntry,
  RoadmapLink,
  RoadmapNode,
  RoadmapNodeKind,
  RoadmapTone,
} from "../contract";
import { firstFreeRow } from "../layout";

// ─── The roadmap.sh shape (only the fields this converter reads) ─────────────

export interface RoadmapShLegendRef {
  id?: string;
  color?: string;
  label?: string;
  /** `left-center` | `right-center` | `left-top` | `right-top`. */
  position?: string;
}

export interface RoadmapShNodeStyle {
  colorType?: string;
  backgroundColor?: string;
  borderColor?: string;
  fontSize?: number;
  width?: number;
  height?: number;
}

export interface RoadmapShNodeData {
  label?: string;
  href?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  badge?: string;
  style?: RoadmapShNodeStyle;
  legend?: RoadmapShLegendRef;
  legends?: RoadmapShLegendRef[];
  links?: { id?: string; label?: string; href?: string; url?: string }[];
  [key: string]: unknown;
}

export interface RoadmapShNode {
  id: string;
  type?: string;
  position?: { x?: number; y?: number };
  width?: number;
  height?: number;
  measured?: { width?: number; height?: number };
  style?: { width?: number; height?: number; backgroundColor?: string };
  data?: RoadmapShNodeData;
}

export interface RoadmapShEdge {
  id?: string;
  source?: string;
  target?: string;
  /** `smoothstep` | `step` | `simplebezier` | absent (a cubic bezier). */
  type?: string;
  markerEnd?: unknown;
  data?: { edgeStyle?: string };
}

export interface RoadmapShMap {
  title?: string;
  slug?: string;
  nodes?: RoadmapShNode[];
  edges?: RoadmapShEdge[];
  [key: string]: unknown;
}

// ─── Report ──────────────────────────────────────────────────────────────────

export interface FromRoadmapShReport {
  /** Tally by reason: a roadmap.sh node type, or `edge:dangling`, `group:overlap`, … */
  dropped: Record<string, number>;
  warnings: string[];
  counts: {
    nodesIn: number;
    nodesOut: number;
    edgesIn: number;
    edgesOut: number;
    sectionsIn: number;
    groupsOut: number;
    legendEntries: number;
  };
}

export interface FromRoadmapShResult {
  document: RoadmapDocument;
  report: FromRoadmapShReport;
}

export interface FromRoadmapShOptions {
  /** Overrides `map.title`. */
  title?: string;
  /** Merged into `document.meta`. Provenance belongs here. */
  meta?: Record<string, unknown>;
  /** Nodes whose vertical centres lie within this many pixels share a row. */
  rowTolerance?: number;
  /** A node wider than this fraction of the bounding box gets `span: 3`. */
  spanThreshold?: number;
}

// ─── Vocabularies ────────────────────────────────────────────────────────────

/** Decorative or out-of-scope roadmap.sh node types. Dropped and counted. */
export const DROPPED_NODE_TYPES = ["checklist", "todo", "horizontal", "vertical"] as const;

/** roadmap.sh `data.style.colorType` -> tone. `f` is unused in the whole corpus. */
export const COLOR_TYPE_TONE: Record<string, RoadmapTone> = {
  a: "accent",
  b: "primary",
  c: "secondary",
  d: "success",
  e: "info",
  f: "neutral",
  g: "danger",
  h: "muted",
};

/** roadmap.sh legend/badge colours -> tone (plan "Mapping from roadmap.sh JSON", step 5). */
export const LEGEND_COLOR_TONE: Record<string, RoadmapTone> = {
  "#874efe": "info",
  "#0433ff": "info",
  "#2b78e4": "info",
  "#4f7a28": "success",
  "#19a323": "success",
  "#147a00": "success",
  "#667113": "success",
  "#38761d": "success",
  "#6d7500": "success",
  "#929292": "muted",
  "#aaaaaa": "muted",
  "#999999": "muted",
  "#9900ff": "accent",
  "#000": "neutral",
  "#000000": "neutral",
};

/** Fill colours seen on nodes and sections -> tone. A miss leaves the kind default. */
export const FILL_TONE: Record<string, RoadmapTone> = {
  "#fdff00": "primary",
  "#fcff00": "primary",
  "#ffe599": "secondary",
  "#ffffff": "neutral",
  white: "neutral",
  transparent: "neutral",
  none: "neutral",
  "#f4f4f4": "muted",
  "#fafafa": "muted",
  "#fcfcfc": "muted",
  "#f2f2f2": "muted",
  "#e6e6e6": "muted",
  "#333333": "accent",
  "#474747": "accent",
  "#666666": "accent",
  "#000000": "accent",
};

const KIND_BY_TYPE: Record<string, RoadmapNodeKind> = {
  topic: "topic",
  subtopic: "subtopic",
  title: "title",
  label: "label",
  paragraph: "paragraph",
  button: "button",
  resourceButton: "button",
  linksgroup: "paragraph",
  legend: "legend",
};

const ROUTE_BY_TYPE: Record<string, RoadmapEdgeRoute> = {
  smoothstep: "elbow",
  step: "elbow",
  simplebezier: "curve",
};

const SECTION_TITLE_BAND = 60;
const MAX_LABEL = 200;
const MAX_LINK_LABEL = 120;

// ─── Small helpers ───────────────────────────────────────────────────────────

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function rectOf(node: RoadmapShNode): Rect {
  const x = num(node.position?.x);
  const y = num(node.position?.y);
  const w = num(node.measured?.width, num(node.width, num(node.style?.width, 0)));
  const h = num(node.measured?.height, num(node.height, num(node.style?.height, 0)));
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

function contains(rect: Rect, point: { cx: number; cy: number }): boolean {
  return (
    point.cx >= rect.x && point.cx <= rect.x + rect.w && point.cy >= rect.y && point.cy <= rect.y + rect.h
  );
}

function overlapArea(a: Rect, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function normaliseColour(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function toneFromFill(value: unknown): RoadmapTone | undefined {
  return FILL_TONE[normaliseColour(value)];
}

// ─── The converter ───────────────────────────────────────────────────────────

interface Draft {
  source: RoadmapShNode;
  rect: Rect;
  id: string;
  kind: RoadmapNodeKind;
  label: string;
  description?: string;
  tone?: RoadmapTone;
  href?: string;
  links?: RoadmapLink[];
  legendRef?: RoadmapShLegendRef;
  meta: Record<string, unknown>;
  action?: { label: string; href: string };
  column: RoadmapColumn;
  span: 1 | 3;
  order: number;
}

/**
 * Convert one roadmap.sh map into a `RoadmapDocument`.
 *
 * The result is always schema-valid: `parseRoadmapDocument` runs on the way out,
 * so a caller never receives a document that the component would refuse.
 */
export function fromRoadmapSh(
  map: RoadmapShMap,
  options: FromRoadmapShOptions = {},
): FromRoadmapShResult {
  const rowTolerance = options.rowTolerance ?? 24;
  const spanThreshold = options.spanThreshold ?? 0.6;

  const dropped: Record<string, number> = {};
  const warnings: string[] = [];
  const drop = (reason: string, detail?: string) => {
    dropped[reason] = (dropped[reason] ?? 0) + 1;
    if (detail) warnings.push(detail);
  };

  const inputNodes = Array.isArray(map.nodes) ? map.nodes : [];
  const inputEdges = Array.isArray(map.edges) ? map.edges : [];

  // 1. Partition by roadmap.sh type.
  const sections: { node: RoadmapShNode; rect: Rect }[] = [];
  const contentSources: RoadmapShNode[] = [];
  for (const node of inputNodes) {
    const type = node.type ?? "";
    if ((DROPPED_NODE_TYPES as readonly string[]).includes(type)) {
      drop(type);
      continue;
    }
    if (type === "section") {
      sections.push({ node, rect: rectOf(node) });
      continue;
    }
    if (!KIND_BY_TYPE[type]) {
      drop(type || "unknown", `unknown roadmap.sh node type "${type}" on node ${node.id}`);
      continue;
    }
    contentSources.push(node);
  }

  // 2. Legend entries come from the `legend` nodes' `data.legends[]`.
  const legendEntries: RoadmapLegendEntry[] = [];
  const legendToneById = new Map<string, RoadmapTone>();
  const seenLegendIds = new Set<string>();
  for (const node of contentSources) {
    if (node.type !== "legend") continue;
    for (const entry of node.data?.legends ?? []) {
      const id = sanitiseId(entry.id ?? "");
      const label = cleanText(entry.label);
      if (!id || !label || seenLegendIds.has(id)) continue;
      const colour = normaliseColour(entry.color);
      const tone = LEGEND_COLOR_TONE[colour];
      if (!tone && colour) {
        warnings.push(`legend colour ${colour} has no tone; used neutral`);
      }
      seenLegendIds.add(id);
      legendToneById.set(id, tone ?? "neutral");
      legendEntries.push({ id, label, tone: tone ?? "neutral", icon: "check" });
    }
  }

  // 3. A `label` node inside the top band of a section rect is that section's
  //    title. roadmap.sh has no title field on a section — 0 of 574 carry one.
  const sectionTitleFor = new Map<RoadmapShNode, string>();
  const titleNodeIds = new Set<string>();
  for (const section of sections) {
    const band: Rect = { ...section.rect, h: Math.min(section.rect.h, SECTION_TITLE_BAND) };
    const candidates = contentSources
      .filter((n) => n.type === "label" && !titleNodeIds.has(n.id) && contains(band, rectOf(n)))
      .sort((a, b) => rectOf(a).cy - rectOf(b).cy || a.id.localeCompare(b.id));
    const title = candidates.length > 0 ? cleanText(candidates[0].data?.label) : "";
    if (title) {
      sectionTitleFor.set(section.node, title.slice(0, MAX_LABEL));
      titleNodeIds.add(candidates[0].id);
    }
  }

  // 4. Draft one node per surviving source, with the label rules applied first —
  //    a node that loses its label must not be placed, and must not leave an
  //    edge pointing at nothing.
  const usedIds = new Set<string>();
  const drafts: Draft[] = [];
  const draftBySourceId = new Map<string, Draft>();
  for (const node of contentSources) {
    if (titleNodeIds.has(node.id)) {
      drop("label:section-title");
      continue;
    }
    const type = node.type ?? "";
    const kind = KIND_BY_TYPE[type];
    let label = cleanText(node.data?.label);
    if (label.length > MAX_LABEL) {
      warnings.push(`label truncated to ${MAX_LABEL} chars on node ${node.id}`);
      label = label.slice(0, MAX_LABEL);
    }
    if (!label && kind === "legend") label = "Legend";
    if (!label) {
      drop(`${type}:empty-label`, `node ${node.id} (${type}) has no label`);
      continue;
    }

    const id = uniqueId(sanitiseId(node.id) || `n${drafts.length}`, usedIds);
    const style = node.data?.style ?? {};
    const colorType = typeof style.colorType === "string" ? style.colorType : undefined;
    const tone =
      (colorType ? COLOR_TYPE_TONE[colorType] : undefined) ??
      toneFromFill(style.backgroundColor ?? node.data?.backgroundColor);

    const meta: Record<string, unknown> = { roadmapsh: { id: node.id, type } };
    if (typeof node.data?.badge === "string" && node.data.badge) {
      (meta.roadmapsh as Record<string, unknown>).badge = node.data.badge;
    }

    const links: RoadmapLink[] = [];
    for (const link of node.data?.links ?? []) {
      const href = cleanText(link.url) || cleanText(link.href);
      const linkLabel = cleanText(link.label);
      if (!href || !linkLabel) continue;
      links.push({ label: linkLabel.slice(0, MAX_LINK_LABEL), href });
    }

    const href = cleanText(node.data?.href);
    const draft: Draft = {
      source: node,
      rect: rectOf(node),
      id,
      kind,
      label,
      tone,
      href: href || undefined,
      links: links.length > 0 ? links : undefined,
      legendRef: node.data?.legend,
      meta,
      column: "center",
      span: 1,
      order: 0,
    };
    drafts.push(draft);
    draftBySourceId.set(node.id, draft);
  }

  // 5. A `paragraph` and a `button` drawn on top of each other are ONE node with
  //    an action. roadmap.sh has no composite type; the overlap is the signal.
  const paragraphs = drafts.filter((d) => d.kind === "paragraph");
  const folded = new Set<Draft>();
  for (const draft of drafts) {
    if (draft.kind !== "button" || !draft.href) continue;
    let best: Draft | undefined;
    let bestArea = 0;
    for (const paragraph of paragraphs) {
      if (paragraph.action) continue;
      const area = overlapArea(draft.rect, paragraph.rect);
      if (area > bestArea) {
        bestArea = area;
        best = paragraph;
      }
    }
    if (!best) continue;
    best.action = { label: draft.label.slice(0, 80), href: draft.href };
    folded.add(draft);
    dropped["button:folded-into-paragraph"] = (dropped["button:folded-into-paragraph"] ?? 0) + 1;
  }
  const placeable = drafts.filter((d) => !folded.has(d));
  for (const draft of folded) draftBySourceId.delete(draft.source.id);

  // 6. Column from the horizontal centre, in three equal bands of the bounding
  //    box. A node wider than `spanThreshold` of the box takes the full width.
  const minX = placeable.length > 0 ? Math.min(...placeable.map((d) => d.rect.x)) : 0;
  const maxX = placeable.length > 0 ? Math.max(...placeable.map((d) => d.rect.x + d.rect.w)) : 0;
  const bboxW = Math.max(maxX - minX, 1);
  for (const draft of placeable) {
    if (draft.rect.w > spanThreshold * bboxW) {
      draft.span = 3;
      draft.column = "center";
      continue;
    }
    const band = Math.floor(((draft.rect.cx - minX) / bboxW) * 3);
    draft.column = ROADMAP_COLUMNS[Math.min(2, Math.max(0, band))];
  }

  // 7. Row from the vertical rank. Centres within `rowTolerance` share a row.
  const byY = [...placeable].sort(
    (a, b) => a.rect.cy - b.rect.cy || a.rect.cx - b.rect.cx || a.id.localeCompare(b.id),
  );
  let row = -1;
  let anchor = Number.NEGATIVE_INFINITY;
  for (const draft of byY) {
    if (draft.rect.cy - anchor > rowTolerance) {
      row += 1;
      anchor = draft.rect.cy;
    }
    draft.order = row;
  }

  // 8. One node per cell. A collision shifts the later node down, and is logged.
  const taken = new Set<string>();
  const inPlacementOrder = [...byY].sort(
    (a, b) =>
      a.order - b.order ||
      b.span - a.span ||
      ROADMAP_COLUMNS.indexOf(a.column) - ROADMAP_COLUMNS.indexOf(b.column) ||
      a.id.localeCompare(b.id),
  );
  for (const draft of inPlacementOrder) {
    const columns = columnsCovered({ column: draft.column, span: draft.span });
    const free = firstFreeRow(taken, columns, draft.order);
    if (free !== draft.order) {
      warnings.push(
        `cell (${draft.column}, ${draft.order}) was taken; node ${draft.id} moved to row ${free}`,
      );
      draft.order = free;
    }
    for (const column of columns) taken.add(`${column}:${draft.order}`);
  }

  // 9. Emit the nodes.
  const nodes: RoadmapNode[] = inPlacementOrder.map((draft) => {
    const node: RoadmapNode = {
      id: draft.id,
      column: draft.column,
      order: draft.order,
      kind: draft.kind,
      label: draft.label,
      meta: draft.meta,
    };
    if (draft.span === 3) node.span = 3;
    if (draft.tone) node.tone = draft.tone;
    if (draft.href) node.href = draft.href;
    if (draft.links) node.links = draft.links;
    if (draft.action) node.action = { label: draft.action.label, href: draft.action.href };
    const ref = draft.legendRef;
    if (ref) {
      const refId = sanitiseId(ref.id ?? "");
      if (refId && seenLegendIds.has(refId)) {
        node.badge = refId;
      } else {
        const colour = normaliseColour(ref.color);
        const tone = LEGEND_COLOR_TONE[colour];
        if (!tone && colour) warnings.push(`node badge colour ${colour} has no tone; used neutral`);
        node.icon = {
          name: "check",
          side: (ref.position ?? "").startsWith("left") ? "left" : "right",
          tone: tone ?? "neutral",
        };
      }
    }
    return node;
  });

  // 10. Edges. Handles are dropped; `type` becomes a route hint; `edgeStyle`
  //     keeps its roadmap.sh name so the mapping is a 1:1 rename (plan ADR-5).
  const edges: RoadmapEdge[] = [];
  inputEdges.forEach((edge, index) => {
    const source = draftBySourceId.get(edge.source ?? "");
    const target = draftBySourceId.get(edge.target ?? "");
    if (!source || !target) {
      drop("edge:dangling");
      return;
    }
    if (source.id === target.id) {
      drop("edge:self-loop");
      return;
    }
    const style = edge.data?.edgeStyle;
    const out: RoadmapEdge = {
      id: `e${index}`,
      source: source.id,
      target: target.id,
      style: (style === "solid" || style === "dashed" || style === "dotted"
        ? style
        : "dashed") as RoadmapEdgeStyle,
    };
    const route = ROUTE_BY_TYPE[edge.type ?? ""];
    if (route) out.route = route;
    if (edge.markerEnd) out.arrow = "end";
    edges.push(out);
  });

  // 11. Sections become groups: an order range plus the columns covered by the source rect (Q5).
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const candidateGroups: RoadmapGroup[] = [];
  sections.forEach((section, index) => {
    const members = placeable.filter((d) => contains(section.rect, d.rect));
    if (members.length === 0) {
      drop("section:empty", `section ${section.node.id} contains no node`);
      return;
    }
    const orders = members.map((m) => nodeById.get(m.id)?.order ?? m.order);
    // Origin: agent — use the rect extent, not a member's expanded grid span.
    const columns = ROADMAP_COLUMNS.filter((_, column) => {
      const trackCenter = minX + ((column + 0.5) * bboxW) / 3;
      return section.rect.x <= trackCenter && section.rect.x + section.rect.w >= trackCenter;
    });
    // A narrow rect between track centres belongs to its own centre's band.
    if (columns.length === 0) {
      const band = Math.floor(((section.rect.cx - minX) / bboxW) * 3);
      columns.push(ROADMAP_COLUMNS[Math.min(2, Math.max(0, band))]);
    }
    const fill =
      section.node.data?.style?.backgroundColor ??
      section.node.style?.backgroundColor ??
      section.node.data?.backgroundColor;
    const group: RoadmapGroup = {
      id: uniqueId(sanitiseId(section.node.id) || `g${index}`, usedIds),
      from: Math.min(...orders),
      to: Math.max(...orders),
      columns,
      tone: toneFromFill(fill) ?? "neutral",
    };
    const title = sectionTitleFor.get(section.node);
    if (title) group.title = title;
    candidateGroups.push(group);
  });

  // 12. Two groups may share rows only when their columns are disjoint (ADR-3).
  //     A rect map has no such rule, so a converted overlap is dropped, counted
  //     and named — never silently merged.
  const groups: RoadmapGroup[] = [];
  const groupCells = new Set<string>();
  const orderedGroups = [...candidateGroups].sort(
    (a, b) => a.from - b.from || a.to - b.to || a.id.localeCompare(b.id),
  );
  for (const group of orderedGroups) {
    const cells: string[] = [];
    let clash = false;
    for (const column of group.columns ?? ROADMAP_COLUMNS) {
      for (let r = group.from; r <= group.to; r += 1) {
        const key = `${column}:${r}`;
        if (groupCells.has(key)) {
          clash = true;
          break;
        }
        cells.push(key);
      }
      if (clash) break;
    }
    if (clash) {
      drop("group:overlap", `group ${group.id} overlaps an earlier group; dropped`);
      continue;
    }
    for (const key of cells) groupCells.add(key);
    groups.push(group);
  }

  const document: RoadmapDocument = {
    version: "roadmap/v1",
    direction: "down",
    columns: 3,
    nodes,
    edges,
    groups,
  };
  const title = cleanText(options.title ?? map.title ?? map.slug);
  if (title) document.title = title.slice(0, MAX_LABEL);
  if (legendEntries.length > 0) {
    document.legend = { entries: legendEntries, placement: "inline" };
  }
  const meta = { ...options.meta };
  if (Object.keys(meta).length > 0) document.meta = meta;

  const report: FromRoadmapShReport = {
    dropped,
    warnings,
    counts: {
      nodesIn: inputNodes.length,
      nodesOut: nodes.length,
      edgesIn: inputEdges.length,
      edgesOut: edges.length,
      sectionsIn: sections.length,
      groupsOut: groups.length,
      legendEntries: legendEntries.length,
    },
  };

  // The converter never hands back a document the component would refuse.
  return { document: parseRoadmapDocument(document), report };
}

/**
 * Convert without throwing. Returns the zod issues instead, so a corpus sweep
 * can report every failing map in one pass rather than stopping at the first.
 */
export function tryFromRoadmapSh(
  map: RoadmapShMap,
  options: FromRoadmapShOptions = {},
): { ok: true; value: FromRoadmapShResult } | { ok: false; error: unknown } {
  try {
    return { ok: true, value: fromRoadmapSh(map, options) };
  } catch (error) {
    return { ok: false, error };
  }
}

/** Exposed for the corpus sweep: validate a converted document without throwing. */
export const validateConverted = safeParseRoadmapDocument;

function sanitiseId(raw: string): string {
  return raw.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 64);
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base || "n";
  let suffix = 1;
  while (used.has(id)) {
    const tail = `_${suffix}`;
    id = `${base.slice(0, 64 - tail.length)}${tail}`;
    suffix += 1;
  }
  used.add(id);
  return id;
}
