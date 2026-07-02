import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Kbd — DFL Design System v0 (NEW in v1.0.0).
 *
 * Single-key chip. Combine like:
 *   <Kbd>⌘</Kbd><span aria-hidden="true">+</span><Kbd>K</Kbd>
 *
 * Also exposed as the `kbd` prop on <Button /> for inline shortcut hints.
 *
 * Tokens consumed (Layer 3 → Layer 2 → Layer 1):
 *   --c-kbd-bg         → --s-surface-raised   (#1a1714)
 *   --c-kbd-bg-depth   → --s-surface-panel    (#141210) — bottom shadow ridge
 *   --c-kbd-border     → --s-border-subtle    (#2a2622)
 *   --c-kbd-fg         → --s-ink-primary      (#f6f1e7) — upgraded from ink-secondary for legibility
 *   --c-kbd-shine      rgba(255,255,255,0.055) — top inset highlight
 *   --c-kbd-radius     → --p-radius-sm        (4px)
 *
 * Size specs (per DS v0 spec):
 *   sm      9.5px mono  · 17px height · 3px radius
 *   default 10.5px mono · 20px height · 4px radius
 *   lg      12px mono   · 24px height · 4px radius
 */
const kbdVariants = cva(
  [
    "inline-flex items-center justify-center font-mono font-medium uppercase",
    "border bg-[var(--c-kbd-bg)] border-[var(--c-kbd-border)] text-[var(--c-kbd-fg)]",
    "tracking-[0.04em] select-none align-middle whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      size: {
        sm:      "text-[9.5px]  min-w-[16px] h-[17px] px-1    rounded-[3px]",
        default: "text-[10.5px] min-w-[18px] h-[20px] px-[5px] rounded-[var(--c-kbd-radius)]",
        lg:      "text-[12px]   min-w-[24px] h-[24px] px-[7px] rounded-[var(--c-kbd-radius)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

/**
 * Physical-key depth shadow — gives the chip its recognisable 3D "pressable"
 * affordance. Two layers:
 *   1. 0 2px 0 --c-kbd-bg-depth   — bottom ridge (darker than key surface)
 *   2. inset 0 1px 0 --c-kbd-shine — subtle top inner highlight
 */
const KBD_SHADOW = "0 2px 0 var(--c-kbd-bg-depth), inset 0 1px 0 var(--c-kbd-shine)";

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, size, style, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(kbdVariants({ size }), className)}
    style={{ boxShadow: KBD_SHADOW, ...style }}
    {...props}
  />
));
Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
