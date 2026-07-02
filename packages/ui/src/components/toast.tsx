import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "../lib/utils";

/**
 * Toast — DFL Design System v0
 *
 * Tokens consumed (Layer 3 → Layer 2 → Layer 1):
 *   --c-toast-{bg,border,fg,fg-desc,radius,shadow,close-fg,close-fg-hover,accent-w,action-border}
 *   --c-toast-{success,warning,danger,info}-{bg,border}
 *   backed by --s-{success,warning,danger,info}-{subtle,border,fg,solid}
 *
 * Variants: default | success | warning | danger | info
 *   `destructive` is kept as a backward-compat alias of `danger`.
 *
 * A11y fixes vs vanilla shadcn:
 *   - ToastClose always visible at opacity-60 (was opacity-0 until group-hover)
 *   - Focus ring uses the uniform DFL box-shadow ring instead of raw ring-2/ring-offset
 *   - Semantic close-fg / title accent inherit per-variant colour via group selectors
 *
 * Left accent stripe rendered as ::before pseudo-element, coloured per variant.
 */

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // Fixed bottom-right, DS z-index token, max-w 420px (per spec)
      "fixed bottom-0 right-0 z-[var(--p-z-toast)]",
      "flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px] sm:flex-col",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  [
    // layout — relative so ::before stripe and absolute ToastClose anchor correctly
    "group pointer-events-auto relative flex w-full items-start justify-between gap-3 overflow-hidden",
    // shape + base colour via --c-toast-* tokens
    "rounded-[var(--c-toast-radius)] border border-[var(--c-toast-border)]",
    "bg-[var(--c-toast-bg)] text-[var(--c-toast-fg)]",
    "p-4 pr-10",
    "shadow-[var(--c-toast-shadow)]",
    // left accent stripe (colour set per variant)
    "before:absolute before:inset-y-0 before:left-0",
    "before:w-[var(--c-toast-accent-w)] before:content-['']",
    // swipe gestures
    "transition-all",
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=move]:transition-none",
    // enter / exit animations
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[swipe=end]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
    "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Neutral default — amber left-accent stripe. */
        default: ["toast-default", "before:bg-[var(--s-brand-solid)]"].join(" "),

        /** Success — green subtle bg tint, success border, green left stripe. */
        success: [
          "toast-success",
          "bg-[var(--c-toast-success-bg)] border-[var(--c-toast-success-border)]",
          "before:bg-[var(--s-success-solid)]",
        ].join(" "),

        /** Warning — yellow subtle bg tint, warning border, yellow left stripe. */
        warning: [
          "toast-warning",
          "bg-[var(--c-toast-warning-bg)] border-[var(--c-toast-warning-border)]",
          "before:bg-[var(--s-warning-solid)]",
        ].join(" "),

        /** Danger — danger subtle bg tint, danger border, red left stripe. */
        danger: [
          "toast-danger",
          "bg-[var(--c-toast-danger-bg)] border-[var(--c-toast-danger-border)]",
          "before:bg-[var(--s-danger-solid)]",
        ].join(" "),

        /** Info — blue subtle bg tint, info border, blue left stripe. */
        info: [
          "toast-info",
          "bg-[var(--c-toast-info-bg)] border-[var(--c-toast-info-border)]",
          "before:bg-[var(--s-info-solid)]",
        ].join(" "),

        /**
         * Backward-compat alias of `danger`.
         * Prefer `variant="danger"` in new code.
         */
        destructive: [
          "toast-danger",
          "bg-[var(--c-toast-danger-bg)] border-[var(--c-toast-danger-border)]",
          "before:bg-[var(--s-danger-solid)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      // base
      "inline-flex h-8 shrink-0 items-center justify-center",
      "rounded-[var(--p-radius-sm)] border border-[var(--c-toast-action-border)]",
      "bg-transparent px-3 text-sm font-medium text-[var(--s-ink-secondary)]",
      "transition-colors",
      "hover:bg-[var(--s-surface-raised)] hover:border-[var(--s-border-strong)]",
      // disabled
      "disabled:pointer-events-none disabled:opacity-50",
      // DFL uniform focus ring — box-shadow, not raw ring-2/ring-offset
      "focus-visible:outline-none",
      "focus-visible:shadow-[0_0_0_2px_var(--s-surface-page),0_0_0_3px_var(--p-amber-500)]",
      // danger-variant — semantic border + fg, no raw destructive/red classes
      "group-[.toast-danger]:border-[var(--s-danger-border)]",
      "group-[.toast-danger]:text-[var(--s-danger-fg)]",
      "group-[.toast-danger]:hover:bg-[var(--s-danger-subtle)]",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      // position + shape
      "absolute right-2 top-2 flex items-center justify-center",
      "rounded-[var(--p-radius-sm)] p-1",
      // always visible at 0.6 — a11y: keyboard + low-vision users can see it
      "text-[var(--c-toast-close-fg)] opacity-60",
      // hover — full opacity + subtle bg tint
      "hover:opacity-100 hover:text-[var(--c-toast-close-fg-hover)] hover:bg-white/[0.06]",
      // group-hover also reveals (for pointer users)
      "group-hover:opacity-100",
      // DFL uniform focus ring — box-shadow replaces raw ring-2 + ring-offset
      "focus-visible:outline-none focus-visible:opacity-100",
      "focus-visible:shadow-[0_0_0_2px_var(--s-surface-page),0_0_0_3px_var(--p-amber-500)]",
      // semantic close-fg per variant via parent group marker classes
      "group-[.toast-danger]:text-[var(--s-danger-fg)]",
      "group-[.toast-success]:text-[var(--s-success-fg)]",
      "group-[.toast-warning]:text-[var(--s-warning-fg)]",
      "group-[.toast-info]:text-[var(--s-info-fg)]",
      "transition-[opacity,color,background-color] duration-[var(--p-duration-fast)]",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-[var(--p-text-13)] font-semibold leading-[var(--p-leading-snug)]",
      "text-[var(--c-toast-fg)]",
      // semantic title accent per variant
      "group-[.toast-success]:text-[var(--s-success-fg)]",
      "group-[.toast-warning]:text-[var(--s-warning-fg)]",
      "group-[.toast-danger]:text-[var(--s-danger-fg)]",
      "group-[.toast-info]:text-[var(--s-info-fg)]",
      className,
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-[var(--p-text-13)] leading-[var(--p-leading-snug)]",
      "text-[var(--c-toast-fg-desc)]",
      className,
    )}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastComponentProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastComponentProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
