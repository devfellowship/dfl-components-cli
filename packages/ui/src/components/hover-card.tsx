"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "../lib/utils";

/**
 * HoverCard — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-hovercard-{bg,border,radius,padding,shadow,focus-ring}
 *   backed by --s-surface-raised, --s-border-subtle, --p-radius-lg (10px),
 *   --p-space-4, --p-shadow, and a double box-shadow focus ring
 *   (0 0 0 2px page-bg + 0 0 0 3px amber — DS uniform ring).
 *
 * Panel radius: --p-radius-lg = 10px (overlay/card tier).
 *   NOT --p-radius-md = 6px (input/button tier).
 * Trigger focus ring: DS uniform ring via --c-hovercard-focus-ring.
 */
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      className={cn(
        "focus-visible:outline-none focus-visible:[box-shadow:var(--c-hovercard-focus-ring)]",
        className,
      )}
      {...props}
    />
  );
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "z-50 w-[var(--c-hovercard-width)] origin-(--radix-hover-card-content-transform-origin)",
          "bg-[var(--c-hovercard-bg)] border border-[var(--c-hovercard-border)]",
          "rounded-[var(--c-hovercard-radius)] p-[var(--c-hovercard-padding)]",
          "shadow-[var(--c-hovercard-shadow)] text-[var(--s-ink-primary)] outline-hidden",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
