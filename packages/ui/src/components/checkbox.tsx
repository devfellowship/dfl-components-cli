import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "../lib/utils";

/**
 * Checkbox — DFL Design System v0
 *
 * Tokens consumed (Layer 3 → --c-checkbox-*):
 *   size, radius, border-width, bg, border, border-hover,
 *   checked-bg, checked-border, checked-fg,
 *   focus-ring, disabled-opacity,
 *   danger-border, danger-bg, danger-checked-bg
 *   (all backed by --s-surface-*, --s-border-*, --s-brand-*, --s-danger-*)
 *
 * Focus ring — uniform DFL two-layer amber ring, replaces shadcn ring utilities:
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px var(--c-checkbox-focus-ring)
 *
 * Checked/indeterminate state: use the Radix `checked` prop
 *   (true | false | "indeterminate"). Indeterminate renders a Minus dash icon
 *   with the same amber fill as checked.
 *
 * Error state: pass `aria-invalid={true}` — mirrors the Input/Textarea pattern.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // group — enables group-data-[state=*] selectors inside Indicator children
      "group",
      // geometry & layout
      "relative inline-flex shrink-0 cursor-pointer items-center justify-center",
      "h-[var(--c-checkbox-size)] w-[var(--c-checkbox-size)]",
      "rounded-[var(--c-checkbox-radius)]",
      // border — explicit 1.5px width + solid + color via component tokens
      "border [border-width:var(--c-checkbox-border-width)] border-[var(--c-checkbox-border)]",
      // background
      "bg-[var(--c-checkbox-bg)]",
      // transition
      "transition-[border-color,background-color] duration-[120ms] ease-in-out",
      // hover (unchecked) — strengthen border, elevate surface
      "hover:border-[var(--c-checkbox-border-hover)] hover:bg-[var(--s-surface-elevated)]",
      // checked state — amber fill + matching border
      "data-[state=checked]:border-[var(--c-checkbox-checked-border)]",
      "data-[state=checked]:bg-[var(--c-checkbox-checked-bg)]",
      // checked hover — brighten amber fill
      "data-[state=checked]:hover:border-[var(--s-brand-hover)]",
      "data-[state=checked]:hover:bg-[var(--s-brand-hover)]",
      // indeterminate — same amber fill as checked, Minus icon (see Indicator below)
      "data-[state=indeterminate]:border-[var(--c-checkbox-checked-border)]",
      "data-[state=indeterminate]:bg-[var(--c-checkbox-checked-bg)]",
      // focus ring — uniform DFL two-layer: 2px page-bg gap + 1px amber ring
      // Replaces shadcn `focus-visible:ring-2 ring-ring ring-offset-2`
      "outline-none",
      "focus-visible:[box-shadow:0_0_0_2px_var(--s-surface-page),0_0_0_3px_var(--c-checkbox-focus-ring)]",
      // disabled — pointer change + 40% opacity
      "disabled:cursor-not-allowed disabled:opacity-[var(--c-checkbox-disabled-opacity)]",
      // error / danger via aria-invalid={true} — red border + very subtle red tint
      "aria-invalid:border-[var(--c-checkbox-danger-border)]",
      "aria-invalid:bg-[var(--c-checkbox-danger-bg)]",
      // error + checked — red fill replaces amber
      "aria-invalid:data-[state=checked]:bg-[var(--c-checkbox-danger-checked-bg)]",
      "aria-invalid:data-[state=checked]:border-[var(--c-checkbox-danger-checked-bg)]",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className="flex items-center justify-center text-[var(--c-checkbox-checked-fg)]"
    >
      {/* Check icon — visible in checked state; hidden in indeterminate */}
      <Check
        className="h-[11px] w-[11px] group-data-[state=indeterminate]:hidden"
        strokeWidth={2.5}
      />
      {/* Minus / dash icon — visible only in indeterminate state */}
      <Minus
        className="hidden h-[9px] w-[9px] group-data-[state=indeterminate]:block"
        strokeWidth={2.5}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
