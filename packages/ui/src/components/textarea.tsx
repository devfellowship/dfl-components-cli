import * as React from "react";

import { cn } from "../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea — DFL Design System v0
 *
 * Shares Input tokens (--c-input-*). Multi-line, 80px min height. Resizable.
 *
 * Focus ring (DS v0 ch.5.2 uniform spec):
 *   --c-textarea-ring-focus       = 0 0 0 2px page-bg, 0 0 0 3px amber
 *   --c-textarea-ring-focus-error = 0 0 0 2px page-bg, 0 0 0 3px danger-red
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
        // DS v0 uniform focus ring: 2px page-bg gap + 1px solid amber outer ring
        "focus-visible:border-[var(--c-input-border-focus)] focus-visible:[box-shadow:var(--c-textarea-ring-focus)]",
        // Error state: danger border; error+focus: parallel danger ring (gap + solid red)
        "aria-invalid:border-[var(--c-input-border-error)] aria-invalid:focus-visible:[box-shadow:var(--c-textarea-ring-focus-error)]",
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
