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
 *   --s-brand-ring (focus ring)
 *
 * Variants: primary (default), secondary, outline, ghost, destructive, success, link
 * Sizes:    sm (28px), default (34px — DS v0 spec), lg (40px), icon (square 34)
 *
 * Additive props (v1.0.0):
 *   loading   — disables button + shows spinner + keeps width
 *   kbd       — renders <kbd> hint at the right (e.g. ⌘K)
 *   asChild   — render as a child Slot (Radix pattern, kept from shadcn)
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--c-button-radius)] font-medium",
    "transition-[background-color,border-color,color,box-shadow] duration-150",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--s-brand-ring)]",
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
        ].join(" "),
        // legacy alias
        default: [
          "bg-[var(--c-button-primary-bg)] text-[var(--c-button-primary-fg)]",
          "hover:bg-[var(--c-button-primary-bg-hover)]",
          "active:bg-[var(--c-button-primary-bg-active)]",
        ].join(" "),
        secondary: [
          "bg-[var(--c-button-secondary-bg)] text-[var(--c-button-secondary-fg)]",
          "border-[var(--c-button-secondary-border)]",
          "hover:bg-[var(--c-button-secondary-bg-hover)] hover:border-[var(--c-button-secondary-border-hover)]",
        ].join(" "),
        outline: [
          "bg-transparent text-[var(--s-ink-secondary)]",
          "border-[var(--s-border-subtle)]",
          "hover:bg-[var(--s-surface-raised)] hover:border-[var(--s-border-strong)] hover:text-[var(--s-ink-primary)]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[var(--c-button-ghost-fg)]",
          "hover:bg-[var(--c-button-ghost-bg-hover)] hover:text-[var(--s-ink-primary)]",
        ].join(" "),
        destructive: [
          "bg-transparent text-[var(--c-button-destructive-fg)]",
          "border-[var(--c-button-destructive-border)]",
          "hover:bg-[var(--c-button-destructive-bg-hover)]",
        ].join(" "),
        success: [
          "bg-[var(--c-button-success-bg)] text-[var(--c-button-success-fg)]",
          "hover:opacity-90",
        ].join(" "),
        link: "text-[var(--s-brand-fg)] underline-offset-4 hover:underline bg-transparent",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, kbd, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        data-loading={loading ? "" : undefined}
        {...props}
      >
        {loading ? <Spinner /> : null}
        {children}
        {kbd ? (
          <kbd
            className={cn(
              "ml-1 inline-flex items-center justify-center font-mono uppercase tracking-[0.04em]",
              "text-[10.5px] text-[var(--s-ink-muted)]",
              "min-w-[18px] h-[18px] px-1 rounded-[var(--p-radius-sm)]",
              "border border-[var(--s-border-subtle)] bg-[var(--s-surface-raised)]",
            )}
          >
            {kbd}
          </kbd>
        ) : null}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
