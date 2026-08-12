/**
 * @devfellowship/components/canvas
 *
 * The shared, opinionated graph canvas. Its own entry point rather than part of
 * the main bundle, because it needs `@xyflow/react` and `@dagrejs/dagre` and
 * most consumers of the design system never draw a graph. Both are declared as
 * OPTIONAL peer dependencies: import this entry and you install them; ignore it
 * and you pay nothing.
 *
 * ```tsx
 * import { FlowCanvas } from "@devfellowship/components/canvas";
 * ```
 */
export { FlowCanvas } from "./FlowCanvas";
export {
  layoutGraph,
  DEFAULT_NODE_WIDTH,
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_SEPARATION,
  DEFAULT_RANK_SEPARATION,
  type LayoutOptions,
} from "./layout";
export type {
  FlowCanvasNode,
  FlowCanvasEdge,
  FlowCanvasProps,
  FlowCanvasDirection,
  FlowCanvasMiniMapColors,
} from "./types";
