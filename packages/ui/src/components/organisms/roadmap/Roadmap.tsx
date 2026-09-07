// Origin: agent
import React, { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import type { RoadmapDocument, RoadmapNode, RoadmapNodeState, RoadmapStateOverlay } from "./contract";
import { resolveLegendPlacement, resolveNodeState } from "./contract";
import { placeNodes } from "./layout";
import { RoadmapNodeView } from "./RoadmapNode";
import { RoadmapGroupView } from "./RoadmapGroup";
import { RoadmapLegendView } from "./RoadmapLegend";
import { RoadmapEdgeLayer } from "./RoadmapEdgeLayer";
export interface RoadmapProps {
  document: RoadmapDocument; state?: RoadmapStateOverlay;
  renderNode?: (node: RoadmapNode, state: RoadmapNodeState) => ReactNode;
  onNodeClick?: (node: RoadmapNode) => void; onAction?: (actionId: string, node: RoadmapNode) => void;
  debugPerf?: boolean;
  testIdPrefix?: string; className?: string; ariaLabel?: string;
}
/** Dark-only, ordinary document scroll. The JSON owns placement; CSS owns the pixels. */
export function Roadmap({ document, state, renderNode, onNodeClick, onAction, testIdPrefix = "roadmap", className = "", ariaLabel, debugPerf }: RoadmapProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { placements } = useMemo(() => placeNodes(document), [document]);
  const badges = useMemo(() => new Map(document.legend?.entries.map(entry => [entry.id, entry])), [document.legend]);
  const legendPlacement = document.legend ? resolveLegendPlacement(document.legend) : undefined;
  const legend = document.legend && <RoadmapLegendView legend={document.legend} testIdPrefix={testIdPrefix} />;
  return <section data-testid={testIdPrefix} aria-label={ariaLabel ?? document.title ?? "Roadmap"} className={`min-w-0 bg-[var(--c-roadmap-surface)] p-3 text-[var(--c-roadmap-neutral-fg)] ${className}`}>
    {legendPlacement === "top" && <div className="mb-6">{legend}</div>}
    <div ref={gridRef} data-roadmap-grid="" data-testid={`${testIdPrefix}-grid`} role="list" aria-label="Roadmap nodes" className="relative isolate grid min-w-0 grid-cols-3 items-center gap-x-3 gap-y-2 md:gap-x-8">
      <RoadmapEdgeLayer containerRef={gridRef} document={document} testIdPrefix={testIdPrefix} debugPerf={debugPerf} />
      {document.groups.map(group => <RoadmapGroupView key={group.id} group={group} testIdPrefix={testIdPrefix} />)}
      {placements.map(({ node, row, column }) => {
        const resolvedState = resolveNodeState(node, state);
        return <div key={node.id} role="listitem" data-testid={`${testIdPrefix}-node`} data-node-id={node.id} data-roadmap-node={node.id} data-state={resolvedState}
          style={{ gridColumn: `${column.start} / span ${column.span}`, gridRow: `${row.start} / span 1` }} className="relative z-10 min-w-0 px-2 py-2">
          {node.kind === "legend" ? (legendPlacement === "inline" ? legend : null) : renderNode ? renderNode(node, resolvedState) : <RoadmapNodeView node={node} state={resolvedState} badge={node.badge ? badges.get(node.badge) : undefined} onNodeClick={onNodeClick} onAction={onAction} testIdPrefix={testIdPrefix} />}
        </div>;
      })}
    </div>
    {legendPlacement === "bottom" && <div className="mt-6">{legend}</div>}
  </section>;
}
