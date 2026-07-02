"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * toggleVariants — DFL DS v0
 *
 * Token hierarchy consumed:
 *   --c-toggle-{bg,bg-hover,bg-active,bg-active-hover}
 *   --c-toggle-{fg,fg-hover,fg-active}
 *   --c-toggle-border
 *   --c-toggle-focus-ring  (uniform 2px-gap + 1px-amber spec, ch.5.2)
 *
 * Active state: amber wash (--s-brand-subtle) + amber-300 fg (--s-brand-fg),
 * NOT the generic --accent alias. Hover on active: slightly stronger amber wash.
 *
 * Focus ring: box-shadow 0 0 0 2px page-bg + 0 0 0 3px #E07A4A, z-index:10
 * so the ring is NOT clipped by siblings in a group.
 *
 * Disabled: 40% opacity + pointer-events:none (active state still visible at
 * reduced opacity to preserve context).
 */
const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium",
    // Base fg — muted until hovered/activated
    "text-[var(--c-toggle-fg)]",
    // Hover states
    "hover:bg-[var(--c-toggle-bg-hover)] hover:text-[var(--c-toggle-fg-hover)]",
    // Active (on) state — amber wash bg + amber-300 fg
    "data-[state=on]:bg-[var(--c-toggle-bg-active)] data-[state=on]:text-[var(--c-toggle-fg-active)]",
    // Active + hover — slightly stronger amber wash
    "data-[state=on]:hover:bg-[var(--c-toggle-bg-active-hover)]",
    // Disabled — 40% opacity (active still readable at reduced opacity)
    "disabled:pointer-events-none disabled:opacity-40",
    // Focus ring — uniform 2px-gap + 1px-amber; z-10 so ring shows above siblings
    "outline-none focus-visible:z-10 focus-visible:shadow-[var(--c-toggle-focus-ring)]",
    // SVG size normalisation
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "whitespace-nowrap transition-[color,background-color,box-shadow]",
    // Form validation — preserve aria-invalid feedback
    "aria-invalid:border-destructive",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          // Border color via component token (--c-toggle-border → --s-border-subtle)
          "border border-[var(--c-toggle-border)] bg-transparent",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
