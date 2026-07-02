import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "../lib/utils";

/**
 * Switch — Radix UI primitive wired to DS v0 component tokens.
 *
 * Fixes vs original shadcn output:
 *   1. Thumb was `bg-background` → `--s-surface-page` (#0a0908, near-black) — invisible
 *      on the dark unchecked track. Now uses `--c-switch-thumb-bg` (#f6f1e7, warm off-white).
 *   2. Focus ring was shadcn `ring-2 ring-ring ring-offset-2` (CSS outline approach).
 *      Now uses the uniform DS box-shadow ring via `--c-switch-focus-ring`
 *      (0 0 0 2px page-bg gap + 0 0 0 3px amber — box-shadow only, no outline property).
 *   3. Component token layer added: all values flow through `--c-switch-*` knobs
 *      (appended to tokens.css Layer 3), making the component theme-overridable
 *      at the per-component level without touching global alias chains.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Layout + shape
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      // Track: unchecked — elevated dark surface + subtle border ring
      "data-[state=unchecked]:bg-[var(--c-switch-track-off-bg)]",
      "data-[state=unchecked]:border-[var(--c-switch-track-off-border)]",
      // Track: checked — amber brand fill
      "data-[state=checked]:bg-[var(--c-switch-track-on-bg)]",
      // Focus ring: uniform DS ring (box-shadow only — no outline property)
      "focus-visible:outline-none",
      "focus-visible:[box-shadow:var(--c-switch-focus-ring)]",
      // Disabled
      "disabled:cursor-not-allowed disabled:opacity-[var(--c-switch-disabled-opacity)]",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform",
        // Thumb: warm off-white (#f6f1e7) — visible on both dark unchecked and amber checked track
        "bg-[var(--c-switch-thumb-bg)]",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
