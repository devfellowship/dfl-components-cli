import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Card — DFL Design System v0
 *
 * Tokens consumed (Layer 3 → Layer 2 → Layer 1):
 *   --c-card-bg           background surface  (→ --s-surface-panel)
 *   --c-card-border       default border       (→ --s-border-subtle)
 *   --c-card-border-hover hover / focus lift   (→ --s-border-strong)
 *   --c-card-radius       corner radius        (→ --p-radius-lg = 10px)
 *   --c-card-padding      inner section pad    (→ --p-space-5  = 20px)
 *   --c-card-shadow       resting shadow       (→ --p-shadow-sm)
 *
 * Ink:
 *   --s-ink-primary   CardTitle text
 *   --s-ink-muted     CardDescription text
 *
 * Focus ring (DS uniform spec — a11y):
 *   Applied via focus-visible on any focusable card (role="button" + tabIndex).
 *   Renders: box-shadow 0 0 0 2px --s-surface-page (gap), 0 0 0 3px #E07A4A (ring).
 *
 * Hover (clickable cards):
 *   Consumers add className="hover:border-[var(--c-card-border-hover)] hover:shadow-[var(--p-shadow)]"
 *   transition already included on the base element.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // token-native surface
      "rounded-[var(--c-card-radius)]",
      "border border-[var(--c-card-border)]",
      "bg-[var(--c-card-bg)]",
      "text-[var(--s-ink-primary)]",
      "shadow-[var(--c-card-shadow)]",
      // smooth transition for hover/focus state changes on clickable cards
      "transition-[border-color,box-shadow] duration-[120ms] ease-in-out",
      // DS uniform focus ring — visible only when keyboard-focused
      "focus-visible:outline-none",
      "focus-visible:border-[var(--c-card-border-hover)]",
      "focus-visible:ring-1",
      "focus-visible:ring-[#E07A4A]",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-[var(--s-surface-page)]",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1.5",
        "p-[var(--c-card-padding)] pb-0",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

/**
 * CardTitle — DS spec: 16px / 600 / −0.2px tracking / --s-ink-primary
 * Replaces the shadcn default of text-2xl (24px) which is oversized for card context.
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-[16px] font-semibold leading-[1.3] tracking-[-0.2px]",
        "text-[var(--s-ink-primary)]",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-[13px] leading-snug text-[var(--s-ink-muted)]", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-[var(--c-card-padding)] pt-3", className)}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        "p-[var(--c-card-padding)] pt-0",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
