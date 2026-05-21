import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Kbd — DFL Design System v0 (NEW in v1.0.0).
 *
 * Single-key chip. Combine: <Kbd>⌘</Kbd><Kbd>K</Kbd>.
 */
const kbdVariants = cva(
  [
    "inline-flex items-center justify-center font-mono uppercase",
    "border bg-[var(--s-surface-raised)] border-[var(--s-border-subtle)] text-[var(--s-ink-secondary)]",
    "tracking-[0.04em] select-none align-middle",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-[9.5px] min-w-[16px] h-[16px] px-1 rounded-[3px]",
        default: "text-[10.5px] min-w-[18px] h-[18px] px-1 rounded-[var(--p-radius-sm)]",
        lg: "text-[12px] min-w-[22px] h-[22px] px-1.5 rounded-[var(--p-radius-sm)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, size, ...props }, ref) => (
    <kbd ref={ref} className={cn(kbdVariants({ size }), className)} {...props} />
  )
)
Kbd.displayName = "Kbd"

export { Kbd, kbdVariants }
