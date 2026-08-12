import dagre from "@dagrejs/dagre";
import type { Node, Edge } from "@xyflow/react";
import type { FlowCanvasDirection, FlowCanvasEdge, FlowCanvasNode } from "./types";

export const DEFAULT_NODE_WIDTH = 240;
export const DEFAULT_NODE_HEIGHT = 202;
export const DEFAULT_NODE_SEPARATION = 48;
export const DEFAULT_RANK_SEPARATION = 120;

export interface LayoutOptions {
  direction?: FlowCanvasDirection;
  nodeWidth?: number;
  nodeHeight?: number;
  nodeSeparation?: number;
  rankSeparation?: number;
}

/**
 * Directional auto-layout for the flow canvas.
 *
 * Ranks nodes by dagre's layered algorithm, which computes rank AND in-rank
 * order at once, so it also minimises edge crossings between ranks. The naive
 * alternative — BFS level to column, insertion order to row — overlaps boxes as
 * soon as the number of nodes per level varies.
 *
 * ⚠️ Do NOT inject a synthetic "super-source" edge to pull entry nodes to the
 * front. It pushes genuine entry nodes one rank to the RIGHT of disconnected
 * orphan nodes, which keep dagre's default rank 0 — so an orphan renders as if
 * it came BEFORE the entry point. Plain ranking from the real edges already
 * gives every node with no incoming edge rank 0, which is the correct result.
 *
 * The function is PURE and side-effect free, which is what makes it testable
 * without a DOM: same graph in, same coordinates out.
 */
export function layoutGraph<TData>(
  nodes: FlowCanvasNode<TData>[],
  edges: FlowCanvasEdge[],
  options: LayoutOptions = {},
): { nodes: Node[]; edges: Edge[] } {
  const {
    direction = "LR",
    nodeWidth = DEFAULT_NODE_WIDTH,
    nodeHeight = DEFAULT_NODE_HEIGHT,
    nodeSeparation = DEFAULT_NODE_SEPARATION,
    rankSeparation = DEFAULT_RANK_SEPARATION,
  } = options;

  const known = new Set(nodes.map((n) => n.id));
  // An edge to a node that is not on the canvas is dropped rather than drawn to
  // nowhere: React Flow would warn and render nothing, which reads as a missing
  // edge rather than as a bad input.
  const usable = edges.filter((e) => known.has(e.source) && known.has(e.target));

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: nodeSeparation, ranksep: rankSeparation, marginx: 24, marginy: 24 });

  for (const n of nodes) g.setNode(n.id, { width: nodeWidth, height: nodeHeight });
  for (const e of usable) g.setEdge(e.source, e.target);

  dagre.layout(g);

  const rfNodes: Node[] = nodes.map((n) => {
    const laid = g.node(n.id);
    return {
      id: n.id,
      type: "flowCanvasCard",
      position: {
        x: laid ? laid.x - nodeWidth / 2 : 0,
        y: laid ? laid.y - nodeHeight / 2 : 0,
      },
      data: { node: n },
      // Explicit width/height, not just post-mount measurement: React Flow's
      // MiniMap only draws a node rect once the node "has dimensions"
      // (`measured` OR explicit width/height — see @xyflow/system
      // nodeHasDimensions). Without this the minimap renders zero rects and
      // reads as an empty panel.
      width: nodeWidth,
      height: nodeHeight,
    };
  });

  // Group edges by their UNORDERED node pair so reciprocal edges (A→B and B→A
  // both exist — common for "back" actions) can spread their label chips apart.
  // Both chips otherwise print on top of each other at the same path midpoint.
  const pairCounts = new Map<string, number>();
  for (const e of usable) {
    const key = pairKey(e);
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
  }

  const pairSeen = new Map<string, number>();
  const rfEdges: Edge[] = usable.map((e) => {
    const key = pairKey(e);
    const pairIndex = pairSeen.get(key) ?? 0;
    pairSeen.set(key, pairIndex + 1);
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: "flowCanvasChip",
      data: { pairIndex, pairCount: pairCounts.get(key) ?? 1 },
    };
  });

  return { nodes: rfNodes, edges: rfEdges };
}

function pairKey(e: FlowCanvasEdge): string {
  return [e.source, e.target].sort().join("|");
}
