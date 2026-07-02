import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Badge — DFL Design System v0
 *
 * Tokens consumed (all pre-existing):
 *   Shape:    --c-pill-radius (999px, default), --c-badge-radius (4px, square)
 *   Brand:    --s-brand-subtle / --s-brand-fg / --s-brand-border
 *   Danger:   --s-danger-subtle / --s-danger-fg / --s-danger-border
 *   Success:  --s-success-subtle / --s-success-fg / --s-success-border
 *   Warning:  --s-warning-subtle / --s-warning-fg / --s-warning-border
 *   Info:     --s-info-subtle / --s-info-fg / --s-info-border
 *   Surface:  --s-surface-raised / --s-ink-secondary / --s-border-subtle
 *   Outline:  --s-border-strong
 *
 * Variants: default | secondary | danger | outline | success | warning | info
 *   (`destructive` kept as legacy alias → same styles as `danger`)
 * Shapes:   pill (default) | square
 *
 * Focus ring: DS-uniform amber box-shadow via :focus-visible (badge must
 *   receive tabIndex={0} + role when used as a filter chip / interactive element).
 */
const badgeVariants = cva(
  [
    // Layout + type
    "inline-flex items-center gap-[5px]",
    "px-2 py-0.5",
    "text-[11px] font-semibold leading-[1.6] whitespace-nowrap tracking-[0.2px]",
    // Border base (each variant supplies the color)
    "border",
    // Interaction
    "select-none cursor-default",
    "transition-[background-color,border-color] duration-[120ms]",
    // Focus ring — DS uniform amber double-shadow. Only visible when the badge
    // receives focus (tabIndex + role added by consumer for interactive use).
    "outline-none focus-visible:[box-shadow:0_0_0_2px_var(--background),0_0_0_3px_#E07A4A]",
  ].join(" "),
  {
    variants: {
      variant: {
        // Subtle brand (amber) — replaces solid bg-primary fill
        default: [
          "bg-[var(--s-brand-subtle)]",
          "text-[var(--s-brand-fg)]",
          "border-[var(--s-brand-border)]",
        ].join(" "),
        // Neutral surface
        secondary: [
          "bg-[var(--s-surface-raised)]",
          "text-[var(--s-ink-secondary)]",
          "border-[var(--s-border-subtle)]",
        ].join(" "),
        // Subtle danger — replaces solid bg-destructive fill
        danger: [
          "bg-[var(--s-danger-subtle)]",
          "text-[var(--s-danger-fg)]",
          "border-[var(--s-danger-border)]",
        ].join(" "),
        // Legacy alias — kept so existing consumers don't break
        destructive: [
          "bg-[var(--s-danger-subtle)]",
          "text-[var(--s-danger-fg)]",
          "border-[var(--s-danger-border)]",
        ].join(" "),
        // Outline — explicit border-strong token (was inheriting raw Tailwind border)
        outline: [
          "bg-transparent",
          "text-[var(--s-ink-secondary)]",
          "border-[var(--s-border-strong)]",
        ].join(" "),
        // New semantic variants
        success: [
          "bg-[var(--s-success-subtle)]",
          "text-[var(--s-success-fg)]",
          "border-[var(--s-success-border)]",
        ].join(" "),
        warning: [
          "bg-[var(--s-warning-subtle)]",
          "text-[var(--s-warning-fg)]",
          "border-[var(--s-warning-border)]",
        ].join(" "),
        info: [
          "bg-[var(--s-info-subtle)]",
          "text-[var(--s-info-fg)]",
          "border-[var(--s-info-border)]",
        ].join(" "),
      },
      // Wires --c-pill-radius (999px, default) vs --c-badge-radius (4px)
      shape: {
        pill:   "rounded-[var(--c-pill-radius)]",
        square: "rounded-[var(--c-badge-radius)]",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "pill",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, shape }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
