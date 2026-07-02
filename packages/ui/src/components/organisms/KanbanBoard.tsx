/**
 * KanbanBoard organism — static visual Kanban with DS-correct elevation stack.
 *
 * Fixes vs previous implementation:
 *   1. Elevation hierarchy: column = --s-surface-panel (#141210), card = --s-surface-raised
 *      (#1a1714), card hover = --s-surface-elevated (#1f1c18). Was INVERTED: columns used
 *      --muted (sand-850) and cards used bg-card (sand-900), so cards sank below columns.
 *   2. Focus ring: DS uniform double box-shadow (2px page-bg gap + 1px amber outer ring).
 *      Applied via focus-visible class; transition: none per DS spec.
 *   3. Ticket IDs (T-101…) use var(--c-kanban-id-font) = JetBrains Mono.
 *   4. Badge variant semantic mapping:
 *        Bug → danger | Conteúdo → default (brand amber) | Backend/Infra → info
 *        QA → warning | Marketing/others → secondary (muted)
 *      Plus shape="square" (4px radius) per --c-badge-radius spec.
 *   5. Done-column cards carry opacity: 0.6 for visual attenuation.
 *   6. Empty column shows a dashed drop-zone placeholder occupying remaining height.
 *
 * No drag-and-drop library — pure static representation with grip affordance.
 * Composes existing @devfellowship/components primitives only.
 */
import * as React from "react";
import { GripVertical, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Badge } from "../badge";

// ── Types ─────────────────────────────────────────────────────────────────────

export type KanbanStatus = "todo" | "doing" | "review" | "done";

export interface KanbanItem {
  id: string;
  title: string;
  assignee: string;
  avatar?: string;
  tag: string;
}

export interface KanbanColumnDef {
  key: KanbanStatus;
  label: string;
  items: KanbanItem[];
}

/** Visual state override for story showcase (no runtime state machine needed). */
export type KanbanCardState = "default" | "focused" | "dragging";

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Semantic tag → Badge variant mapping per DS spec.
 *
 * Bug → danger (outline-on-subtle red)
 * Conteúdo → default (brand amber outline-on-subtle)
 * Backend / Infra → info (blue — these are technical, not CTA-level)
 * QA → warning (yellow)
 * Marketing / others → secondary (muted surface)
 */
export function tagVariant(
  tag: string,
): "default" | "danger" | "info" | "warning" | "secondary" {
  switch (tag) {
    case "Bug":
      return "danger";
    case "Conteúdo":
      return "default";
    case "Backend":
    case "Infra":
      return "info";
    case "QA":
      return "warning";
    default:
      return "secondary";
  }
}

/** Column status → top-border accent colour (resolves to DS semantic tokens). */
export function statusAccent(status: KanbanStatus): string {
  switch (status) {
    case "todo":
      return "var(--s-border-strong)"; // neutral gray
    case "doing":
      return "var(--s-brand-solid)"; // amber #E07A4A
    case "review":
      return "var(--s-info-solid)"; // blue #7aa2e0
    case "done":
      return "var(--s-success-solid)"; // green #5ec27e
  }
}

// ── KanbanCard ────────────────────────────────────────────────────────────────

export interface KanbanCardProps {
  item: KanbanItem;
  /**
   * Force a specific visual state for Storybook showcase.
   * In production, states are driven by CSS :hover / :focus-visible.
   */
  forceState?: KanbanCardState;
  /** Apply done-column opacity attenuation (0.6). */
  done?: boolean;
}

export function KanbanCard({ item, forceState, done }: KanbanCardProps) {
  const isDragging = forceState === "dragging";
  const isFocused = forceState === "focused";
  const isAtenuated = done === true;

  const cardStyle: React.CSSProperties = {
    background: isDragging
      ? "var(--c-kanban-card-bg-hover)"
      : "var(--c-kanban-card-bg)",
    borderTop: `1px solid ${isDragging ? "var(--c-kanban-card-drag-border)" : "var(--c-kanban-card-border)"}`,
    borderRight: `1px solid ${isDragging ? "var(--c-kanban-card-drag-border)" : "var(--c-kanban-card-border)"}`,
    borderBottom: `1px solid ${isDragging ? "var(--c-kanban-card-drag-border)" : "var(--c-kanban-card-border)"}`,
    borderLeft: `1px solid ${isDragging ? "var(--c-kanban-card-drag-border)" : "var(--c-kanban-card-border)"}`,
    borderRadius: "var(--c-kanban-card-radius)",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 9,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    opacity: isAtenuated ? 0.6 : 1,
    ...(isDragging && {
      boxShadow: "var(--c-kanban-card-drag-shadow)",
      transform: "rotate(1.5deg)",
    }),
    ...(isFocused && {
      // Forced focus state for story showcase — matches :focus-visible ring exactly
      boxShadow: "0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A",
      borderTopColor: "var(--c-kanban-card-border-hover)",
      borderRightColor: "var(--c-kanban-card-border-hover)",
      borderBottomColor: "var(--c-kanban-card-border-hover)",
      borderLeftColor: "var(--c-kanban-card-border-hover)",
      outline: "none",
    }),
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-roledescription="Cartão arrastável"
      style={cardStyle}
      // DS uniform focus ring via Tailwind focus-visible: (only active when not force-focused)
      // box-shadow: 2px page-bg gap + 1px amber outer ring; transition: none per DS spec.
      className={
        !isFocused
          ? "outline-none focus-visible:[box-shadow:0_0_0_2px_var(--s-surface-page),0_0_0_3px_#E07A4A] focus-visible:[border-color:var(--c-kanban-card-border-hover)]"
          : undefined
      }
    >
      {/* Title row — grip icon + task title */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
        <GripVertical
          style={{
            width: 13,
            height: 13,
            color: "var(--s-ink-muted)",
            marginTop: 1,
            flexShrink: 0,
          }}
          aria-hidden
        />
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: "var(--s-ink-primary)",
            lineHeight: 1.4,
          }}
        >
          {item.title}
        </span>
      </div>

      {/* Meta row — badge + ticket ID + avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        {/* Semantic badge — square (4 px radius) per DS spec */}
        <Badge variant={tagVariant(item.tag)} shape="square">
          {item.tag}
        </Badge>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Ticket ID — JetBrains Mono per DS spec for codes/IDs */}
          <span
            style={{
              fontFamily: "var(--c-kanban-id-font)",
              fontSize: 10,
              color: "var(--c-kanban-id-fg)",
              letterSpacing: "0.4px",
              whiteSpace: "nowrap",
            }}
          >
            {item.id}
          </span>
          <Avatar className="h-[22px] w-[22px] shrink-0">
            {item.avatar && <AvatarImage src={item.avatar} alt={item.assignee} />}
            <AvatarFallback className="text-[8.5px] font-semibold">
              {getInitials(item.assignee)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

// ── KanbanDropZone ────────────────────────────────────────────────────────────

/**
 * Dashed drop-zone placeholder rendered in empty columns.
 * Occupies the remaining column height (flex: 1) with a centered Plus icon + label.
 */
export function KanbanDropZone() {
  return (
    <div
      style={{
        border: "1.5px dashed var(--c-kanban-dropzone-border)",
        borderRadius: "var(--c-kanban-card-radius)",
        padding: "22px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        color: "var(--c-kanban-dropzone-fg)",
        fontSize: 12,
        flex: 1,
        minHeight: 90,
      }}
    >
      <Plus style={{ width: 18, height: 18, opacity: 0.4 }} aria-hidden />
      <span>Arraste cartões aqui</span>
    </div>
  );
}

// ── KanbanColumn ──────────────────────────────────────────────────────────────

export interface KanbanColumnProps {
  column: KanbanColumnDef;
  /** Force done-column attenuation on all cards */
  doneAttenuation?: boolean;
  /** Force empty drop zone regardless of items.length */
  forceEmpty?: boolean;
}

export function KanbanColumn({
  column,
  doneAttenuation,
  forceEmpty,
}: KanbanColumnProps) {
  const accent = statusAccent(column.key);
  const isEmpty = forceEmpty || column.items.length === 0;

  return (
    <div
      style={{
        background: "var(--c-kanban-col-bg)",
        borderTop: `2px solid ${accent}`,
        borderRight: "1px solid var(--c-kanban-col-border)",
        borderBottom: "1px solid var(--c-kanban-col-border)",
        borderLeft: "1px solid var(--c-kanban-col-border)",
        borderRadius: "var(--c-kanban-col-radius)",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 200,
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2px 2px 6px",
          borderBottom: "1px solid var(--c-kanban-col-border)",
          marginBottom: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* Status dot */}
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: accent,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--s-ink-secondary)",
              letterSpacing: "0.1px",
            }}
          >
            {column.label}
          </span>
        </div>

        {/* Count chip — JetBrains Mono, pill shape */}
        <span
          style={{
            fontFamily: "var(--c-kanban-id-font)",
            fontSize: 10,
            fontWeight: 500,
            color: "var(--s-ink-muted)",
            background: "var(--c-kanban-count-bg)",
            border: "1px solid var(--c-kanban-count-border)",
            borderRadius: 999,
            padding: "1px 8px",
            minWidth: 22,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {column.items.length}
        </span>
      </div>

      {/* Cards or empty drop zone */}
      {isEmpty ? (
        <KanbanDropZone />
      ) : (
        column.items.map((item) => (
          <KanbanCard key={item.id} item={item} done={doneAttenuation} />
        ))
      )}
    </div>
  );
}

// ── KanbanBoard ───────────────────────────────────────────────────────────────

export interface KanbanBoardProps {
  columns: KanbanColumnDef[];
}

/** Full-width board grid. Column count drives the CSS grid. */
export function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns.length}, minmax(220px, 1fr))`,
        gap: 12,
        overflowX: "auto",
        paddingBottom: 8,
      }}
    >
      {columns.map((col) => (
        <KanbanColumn
          key={col.key}
          column={col}
          doneAttenuation={col.key === "done"}
        />
      ))}
    </div>
  );
}
