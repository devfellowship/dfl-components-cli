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
      /**
       * Fill treatment.
       *   subtle — tinted bg + semantic border (the default look).
       *   solid  — solid intent fill + inverse ink. For count indicators /
       *            emphatic status (e.g. "3", "New", "Blocked"). Backed by
       *            --c-badge-solid-{intent}-bg + --c-badge-solid-fg.
       */
      fill: {
        subtle: "",
        solid: "border-transparent text-[var(--c-badge-solid-fg)]",
      },
    },
    compoundVariants: [
      // solid fill × each semantic intent → solid bg (border already transparent)
      { fill: "solid", variant: "default",     class: "bg-[var(--c-badge-solid-default-bg)]" },
      { fill: "solid", variant: "success",     class: "bg-[var(--c-badge-solid-success-bg)]" },
      { fill: "solid", variant: "warning",     class: "bg-[var(--c-badge-solid-warning-bg)]" },
      { fill: "solid", variant: "danger",      class: "bg-[var(--c-badge-solid-danger-bg)]" },
      { fill: "solid", variant: "destructive", class: "bg-[var(--c-badge-solid-danger-bg)]" },
      { fill: "solid", variant: "info",        class: "bg-[var(--c-badge-solid-info-bg)]" },
      // secondary/outline solid → neutral brand solid so the API never no-ops
      { fill: "solid", variant: "secondary",   class: "bg-[var(--c-badge-solid-default-bg)]" },
      { fill: "solid", variant: "outline",     class: "bg-[var(--c-badge-solid-default-bg)]" },
    ],
    defaultVariants: {
      variant: "default",
      shape: "pill",
      fill: "subtle",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Render a leading status dot (coloured with the badge's own text/intent
   * colour via currentColor). For presence/status chips — "● Active".
   */
  dot?: boolean;
}

function Badge({ className, variant, shape, fill, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, shape, fill }), className)} {...props}>
      {dot && (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: "currentColor" }}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
