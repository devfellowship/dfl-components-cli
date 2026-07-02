"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { cn } from "../lib/utils";

/**
 * Collapsible — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-collapsible-{bg, bg-hover, border, border-hover, radius}
 *   --c-collapsible-header-fg
 *   --c-collapsible-content-{bg, border}
 *   --c-collapsible-item-fg
 *   --c-collapsible-trigger-{fg, fg-hover, ring}
 *   backed by --s-{surface-*, border-*, ink-*, brand-*} semantic tokens
 *
 * Subcomponents:
 *   <Collapsible>         — Root (w-[320px] flex col gap-1.5; Radix open/disabled control)
 *   <CollapsibleHeader>   — Header row: label slot + CollapsibleTrigger
 *   <CollapsibleTrigger>  — 28×28 ghost icon button; amber focus ring + hover affordance
 *   <CollapsibleContent>  — Animated content area (Radix animated reveal)
 *   <CollapsibleItem>     — Individual content row with elevated surface bg
 *
 * Reference: Alert pilot pattern (merged) for token-wire approach.
 */

function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn("w-[320px] flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

/**
 * CollapsibleHeader — the header row.
 *
 * Provides the panel bg (--c-collapsible-bg), border, radius, and a
 * subtle hover lift (border-hover, bg-hover). Slot the label + trigger inside.
 */
function CollapsibleHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="collapsible-header"
      className={cn(
        "flex items-center justify-between gap-3",
        "rounded-[var(--c-collapsible-radius)] border border-[var(--c-collapsible-border)]",
        "bg-[var(--c-collapsible-bg)]",
        "px-[14px] py-[10px]",
        "transition-[border-color,background] duration-[120ms]",
        "text-[13px] font-semibold tracking-[-0.2px]",
        "text-[var(--c-collapsible-header-fg)]",
        "hover:border-[var(--c-collapsible-border-hover)] hover:bg-[var(--c-collapsible-bg-hover)]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CollapsibleTrigger — 28×28 ghost icon button.
 *
 * Focus ring: double-layer box-shadow via --c-collapsible-trigger-ring
 *   (0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A)
 * Hover: amber fg shift (--c-collapsible-trigger-fg-hover) + brand-subtle bg chip.
 * Disabled: 45% opacity, pointer-events-none (propagated from Radix root `disabled`).
 */
function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(
        // ghost icon button base
        "inline-flex items-center justify-center size-7 shrink-0",
        "rounded-[var(--p-radius-sm)] border border-transparent bg-transparent",
        "text-[var(--c-collapsible-trigger-fg)]",
        "transition-[color,background,border-color,box-shadow] duration-[120ms]",
        // hover — amber accent color shift + brand-subtle chip
        "hover:text-[var(--c-collapsible-trigger-fg-hover)]",
        "hover:bg-[var(--s-brand-subtle)]",
        "hover:border-[var(--s-brand-border)]",
        // DS focus ring — 2px page-bg gap + 1px amber outer ring
        "focus-visible:outline-none",
        "focus-visible:[box-shadow:var(--c-collapsible-trigger-ring)]",
        "focus-visible:text-[var(--s-brand-hover)]",
        "focus-visible:bg-[var(--s-brand-subtle)]",
        // disabled
        "disabled:pointer-events-none disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CollapsibleContent — animated reveal, items stacked with gap.
 * Surface is transparent; individual CollapsibleItems carry the elevation.
 */
function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

/**
 * CollapsibleItem — individual content row inside CollapsibleContent.
 * Elevated surface bg (--c-collapsible-content-bg) + subtle border + muted ink.
 */
function CollapsibleItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="collapsible-item"
      className={cn(
        "rounded-[var(--c-collapsible-radius)]",
        "border border-[var(--c-collapsible-content-border)]",
        "bg-[var(--c-collapsible-content-bg)]",
        "px-[14px] py-2",
        "text-[13px] text-[var(--c-collapsible-item-fg)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Collapsible,
  CollapsibleHeader,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleItem,
};
