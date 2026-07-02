import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../lib/utils";

/**
 * Tooltip — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-tooltip-bg, --c-tooltip-fg, --c-tooltip-border,
 *   --c-tooltip-radius, --c-tooltip-shadow
 *
 * Anatomy:
 *   TooltipProvider  — wrap page / section once (controls delayDuration etc.)
 *   Tooltip          — root (open state machine)
 *   TooltipTrigger   — the interactive element; carries the DS uniform focus ring
 *   TooltipContent   — the floating bubble; includes a directional Radix Arrow
 *
 * Focus ring:
 *   TooltipTrigger adds the `.ds-focus-ring` class, which resolves to
 *   `outline: 1px solid var(--s-border-focus); outline-offset: 3px` on
 *   :focus-visible. When used with `asChild` + a Button, the class merges
 *   into the child via Radix Slot.
 *
 * Arrow / caret:
 *   TooltipPrimitive.Arrow is wired inside TooltipContent.
 *   fill = --c-tooltip-bg  (same as bubble bg)
 *   stroke = --c-tooltip-border  (matches bubble border)
 *
 * sideOffset default raised 4 → 6 for breathing room between bubble and trigger.
 */

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

/**
 * TooltipTrigger — wraps Radix Trigger and injects the DS uniform focus ring.
 * The `.ds-focus-ring` class is defined in tokens.css and applies
 * `outline: 1px solid var(--s-border-focus); outline-offset: 3px` on :focus-visible.
 */
const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Trigger
    ref={ref}
    className={cn("ds-focus-ring", className)}
    {...props}
  />
));
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Layout
      "z-50 max-w-[220px] overflow-hidden",
      // Spacing & typography — 12px/1.4 per spec, one step below body
      "px-[10px] py-[6px] text-[12px] leading-[1.4]",
      // DS component tokens — no raw shadcn palette classes
      "rounded-[var(--c-tooltip-radius)]",
      "border border-[var(--c-tooltip-border)]",
      "bg-[var(--c-tooltip-bg)] text-[var(--c-tooltip-fg)]",
      "shadow-[var(--c-tooltip-shadow)]",
      // Radix placement animations
      "animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  >
    {children}
    {/* Directional caret — fill matches bubble bg; stroke matches bubble border */}
    <TooltipPrimitive.Arrow
      width={10}
      height={5}
      className="fill-[var(--c-tooltip-bg)] stroke-[var(--c-tooltip-border)] [stroke-width:1]"
    />
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
