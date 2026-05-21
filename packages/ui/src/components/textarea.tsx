import * as React from "react";

import { cn } from "../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea — DFL Design System v0
 *
 * Shares Input tokens (--c-input-*). Multi-line, 80px min height.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full px-3 py-2 text-[13px] leading-[1.55]",
        "bg-[var(--c-input-bg)] text-[var(--c-input-fg)]",
        "placeholder:text-[var(--c-input-placeholder)]",
        "rounded-[var(--c-input-radius)] border border-[var(--c-input-border)]",
        "hover:border-[var(--c-input-border-hover)]",
        "outline-none transition-[border-color,box-shadow,background-color] duration-150",
        "focus-visible:border-[var(--c-input-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--c-input-ring-focus)]",
        "aria-invalid:border-[var(--c-input-border-error)] aria-invalid:focus-visible:ring-[var(--s-danger-subtle)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-y",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
