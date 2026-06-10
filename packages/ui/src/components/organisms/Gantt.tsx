/**
 * Gantt organism — a real roadmap Gantt (rows × week columns).
 *
 * Ported from João's cohort Gantt (joao.devfellowship.com home) to the DFL
 * design system: dark surfaces, amber single-accent, Barlow/Inter/JBMono,
 * 4px grid, rounded (radius-lg) cards. ~90% visual parity, on-brand.
 *
 * Anatomy (matches the reference):
 *   ┌ STAGE / TASK ┬ W1 │ W2 │ W3 │ … │ Wn ┐   ← week axis header (mono-uppercase)
 *   │ ▸ Stage 1 ●  │ ▓▓▓▓▓▓░░░░░  40%       │   ← stage row: bar across its week-span,
 *   │   milestone  │      ▓▓▓               │     amber-filled to progress
 *   │   milestone  │         ░░░            │   ← milestone sub-bars positioned by week
 *   │ ▸ Stage 2 ●  │            ░░░░░  0%   │
 *   └──────────────┴───────────────────────┘
 *   Dependencies (predecessor → successor) render as connector links between
 *   stage bars, NOT plain arrows between cards.
 *
 * Pure (no data fetching). Consumer maps its model into GanttStage[] and the
 * derived week axis. Self-contained: only depends on cn + DS tokens/utilities.
 */
import * as React from "react";

import { cn } from "../../lib/utils";

// ─── Public types ────────────────────────────────────────────────────────────

export interface GanttMilestone {
  id: string;
  title: string;
  /** Done = filled bar + struck title. */
  done?: boolean;
  /** 1-based week this milestone starts on. Falls back to the stage's start. */
  weekStart?: number;
  /** Width of the milestone bar in weeks. Defaults to 1. */
  weekSpan?: number;
  /** Optional trailing weight/points label (e.g. "10"). */
  points?: number | string;
}

export interface GanttStage {
  id: string;
  title: string;
  subtitle?: string;
  /** Stage accent dot color. A single hex; the bar tints from it. Optional. */
  color?: string;
  /** 1-based first week of the stage bar. */
  weekStart: number;
  /** Width of the stage bar in weeks (>= 1). */
  weekSpan: number;
  /** 0–100 completion. If omitted, derived from milestones (done / total). */
  progress?: number;
  milestones?: GanttMilestone[];
  /** Start collapsed (milestone rows hidden). */
  collapsed?: boolean;
}

export interface GanttDependency {
  /** Stage id the edge starts from. */
  from: string;
  /** Stage id the edge points to. */
  to: string;
}

export interface GanttProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: GanttStage[];
  /**
   * Number of week columns, or explicit labels. If omitted, derived from the
   * furthest stage/milestone end (max weekStart + weekSpan - 1).
   */
  weeks?: number | string[];
  /** Predecessor → successor edges, drawn as connector links between stage bars. */
  dependencies?: GanttDependency[];
  /** Label for the left (rows) column header. Defaults to "STAGE / TASK". */
  rowsHeader?: string;
  /** Hide the milestone rows entirely (stages-only summary). */
  stagesOnly?: boolean;
  /** Optional header strip (e.g. member + per-stage progress pills). */
  header?: React.ReactNode;
  /**
   * Px width of the left (sticky) name column.
   * @deprecated prefer `nameColWidth` — kept as a fallback for back-compat.
   */
  labelWidth?: number;
  /**
   * Px width of the left (sticky) STAGE/TASK name column. Takes precedence
   * over `labelWidth`. Defaults to 320 — wide enough that long stage/task
   * titles read in full; overflow ellipsizes with a native tooltip. Bump this
   * higher (e.g. 420) on full-width pages where you have the room.
   */
  nameColWidth?: number;
  /** Min px width of a single week column. Defaults to 64. */
  weekMinWidth?: number;
}

/** Default width of the sticky name column. ~2× the original 240 → readable. */
export const DEFAULT_NAME_COL_WIDTH = 320;

/** Resolve the effective name-column width: `nameColWidth` > `labelWidth` > default. */
export function resolveNameColWidth(
  nameColWidth?: number,
  labelWidth?: number,
): number {
  if (typeof nameColWidth === "number" && nameColWidth > 0) return Math.round(nameColWidth);
  if (typeof labelWidth === "number" && labelWidth > 0) return Math.round(labelWidth);
  return DEFAULT_NAME_COL_WIDTH;
}

// ─── Pure layout helpers (unit-tested, node-safe) ────────────────────────────

/** Clamp a 0..100 percentage to an integer. */
export function clampPct(value: number | undefined): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Progress for a stage: explicit `progress`, else done/total of milestones. */
export function stageProgress(stage: GanttStage): number {
  if (stage.progress != null) return clampPct(stage.progress);
  const ms = stage.milestones ?? [];
  if (ms.length === 0) return 0;
  const done = ms.filter((m) => m.done).length;
  return clampPct((done / ms.length) * 100);
}

/** Total number of week columns: explicit, else furthest stage/milestone end. */
export function resolveWeekCount(
  stages: GanttStage[],
  weeks?: number | string[],
): number {
  if (Array.isArray(weeks)) return Math.max(1, weeks.length);
  if (typeof weeks === "number" && weeks > 0) return Math.round(weeks);
  let max = 1;
  for (const s of stages) {
    max = Math.max(max, s.weekStart + Math.max(1, s.weekSpan) - 1);
    for (const m of s.milestones ?? []) {
      const ws = m.weekStart ?? s.weekStart;
      max = Math.max(max, ws + Math.max(1, m.weekSpan ?? 1) - 1);
    }
  }
  return Math.max(1, max);
}

/** Week labels: explicit array, else "W1".."Wn". */
export function resolveWeekLabels(
  count: number,
  weeks?: number | string[],
): string[] {
  if (Array.isArray(weeks)) return weeks;
  return Array.from({ length: count }, (_, i) => `W${i + 1}`);
}

/**
 * Left/width of a bar as grid-column geometry (1-based, inclusive start).
 * Returns CSS grid-column values clamped to [1, weekCount].
 */
export function barGridColumn(
  weekStart: number,
  weekSpan: number,
  weekCount: number,
): { start: number; span: number } {
  const start = Math.max(1, Math.min(weekStart, weekCount));
  const rawEnd = start + Math.max(1, weekSpan) - 1;
  const end = Math.max(start, Math.min(rawEnd, weekCount));
  return { start, span: end - start + 1 };
}

// ─── Component ───────────────────────────────────────────────────────────────

const DEFAULT_DOT = "var(--s-brand-solid, #E07A4A)";

export function Gantt({
  stages,
  weeks,
  dependencies = [],
  rowsHeader = "Stage / Task",
  stagesOnly = false,
  header,
  labelWidth,
  nameColWidth,
  weekMinWidth = 64,
  className,
  style,
  ...rest
}: GanttProps) {
  const weekCount = resolveWeekCount(stages, weeks);
  const weekLabels = resolveWeekLabels(weekCount, weeks);
  const nameWidth = resolveNameColWidth(nameColWidth, labelWidth);

  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(stages.filter((s) => s.collapsed).map((s) => [s.id, true])),
  );
  const toggle = (id: string) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  // Track stage-bar DOM positions to draw dependency connectors.
  const gridRef = React.useRef<HTMLDivElement>(null);
  const barRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [edges, setEdges] = React.useState<
    { id: string; x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  const recomputeEdges = React.useCallback(() => {
    const root = gridRef.current;
    if (!root || dependencies.length === 0) {
      setEdges([]);
      return;
    }
    const rootBox = root.getBoundingClientRect();
    const next: typeof edges = [];
    for (const dep of dependencies) {
      const a = barRefs.current[dep.from];
      const b = barRefs.current[dep.to];
      if (!a || !b) continue;
      const ab = a.getBoundingClientRect();
      const bb = b.getBoundingClientRect();
      next.push({
        id: `${dep.from}->${dep.to}`,
        x1: ab.right - rootBox.left,
        y1: ab.top - rootBox.top + ab.height / 2,
        x2: bb.left - rootBox.left,
        y2: bb.top - rootBox.top + bb.height / 2,
      });
    }
    setEdges(next);
  }, [dependencies]);

  React.useLayoutEffect(() => {
    recomputeEdges();
  }, [recomputeEdges, collapsed, weekCount, stages]);

  React.useEffect(() => {
    if (dependencies.length === 0) return;
    const handler = () => recomputeEdges();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [dependencies.length, recomputeEdges]);

  const trackTemplate = `${nameWidth}px repeat(${weekCount}, minmax(${weekMinWidth}px, 1fr))`;

  // The left name column is sticky so it stays put while the week grid scrolls
  // horizontally. Each row-type carries its own opaque background (matching the
  // row) so the scrolling bars never bleed through under the sticky column.
  const stickyCol =
    "sticky left-0 z-20 after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-[var(--s-border-subtle,#2A2622)]";

  return (
    <div
      className={cn(
        "dfl-gantt rounded-[var(--c-card-radius,10px)] border border-[var(--s-border-subtle,#2A2622)] bg-[var(--s-surface-panel,#141210)] text-[var(--s-ink-primary,#F6F1E7)] overflow-hidden",
        className,
      )}
      style={style}
      {...rest}
    >
      {header && (
        <div className="border-b border-[var(--s-border-subtle,#2A2622)] px-5 py-4">
          {header}
        </div>
      )}

      <div className="overflow-x-auto">
        <div ref={gridRef} className="relative min-w-max">
          {/* Dependency connectors (overlay) */}
          {edges.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="dfl-gantt-arrow"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path
                    d="M0,0 L6,3 L0,6 Z"
                    fill="var(--s-brand-solid, #E07A4A)"
                  />
                </marker>
              </defs>
              {edges.map((e) => {
                // Route out to the right of the predecessor end, then curve into
                // the successor start — a short horizontal stub on each side keeps
                // the curve tidy even when the successor starts left of x1.
                const stub = 14;
                const c1x = e.x1 + stub;
                const c2x = e.x2 - stub;
                return (
                  <path
                    key={e.id}
                    d={`M ${e.x1} ${e.y1} C ${c1x} ${e.y1}, ${c2x} ${e.y2}, ${e.x2} ${e.y2}`}
                    fill="none"
                    stroke="var(--s-brand-solid, #E07A4A)"
                    strokeWidth={1.5}
                    strokeOpacity={0.65}
                    markerEnd="url(#dfl-gantt-arrow)"
                  />
                );
              })}
            </svg>
          )}

          {/* Week axis header */}
          <div
            className="grid items-center border-b border-[var(--s-border-subtle,#2A2622)] bg-[var(--s-surface-raised,#1A1714)]"
            style={{ gridTemplateColumns: trackTemplate }}
          >
            <div
              className={cn(
                stickyCol,
                "bg-[var(--s-surface-raised,#1A1714)] px-4 py-2.5 font-[var(--s-font-mono,monospace)] text-[10.5px] font-medium uppercase tracking-[0.6px] text-[var(--s-ink-muted,#7D7568)]",
              )}
            >
              {rowsHeader}
            </div>
            {weekLabels.map((label, i) => (
              <div
                key={i}
                className="border-l border-[var(--s-border-subtle,#2A2622)] py-2.5 text-center font-[var(--s-font-mono,monospace)] text-[11px] tabular-nums text-[var(--s-ink-muted,#7D7568)]"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Stage + milestone rows */}
          {stages.map((stage) => {
            const pct = stageProgress(stage);
            const dot = stage.color || DEFAULT_DOT;
            const isCollapsed = !!collapsed[stage.id];
            const ms = stage.milestones ?? [];
            const done = ms.filter((m) => m.done).length;
            const sCol = barGridColumn(stage.weekStart, stage.weekSpan, weekCount);

            return (
              <React.Fragment key={stage.id}>
                {/* Stage row */}
                <div
                  className="grid items-center border-b border-[var(--s-border-subtle,#2A2622)]"
                  style={{ gridTemplateColumns: trackTemplate }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(stage.id)}
                    className={cn(
                      stickyCol,
                      "flex items-center gap-2 bg-[var(--s-surface-panel,#141210)] px-4 py-3 text-left transition-colors hover:bg-[var(--s-surface-raised,#1A1714)]",
                    )}
                    aria-expanded={!isCollapsed}
                  >
                    <Chevron open={!isCollapsed} />
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: dot }}
                    />
                    <span className="min-w-0">
                      <span
                        className="block truncate text-[13px] font-semibold text-[var(--s-ink-primary,#F6F1E7)]"
                        title={stage.title}
                      >
                        {stage.title}
                      </span>
                      {stage.subtitle && (
                        <span
                          className="block truncate text-[11px] text-[var(--s-ink-muted,#7D7568)]"
                          title={stage.subtitle}
                        >
                          {stage.subtitle}
                        </span>
                      )}
                    </span>
                    {ms.length > 0 && (
                      <span className="ml-auto shrink-0 rounded-[var(--c-badge-radius,4px)] bg-[var(--s-surface-elevated,#1F1C18)] px-1.5 py-0.5 font-[var(--s-font-mono,monospace)] text-[10px] tabular-nums text-[var(--s-ink-secondary,#C9C0B4)]">
                        {done}/{ms.length}
                      </span>
                    )}
                  </button>

                  {/* Stage bar spanning week columns */}
                  <div
                    className="relative h-9"
                    style={{
                      gridColumn: `${1 + sCol.start} / span ${sCol.span}`,
                    }}
                  >
                    <div
                      ref={(el) => {
                        barRefs.current[stage.id] = el;
                      }}
                      className="absolute inset-y-2 inset-x-1 overflow-hidden rounded-[var(--p-radius-sm,4px)]"
                      style={{ background: tint(dot, 0.16) }}
                      title={`${stage.title} · ${pct}%`}
                    >
                      <div
                        className="h-full rounded-[var(--p-radius-sm,4px)]"
                        style={{ width: `${pct}%`, background: dot }}
                      />
                      <span className="absolute inset-0 flex items-center px-2 font-[var(--s-font-mono,monospace)] text-[10.5px] font-medium tabular-nums text-[var(--s-ink-primary,#F6F1E7)]">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestone rows */}
                {!stagesOnly &&
                  !isCollapsed &&
                  ms.map((m) => {
                    const mStart = m.weekStart ?? stage.weekStart;
                    const mCol = barGridColumn(
                      mStart,
                      m.weekSpan ?? 1,
                      weekCount,
                    );
                    return (
                      <div
                        key={m.id}
                        className="grid items-center border-b border-[var(--s-border-subtle,#2A2622)] bg-[var(--s-surface-page,#0A0908)]"
                        style={{ gridTemplateColumns: trackTemplate }}
                      >
                        <div
                          className={cn(
                            stickyCol,
                            "flex items-center gap-2 bg-[var(--s-surface-page,#0A0908)] py-2 pl-10 pr-4",
                          )}
                        >
                          <StatusDot done={m.done} color={dot} />
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate text-[13px]",
                              m.done
                                ? "text-[var(--s-ink-muted,#7D7568)] line-through"
                                : "text-[var(--s-ink-secondary,#C9C0B4)]",
                            )}
                            title={m.title}
                          >
                            {m.title}
                          </span>
                          {m.points != null && (
                            <span className="shrink-0 font-[var(--s-font-mono,monospace)] text-[10px] tabular-nums text-[var(--s-ink-muted,#7D7568)]">
                              {m.points}
                            </span>
                          )}
                        </div>
                        <div
                          className="relative h-6"
                          style={{
                            gridColumn: `${1 + mCol.start} / span ${mCol.span}`,
                          }}
                        >
                          <div
                            className={cn(
                              "absolute inset-y-1.5 inset-x-1 rounded-[var(--p-radius-sm,4px)]",
                              m.done ? "" : "border",
                            )}
                            style={
                              m.done
                                ? { background: dot }
                                : {
                                    background: tint(dot, 0.08),
                                    borderColor: tint(dot, 0.4),
                                  }
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
              </React.Fragment>
            );
          })}

          {stages.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-[var(--s-ink-muted,#7D7568)]">
              No stages yet.
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 border-t border-[var(--s-border-subtle,#2A2622)] px-5 py-2.5 font-[var(--s-font-mono,monospace)] text-[10.5px] uppercase tracking-[0.6px] text-[var(--s-ink-muted,#7D7568)]">
        <LegendItem swatch={<span className="h-2.5 w-3 rounded-[2px]" style={{ background: "var(--s-brand-solid, #E07A4A)" }} />} label="Completed" />
        <LegendItem swatch={<span className="h-2.5 w-3 rounded-[2px] border" style={{ background: "rgba(224,122,74,0.08)", borderColor: "rgba(224,122,74,0.4)" }} />} label="Upcoming" />
        {dependencies.length > 0 && (
          <LegendItem swatch={<span className="block h-0.5 w-4" style={{ background: "var(--s-brand-solid, #E07A4A)", opacity: 0.7 }} />} label="Depends on" />
        )}
      </div>
    </div>
  );
}

// ─── Sub-parts ───────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[var(--s-ink-muted,#7D7568)] transition-transform"
      style={{ transform: open ? "rotate(90deg)" : "none" }}
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function StatusDot({ done, color }: { done?: boolean; color: string }) {
  if (done) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill={color} />
        <path
          d="M8 12l3 3 5-6"
          fill="none"
          stroke="var(--s-ink-inverse, #0A0908)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="var(--s-border-strong, #3A3530)"
        strokeWidth="2"
      />
    </svg>
  );
}

function LegendItem({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {swatch}
      {label}
    </span>
  );
}

/**
 * Tint a hex color toward transparency (returns an rgba). For non-hex inputs
 * (CSS vars), wraps in color-mix so DS tokens still tint gracefully.
 */
function tint(color: string, alpha: number): string {
  const hex = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (hex) {
    const n = parseInt(hex[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}
