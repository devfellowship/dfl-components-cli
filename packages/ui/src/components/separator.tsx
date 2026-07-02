import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "../lib/utils";

/**
 * Separator — Radix UI primitive, 1-pixel rule consuming DS component tokens.
 *
 * Component tokens consumed (defined in tokens.css Layer 3):
 *   --c-separator-color     : line fill (default → --s-border-subtle → #2a2622)
 *   --c-separator-thickness : line width/height (default → 1px)
 *
 * Override per-use via inline style:
 *   style={{ "--c-separator-color": "var(--s-border-strong)" } as React.CSSProperties}
 *
 * Non-interactive — no focus ring needed.
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-[var(--c-separator-color)]",
      orientation === "horizontal"
        ? "h-[var(--c-separator-thickness)] w-full"
        : "h-full w-[var(--c-separator-thickness)]",
      className,
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

/**
 * SeparatorWithLabel — composite: two separator lines flanking a centered label.
 *
 * Additional component tokens consumed:
 *   --c-separator-label-fg   : label text color (default → --s-ink-muted → #7d7568)
 *   --c-separator-label-size : label font size  (default → 11px)
 *
 * Usage:
 *   <SeparatorWithLabel label="ou continue com" />
 *   <SeparatorWithLabel label="Módulo 3" />
 */
interface SeparatorWithLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

const SeparatorWithLabel = React.forwardRef<HTMLDivElement, SeparatorWithLabelProps>(
  ({ label, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-[10px] w-full", className)}
      {...props}
    >
      <div
        className="flex-1 shrink-0 h-[var(--c-separator-thickness)] bg-[var(--c-separator-color)]"
        aria-hidden="true"
      />
      <span
        className="shrink-0 font-medium whitespace-nowrap uppercase"
        style={{
          fontSize: "var(--c-separator-label-size)",
          color: "var(--c-separator-label-fg)",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
      <div
        className="flex-1 shrink-0 h-[var(--c-separator-thickness)] bg-[var(--c-separator-color)]"
        aria-hidden="true"
      />
    </div>
  ),
);
SeparatorWithLabel.displayName = "SeparatorWithLabel";

export { Separator, SeparatorWithLabel };
