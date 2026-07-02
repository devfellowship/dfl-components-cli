import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/resizable";

/**
 * Resizable — one story per state (DS v0 "1 story = 1 state" rule).
 *
 * DS component tokens exercised:
 *   --c-resizable-handle-track / -hover / -focus / -drag  (divider line)
 *   --c-resizable-grip-bg / -border / -border-hover / -border-focus / -border-drag
 *   --c-resizable-grip-icon / -icon-drag
 *   Focus ring: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A (DFL uniform)
 *
 * Drag state driven by data-resize-handle-active attribute from the library.
 * Handle/Focus story uses a play function to programmatically focus the handle.
 * Handle/Hover and Handle/Active use static visual mocks (CSS `:hover` and
 * pointer drag cannot be reliably triggered without a pseudo-states addon).
 */

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "Components/Organisms/Resizable",
  component: ResizablePanelGroup,
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

/* ─────────────────────────────────────────────────────────────────────────
 * Shared panel content helpers
 * ─────────────────────────────────────────────────────────────────────── */

function PanelContent({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center p-4 text-sm text-[var(--s-ink-muted)]">
      {label}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Static handle-state demo (for Hover + Active — cannot simulate via play)
 *
 * Renders a static mini split-pane using inline CSS tokens set to the
 * values the real component applies during that state.
 * ─────────────────────────────────────────────────────────────────────── */

type HandleState = "idle" | "hover" | "focus" | "active";

function StaticHandleDemo({ state = "idle" }: { state?: HandleState }) {
  const isHover = state === "hover";
  const isFocus = state === "focus";
  const isActive = state === "active";
  const isElevated = isHover || isFocus || isActive;

  const trackBg = isActive
    ? "var(--c-resizable-handle-track-drag)"
    : isFocus
      ? "var(--c-resizable-handle-track-focus)"
      : isHover
        ? "var(--c-resizable-handle-track-hover)"
        : "var(--c-resizable-handle-track)";

  const gripBg = isActive
    ? "rgba(224,122,74,0.10)"
    : "var(--c-resizable-grip-bg)";

  const gripBorder = isActive
    ? "1px solid var(--c-resizable-grip-border-drag)"
    : isFocus
      ? "1px solid var(--c-resizable-grip-border-focus)"
      : isHover
        ? "1px solid var(--c-resizable-grip-border-hover)"
        : "1px solid var(--c-resizable-grip-border)";

  const gripBoxShadow = isFocus
    ? "0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A"
    : "none";

  const dotColor = isActive
    ? "var(--c-resizable-grip-icon-drag)"
    : isElevated
      ? "var(--s-ink-secondary)"
      : "var(--c-resizable-grip-icon)";

  return (
    <div
      style={{
        display: "flex",
        height: "120px",
        width: "240px",
        border: "1px solid var(--s-border-subtle)",
        borderRadius: "6px",
        overflow: "hidden",
        background: "var(--s-surface-panel)",
      }}
    >
      {/* Left panel mock */}
      <div
        style={{
          flex: 1,
          background: "var(--s-surface-panel)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          color: "var(--s-ink-muted)",
        }}
      >
        Panel
      </div>

      {/* Handle track + grip */}
      <div
        style={{
          position: "relative",
          width: "1px",
          flexShrink: 0,
          background: trackBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "col-resize",
        }}
        role="separator"
        aria-orientation="vertical"
      >
        {/* Grip widget */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "12px",
            height: "18px",
            background: gripBg,
            border: gripBorder,
            borderRadius: "3px",
            boxShadow: gripBoxShadow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 3×2 dot grid (matches GripVerticalIcon visual) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2px",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "2px",
                  height: "2px",
                  borderRadius: "50%",
                  background: dotColor,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel mock */}
      <div
        style={{
          flex: 1,
          background: "var(--s-surface-panel)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          color: "var(--s-ink-muted)",
        }}
      >
        Panel
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Story 1 — Horizontal / Default
 * Two-pane horizontal group, no grip handle, idle state.
 * ─────────────────────────────────────────────────────────────────────── */

/** Two-pane horizontal split — bare handle (no grip widget), idle state. */
export const HorizontalDefault: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-48 w-[480px] rounded-md border"
    >
      <ResizablePanel defaultSize={30}>
        <PanelContent label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <PanelContent label="Content" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 2 — Horizontal / WithHandle
 * Two-pane horizontal group with grip widget (withHandle=true), idle state.
 * ─────────────────────────────────────────────────────────────────────── */

/** Two-pane horizontal split — grip handle enabled, idle state. */
export const HorizontalWithHandle: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-48 w-[480px] rounded-md border"
    >
      <ResizablePanel defaultSize={30}>
        <PanelContent label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <PanelContent label="Content" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 3 — Vertical / Default
 * Two-pane vertical group, no grip handle.
 * ─────────────────────────────────────────────────────────────────────── */

/** Two-pane vertical split — bare handle, no grip widget. */
export const VerticalDefault: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="vertical"
      className="h-64 w-72 rounded-md border"
    >
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Top" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Bottom" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 4 — Vertical / WithHandle
 * Two-pane vertical group with grip widget.
 * ─────────────────────────────────────────────────────────────────────── */

/** Two-pane vertical split — grip handle enabled (grip rotated 90° for vertical direction). */
export const VerticalWithHandle: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="vertical"
      className="h-64 w-72 rounded-md border"
    >
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Top" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Bottom" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 5 — ThreePane / Default
 * Sidebar + content + detail panes, both handles with grip.
 * ─────────────────────────────────────────────────────────────────────── */

/** Three-pane horizontal layout: sidebar (25%) + content (flexible) + detail (30%). */
export const ThreePaneDefault: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-56 w-[640px] rounded-md border"
    >
      <ResizablePanel defaultSize={25} minSize={15}>
        <PanelContent label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45}>
        <PanelContent label="Content" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={15}>
        <PanelContent label="Detail" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 6 — Handle / Hover
 * Close-up of grip handle in pointer-hover state.
 * Static mock: track brightens to --s-border-strong, grip border brightens.
 * (CSS :hover cannot be reliably triggered without a pseudo-states addon.)
 * ─────────────────────────────────────────────────────────────────────── */

/**
 * Handle in pointer-hover state — static visual mock.
 *
 * Tokens active:
 *   track:  --c-resizable-handle-track-hover → --s-border-strong
 *   border: --c-resizable-grip-border-hover  → --s-border-strong
 *   dots:   --s-ink-secondary                (brightened from --s-ink-muted)
 */
export const HandleHover: Story = {
  render: () => <StaticHandleDemo state="hover" />,
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 7 — Handle / Focus
 * Grip in keyboard-focus state showing the DFL uniform amber ring.
 * Uses play function to programmatically focus the handle.
 * ─────────────────────────────────────────────────────────────────────── */

/**
 * Handle in :focus-visible state — DFL uniform amber ring on grip.
 *
 * Tokens active:
 *   track:  --c-resizable-handle-track-focus → --s-brand-solid (#E07A4A)
 *   border: --c-resizable-grip-border-focus  → --s-brand-solid
 *   ring:   box-shadow 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 */
export const HandleFocus: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-48 w-[400px] rounded-md border"
    >
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Panel" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Panel" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvasElement }) => {
    const handle = canvasElement.querySelector<HTMLElement>(
      '[data-slot="resizable-handle"]',
    );
    handle?.focus();
  },
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 8 — Handle / Active
 * Grip in drag/active state: amber track, amber-tinted grip bg, amber dots.
 * Driven by the data-resize-handle-active attribute the library emits.
 * Static mock used here (simulating a pointer drag is complex in play fn).
 * ─────────────────────────────────────────────────────────────────────── */

/**
 * Handle in drag/active state — static visual mock.
 *
 * Tokens active (via data-resize-handle-active selector):
 *   track:      --c-resizable-handle-track-drag     → --s-brand-solid
 *   border:     --c-resizable-grip-border-drag      → --s-brand-solid
 *   grip-bg:    rgba(224, 122, 74, 0.10)            (amber 10% tint)
 *   dots color: --c-resizable-grip-icon-drag        → --s-brand-solid
 */
export const HandleActive: Story = {
  render: () => <StaticHandleDemo state="active" />,
};
