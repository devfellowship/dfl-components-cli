import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * IconButton — DFL Design System v0 (NEW in v1.0.0).
 *
 * Square, icon-only. 4 sizes × 4 variants. Ghost-by-default. When
 * `aria-pressed` is set, paints with --s-brand-subtle background and
 * --s-brand-fg text — Toolbar's "active" state.
 *
 * Sizes: xs (20×20), sm (28×28), default (34×34), lg (40×40).
 *
 * Always accepts a single icon as child:
 *   <IconButton aria-label="Search"><SearchIcon /></IconButton>
 *
 * Tokens consumed:
 *   --c-button-radius, --s-brand-subtle, --s-brand-fg, --s-brand-ring,
 *   --c-button-ghost-fg, --c-button-ghost-bg-hover, --s-ink-primary,
 *   --s-surface-raised, --s-border-subtle, --s-border-strong.
 */
const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "rounded-[var(--c-button-radius)]",
    "transition-[background-color,border-color,color,box-shadow] duration-150",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--s-brand-ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "border border-transparent",
    "select-none cursor-pointer",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // pressed state — Toolbar "active" item
    "aria-pressed:bg-[var(--s-brand-subtle)] aria-pressed:text-[var(--s-brand-fg)]",
  ].join(" "),
  {
    variants: {
      variant: {
        ghost: [
          "bg-transparent text-[var(--c-button-ghost-fg)]",
          "hover:bg-[var(--c-button-ghost-bg-hover)] hover:text-[var(--s-ink-primary)]",
        ].join(" "),
        outline: [
          "bg-transparent text-[var(--s-ink-secondary)]",
          "border-[var(--s-border-subtle)]",
          "hover:bg-[var(--s-surface-raised)] hover:border-[var(--s-border-strong)] hover:text-[var(--s-ink-primary)]",
        ].join(" "),
        solid: [
          "bg-[var(--c-button-primary-bg)] text-[var(--c-button-primary-fg)]",
          "hover:bg-[var(--c-button-primary-bg-hover)]",
        ].join(" "),
        destructive: [
          "bg-transparent text-[var(--c-button-destructive-fg)]",
          "hover:bg-[var(--c-button-destructive-bg-hover)]",
        ].join(" "),
      },
      size: {
        xs: "h-5 w-5 [&_svg]:size-3",
        sm: "h-7 w-7 [&_svg]:size-3.5",
        default: "h-[34px] w-[34px] [&_svg]:size-4",
        lg: "h-10 w-10 [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  },
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
  /** Required for accessibility — icon-only buttons need a name. */
  "aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(iconButtonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
