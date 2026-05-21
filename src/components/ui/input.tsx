import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input — DFL Design System v0
 *
 * Mirrors packages/ui/src/components/input.tsx. Tokens consumed:
 *   --c-input-{bg,fg,placeholder,border,border-hover,border-focus,ring-focus,border-error,radius}
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full min-w-0 px-3 py-1.5 text-[13px] leading-none",
          "bg-[var(--c-input-bg)] text-[var(--c-input-fg)]",
          "placeholder:text-[var(--c-input-placeholder)]",
          "rounded-[var(--c-input-radius)] border border-[var(--c-input-border)]",
          "hover:border-[var(--c-input-border-hover)]",
          "outline-none transition-[border-color,box-shadow,background-color] duration-150",
          "focus-visible:border-[var(--c-input-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--c-input-ring-focus)]",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-[13px] file:font-medium file:text-[var(--s-ink-primary)]",
          "selection:bg-[var(--s-brand-solid)] selection:text-[var(--p-sand-950)]",
          "aria-invalid:border-[var(--c-input-border-error)] aria-invalid:focus-visible:ring-[var(--s-danger-subtle)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
