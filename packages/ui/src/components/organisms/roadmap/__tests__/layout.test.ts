import { describe, it, expect } from "vitest";

import { columnsCovered, parseRoadmapDocument } from "../contract";
import type { RoadmapDocument, RoadmapNode } from "../contract";
import {
  columnIndex,
  columnsUsed,
  firstFreeRow,
  gridColumnFor,
  groupColumnRuns,
  groupRanges,
  maxRowOf,
  nodesByRow,
  placeNodes,
  rowsOf,
  validateNoOverlap,
} from "../layout";
import { loadFixture } from "../__fixtures__/load";

/**
 * The layout helpers are pure, so they are tested with no DOM at all — the same
 * shape as `src/canvas/__tests__/layout.test.ts`. The last test in each block is
 * a MUTATION case: it changes the document and proves the helper answers
 * differently. A detector that never fires is worse than no detector.
 */

const doc = () => parseRoadmapDocument(loadFixture("vocabulary.json"));

const node = (
  id: string,
  column: RoadmapNode["column"],
  order: number,
  span?: 1 | 2 | 3,
): RoadmapNode => ({ id, column, order, kind: "topic", label: id, ...(span ? { span } : {}) });

const docOf = (nodes: RoadmapNode[], groups: RoadmapDocument["groups"] = []): RoadmapDocument => ({
  version: "roadmap/v1",
  direction: "down",
  columns: 3,
  nodes,
  edges: [],
  groups,
});

describe("columnIndex / columnsCovered / gridColumnFor", () => {
  it("orders the tracks left, center, right", () => {
    expect(columnIndex("left")).toBe(0);
    expect(columnIndex("center")).toBe(1);
    expect(columnIndex("right")).toBe(2);
  });

  it("covers one track by default, two from the start column, three when span is 3", () => {
    expect(columnsCovered({ column: "center" })).toEqual(["center"]);
    expect(columnsCovered({ column: "left", span: 2 })).toEqual(["left", "center"]);
    expect(columnsCovered({ column: "center", span: 2 })).toEqual(["center", "right"]);
    // A span-3 node ignores its column and takes the whole width.
    expect(columnsCovered({ column: "right", span: 3 })).toEqual(["left", "center", "right"]);
  });

  it("returns 1-based CSS grid placement", () => {
    expect(gridColumnFor({ column: "left" })).toEqual({ start: 1, span: 1 });
    expect(gridColumnFor({ column: "right" })).toEqual({ start: 3, span: 1 });
    expect(gridColumnFor({ column: "center", span: 2 })).toEqual({ start: 2, span: 2 });
    expect(gridColumnFor({ column: "right", span: 3 })).toEqual({ start: 1, span: 3 });
  });
});

describe("rowsOf / maxRowOf / nodesByRow", () => {
  it("lists the occupied orders ascending, without gaps invented", () => {
    const d = docOf([node("a", "center", 5), node("b", "left", 1), node("c", "right", 5)]);
    expect(rowsOf(d)).toEqual([1, 5]);
    expect(maxRowOf(d)).toBe(5);
  });

  it("returns -1 as the max row of an empty document", () => {
    expect(maxRowOf(docOf([]))).toBe(-1);
    expect(rowsOf(docOf([]))).toEqual([]);
  });

  it("buckets a row left to right — that order is the DOM order", () => {
    const d = docOf([node("r", "right", 2), node("l", "left", 2), node("c", "center", 2)]);
    expect((nodesByRow(d).get(2) ?? []).map((n) => n.id)).toEqual(["l", "c", "r"]);
  });

  it("reads the vocabulary fixture in reading order", () => {
    const byRow = nodesByRow(doc());
    expect((byRow.get(1) ?? []).map((n) => n.id)).toEqual(["net", "how"]);
    expect((byRow.get(6) ?? []).map((n) => n.id)).toEqual(["ok", "note", "warn"]);
  });
});

describe("columnsUsed", () => {
  it("reports only the tracks a node actually occupies", () => {
    expect(columnsUsed(docOf([node("a", "center", 0)]))).toEqual(["center"]);
    expect(columnsUsed(docOf([node("a", "left", 0), node("b", "right", 0)]))).toEqual([
      "left",
      "right",
    ]);
  });

  it("counts every track a spanning node covers", () => {
    expect(columnsUsed(docOf([node("a", "left", 0, 2)]))).toEqual(["left", "center"]);
    expect(columnsUsed(docOf([node("a", "center", 0, 3)]))).toEqual(["left", "center", "right"]);
  });

  it("is NOT vacuous — dropping the side nodes drops the side tracks", () => {
    const full = doc();
    expect(columnsUsed(full)).toEqual(["left", "center", "right"]);
    const spineOnly = { ...full, nodes: full.nodes.filter((n) => n.column === "center" && !n.span) };
    expect(columnsUsed(spineOnly)).toEqual(["center"]);
  });
});

describe("groupRanges / groupColumnRuns", () => {
  it("turns a range into a 1-based grid row span", () => {
    const ranges = groupRanges(doc());
    const basics = ranges.find((r) => r.id === "g-basics")!;
    expect(basics.row).toEqual({ start: 2, span: 3 });
    expect(basics.column).toEqual({ start: 1, span: 3 });
    expect(basics.fragmented).toBe(false);

    const check = ranges.find((r) => r.id === "g-check")!;
    expect(check.row).toEqual({ start: 6, span: 1 });
    expect(check.column).toEqual({ start: 2, span: 1 });
  });

  it("flags a non-contiguous column set, and splits it into runs", () => {
    const d = docOf([], [{ id: "g", from: 0, to: 1, columns: ["left", "right"] }]);
    const range = groupRanges(d)[0];
    expect(range.fragmented).toBe(true);
    expect(groupColumnRuns(d.groups[0])).toEqual([
      { start: 1, span: 1 },
      { start: 3, span: 1 },
    ]);
  });

  it("keeps a contiguous pair as ONE run", () => {
    expect(groupColumnRuns({ id: "g", from: 0, to: 0, columns: ["left", "center"] })).toEqual([
      { start: 1, span: 2 },
    ]);
    expect(groupColumnRuns({ id: "g", from: 0, to: 0 })).toEqual([{ start: 1, span: 3 }]);
  });
});

describe("validateNoOverlap", () => {
  it("finds nothing in a document the schema accepted", () => {
    expect(validateNoOverlap(doc())).toEqual([]);
    expect(validateNoOverlap(parseRoadmapDocument(loadFixture("long-5000.json")))).toEqual([]);
  });

  it("finds two nodes in one cell", () => {
    const overlaps = validateNoOverlap(docOf([node("a", "center", 3), node("b", "center", 3)]));
    expect(overlaps).toEqual([{ kind: "node", column: "center", row: 3, ids: ["a", "b"] }]);
  });

  it("finds a spanning node sitting on a neighbour", () => {
    const overlaps = validateNoOverlap(docOf([node("wide", "left", 0, 2), node("mid", "center", 0)]));
    expect(overlaps).toHaveLength(1);
    expect(overlaps[0]).toMatchObject({ kind: "node", column: "center", row: 0 });
  });

  it("finds two groups painting the same cell", () => {
    const overlaps = validateNoOverlap(
      docOf(
        [],
        [
          { id: "g1", from: 0, to: 2 },
          { id: "g2", from: 2, to: 4, columns: ["center"] },
        ],
      ),
    );
    expect(overlaps).toHaveLength(1);
    expect(overlaps[0]).toMatchObject({ kind: "group", column: "center", row: 2 });
  });

  it("ignores a group whose range is backwards — the schema owns that error", () => {
    expect(validateNoOverlap(docOf([], [{ id: "g", from: 4, to: 1 }]))).toEqual([]);
  });

  it("is NOT vacuous — moving one node makes the same document clean", () => {
    const clash = docOf([node("a", "center", 3), node("b", "center", 3)]);
    expect(validateNoOverlap(clash)).toHaveLength(1);
    clash.nodes[1].order = 4;
    expect(validateNoOverlap(clash)).toEqual([]);
  });
});

describe("placeNodes", () => {
  it("emits placements row by row, left to right, with 1-based grid coordinates", () => {
    const { placements, rows, rowCount } = placeNodes(doc());
    expect(rows[0]).toBe(0);
    expect(rowCount).toBe(8);
    expect(placements.map((p) => p.node.id).slice(0, 4)).toEqual(["t", "net", "how", "dns"]);
    expect(placements[0]).toMatchObject({ row: { start: 1, span: 1 }, column: { start: 1, span: 3 } });
    expect(placements[1]).toMatchObject({ row: { start: 2, span: 1 }, column: { start: 2, span: 1 } });
  });

  it("keeps an empty row in `rowCount`, so a group can still paint it", () => {
    const { rows, rowCount } = placeNodes(docOf([node("a", "center", 0), node("b", "center", 4)]));
    expect(rows).toEqual([0, 4]);
    expect(rowCount).toBe(5);
  });
});

describe("firstFreeRow", () => {
  it("returns the requested row when the cells are free", () => {
    expect(firstFreeRow(new Set<string>(), ["center"], 3)).toBe(3);
  });

  it("walks down until every requested column is free", () => {
    const taken = new Set(["center:3", "center:4", "left:5"]);
    expect(firstFreeRow(taken, ["center"], 3)).toBe(5);
    expect(firstFreeRow(taken, ["left", "center"], 3)).toBe(6);
  });
});
