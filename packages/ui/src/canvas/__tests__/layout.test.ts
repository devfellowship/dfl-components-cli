import { describe, it, expect } from "vitest";
import { layoutGraph, DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from "../layout";
import type { FlowCanvasEdge, FlowCanvasNode } from "../types";

const n = (id: string): FlowCanvasNode<{ kind: string }> => ({ id, title: id, data: { kind: "test" } });

describe("layoutGraph", () => {
  it("positions every node and keeps the input order", () => {
    const { nodes } = layoutGraph([n("a"), n("b"), n("c")], [{ id: "a>b", source: "a", target: "b" }]);

    expect(nodes.map((x) => x.id)).toEqual(["a", "b", "c"]);
    for (const node of nodes) {
      expect(Number.isFinite(node.position.x)).toBe(true);
      expect(Number.isFinite(node.position.y)).toBe(true);
      expect(node.width).toBe(DEFAULT_NODE_WIDTH);
      expect(node.height).toBe(DEFAULT_NODE_HEIGHT);
    }
  });

  it("ranks a target to the right of its source in LR", () => {
    const { nodes } = layoutGraph([n("a"), n("b")], [{ id: "a>b", source: "a", target: "b" }]);
    const a = nodes.find((x) => x.id === "a")!;
    const b = nodes.find((x) => x.id === "b")!;
    expect(b.position.x).toBeGreaterThan(a.position.x);
  });

  it("ranks a target below its source in TB", () => {
    const { nodes } = layoutGraph([n("a"), n("b")], [{ id: "a>b", source: "a", target: "b" }], { direction: "TB" });
    const a = nodes.find((x) => x.id === "a")!;
    const b = nodes.find((x) => x.id === "b")!;
    expect(b.position.y).toBeGreaterThan(a.position.y);
  });

  it("leaves an orphan node at the first rank instead of pushing entries past it", () => {
    // The regression guarded here: a synthetic "super-source" edge used to be
    // injected to pull entry nodes forward, which ranked genuine entries AFTER
    // disconnected orphans and made an orphan read as the first screen.
    const { nodes } = layoutGraph(
      [n("entry"), n("second"), n("orphan")],
      [{ id: "e>s", source: "entry", target: "second" }],
    );
    const entry = nodes.find((x) => x.id === "entry")!;
    const orphan = nodes.find((x) => x.id === "orphan")!;
    expect(orphan.position.x).toBe(entry.position.x);
  });

  it("drops an edge whose endpoint is not on the canvas", () => {
    const { edges } = layoutGraph(
      [n("a"), n("b")],
      [
        { id: "a>b", source: "a", target: "b" },
        { id: "a>ghost", source: "a", target: "ghost" },
      ],
    );
    expect(edges.map((e) => e.id)).toEqual(["a>b"]);
  });

  it("tags reciprocal edges with an index and a count so their chips can separate", () => {
    const edges: FlowCanvasEdge[] = [
      { id: "a>b", source: "a", target: "b", label: "go" },
      { id: "b>a", source: "b", target: "a", label: "back" },
      { id: "b>c", source: "b", target: "c", label: "next" },
    ];
    const laid = layoutGraph([n("a"), n("b"), n("c")], edges);

    const ab = laid.edges.find((e) => e.id === "a>b")!;
    const ba = laid.edges.find((e) => e.id === "b>a")!;
    const bc = laid.edges.find((e) => e.id === "b>c")!;

    expect(ab.data).toMatchObject({ pairIndex: 0, pairCount: 2 });
    expect(ba.data).toMatchObject({ pairIndex: 1, pairCount: 2 });
    // A lone edge must NOT be offset — a nudge on a chip with nothing to
    // collide with is a bug that reads as a misaligned label.
    expect(bc.data).toMatchObject({ pairIndex: 0, pairCount: 1 });
  });

  it("carries the consumer payload through untouched", () => {
    const payload = { kind: "screenshot", url: "https://example.test/a.png" };
    const { nodes } = layoutGraph([{ id: "a", title: "A", data: payload }], []);
    expect((nodes[0].data as { node: FlowCanvasNode<typeof payload> }).node.data).toBe(payload);
  });

  it("is deterministic — the same graph lays out to the same coordinates", () => {
    const nodes = [n("a"), n("b"), n("c")];
    const edges: FlowCanvasEdge[] = [
      { id: "a>b", source: "a", target: "b" },
      { id: "b>c", source: "b", target: "c" },
    ];
    const first = layoutGraph(nodes, edges).nodes.map((x) => x.position);
    const second = layoutGraph(nodes, edges).nodes.map((x) => x.position);
    expect(second).toEqual(first);
  });

  it("honours custom card dimensions", () => {
    const { nodes } = layoutGraph([n("a")], [], { nodeWidth: 320, nodeHeight: 100 });
    expect(nodes[0].width).toBe(320);
    expect(nodes[0].height).toBe(100);
  });
});
