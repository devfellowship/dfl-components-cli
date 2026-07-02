import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Alert — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-alert-{bg,radius,padding-x,padding-y,border,fg,desc-fg,icon-size,accent-w}
 *   --c-alert-{default,info,success,warning,danger}-{bg,border,icon,accent}
 *   backed by --s-{info,success,warning,danger}-{subtle,border,fg,solid}
 *
 * Variants: default (neutral panel) | info | success | warning | danger
 *   `destructive` is kept as a backward-compat alias of `danger`.
 *
 * Layout: a 2-col grid — [icon | content]. A leading <svg> lands in col 1 and
 * spans both rows; AlertTitle + AlertDescription flow in col 2. A 3px left
 * accent stripe (::before) is coloured per variant. Renders cleanly with or
 * without an icon, and title-only (no description).
 */
const alertVariants = cva(
  [
    "relative grid w-full items-start overflow-hidden",
    "grid-cols-[0_1fr] has-[>svg]:grid-cols-[auto_1fr] gap-x-3 gap-y-1",
    "rounded-[var(--c-alert-radius)] border",
    "py-[var(--c-alert-padding-y)] pr-[var(--c-alert-padding-x)] pl-[calc(var(--c-alert-padding-x)+10px)]",
    "text-[var(--c-alert-fg)]",
    // left accent stripe
    "before:absolute before:inset-y-0 before:left-0 before:w-[var(--c-alert-accent-w)] before:content-['']",
    // icon
    "[&>svg]:col-start-1 [&>svg]:row-span-2 [&>svg]:size-[var(--c-alert-icon-size)] [&>svg]:translate-y-px [&>svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--c-alert-bg)] border-[var(--c-alert-border)]",
          "before:bg-[var(--c-alert-default-accent)]",
          "[&>svg]:text-[var(--c-alert-default-icon)]",
        ].join(" "),
        info: [
          "bg-[var(--c-alert-info-bg)] border-[var(--c-alert-info-border)]",
          "before:bg-[var(--c-alert-info-accent)]",
          "[&>svg]:text-[var(--c-alert-info-icon)]",
        ].join(" "),
        success: [
          "bg-[var(--c-alert-success-bg)] border-[var(--c-alert-success-border)]",
          "before:bg-[var(--c-alert-success-accent)]",
          "[&>svg]:text-[var(--c-alert-success-icon)]",
        ].join(" "),
        warning: [
          "bg-[var(--c-alert-warning-bg)] border-[var(--c-alert-warning-border)]",
          "before:bg-[var(--c-alert-warning-accent)]",
          "[&>svg]:text-[var(--c-alert-warning-icon)]",
        ].join(" "),
        danger: [
          "bg-[var(--c-alert-danger-bg)] border-[var(--c-alert-danger-border)]",
          "before:bg-[var(--c-alert-danger-accent)]",
          "[&>svg]:text-[var(--c-alert-danger-icon)]",
        ].join(" "),
        // backward-compat alias of `danger`
        destructive: [
          "bg-[var(--c-alert-danger-bg)] border-[var(--c-alert-danger-border)]",
          "before:bg-[var(--c-alert-danger-accent)]",
          "[&>svg]:text-[var(--c-alert-danger-icon)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn(
        "col-start-2 text-[var(--p-text-14)] font-medium leading-tight tracking-tight text-[var(--c-alert-fg)]",
        className,
      )}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-[var(--p-text-13)] leading-relaxed text-[var(--c-alert-desc-fg)] [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
