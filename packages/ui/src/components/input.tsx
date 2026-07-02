import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Input — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-input-{bg,fg,placeholder,border,border-hover,border-focus,border-error,radius}
 *
 * DS v0 spec: 36px height, surface-raised bg, 12px horizontal padding.
 * Focus ring: 2-layer box-shadow — 0 0 0 2px var(--background) (bg gap) +
 *             0 0 0 3px var(--c-input-border-focus) (solid amber).
 * Error+focus: same 2-layer pattern with var(--c-input-border-error) as outer ring.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // base layout
          "flex h-9 w-full min-w-0 px-3 py-1.5 text-[13px] leading-none",
          // surface + color
          "bg-[var(--c-input-bg)] text-[var(--c-input-fg)]",
          "placeholder:text-[var(--c-input-placeholder)]",
          // border + radius
          "rounded-[var(--c-input-radius)] border border-[var(--c-input-border)]",
          "hover:border-[var(--c-input-border-hover)]",
          // focus
          "outline-none transition-[border-color,box-shadow,background-color] duration-150",
          // 2-layer brand focus ring: 2px bg gap + 1px solid amber (brand spec)
          "focus-visible:border-[var(--c-input-border-focus)]",
          "focus-visible:[box-shadow:0_0_0_2px_var(--background),0_0_0_3px_var(--c-input-border-focus)]",
          // file input
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-[13px] file:font-medium file:text-[var(--s-ink-primary)]",
          // selection
          "selection:bg-[var(--s-brand-solid)] selection:text-[var(--p-sand-950)]",
          // states: error border + 2-layer danger ring on error+focus
          "aria-invalid:border-[var(--c-input-border-error)]",
          "aria-invalid:focus-visible:[box-shadow:0_0_0_2px_var(--background),0_0_0_3px_var(--c-input-border-error)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
