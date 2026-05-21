import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Label — DFL Design System v0
 *
 * DS v0 spec: 12px, weight 500, leading 1.4. Two variants:
 *   default — Inter, sentence case for form fields.
 *   mono    — JetBrains Mono uppercase, used for "meta about meta" (KeyValueList keys, table headers).
 */
const labelVariants = cva(
  "inline-flex items-center gap-1.5 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-[12px] font-medium leading-[1.4] text-[var(--s-ink-secondary)]",
        mono:
          "text-[10.5px] font-medium uppercase tracking-[0.06em] font-mono text-[var(--s-ink-muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant }), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
