"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Toggle — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-toggle-{radius,bg,fg,bg-hover,fg-hover,bg-on,fg-on,border-on,
 *               outline-border,outline-bg-hover,fg-disabled}
 *   backed by --s-{ink-*,surface-*,brand-*,border-*}
 *
 * Three brand-gate fixes vs the original shadcn scaffold:
 *   1. On-state: --c-toggle-bg-on (brand-subtle, 10% tint) + --c-toggle-fg-on
 *      (brand-fg, amber-300) — signals "selected", NOT "action".
 *      Was: bg-accent (solid amber #E07A4A) + near-black text → CTA clone.
 *   2. Focus ring: uniform DFL spec — box-shadow 2px page gap + 1px amber
 *      #E07A4A, transition:none (instant, no animation).
 *      Was: translucent ring-ring/50 ring-[3px].
 *   3. Outline hover: step-up surface (--s-surface-raised) + stronger border.
 *      Was: hover:bg-accent (solid amber) — looked pressed before clicking.
 */
const toggleVariants = cva(
  [
    // layout
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    // shape — radius via --c-toggle-radius; border-transparent for default variant
    "rounded-[var(--c-toggle-radius)] border border-transparent",
    // typography
    "text-[var(--p-text-13)] font-medium",
    // base colours (DS Layer-3 tokens)
    "bg-[var(--c-toggle-bg)] text-[var(--c-toggle-fg)]",
    // hover — step up surface + ink-primary; applies to both variants
    "hover:bg-[var(--c-toggle-bg-hover)] hover:text-[var(--c-toggle-fg-hover)]",
    // on / active — brand-subtle bg, brand-fg text, brand border (NOT solid amber)
    "data-[state=on]:bg-[var(--c-toggle-bg-on)]",
    "data-[state=on]:text-[var(--c-toggle-fg-on)]",
    "data-[state=on]:border-[var(--c-toggle-border-on)]",
    // disabled — 38 % opacity per DS spec (was 50 %)
    "disabled:pointer-events-none disabled:opacity-[.38]",
    // focus ring — 2px page-coloured gap + 1px amber, instant (no animation)
    "outline-none",
    "focus-visible:[box-shadow:0_0_0_2px_var(--background),0_0_0_3px_#E07A4A]",
    "focus-visible:[transition:none]",
    // SVG icon sizing
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    // motion — bg/colour/border only; box-shadow excluded so focus ring is instant
    "transition-[background-color,color,border-color] duration-[120ms]",
    // a11y — error state passthrough
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        outline: [
          // idle: visible border
          "border-[var(--c-toggle-outline-border)]",
          // hover: subtle surface step-up + stronger border (NOT solid amber fill)
          "hover:bg-[var(--c-toggle-outline-bg-hover)] hover:border-[var(--s-border-strong)]",
        ].join(" "),
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
