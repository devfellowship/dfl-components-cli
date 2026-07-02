import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../lib/utils";

/**
 * Tabs — DFL Design System v0
 *
 * Tokens consumed (underline-indicator pattern):
 *   --c-tabs-fg           inactive trigger text  → --s-ink-muted
 *   --c-tabs-fg-active    active trigger text     → --s-ink-primary
 *   --c-tabs-indicator    active 2 px bottom border → --s-brand-solid (#E07A4A)
 *   --c-tabs-divider      list 1 px bottom border  → --s-border-subtle
 *
 * Layout:
 *   - TabsList: transparent container, 1 px --c-tabs-divider bottom border.
 *     No pill bg, no card-bg affordance, no border-radius container.
 *   - TabsTrigger: 2 px transparent bottom border that becomes --c-tabs-indicator
 *     when active. Overlaps list divider by 1 px so indicator sits on the line.
 *   - Hover: secondary ink + faint rgba wash (rgba 255 255 255 / 0.035).
 *   - Focus: uniform DFL ring via `.ds-focus-ring` (1 px amber, 3 px offset).
 *   - Disabled: ink-disabled, pointer-events-none, opacity-50.
 */

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Underline-indicator container: no pill bg, no card shadow — only the divider line.
      "inline-flex items-end border-b border-b-[var(--c-tabs-divider)]",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Layout
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
      "px-4 py-2 text-sm font-medium",
      // Shape — top-corner radius only; bg is transparent (no pill/card-bg)
      "rounded-t-sm bg-transparent cursor-pointer",
      // Underline indicator: 2 px solid bottom border, transparent by default.
      // -mb-px overlaps the list's 1 px divider so the active indicator sits on the line.
      "border-b-2 [border-bottom-color:transparent] -mb-px",
      // Base text color
      "text-[var(--c-tabs-fg)]",
      // Transitions
      "transition-colors duration-[120ms]",
      // Active state: amber bottom indicator + primary ink
      "data-[state=active]:text-[var(--c-tabs-fg-active)] data-[state=active]:[border-bottom-color:var(--c-tabs-indicator)]",
      // Hover: secondary ink + faint background wash
      // (disabled triggers skip hover via disabled:pointer-events-none)
      "hover:text-[var(--s-ink-secondary)] hover:[background:rgba(255,255,255,0.035)]",
      // Focus: uniform DFL ring — 1 px amber, 3 px offset (replaces Tailwind ring pattern)
      "ds-focus-ring",
      // Disabled
      "disabled:pointer-events-none disabled:opacity-50 disabled:text-[var(--s-ink-disabled)] disabled:cursor-not-allowed",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
