"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import { toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

/**
 * ToggleGroup — DFL DS v0
 *
 * Tokens consumed (via toggleVariants in toggle.tsx):
 *   --c-toggle-{bg,bg-hover,bg-active,bg-active-hover,fg,fg-hover,fg-active}
 *   --c-toggle-{border,focus-ring,outline-active-shadow}
 *   --c-toggle-group-radius
 *
 * Variant "outline":
 *   • Group container gets --p-shadow-sm depth shadow
 *   • Each item's border is `border-[var(--c-toggle-border)]` (--s-border-subtle)
 *   • Non-first items have `border-l-0` (left removed) so only item-1's right
 *     border acts as the internal divider — no double lines
 *   • Active item gets an inset top-highlight shadow (--c-toggle-outline-active-shadow)
 *
 * Focus ring: see toggle.tsx — z-10 ensures ring renders above siblings.
 */
function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-[var(--c-toggle-group-radius)]",
        // Outline variant: elevated shadow on the group container
        "data-[variant=outline]:shadow-[var(--p-shadow-sm)]",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        // Group geometry: zero radius on middle items; first/last get end radii
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none",
        "first:rounded-l-[var(--c-toggle-group-radius)] last:rounded-r-[var(--c-toggle-group-radius)]",
        // Outline divider: all items remove their left border; first child adds it back
        // so item-N's right border acts as the divider (no double lines)
        "data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        // Outline active: inset top-highlight (brand amber glow inside the border)
        "data-[variant=outline]:data-[state=on]:shadow-[var(--c-toggle-outline-active-shadow)]",
        // focus-visible:z-10 already set in toggleVariants — ensures ring not clipped
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
