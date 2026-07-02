import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "../lib/utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-0.5",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

/**
 * DS-token-aware trigger style.
 *
 * Fixes vs previous shadcn generic:
 *  • hover:bg-accent (= --accent = amber #E07A4A full-fill) → surface-elevated
 *    lift via --c-nav-trigger-hover-bg (#1f1c18). Amber is reserved for CTA only.
 *  • focus ring: was ring-[3px] ring-ring/50 (wrong width + opacity) →
 *    DS uniform ring: 2px gap + 1px amber ring via ring-1 / ring-offset-2,
 *    with transition-none so it appears instantly.
 *  • open state: amber-subtle bg tint (--c-nav-trigger-open-bg) + amber-300
 *    text + amber border — NOT a full amber fill.
 */
const navigationMenuTriggerStyle = cva(
  [
    // Layout
    "group inline-flex h-[var(--c-nav-trigger-h,36px)] w-max items-center justify-center",
    "rounded-[var(--c-nav-trigger-radius,6px)] border border-transparent",
    "px-[var(--c-nav-trigger-px,14px)] text-[13px] font-medium",
    // Base colors: muted secondary ink, transparent bg
    "bg-[var(--c-nav-bg,transparent)] text-[var(--c-nav-fg)]",
    // Smooth transitions for bg/color/border (NOT box-shadow — that snaps on focus-visible)
    "transition-[background-color,color,border-color] duration-[120ms]",
    // Hover: surface-elevated lift, NOT amber fill
    "hover:bg-[var(--c-nav-trigger-hover-bg)] hover:text-[var(--c-nav-trigger-hover-fg)]",
    // DS uniform focus ring: 2px gap (page bg) + 1px amber ring, instant
    "outline-none",
    "focus-visible:bg-[var(--c-nav-trigger-hover-bg)] focus-visible:text-[var(--c-nav-trigger-hover-fg)]",
    "focus-visible:ring-1 focus-visible:ring-[#E07A4A]",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s-surface-page)]",
    "focus-visible:transition-none",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-45",
    // Open: amber-subtle bg tint + amber-300 text + amber border
    "data-[state=open]:bg-[var(--c-nav-trigger-open-bg)]",
    "data-[state=open]:text-[var(--c-nav-trigger-open-fg)]",
    "data-[state=open]:border-[var(--c-nav-trigger-open-border)]",
  ].join(" "),
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className={cn(
          "relative top-[1px] ml-1 size-3 opacity-70",
          "transition-[transform,opacity] duration-200",
          "group-hover:opacity-100",
          "group-data-[state=open]:rotate-180 group-data-[state=open]:opacity-100",
          "group-data-[state=open]:text-[var(--c-nav-trigger-open-fg)]",
        )}
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

/**
 * NavigationMenuContent — dropdown panel content.
 *
 * Fix: removed `**:data-[slot=navigation-menu-link]:focus:ring-0` and
 * `**:data-[slot=navigation-menu-link]:focus:outline-none` which were
 * silencing all focus rings inside the open dropdown (keyboard a11y regression).
 * Content panel now uses --c-nav-content-* tokens instead of generic popover vars.
 */
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        // Entry/exit animations (viewport mode)
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
        "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
        "top-0 left-0 w-full p-2 md:absolute md:w-auto",
        // viewport=false (inline) mode — DS content tokens, NOT bg-popover
        "group-data-[viewport=false]/navigation-menu:bg-[var(--c-nav-content-bg)]",
        "group-data-[viewport=false]/navigation-menu:text-[var(--s-ink-secondary)]",
        "group-data-[viewport=false]/navigation-menu:border",
        "group-data-[viewport=false]/navigation-menu:border-[var(--c-nav-content-border)]",
        "group-data-[viewport=false]/navigation-menu:rounded-[var(--c-nav-content-radius,8px)]",
        "group-data-[viewport=false]/navigation-menu:shadow-[var(--c-nav-content-shadow)]",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0",
        "group-data-[viewport=false]/navigation-menu:top-full",
        "group-data-[viewport=false]/navigation-menu:mt-1.5",
        "group-data-[viewport=false]/navigation-menu:overflow-hidden",
        "group-data-[viewport=false]/navigation-menu:duration-200",
        // NOTE: **:data-[slot=navigation-menu-link]:focus:ring-0 intentionally removed.
        // Keyboard users MUST see focus rings on links inside the open dropdown.
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          // DS surface tokens — NOT generic bg-popover which leaks --popover = dialog bg
          "bg-[var(--c-nav-content-bg)] text-[var(--s-ink-secondary)]",
          "border border-[var(--c-nav-content-border)]",
          "rounded-[var(--c-nav-content-radius,8px)]",
          "shadow-[var(--c-nav-content-shadow)]",
          // Radix viewport open/close animation
          "origin-top-center data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
          "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)]",
          "w-full overflow-hidden md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/**
 * NavigationMenuLink — top-level direct links AND content panel items.
 *
 * Fixes:
 *  • hover:bg-accent (amber full-fill) → --c-nav-item-hover-bg (surface-elevated)
 *  • focus:bg-accent → removed; replaced with DS ring on focus-visible
 *  • focus ring now visible (parent Content no longer suppresses it)
 *  • active state: brand-subtle bg + brand-fg text
 *    For content items with left-border indicator, add
 *    `border-l-2 border-l-[var(--c-nav-item-active-border)]` via className.
 */
function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        // Layout
        "flex flex-col gap-1 rounded-[var(--p-radius-md,6px)] p-2 text-[13px]",
        "transition-[background-color,color] duration-[120ms] outline-none",
        // Default: muted ink
        "text-[var(--s-ink-muted)]",
        // Hover: surface lift, NOT amber fill
        "hover:bg-[var(--c-nav-item-hover-bg)] hover:text-[var(--c-nav-item-hover-fg)]",
        // DS uniform focus ring: same spec as trigger
        "focus-visible:bg-[var(--c-nav-item-hover-bg)] focus-visible:text-[var(--c-nav-item-hover-fg)]",
        "focus-visible:ring-1 focus-visible:ring-[#E07A4A]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s-surface-page)]",
        "focus-visible:transition-none",
        // Active/current-route: brand-subtle tint + brand-fg text
        "data-[active=true]:bg-[var(--c-nav-item-active-bg)]",
        "data-[active=true]:text-[var(--c-nav-item-active-fg)]",
        // Icon helpers
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-[var(--s-ink-muted)]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
        "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Arrow caret: bg + border match the content panel for visual continuity */}
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[var(--c-nav-content-bg)] border-t border-l border-[var(--c-nav-content-border)] shadow-[var(--p-shadow-sm)]" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
