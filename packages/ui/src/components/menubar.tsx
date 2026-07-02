"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "../lib/utils";

/**
 * Menubar — DFL Design System v0
 *
 * Tokens consumed (Layer 3 → Layer 2 → Layer 1):
 *   --c-menubar-bar-bg, --c-menubar-bar-border, --c-menubar-bar-radius
 *   --c-menubar-trigger-fg, --c-menubar-trigger-bg-hover, --c-menubar-trigger-bg-open, --c-menubar-trigger-radius
 *   --c-menubar-content-bg, --c-menubar-item-fg, --c-menubar-item-bg-hover, --c-menubar-item-radius
 *   --c-menubar-shortcut-font, --c-menubar-shortcut-fg
 *   --c-menubar-indicator-color
 *   --c-menubar-dest-fg, --c-menubar-dest-bg-hover
 *   --c-menubar-ring-trigger, --c-menubar-ring-item  (DS 2-layer amber focus ring)
 *
 * Focus ring spec: box-shadow: 0 0 0 2px <surface-bg>, 0 0 0 3px #E07A4A
 *   Triggers sit on bar bg → ring uses --c-menubar-bar-bg as inner layer.
 *   Items sit inside the dropdown → ring uses --c-menubar-content-bg.
 *
 * Item hover: brand-subtle tint (rgba(224,122,74,0.10)) — NOT solid accent fill.
 * CheckboxItem/RadioItem indicators: --c-menubar-indicator-color (#E07A4A amber).
 * Shortcuts: JetBrains Mono via --c-menubar-shortcut-font.
 */

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-9 items-center gap-1 rounded-[var(--c-menubar-bar-radius)] border border-[var(--c-menubar-bar-border)] bg-[var(--c-menubar-bar-bg)] p-1 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        // Base layout
        "flex items-center rounded-[var(--c-menubar-trigger-radius)] px-2 py-1 text-sm font-medium select-none",
        // Default ink — secondary, lifts to primary on active states
        "text-[var(--c-menubar-trigger-fg)] outline-none",
        // Pointer hover — surface-raised bg, primary ink
        "hover:bg-[var(--c-menubar-trigger-bg-hover)] hover:text-[var(--s-ink-primary)]",
        // Open / active — surface-elevated bg, primary ink
        "data-[state=open]:bg-[var(--c-menubar-trigger-bg-open)] data-[state=open]:text-[var(--s-ink-primary)]",
        // DS amber focus ring — 2-layer box-shadow (inner offset = bar bg, outer = amber)
        // NO accent fill on focus — ring only.
        "focus-visible:[box-shadow:var(--c-menubar-ring-trigger)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-[var(--p-radius-md)] border border-[var(--c-menubar-bar-border)] bg-[var(--c-menubar-content-bg)] p-1 shadow-md",
          "text-[var(--c-menubar-item-fg)]",
          "origin-(--radix-menubar-content-transform-origin)",
          "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // Base layout
        "relative flex cursor-default items-center gap-2 rounded-[var(--c-menubar-item-radius)] px-2 py-1.5 text-sm outline-none select-none",
        "text-[var(--c-menubar-item-fg)]",
        // Hover — brand-subtle tint (NOT solid amber fill)
        "data-[highlighted]:bg-[var(--c-menubar-item-bg-hover)]",
        // DS amber focus ring — inner offset = content bg
        "focus-visible:[box-shadow:var(--c-menubar-ring-item)]",
        // Disabled
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Inset (for icon-aligned rows)
        "data-[inset]:pl-8",
        // Icon defaults — muted when idle
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-[var(--s-ink-muted)]",
        // Destructive variant — danger fg, danger-subtle hover
        "data-[variant=destructive]:text-[var(--c-menubar-dest-fg)]",
        "data-[variant=destructive]:data-[highlighted]:bg-[var(--c-menubar-dest-bg-hover)]",
        "data-[variant=destructive]:[&_svg:not([class*='text-'])]:text-[var(--c-menubar-dest-fg)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[var(--c-menubar-item-radius)] py-1.5 pr-2 pl-8 text-sm outline-none select-none",
        // Hover — brand-subtle tint
        "data-[highlighted]:bg-[var(--c-menubar-item-bg-hover)]",
        // DS amber focus ring
        "focus-visible:[box-shadow:var(--c-menubar-ring-item)]",
        // Disabled
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          {/* Amber checkmark — --c-menubar-indicator-color */}
          <CheckIcon className="size-4 text-[var(--c-menubar-indicator-color)]" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[var(--c-menubar-item-radius)] py-1.5 pr-2 pl-8 text-sm outline-none select-none",
        // Hover — brand-subtle tint
        "data-[highlighted]:bg-[var(--c-menubar-item-bg-hover)]",
        // DS amber focus ring
        "focus-visible:[box-shadow:var(--c-menubar-ring-item)]",
        // Disabled
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          {/* Amber filled circle — --c-menubar-indicator-color */}
          <CircleIcon className="size-2 fill-[var(--c-menubar-indicator-color)] text-[var(--c-menubar-indicator-color)]" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--s-ink-muted)] data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-[var(--c-menubar-bar-border)]", className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        // JetBrains Mono per DS monospace-for-codes/kbd rule
        "ml-auto text-xs tracking-widest [font-family:var(--c-menubar-shortcut-font)] text-[var(--c-menubar-shortcut-fg)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-[var(--c-menubar-item-radius)] px-2 py-1.5 text-sm outline-none select-none",
        "text-[var(--c-menubar-item-fg)]",
        // Hover — brand-subtle tint
        "data-[highlighted]:bg-[var(--c-menubar-item-bg-hover)]",
        // Sub open — same brand-subtle treatment
        "data-[state=open]:bg-[var(--c-menubar-item-bg-hover)]",
        // DS amber focus ring
        "focus-visible:[box-shadow:var(--c-menubar-ring-item)]",
        "data-[inset]:pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4 text-[var(--s-ink-muted)]" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-[var(--p-radius-md)] border border-[var(--c-menubar-bar-border)] bg-[var(--c-menubar-content-bg)] p-1 shadow-lg",
        "text-[var(--c-menubar-item-fg)]",
        "origin-(--radix-menubar-content-transform-origin)",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
