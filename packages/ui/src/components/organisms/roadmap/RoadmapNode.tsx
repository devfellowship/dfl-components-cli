// Origin: agent
import React from "react";
import { cva } from "class-variance-authority";
import type { RoadmapNode as Node, RoadmapNodeState, RoadmapLegendEntry } from "./contract";
import { resolveNodeTone } from "./contract";
import { RoadmapBadge } from "./RoadmapLegend";
import { focusClass, toneStyle } from "./appearance";
const nodeVariants = cva("relative flex min-w-0 flex-col justify-center rounded-[var(--radius)] border-2 px-2 py-3 text-center text-xs leading-normal md:px-4 md:text-base text-[var(--c-roadmap-node-fg)]", {
  variants: {
    kind: { topic: "min-h-[49px] border-[var(--c-roadmap-border)] bg-[var(--c-roadmap-node-bg)]", subtopic: "min-h-[49px] border-[var(--c-roadmap-border)] bg-[var(--c-roadmap-node-bg)]", button: "min-h-[49px] border-[var(--c-roadmap-border)] bg-[var(--c-roadmap-node-bg)]", label: "border-transparent bg-transparent", title: "border-transparent bg-transparent font-semibold md:text-[28px]", paragraph: "text-left border-[var(--c-roadmap-border)] bg-[var(--c-roadmap-node-bg)]", legend: "border-[var(--c-roadmap-border)] bg-[var(--c-roadmap-node-bg)]" },
    state: { todo: "", done: "[--c-roadmap-node-bg:var(--c-roadmap-done-bg)] [--c-roadmap-node-fg:var(--c-roadmap-done-fg)]", learning: "[--c-roadmap-node-bg:var(--c-roadmap-learning-bg)] [--c-roadmap-node-fg:var(--c-roadmap-learning-fg)]", skipped: "[--c-roadmap-node-bg:var(--c-roadmap-skipped-bg)] [--c-roadmap-node-fg:var(--c-roadmap-skipped-fg)]", locked: "opacity-60" },
  },
});
export interface RoadmapNodeViewProps {
  node: Node; state: RoadmapNodeState; badge?: RoadmapLegendEntry; testIdPrefix: string;
  onNodeClick?: (node: Node) => void; onAction?: (actionId: string, node: Node) => void;
}
export function RoadmapNodeView({ node, state, badge, testIdPrefix, onNodeClick, onAction }: RoadmapNodeViewProps) {
  const locked = state === "locked";
  const nodeTone = resolveNodeTone(node);
  // Inline tone variables belong on an outer element so state classes can override them.
  const label = <span data-testid={`${testIdPrefix}-node-label`} className={`[overflow-wrap:anywhere] ${state === "done" ? "line-through" : state === "learning" ? "underline" : ""}`}>{node.label}</span>;
  const interactiveClass = `block w-full min-w-0 text-inherit ${focusClass}`;
  const wholeBox = !locked && !node.action && !node.links?.length;
  const Box = wholeBox && node.href ? "a" : wholeBox && onNodeClick ? "button" : "div";
  const primary = Box !== "div" ? label : node.href && !locked ? <a href={node.href} className={interactiveClass} onClick={() => onNodeClick?.(node)}>{label}</a>
    : onNodeClick && !locked ? <button type="button" className={interactiveClass} onClick={() => onNodeClick(node)}>{label}</button> : label;
  const icon = node.icon ?? (badge ? { name: badge.icon ?? "check", side: "right" as const, tone: badge.tone } : undefined);
  return <div style={toneStyle(nodeTone)} className="min-w-0">
    <Box data-roadmap-node-box={node.id} href={Box === "a" ? node.href : undefined} type={Box === "button" ? "button" : undefined} onClick={Box !== "div" ? () => onNodeClick?.(node) : undefined} className={`${nodeVariants({ kind: node.kind, state })} w-full ${Box !== "div" ? focusClass : ""}`} aria-disabled={locked || undefined} title={node.kind === "topic" || node.kind === "subtopic" ? node.description : undefined}>
      {icon && <RoadmapBadge name={icon.name} tone={icon.tone ?? nodeTone} label={badge?.label ?? icon.name} className={`absolute top-1/2 -translate-y-1/2 ${icon.side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`} />}
      {primary}
      {node.description && node.kind === "paragraph" && <p className="mt-2 [overflow-wrap:anywhere]">{node.description}</p>}
      {node.links && <ul className="mt-2 list-none space-y-2 p-0">{node.links.map((link, index) => <li key={index}>{locked ? <span>{link.label}</span> : <a href={link.href} className={`underline [overflow-wrap:anywhere] ${focusClass}`} onClick={e => e.stopPropagation()}>{link.label}</a>}</li>)}</ul>}
      {node.action && <div style={toneStyle(node.action.tone ?? "primary")} className="mt-3 min-w-0">
        {node.action.href && !locked ? <a href={node.action.href} className={`inline-block rounded px-2 py-2 bg-[var(--c-roadmap-node-bg)] text-[var(--c-roadmap-node-fg)] [overflow-wrap:anywhere] ${focusClass}`}>{node.action.label}</a> : <button type="button" disabled={locked} className={`max-w-full rounded px-2 py-2 bg-[var(--c-roadmap-node-bg)] text-[var(--c-roadmap-node-fg)] [overflow-wrap:anywhere] ${focusClass}`} onClick={e => { e.stopPropagation(); if (node.action?.actionId) onAction?.(node.action.actionId, node); }}>{node.action.label}</button>}
      </div>}
    </Box>
  </div>;
}
