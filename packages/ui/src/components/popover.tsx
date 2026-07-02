import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../lib/utils";

/**
 * Popover — DFL Design System v0
 *
 * Tokens consumed (Layer 3):
 *   --c-popover-bg      background surface (--s-surface-elevated #1f1c18)
 *   --c-popover-fg      primary text (--s-ink-primary)
 *   --c-popover-border  border color (--s-border-subtle)
 *   --c-popover-radius  10px (--p-radius-lg) — overlays use lg, not md
 *   --c-popover-shadow  DS shadow token (--p-shadow 0 4px 12px…)
 *   --c-popover-padding interior padding (--p-space-4 = 16px)
 *
 * Focus ring on the trigger — apply via className on the wrapped element:
 *   focus-visible:ring-0
 *   focus-visible:[box-shadow:0_0_0_2px_var(--s-surface-page),_0_0_0_3px_#E07A4A]
 *
 * sideOffset default raised to 6 (was 4) — breathing room per DS spec.
 */

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 6, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // Layout
        "z-50 w-72 outline-none",
        // DS component tokens — radius, surface, border, shadow, padding, text
        "rounded-[var(--c-popover-radius)]",
        "border border-[var(--c-popover-border)]",
        "bg-[var(--c-popover-bg)]",
        "shadow-[var(--c-popover-shadow)]",
        "p-[var(--c-popover-padding)]",
        "text-[var(--c-popover-fg)]",
        // Radix open/close animations (unchanged)
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
