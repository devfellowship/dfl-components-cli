import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";

/**
 * A node the canvas can lay out and draw a card for.
 *
 * The canvas reads exactly three things: `id` (identity, edge endpoints, React
 * keys), `title` and `subtitle` (the caption). Everything else a lens needs
 * travels in `data`, which the canvas NEVER inspects — it only hands it back to
 * `renderCard` and `onNodeClick`. That opacity is the whole point: a card can
 * draw a low-fidelity wireframe, a real screenshot, a coverage heat cell or a
 * diff badge, and the canvas cannot tell the difference.
 */
export interface FlowCanvasNode<TData = unknown> {
  /** Stable identity. Edges point at it and React keys off it. */
  id: string;
  /** First caption line. */
  title: string;
  /** Second caption line, rendered monospaced. Typically a route or a path. */
  subtitle?: string;
  /** Opaque to the canvas. Handed back to `renderCard` and `onNodeClick`. */
  data?: TData;
}

/** A directed edge between two `FlowCanvasNode.id`s. */
export interface FlowCanvasEdge {
  /** Stable identity. Two edges between the same pair must still differ here. */
  id: string;
  source: string;
  target: string;
  /** Drawn as a chip on the path midpoint. Omit for an unlabelled edge. */
  label?: string;
}

/** Layout direction. `LR` reads as a journey, `TB` as a hierarchy. */
export type FlowCanvasDirection = "LR" | "TB";

/**
 * MiniMap colours. React Flow's MiniMap takes colour STRINGS (it writes them
 * onto SVG `fill`/`stroke` attributes), so it cannot take a Tailwind class or a
 * CSS custom property reliably. The defaults are the DFL sand/amber values
 * written out literally for that reason — not because the tokens were ignored.
 */
export interface FlowCanvasMiniMapColors {
  nodeColor?: string;
  maskColor?: string;
  bgColor?: string;
}

export interface FlowCanvasProps<TData = unknown> {
  /** The graph. Positions are computed here — do not pre-position. */
  nodes: FlowCanvasNode<TData>[];
  edges: FlowCanvasEdge[];

  /**
   * THE CARD-CONTENT SLOT. Fills the card's content area, above the caption.
   *
   * This is the seam that keeps the canvas reusable: the consuming lens decides
   * what a card shows. Return a sketch, an `<img>`, a chart, a placeholder —
   * the canvas renders the frame around it and nothing else.
   */
  renderCard: (node: FlowCanvasNode<TData>) => ReactNode;

  /**
   * Optional override for the caption under the card content. The default
   * renders `title` over `subtitle`, which is what makes every lens's canvas
   * read as the same map. Override it when a lens needs a badge or a marker
   * in the caption row.
   */
  renderCaption?: (node: FlowCanvasNode<TData>) => ReactNode;

  /**
   * Click handler for a card. The node comes first because that is what a lens
   * acts on; the DOM event is there for modifier keys.
   *
   * When omitted the cards are not interactive and no pointer affordance is
   * drawn — a canvas whose cards do nothing must not look clickable.
   */
  onNodeClick?: (node: FlowCanvasNode<TData>, event: ReactMouseEvent) => void;

  /** @default "LR" */
  direction?: FlowCanvasDirection;
  /** Card width in px. Also the box dagre lays out around. @default 240 */
  nodeWidth?: number;
  /** Card height in px, caption included. @default 202 */
  nodeHeight?: number;
  /** Height of the card-content area in px. @default 130 */
  cardContentHeight?: number;

  /** Horizontal gap between siblings in a rank. @default 48 */
  nodeSeparation?: number;
  /** Gap between ranks. @default 120 */
  rankSeparation?: number;

  /** @default "dark" */
  colorMode?: "dark" | "light" | "system";
  /** `false` hides the MiniMap. An object overrides its colours. @default true */
  miniMap?: boolean | FlowCanvasMiniMapColors;
  /** @default true */
  controls?: boolean;
  /** @default true */
  background?: boolean;

  /**
   * Prefix for every `data-testid` this component emits:
   * `<prefix>-canvas`, `<prefix>-node`, `<prefix>-node-content`,
   * `<prefix>-node-caption`, `<prefix>-edge-label`.
   *
   * A page with two canvases needs two prefixes, and a consumer whose suite
   * already names the canvas can keep its selectors. @default "flow"
   */
  testIdPrefix?: string;

  /** Applied to the canvas frame (the bordered box), not to the viewport. */
  className?: string;

  /** Accessible name for the canvas region. @default "Flow canvas" */
  ariaLabel?: string;
}
