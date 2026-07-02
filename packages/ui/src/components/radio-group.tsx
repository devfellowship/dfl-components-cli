import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "../lib/utils";
import { Label } from "./label";

/**
 * RadioGroup — DS v0 token-native refactor.
 *
 * Changes from vanilla shadcn:
 *   - Border on unselected items uses --c-radio-border (→ --s-border-strong, #3a3530)
 *     instead of border-primary (amber) which leaked the brand accent onto neutral state.
 *   - Focus ring is the uniform DFL ring: box-shadow 0 0 0 2px page-bg, 0 0 0 3px #E07A4A
 *     (instant — box-shadow not in transition-colors, appears/disappears without animation).
 *   - Indicator is a pure CSS div (8px filled circle) replacing the Lucide <Circle> icon
 *     which required SVG fill/color coupling via fill-current text-current.
 *   - All knobs resolve through --c-radio-* component tokens → --s-* semantic tokens.
 */

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-[var(--c-radio-item-gap)]", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Geometry
        "relative h-4 w-4 rounded-full border-[1.5px] border-solid",
        "flex shrink-0 items-center justify-center",
        // Background + border — neutral/unselected uses --s-border-strong, not amber
        "[background-color:var(--c-radio-bg)]",
        "[border-color:var(--c-radio-border)]",
        // Checked: amber border
        "data-[state=checked]:[border-color:var(--c-radio-border-checked)]",
        // Hover unchecked: muted border (--s-ink-muted)
        "hover:[border-color:var(--c-radio-border-hover)]",
        // Hover checked: brand-hover border (overrides unchecked hover above)
        "data-[state=checked]:hover:[border-color:var(--s-brand-hover)]",
        // Focus — remove browser default; apply uniform DFL ring (instant, not in transition-colors)
        "focus:outline-none",
        "focus-visible:[border-color:var(--c-radio-border-checked)]",
        "focus-visible:[box-shadow:0_0_0_2px_var(--s-surface-page),_0_0_0_3px_var(--s-brand-solid)]",
        // Transition border-color only (120ms); box-shadow intentionally instant
        "transition-colors duration-[120ms]",
        // Disabled: opacity on the circle; label handled via RadioGroupRow
        "disabled:cursor-not-allowed disabled:opacity-[0.45]",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/*
         * Pure CSS dot — replaces Lucide <Circle> to remove SVG fill/color coupling.
         * 8px filled circle; color via --c-radio-indicator-color → --s-brand-solid.
         */}
        <div className="h-2 w-2 rounded-full [background-color:var(--c-radio-indicator-color)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

/**
 * RadioGroupRow — convenience compound: RadioGroupItem + Label with correct
 * disabled handling. Disabled propagates to both the circle (opacity/cursor via
 * the item) and the label (--c-radio-label-fg-disabled, cursor not-allowed).
 *
 * Use for typical radio list rows. Use RadioGroupItem directly when you need
 * finer composition control (e.g. custom label markup).
 */
interface RadioGroupRowProps {
  value: string;
  id: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const RadioGroupRow = ({
  value,
  id,
  disabled,
  children,
  className,
}: RadioGroupRowProps) => (
  <div
    className={cn(
      "flex items-center gap-[var(--c-radio-label-gap)]",
      disabled && "cursor-not-allowed",
      className,
    )}
  >
    <RadioGroupItem value={value} id={id} disabled={disabled} />
    <Label
      htmlFor={id}
      className={cn(
        "cursor-pointer select-none text-sm leading-snug [color:var(--c-radio-label-fg)]",
        disabled && "cursor-not-allowed [color:var(--c-radio-label-fg-disabled)]",
      )}
    >
      {children}
    </Label>
  </div>
);
RadioGroupRow.displayName = "RadioGroupRow";

export { RadioGroup, RadioGroupItem, RadioGroupRow };
