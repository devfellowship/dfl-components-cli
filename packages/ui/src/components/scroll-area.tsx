import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "../lib/utils";

/**
 * ScrollArea — Radix custom-scrollbar container with DS v0 token adoption.
 *
 * DS tokens consumed (Layer 3 → Layer 2 chain):
 *   --c-scroll-area-thumb        rest   → --s-ink-muted    (#7d7568)
 *   --c-scroll-area-thumb-hover  hover  → --s-brand-solid  (#E07A4A)
 *   --c-scroll-area-thumb-active active → --s-brand-pressed (#c2663b)
 *   --c-scroll-area-track-hover  track bg on container hover
 *   --c-scroll-area-width        8px scrollbar rail width
 *   --c-scroll-area-radius       999px pill thumb
 *
 * Focus: the Viewport receives keyboard focus when children are non-focusable
 * (plain-text lists). The DS uniform amber ring is applied via focus-visible:
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 * When children ARE focusable (buttons, links), the ring belongs on those
 * elements — not on the scroll container.
 */

export type ScrollAreaScrollbars = "vertical" | "horizontal" | "both";

interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  /** Which scrollbar orientations to render. @default "vertical" */
  scrollbars?: ScrollAreaScrollbars;
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, scrollbars = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden group/scroll", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={cn(
        "h-full w-full rounded-[inherit]",
        // DS uniform focus ring — keyboard focus on Viewport (non-focusable children).
        "focus-visible:outline-none",
        "focus-visible:shadow-[0_0_0_2px_var(--s-surface-page),_0_0_0_3px_#E07A4A]",
      )}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>

    {(scrollbars === "vertical" || scrollbars === "both") && (
      <ScrollBar orientation="vertical" />
    )}
    {(scrollbars === "horizontal" || scrollbars === "both") && (
      <ScrollBar orientation="horizontal" />
    )}

    {/* Corner — shown where both scrollbars meet; styled to match surface */}
    <ScrollAreaPrimitive.Corner className="bg-[var(--s-surface-raised)]" />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none",
      // Track: transparent at rest; reveals sand-700@50% groove on container hover.
      "bg-transparent group-hover/scroll:bg-[var(--c-scroll-area-track-hover,rgba(42,38,34,0.50))]",
      "transition-colors duration-[var(--p-duration,180ms)]",
      orientation === "vertical" &&
        "h-full w-[var(--c-scroll-area-width,8px)] border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-[var(--c-scroll-area-width,8px)] flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={cn(
        "relative flex-1",
        // Pill shape matching --c-scroll-area-radius (999px)
        "rounded-[var(--c-scroll-area-radius,999px)]",
        // 1px inset border — matches Radix p-[1px] gap between thumb and track wall
        "border border-[var(--s-surface-raised)]",
        // State hierarchy: rest → hover → active/dragging
        "bg-[var(--c-scroll-area-thumb,var(--s-ink-muted))]",
        "hover:bg-[var(--c-scroll-area-thumb-hover,var(--s-brand-solid))]",
        "active:bg-[var(--c-scroll-area-thumb-active,var(--s-brand-pressed))]",
        "transition-colors duration-[var(--p-duration,180ms)]",
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
