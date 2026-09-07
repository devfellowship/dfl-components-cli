// Origin: agent
import React from "react";
import type { RoadmapGroup as Group } from "./contract";
import { resolveGroupTone } from "./contract";
import { groupColumnRuns } from "./layout";
import { toneStyle } from "./appearance";
export function RoadmapGroupView({ group, testIdPrefix }: { group: Group; testIdPrefix: string }) {
  return <>{groupColumnRuns(group).map((run, index) => <div key={run.start} data-testid={`${testIdPrefix}-group`} data-group-id={group.id}
    style={{ ...toneStyle(resolveGroupTone(group)), gridColumn: `${run.start} / span ${run.span}`, gridRow: `${group.from + 1} / span ${group.to - group.from + 1}` }}
    className="pointer-events-none relative z-0 min-w-0 self-stretch rounded-[var(--radius)] border-2 border-[var(--c-roadmap-border)] bg-[var(--c-roadmap-node-bg)] text-[var(--c-roadmap-node-fg)]">
    {index === 0 && group.title && <span className="absolute left-2 right-2 top-0 -translate-y-1/2 text-xs leading-normal"><span className="bg-[var(--c-roadmap-surface)] px-1 [overflow-wrap:anywhere]">{group.title}</span></span>}
    {index === 0 && group.description && <span className="sr-only">{group.description}</span>}
  </div>)}</>;
}
