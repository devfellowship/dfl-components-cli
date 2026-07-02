import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Progress — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-progress-{track-bg,radius,h-sm,h-md,h-lg,duration,easing}
 *   --c-progress-fill-{default,success,danger,warning,info}
 *   backed by --s-brand-solid, --s-{success,danger,warning,info}-solid
 *
 * Props:
 *   size:    sm (4px) | md (8px, default) | lg (12px)
 *   variant: default (amber) | success | danger | warning | info
 *   value:   0–100
 */

const progressTrackVariants = cva(
  [
    "relative w-full overflow-hidden",
    "bg-[var(--c-progress-track-bg)]",
    "rounded-[var(--c-progress-radius)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[var(--c-progress-h-sm)]",
        md: "h-[var(--c-progress-h-md)]",
        lg: "h-[var(--c-progress-h-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const progressFillVariants = cva(
  [
    "h-full w-full flex-1",
    "transition-transform",
    "duration-[var(--c-progress-duration)]",
    "ease-[var(--c-progress-easing)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-[var(--c-progress-fill)]",
        success: "bg-[var(--c-progress-fill-success)]",
        danger:  "bg-[var(--c-progress-fill-danger)]",
        warning: "bg-[var(--c-progress-fill-warning)]",
        info:    "bg-[var(--c-progress-fill-info)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressTrackVariants>,
    VariantProps<typeof progressFillVariants> {}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressTrackVariants({ size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressFillVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
