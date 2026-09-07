/**
 * Roadmap layout — PURE helpers. No DOM, no React, no measurement.
 *
 * The renderer (round R2) places nodes with `grid-column` and `grid-row`; the
 * edge overlay (round R3) measures the placed boxes at runtime. Everything that
 * can be decided from the document alone is decided here, so it is unit-testable
 * with no jsdom, exactly like `src/canvas/layout.ts` for the FlowCanvas.
 *
 * The one rule these helpers encode: a node's cell is `(column, order)`, and a
 * spanning node occupies every track it covers. Rows are the `order` values that
 * actually carry a node or a group — they are NOT re-numbered, because a
 * consumer that emits `order` (the ITERA mapper) needs its numbers to survive.
 */
import {
  ROADMAP_COLUMNS,
  columnsCovered,
  resolveGroupColumns,
  resolveNodeSpan,
} from "./contract";
import type { RoadmapColumn, RoadmapDocument, RoadmapGroup, RoadmapNode } from "./contract";

/** 0 for `left`, 1 for `center`, 2 for `right`. */
export function columnIndex(column: RoadmapColumn): number {
  return ROADMAP_COLUMNS.indexOf(column);
}

/**
 * The CSS grid placement of a node, 1-based as `grid-column` wants it.
 * A `span: 3` node always starts at track 1 and covers all three.
 */
export function gridColumnFor(node: Pick<RoadmapNode, "column" | "span">): {
  start: number;
  span: number;
} {
  const span = resolveNodeSpan(node as RoadmapNode);
  if (span === 3) return { start: 1, span: 3 };
  return { start: columnIndex(node.column) + 1, span };
}

/** The `order` values that carry at least one node, ascending. */
export function rowsOf(doc: Pick<RoadmapDocument, "nodes">): number[] {
  const rows = new Set<number>();
  for (const node of doc.nodes) rows.add(node.order);
  return [...rows].sort((a, b) => a - b);
}

/** The highest `order` in the document, or `-1` when there is no node. */
export function maxRowOf(doc: Pick<RoadmapDocument, "nodes">): number {
  return doc.nodes.reduce((max, node) => Math.max(max, node.order), -1);
}

/**
 * Nodes bucketed by `order`, each bucket ordered left to right. That order is
 * also the DOM order the renderer emits, which is what makes a screen reader
 * read the map in reading order.
 */
export function nodesByRow(doc: Pick<RoadmapDocument, "nodes">): Map<number, RoadmapNode[]> {
  const byRow = new Map<number, RoadmapNode[]>();
  for (const node of doc.nodes) {
    const bucket = byRow.get(node.order);
    if (bucket) bucket.push(node);
    else byRow.set(node.order, [node]);
  }
  for (const bucket of byRow.values()) {
    bucket.sort((a, b) => {
      const byColumn = columnIndex(a.column) - columnIndex(b.column);
      return byColumn !== 0 ? byColumn : a.id.localeCompare(b.id);
    });
  }
  return byRow;
}

/**
 * The columns that at least one node occupies.
 *
 * `collapseEmptyColumns` (round R4) reads this. It is the fix for the measured
 * ITERA regression of 2026-09-03, where 512 of 776 px were reserved for two
 * side columns that held nothing.
 */
export function columnsUsed(doc: Pick<RoadmapDocument, "nodes">): RoadmapColumn[] {
  const used = new Set<RoadmapColumn>();
  for (const node of doc.nodes) for (const column of columnsCovered(node)) used.add(column);
  return ROADMAP_COLUMNS.filter((column) => used.has(column));
}

/** One resolved group: its row range and the tracks it paints. */
export interface RoadmapGroupRange {
  id: string;
  from: number;
  to: number;
  columns: RoadmapColumn[];
  /** 1-based `grid-row` start and span. */
  row: { start: number; span: number };
  /** 1-based `grid-column` start and span. Contiguous groups only (see below). */
  column: { start: number; span: number };
  /** True when `columns` is not a contiguous run — the renderer paints one box per run. */
  fragmented: boolean;
}

/**
 * Resolve every group to the range and the tracks it paints.
 *
 * A group is a RANGE over `order`, never a rect (plan ADR-3), so it spans the
 * same rows at every viewport width. `columns` may be any subset; when the
 * subset is not contiguous (`['left','right']`), `fragmented` is true and the
 * renderer draws one box per contiguous run rather than one box that swallows
 * the middle track.
 */
export function groupRanges(doc: Pick<RoadmapDocument, "groups">): RoadmapGroupRange[] {
  return doc.groups.map((group) => {
    const columns = resolveGroupColumns(group);
    const indices = columns.map(columnIndex).sort((a, b) => a - b);
    const start = indices[0];
    const end = indices[indices.length - 1];
    return {
      id: group.id,
      from: group.from,
      to: group.to,
      columns: ROADMAP_COLUMNS.filter((c) => columns.includes(c)),
      row: { start: group.from + 1, span: group.to - group.from + 1 },
      column: { start: start + 1, span: end - start + 1 },
      fragmented: end - start + 1 !== indices.length,
    };
  });
}

/** The contiguous column runs of a group — one painted box each. */
export function groupColumnRuns(group: RoadmapGroup): { start: number; span: number }[] {
  const indices = resolveGroupColumns(group)
    .map(columnIndex)
    .sort((a, b) => a - b);
  const runs: { start: number; span: number }[] = [];
  for (const index of indices) {
    const last = runs[runs.length - 1];
    if (last && last.start + last.span === index + 1) last.span += 1;
    else runs.push({ start: index + 1, span: 1 });
  }
  return runs;
}

/** One reported collision between two things that want the same space. */
export interface RoadmapOverlap {
  kind: "node" | "group";
  /** `(column, order)` for a node collision; `(column, row)` for a group collision. */
  column: RoadmapColumn;
  row: number;
  /** The two ids that collide, in document order. */
  ids: [string, string];
}

/**
 * Every cell claimed twice — by two nodes, or by two groups.
 *
 * The zod schema rejects both cases, so a parsed document always returns an
 * empty array here. The helper exists for the CONVERTER, which must find and
 * repair a collision before it emits a document, and for the renderer's dev
 * assertions.
 */
export function validateNoOverlap(
  doc: Pick<RoadmapDocument, "nodes" | "groups">,
): RoadmapOverlap[] {
  const overlaps: RoadmapOverlap[] = [];

  const nodeCell = new Map<string, string>();
  for (const node of doc.nodes) {
    for (const column of columnsCovered(node)) {
      const key = `${column}:${node.order}`;
      const owner = nodeCell.get(key);
      if (owner !== undefined) {
        overlaps.push({ kind: "node", column, row: node.order, ids: [owner, node.id] });
        continue;
      }
      nodeCell.set(key, node.id);
    }
  }

  const groupCell = new Map<string, string>();
  for (const group of doc.groups) {
    if (group.from > group.to) continue;
    for (const column of resolveGroupColumns(group)) {
      for (let row = group.from; row <= group.to; row += 1) {
        const key = `${column}:${row}`;
        const owner = groupCell.get(key);
        if (owner !== undefined) {
          if (owner !== group.id) {
            overlaps.push({ kind: "group", column, row, ids: [owner, group.id] });
          }
          continue;
        }
        groupCell.set(key, group.id);
      }
    }
  }

  return overlaps;
}

/** One node, resolved to its grid placement. */
export interface RoadmapPlacement {
  node: RoadmapNode;
  row: { start: number; span: number };
  column: { start: number; span: number };
}

/**
 * Place every node in the 3-column grid, in DOM order (row by row, left to
 * right). `rows` is the ascending list of occupied `order` values and
 * `rowCount` is `maxRow + 1`, because the grid keeps an empty row that a group
 * may still paint.
 */
export function placeNodes(doc: Pick<RoadmapDocument, "nodes">): {
  placements: RoadmapPlacement[];
  rows: number[];
  rowCount: number;
} {
  const byRow = nodesByRow(doc);
  const rows = rowsOf(doc);
  const placements: RoadmapPlacement[] = [];
  for (const row of rows) {
    for (const node of byRow.get(row) ?? []) {
      placements.push({
        node,
        row: { start: node.order + 1, span: 1 },
        column: gridColumnFor(node),
      });
    }
  }
  return { placements, rows, rowCount: maxRowOf(doc) + 1 };
}

/**
 * The first free `order` at or below `from` for a node in `columns`.
 * The converter uses it to resolve a cell collision by shifting a node down.
 */
export function firstFreeRow(
  taken: ReadonlySet<string>,
  columns: readonly RoadmapColumn[],
  from: number,
): number {
  let row = from;
  // A map is at most a few hundred rows tall; the guard only stops a runaway.
  for (let guard = 0; guard < 100_000; guard += 1) {
    if (columns.every((column) => !taken.has(`${column}:${row}`))) return row;
    row += 1;
  }
  return row;
}
