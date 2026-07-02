import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Label — DFL Design System v0
 *
 * Tokens consumed (Layer 3 → Layer 2 → Layer 1):
 *   --c-label-fg             → --s-ink-secondary   (default variant)
 *   --c-label-fg-muted       → --s-ink-muted        (mono variant)
 *   --c-label-fg-error       → --s-danger-fg        (error state; #e89898)
 *   --c-label-fg-disabled    → --s-ink-disabled     (explicit disabled state)
 *   --c-label-required-color → --s-brand-solid      (required asterisk)
 *   --c-label-font-size      → --p-text-12          (12px default)
 *   --c-label-mono-font-size → 10.5px               (mono; no p-text primitive)
 *   --c-label-mono-tracking  → 0.06em               (mono letter-spacing)
 *
 * Two shape variants:
 *   default — Inter 12px/500, sentence case for form fields.
 *   mono    — JetBrains Mono uppercase, for "meta about meta" (table headers, key lists).
 *
 * Three explicit states (peer-disabled also propagates automatically via CSS):
 *   default  — no additional override.
 *   error    — label adopts --c-label-fg-error when its paired field is invalid.
 *   disabled — reduced opacity + cursor:not-allowed (for label-first layouts where
 *              peer-disabled cannot propagate via DOM sibling order).
 */
const labelVariants = cva(
  "inline-flex items-center gap-1.5 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "[font-size:var(--c-label-font-size)] font-medium [line-height:var(--c-label-line-height)] text-[var(--c-label-fg)]",
        mono:
          "[font-size:var(--c-label-mono-font-size)] font-medium uppercase [letter-spacing:var(--c-label-mono-tracking)] font-mono text-[var(--c-label-fg-muted)]",
      },
      state: {
        default:  "",
        error:    "text-[var(--c-label-fg-error)]",
        disabled: "text-[var(--c-label-fg-disabled)] cursor-not-allowed opacity-50",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, state, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, state }), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
