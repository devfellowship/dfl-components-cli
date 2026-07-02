"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../lib/utils";

/**
 * ResizablePanelGroup / ResizablePanel / ResizableHandle
 *
 * DS v0 token adoption — Layer 3 component tokens (--c-resizable-*):
 *   --c-resizable-handle-track          → --s-border-subtle  (1px divider, idle)
 *   --c-resizable-handle-track-hover    → --s-border-strong  (divider on hover)
 *   --c-resizable-handle-track-focus    → --s-brand-solid    (divider on keyboard focus)
 *   --c-resizable-handle-track-drag     → --s-brand-solid    (divider while dragging)
 *   --c-resizable-grip-bg               → --s-surface-elevated
 *   --c-resizable-grip-border           → --s-border-subtle
 *   --c-resizable-grip-border-hover     → --s-border-strong
 *   --c-resizable-grip-border-focus     → --s-brand-solid
 *   --c-resizable-grip-border-drag      → --s-brand-solid
 *   --c-resizable-grip-icon             → --s-ink-muted
 *   --c-resizable-grip-icon-drag        → --s-brand-solid
 *
 * Focus ring: DFL uniform ring (2px surface-page gap + 1px amber) applied as
 *   box-shadow on the grip widget when the handle has :focus-visible.
 * Drag state: react-resizable-panels emits data-resize-handle-active on
 *   PanelResizeHandle during drag — drives amber track + amber-tinted grip +
 *   amber dot icons.
 */

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        // ── Layout ──────────────────────────────────────────────────────────
        "group relative flex w-px items-center justify-center",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        // ── Vertical direction adjustments ───────────────────────────────────
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full",
        "data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
        // Rotate grip widget 90° when direction is vertical
        "[&[data-panel-group-direction=vertical]>div]:rotate-90",
        // ── Track color: idle → hover → focus → drag (drag wins) ────────────
        "bg-[var(--c-resizable-handle-track)]",
        "hover:bg-[var(--c-resizable-handle-track-hover)]",
        "focus-visible:bg-[var(--c-resizable-handle-track-focus)]",
        "data-[resize-handle-active]:bg-[var(--c-resizable-handle-track-drag)]",
        "transition-colors duration-150",
        // ── Focus: suppress default outline; ring lives on the grip widget ───
        "focus-visible:outline-hidden",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            // ── Layout ────────────────────────────────────────────────────────
            "z-10 flex h-4 w-3 items-center justify-center rounded-xs",
            // ── Colors (idle) ─────────────────────────────────────────────────
            "bg-[var(--c-resizable-grip-bg)]",
            "border border-[var(--c-resizable-grip-border)]",
            // ── Smooth transitions ────────────────────────────────────────────
            "transition-colors duration-150",
            // ── Hover state (parent group has :hover) ─────────────────────────
            "group-hover:border-[var(--c-resizable-grip-border-hover)]",
            // ── Focus state — DFL uniform ring: 2px gap + 1px amber ──────────
            "group-focus-visible:border-[var(--c-resizable-grip-border-focus)]",
            "group-focus-visible:shadow-[0_0_0_2px_var(--s-surface-page),_0_0_0_3px_#E07A4A]",
            // ── Drag/active state (data-resize-handle-active on parent) ───────
            "group-data-[resize-handle-active]:border-[var(--c-resizable-grip-border-drag)]",
            "group-data-[resize-handle-active]:bg-[rgba(224,122,74,0.10)]",
          )}
        >
          <GripVerticalIcon
            className={cn(
              "size-2.5",
              "text-[var(--c-resizable-grip-icon)]",
              "transition-colors duration-150",
              // Hover: dots brighten to ink-secondary
              "group-hover:text-[var(--s-ink-secondary)]",
              // Focus: dots brighten (border-focus already signals focus)
              "group-focus-visible:text-[var(--s-ink-secondary)]",
              // Drag: dots turn amber
              "group-data-[resize-handle-active]:text-[var(--c-resizable-grip-icon-drag)]",
            )}
          />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
