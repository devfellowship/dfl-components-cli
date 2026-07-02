import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "../lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      // Border via component token — not the raw Tailwind `border-b` utility
      // which leaks the raw --border var without the component-token indirection.
      "[border-bottom:1px_solid_var(--c-accordion-border)] last:border-b-0",
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Layout
        "flex flex-1 items-center justify-between gap-3 text-left",
        // Spacing — component tokens (16px x / 14px y per DS spec)
        "px-[var(--c-accordion-padding-x)] py-[var(--c-accordion-padding-y)]",
        // Typography
        "text-sm [font-weight:var(--c-accordion-trigger-weight)]",
        "text-[var(--c-accordion-trigger-fg)]",
        // Shape & base bg
        "rounded-[var(--c-accordion-item-radius)] bg-transparent",
        "transition-[background-color,color] duration-[var(--p-duration-fast)]",
        // Hover: bg lift to surface-raised — replaces vanilla shadcn hover:underline
        "hover:bg-[var(--c-accordion-trigger-bg-hover)] hover:no-underline",
        // Active press lifts to surface-elevated
        "active:bg-[var(--c-accordion-trigger-bg-active)]",
        // THE ONE uniform DS focus ring: 2px page-bg gap + 1px amber
        "outline-none",
        "focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--s-border-focus)]",
        // Disabled — Radix sets data-disabled (not HTML disabled) on trigger
        "data-[disabled]:cursor-not-allowed",
        "data-[disabled]:text-[var(--s-ink-disabled)]",
        "data-[disabled]:pointer-events-none",
        // Chevron: rotate 180° when item is open
        "[&[data-state=open]>svg]:rotate-180",
        // Chevron: amber brand color when open
        "[&[data-state=open]>svg]:text-[var(--c-accordion-indicator-color-open)]",
        // Chevron: lift to ink-secondary on trigger hover (subtle affordance)
        "hover:[&>svg]:text-[var(--s-ink-secondary)]",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "size-4 shrink-0",
          // Muted (#7d7568) at rest; open/hover colour overridden by parent selectors above
          "text-[var(--c-accordion-indicator-color)]",
          "transition-[transform,color] duration-[180ms] ease-[var(--p-ease-out)]",
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div
      className={cn(
        // Horizontal padding matches trigger; vertical padding on bottom only
        "px-[var(--c-accordion-padding-x)] pb-[var(--c-accordion-padding-y)] pt-0",
        // Content: ink-secondary, 14px, relaxed line-height
        "text-[var(--c-accordion-content-fg)]",
        "text-[length:var(--c-accordion-content-size)]",
        "leading-[var(--p-leading-relaxed)]",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
