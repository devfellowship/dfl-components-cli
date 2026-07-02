import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "../components/scroll-area";
import { Separator } from "../components/separator";

/**
 * ScrollArea — one state per story. Radix custom-scrollbar container.
 *
 * DS v0 tokens drive all thumb / track colours and dimensions:
 *   --c-scroll-area-thumb        → --s-ink-muted (#7d7568) at rest
 *   --c-scroll-area-thumb-hover  → --s-brand-solid (#E07A4A) on hover
 *   --c-scroll-area-thumb-active → --s-brand-pressed (#c2663b) dragging
 *   --c-scroll-area-track-hover  → sand-700@50% on container hover
 *   --c-scroll-area-width        → 8px rail
 *   --c-scroll-area-radius       → 999px pill thumb
 */
const meta: Meta<typeof ScrollArea> = {
  title: "Components/Atoms/ScrollArea",
  component: ScrollArea,
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 30 }).map((_, i) => `Tag ${i + 1}`);

const members = [
  "Alice Drummond",
  "Bruno Vasconcelos",
  "Carla Menezes",
  "Daniel Ferreira",
  "Elena Sousa",
  "Felipe Andrade",
  "Gabriela Lima",
  "Henrique Costa",
  "Isabela Rocha",
  "João Batista",
  "Karen Oliveira",
  "Lucas Santos",
  "Mariana Lopes",
  "Nathan Ribeiro",
];

// ─────────────────────────────────────────────────────────────────────────────
// Story 1 — Vertical (default)
// Long tag list; thumb visible at rest via --c-scroll-area-thumb (ink-muted).
// Track is transparent until the user hovers the container.
// ─────────────────────────────────────────────────────────────────────────────
export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-48 w-56 rounded-md border">
      <div className="p-4">
        <div className="mb-2 text-sm font-medium">Tags</div>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="py-1 text-sm">{tag}</div>
            <Separator className="my-1" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 2 — Thumb Hover (forced via CSS var override)
// Simulates the pointer-hover state by remapping --c-scroll-area-thumb to the
// hover token locally, so the amber brand colour is statically visible in
// Storybook. In the live component this state is triggered on pointer-hover.
// ─────────────────────────────────────────────────────────────────────────────
export const ThumbHover: Story = {
  render: () => (
    <div
      style={
        {
          "--c-scroll-area-thumb": "var(--c-scroll-area-thumb-hover)",
          "--c-scroll-area-track": "var(--c-scroll-area-track-hover)",
        } as React.CSSProperties
      }
    >
      <ScrollArea className="h-48 w-56 rounded-md border">
        <div className="p-4">
          <div className="mb-2 text-sm font-medium">Tags</div>
          {tags.map((tag) => (
            <div key={tag}>
              <div className="py-1 text-sm">{tag}</div>
              <Separator className="my-1" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 3 — Horizontal
// Wide card row with horizontal scrollbar; same token-driven thumb / track.
// Uses scrollbars="horizontal" so only the horizontal ScrollBar is rendered.
// ─────────────────────────────────────────────────────────────────────────────
export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-72 rounded-md border" scrollbars="horizontal">
      <div className="flex w-max gap-3 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-md border text-xs font-mono text-muted-foreground"
          >
            <div className="h-6 w-6 rounded-full bg-[var(--s-border-subtle)]" />
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 4 — Both Axes
// Grid content overflowing on both axes — shows the Corner primitive and both
// scrollbars with consistent token-driven styling.
// ─────────────────────────────────────────────────────────────────────────────
export const BothAxes: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-md border" scrollbars="both">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 80px)",
          gridTemplateRows: "repeat(6, 44px)",
          gap: "8px",
          padding: "16px",
          width: "max-content",
        }}
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--s-border-subtle)",
              borderRadius: "4px",
              fontSize: "10px",
              fontFamily: "var(--s-font-mono)",
              color: "var(--s-ink-muted)",
              background: "var(--s-surface-elevated)",
            }}
          >
            {`R${Math.floor(i / 6) + 1}·C${(i % 6) + 1}`}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 5 — Always Visible (type="always")
// Persistent scrollbar rendered without hover trigger — suited for sidebars
// and member lists where users need a persistent position indicator.
// ─────────────────────────────────────────────────────────────────────────────
export const AlwaysVisible: Story = {
  render: () => (
    <ScrollArea type="always" className="h-48 w-56 rounded-md border">
      <div className="p-4">
        <div className="mb-2 text-sm font-medium">Members (42)</div>
        {members.map((name) => (
          <div key={name}>
            <div className="py-1 text-sm">{name}</div>
            <Separator className="my-1" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 6 — Viewport Focus
// Plain-text (non-focusable children) list where the Radix Viewport itself
// receives keyboard focus via Tab. The DS uniform amber focus ring appears:
//   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
// When children are focusable (buttons, links), the ring belongs on those
// elements — not on the scroll container.
// ─────────────────────────────────────────────────────────────────────────────
export const ViewportFocus: Story = {
  render: () => (
    <ScrollArea className="h-48 w-56 rounded-md border">
      <div className="p-4">
        <div className="mb-2 text-xs text-muted-foreground">
          Press Tab to focus viewport — amber ring appears
        </div>
        {tags.map((tag) => (
          <div key={tag} className="py-1 text-sm">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
