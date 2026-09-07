// Origin: agent
import type { CSSProperties } from "react";
import type { RoadmapTone } from "./contract";
/** The only colour inputs are semantic tokens. Q1: the surface is dark only. */
export function toneStyle(tone: RoadmapTone): CSSProperties {
  return {
    "--c-roadmap-node-bg": `var(--c-roadmap-${tone}-bg)`,
    "--c-roadmap-node-fg": `var(--c-roadmap-${tone}-fg)`,
  } as CSSProperties;
}
export const focusClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-roadmap-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-roadmap-surface)]";
