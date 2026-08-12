import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type NodeProps,
  type EdgeProps,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import { cn } from "../lib/utils";
import { layoutGraph, DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from "./layout";
import type { FlowCanvasNode, FlowCanvasProps } from "./types";

const DEFAULT_CARD_CONTENT_HEIGHT = 130;

/** The DFL sand/amber MiniMap palette. See FlowCanvasMiniMapColors for why these are literals. */
const MINIMAP_NODE_COLOR = "#E07A4A";
const MINIMAP_MASK_COLOR = "rgba(10,9,8,0.72)";
const MINIMAP_BG_COLOR = "#141210";

/**
 * The slots and the chrome settings travel by context rather than through node
 * `data`. React Flow requires `nodeTypes`/`edgeTypes` to be stable object
 * identities — rebuilding them per render remounts every node — and putting a
 * closure in `data` would change every node object on every render. Context
 * keeps both stable and keeps `data` free for the consumer's own payload.
 */
interface FlowCanvasContextValue {
  renderCard: (node: FlowCanvasNode<unknown>) => ReactNode;
  renderCaption?: (node: FlowCanvasNode<unknown>) => ReactNode;
  clickable: boolean;
  nodeWidth: number;
  cardContentHeight: number;
  horizontal: boolean;
  testIdPrefix: string;
}

const FlowCanvasContext = createContext<FlowCanvasContextValue | null>(null);

function useFlowCanvas(): FlowCanvasContextValue {
  const ctx = useContext(FlowCanvasContext);
  if (!ctx) throw new Error("FlowCanvas internals rendered outside of <FlowCanvas>");
  return ctx;
}

/**
 * The card frame. It draws a box, a content area and a caption — and it never
 * looks inside `node.data`. Everything domain-specific arrives through
 * `renderCard`, which is what lets one canvas serve a wireframe lens and a
 * screenshot lens without knowing that either exists.
 */
function FlowCanvasCard({ data }: NodeProps) {
  const { renderCard, renderCaption, clickable, nodeWidth, cardContentHeight, horizontal, testIdPrefix } =
    useFlowCanvas();
  const node = (data as { node: FlowCanvasNode<unknown> }).node;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-s-brand-ring bg-card shadow-lg shadow-black/40",
        clickable && "cursor-pointer",
      )}
      // Inline width rather than a Tailwind arbitrary class: the width is a
      // prop, and an arbitrary class cannot be composed from a runtime value.
      style={{ width: nodeWidth }}
      data-testid={`${testIdPrefix}-node`}
      data-node-id={node.id}
    >
      {/* A custom node type renders no implicit connection points. Without
          explicit Handles React Flow silently drops every edge on this node. */}
      <Handle
        type="target"
        position={horizontal ? Position.Left : Position.Top}
        className="!h-2 !w-2 !border-none !bg-primary"
      />

      <div
        className="flex w-full items-center justify-center overflow-hidden border-b border-border bg-muted"
        style={{ height: cardContentHeight }}
        data-testid={`${testIdPrefix}-node-content`}
      >
        {renderCard(node)}
      </div>

      <div className="px-3 py-2 text-xs" data-testid={`${testIdPrefix}-node-caption`}>
        {renderCaption ? (
          renderCaption(node)
        ) : (
          <>
            <div className="truncate font-semibold text-foreground" title={node.title}>
              {node.title}
            </div>
            {node.subtitle ? (
              <div className="truncate font-mono text-muted-foreground" title={node.subtitle}>
                {node.subtitle}
              </div>
            ) : null}
          </>
        )}
      </div>

      <Handle
        type="source"
        position={horizontal ? Position.Right : Position.Bottom}
        className="!h-2 !w-2 !border-none !bg-primary"
      />
    </div>
  );
}

/**
 * Chip-styled edge label on a smoothstep path.
 *
 * A bare label floating on the path collides visually with edges and nodes, so
 * the label gets a background chip. Reciprocal pairs (A→B and B→A both exist)
 * are de-collided by nudging the CHIP perpendicular to the path — never the
 * path itself, which stays true to source and target. `layoutGraph` supplies
 * `pairIndex`/`pairCount`.
 */
function FlowCanvasChipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
}: EdgeProps) {
  const { testIdPrefix } = useFlowCanvas();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const pairIndex = (data?.pairIndex as number | undefined) ?? 0;
  const pairCount = (data?.pairCount as number | undefined) ?? 1;
  const offsetY = pairCount > 1 ? (pairIndex - (pairCount - 1) / 2) * 22 : 0;

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: "var(--s-brand-ring)", strokeWidth: 1.5 }} />
      {label ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute rounded-md border border-s-brand-ring bg-popover px-1.5 py-0.5 text-[10px] font-semibold text-foreground"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY + offsetY}px)` }}
            data-testid={`${testIdPrefix}-edge-label`}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

// Module-level and frozen: React Flow remounts every node when these object
// identities change.
const nodeTypes: NodeTypes = { flowCanvasCard: FlowCanvasCard };
const edgeTypes: EdgeTypes = { flowCanvasChip: FlowCanvasChipEdge };

/**
 * FlowCanvas — a spatial, auto-laid-out graph of cards.
 *
 * ONE CANVAS, N LENSES. The canvas owns the map: layout, ranking, edge routing,
 * the card frame, the caption, the minimap and the controls. The consuming lens
 * owns what a card SHOWS (`renderCard`) and what a click DOES (`onNodeClick`).
 * The canvas never inspects `node.data`, so a lens can put a low-fidelity
 * wireframe in one card and a production screenshot in the next without the
 * canvas learning about either. Duplicate the lens; never duplicate the canvas.
 *
 * ## Peer dependencies
 * `@xyflow/react` and `@dagrejs/dagre` are OPTIONAL peer dependencies —
 * install them only if you import this entry point. Consumers of
 * `@devfellowship/components` who never draw a canvas pay nothing.
 *
 * ## Stylesheets the consumer must import
 * ```css
 * @import "@xyflow/react/dist/style.css";   /* React Flow's own base styles *​/
 * @import "@devfellowship/components/canvas.css"; /* DS skin for its chrome *​/
 * ```
 *
 * @example
 * ```tsx
 * <FlowCanvas
 *   nodes={screens.map((s) => ({ id: s.id, title: s.name, subtitle: s.route, data: s }))}
 *   edges={transitions}
 *   renderCard={(node) => <WireframePreview screen={node.data} />}
 *   onNodeClick={(node) => select(node.id)}
 * />
 * ```
 */
export function FlowCanvas<TData = unknown>({
  nodes,
  edges,
  renderCard,
  renderCaption,
  onNodeClick,
  direction = "LR",
  nodeWidth = DEFAULT_NODE_WIDTH,
  nodeHeight = DEFAULT_NODE_HEIGHT,
  cardContentHeight = DEFAULT_CARD_CONTENT_HEIGHT,
  nodeSeparation,
  rankSeparation,
  colorMode = "dark",
  miniMap = true,
  controls = true,
  background = true,
  testIdPrefix = "flow",
  className,
  ariaLabel = "Flow canvas",
}: FlowCanvasProps<TData>) {
  const graph = useMemo(
    () => layoutGraph(nodes, edges, { direction, nodeWidth, nodeHeight, nodeSeparation, rankSeparation }),
    [nodes, edges, direction, nodeWidth, nodeHeight, nodeSeparation, rankSeparation],
  );

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const ctx = useMemo<FlowCanvasContextValue>(
    () => ({
      renderCard: renderCard as (node: FlowCanvasNode<unknown>) => ReactNode,
      renderCaption: renderCaption as ((node: FlowCanvasNode<unknown>) => ReactNode) | undefined,
      clickable: Boolean(onNodeClick),
      nodeWidth,
      cardContentHeight,
      horizontal: direction === "LR",
      testIdPrefix,
    }),
    [renderCard, renderCaption, onNodeClick, nodeWidth, cardContentHeight, direction, testIdPrefix],
  );

  const miniMapColors = typeof miniMap === "object" ? miniMap : {};

  return (
    <FlowCanvasContext.Provider value={ctx}>
      <div
        className={cn(
          "h-[70vh] min-h-[520px] w-full overflow-hidden rounded-lg border border-border bg-card",
          className,
        )}
        data-testid={`${testIdPrefix}-canvas`}
        role="region"
        aria-label={ariaLabel}
      >
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          colorMode={colorMode}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodeClick={
            onNodeClick
              ? (event, rfNode) => {
                  const node = byId.get(rfNode.id);
                  if (node) onNodeClick(node, event);
                }
              : undefined
          }
        >
          {background ? <Background /> : null}
          {controls ? <Controls showInteractive={false} /> : null}
          {miniMap ? (
            <MiniMap
              pannable
              zoomable
              nodeColor={miniMapColors.nodeColor ?? MINIMAP_NODE_COLOR}
              maskColor={miniMapColors.maskColor ?? MINIMAP_MASK_COLOR}
              bgColor={miniMapColors.bgColor ?? MINIMAP_BG_COLOR}
            />
          ) : null}
        </ReactFlow>
      </div>
    </FlowCanvasContext.Provider>
  );
}
