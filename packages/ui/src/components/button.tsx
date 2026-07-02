import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Button — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-button-radius, --c-button-font-weight
 *   --c-button-{primary,secondary,ghost,destructive,success}-{bg,fg,border,bg-hover,border-hover,bg-active}
 *   --c-button-focus-gap     — 2px bg-color gap for the brand-spec double ring
 *   --c-button-focus-brand   — amber focus ring (primary/secondary/outline/ghost/link)
 *   --c-button-focus-danger  — red focus ring (destructive)
 *   --c-button-focus-success — green focus ring (success)
 *
 * Focus ring (brand spec): box-shadow 0 0 0 2px <gap> , 0 0 0 3px <accent>
 *   Crisp 2px bg-color gap + 1px solid accent — no blur, no rgba transparency.
 *   Each variant carries its own semantic accent colour instead of defaulting to amber.
 *
 * Variants: primary (default), secondary, outline, ghost, destructive, success, link
 * Sizes:    sm (28px), default (34px — DS v0 spec), lg (40px), icon (square 34)
 *
 * Additive props (v1.0.0):
 *   loading   — disables button + shows spinner + keeps width
 *   kbd       — renders <kbd> hint at the right (e.g. ⌘K)
 *   asChild   — render as a child Slot (Radix pattern, kept from shadcn)
 */

// Brand-spec compound focus rings — 2px bg gap + 1px solid accent.
// Defined as constants so each variant opts in explicitly; no base-class override needed.
const FOCUS_BRAND   = "focus-visible:shadow-[0_0_0_2px_var(--c-button-focus-gap),0_0_0_3px_var(--c-button-focus-brand)]";
const FOCUS_DANGER  = "focus-visible:shadow-[0_0_0_2px_var(--c-button-focus-gap),0_0_0_3px_var(--c-button-focus-danger)]";
const FOCUS_SUCCESS = "focus-visible:shadow-[0_0_0_2px_var(--c-button-focus-gap),0_0_0_3px_var(--c-button-focus-success)]";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--c-button-radius)] font-medium",
    "transition-[background-color,border-color,color,box-shadow] duration-150",
    "outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "border border-transparent",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--c-button-primary-bg)] text-[var(--c-button-primary-fg)]",
          "hover:bg-[var(--c-button-primary-bg-hover)]",
          "active:bg-[var(--c-button-primary-bg-active)]",
          FOCUS_BRAND,
        ].join(" "),
        // legacy alias
        default: [
          "bg-[var(--c-button-primary-bg)] text-[var(--c-button-primary-fg)]",
          "hover:bg-[var(--c-button-primary-bg-hover)]",
          "active:bg-[var(--c-button-primary-bg-active)]",
          FOCUS_BRAND,
        ].join(" "),
        secondary: [
          "bg-[var(--c-button-secondary-bg)] text-[var(--c-button-secondary-fg)]",
          "border-[var(--c-button-secondary-border)]",
          "hover:bg-[var(--c-button-secondary-bg-hover)] hover:border-[var(--c-button-secondary-border-hover)]",
          FOCUS_BRAND,
        ].join(" "),
        outline: [
          "bg-transparent text-[var(--s-ink-secondary)]",
          "border-[var(--s-border-subtle)]",
          "hover:bg-[var(--s-surface-raised)] hover:border-[var(--s-border-strong)] hover:text-[var(--s-ink-primary)]",
          FOCUS_BRAND,
        ].join(" "),
        ghost: [
          "bg-transparent text-[var(--c-button-ghost-fg)]",
          "hover:bg-[var(--c-button-ghost-bg-hover)] hover:text-[var(--s-ink-primary)]",
          FOCUS_BRAND,
        ].join(" "),
        destructive: [
          "bg-transparent text-[var(--c-button-destructive-fg)]",
          "border-[var(--c-button-destructive-border)]",
          "hover:bg-[var(--c-button-destructive-bg-hover)]",
          FOCUS_DANGER,
        ].join(" "),
        success: [
          "bg-[var(--c-button-success-bg)] text-[var(--c-button-success-fg)]",
          "hover:opacity-90",
          FOCUS_SUCCESS,
        ].join(" "),
        link: [
          "text-[var(--s-brand-fg)] underline-offset-4 hover:underline bg-transparent",
          FOCUS_BRAND,
        ].join(" "),
      },
      size: {
        sm: "h-7 px-3 text-[12px] [&_svg]:size-3.5",
        default: "h-[34px] px-[14px] text-[13px]",
        lg: "h-10 px-5 text-[14px]",
        icon: "h-[34px] w-[34px] p-0",
        "icon-sm": "h-7 w-7 p-0",
        "icon-lg": "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  kbd?: React.ReactNode;
}

const Spinner = () => (
  <svg
    className="size-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path
      d="M22 12a10 10 0 0 1-10 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd
    className={cn(
      "ml-1 inline-flex items-center justify-center font-mono uppercase tracking-[0.04em]",
      "text-[10.5px] text-[var(--s-ink-muted)]",
      "min-w-[18px] h-[18px] px-1 rounded-[var(--p-radius-sm)]",
      "border border-[var(--s-border-subtle)] bg-[var(--s-surface-raised)]",
    )}
  >
    {children}
  </kbd>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, kbd, children, ...props },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    // asChild path: Radix `Slot` requires EXACTLY ONE React element child.
    // Injecting sibling adornments (spinner/kbd) here triggers
    // `React.Children.only expected to receive a single React element child`.
    // So in this mode we pass `children` straight through and skip adornments.
    // This is the standard shadcn `<Button asChild><Link/></Button>` pattern.
    if (asChild) {
      return (
        <Slot
          className={classes}
          ref={ref}
          data-loading={loading ? "" : undefined}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        data-loading={loading ? "" : undefined}
        {...props}
      >
        {loading ? <Spinner /> : null}
        {children}
        {kbd ? <Kbd>{kbd}</Kbd> : null}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
