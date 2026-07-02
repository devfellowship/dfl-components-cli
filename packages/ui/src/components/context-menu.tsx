"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "../lib/utils";

/**
 * ContextMenu — DS v0 token-aligned right-click menu.
 *
 * Token layer: --c-contextmenu-* (Layer 3) → --s-* → --p-*
 *
 * Key fixes vs. vanilla shadcn:
 *   • bg-accent (solid amber fill) → --c-contextmenu-item-hover-bg (brand-subtle 10%)
 *   • accent-foreground (sand-950 on orange) → --c-contextmenu-item-hover-fg (amber-300)
 *   • Keyboard-focus: same hover bg + inset ring (--c-contextmenu-item-focus-ring)
 *     via focus-visible — distinguishes keyboard from pointer-hover.
 *   • ContextMenuShortcut gets font-mono (JetBrains Mono) per DS kbd/code spec.
 *   • Destructive items: --s-danger-fg text, --s-danger-subtle hover bg.
 *   • CheckIcon + CircleIcon indicators tinted with --s-brand-solid (amber).
 *   • ContextMenuLabel: uppercase, tracking-wider, font-mono, muted — per DS spec.
 */

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        // Hover / keyboard-highlighted (Radix data-[highlighted]) — brand-subtle + amber-300
        "data-[highlighted]:bg-[var(--c-contextmenu-item-hover-bg)] data-[highlighted]:text-[var(--c-contextmenu-item-hover-fg)]",
        // Submenu-open state mirrors hover treatment
        "data-[state=open]:bg-[var(--c-contextmenu-item-hover-bg)] data-[state=open]:text-[var(--c-contextmenu-item-hover-fg)]",
        // Keyboard focus adds inset amber ring on top of hover bg
        "focus-visible:shadow-[var(--c-contextmenu-item-focus-ring)]",
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
        "data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "bg-[var(--c-contextmenu-bg)] text-[var(--c-contextmenu-item-fg)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin)",
        "overflow-hidden rounded-[var(--c-contextmenu-radius)] border border-[var(--c-contextmenu-border)] p-1",
        "shadow-[var(--c-contextmenu-shadow)]",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "bg-[var(--c-contextmenu-bg)] text-[var(--c-contextmenu-item-fg)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem]",
          "origin-(--radix-context-menu-content-transform-origin)",
          "overflow-x-hidden overflow-y-auto",
          "rounded-[var(--c-contextmenu-radius)] border border-[var(--c-contextmenu-border)] p-1",
          "shadow-[var(--c-contextmenu-shadow)]",
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // ── Hover / keyboard-highlighted (data-[highlighted] from Radix) ──
        // brand-subtle (10% amber) bg + amber-300 text — replaces solid bg-accent
        "data-[highlighted]:bg-[var(--c-contextmenu-item-hover-bg)] data-[highlighted]:text-[var(--c-contextmenu-item-hover-fg)]",
        // ── Keyboard-focus ring (focus-visible only — pointer hover does NOT add ring) ──
        "focus-visible:shadow-[var(--c-contextmenu-item-focus-ring)]",
        // ── Destructive variant ──────────────────────────────────────────────
        "data-[variant=destructive]:text-[var(--s-danger-fg)]",
        "data-[variant=destructive]:data-[highlighted]:bg-[var(--s-danger-subtle)]",
        "data-[variant=destructive]:data-[highlighted]:text-[var(--s-danger-fg)]",
        // ── SVG icon default tint (no explicit text- class → use shortcut-fg) ─
        "[&_svg:not([class*='text-'])]:text-[var(--c-contextmenu-shortcut-fg)]",
        // ── Base layout ───────────────────────────────────────────────────────
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "data-[highlighted]:bg-[var(--c-contextmenu-item-hover-bg)] data-[highlighted]:text-[var(--c-contextmenu-item-hover-fg)]",
        "focus-visible:shadow-[var(--c-contextmenu-item-focus-ring)]",
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      {/* Amber checkmark indicator (--s-brand-solid) */}
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center text-[var(--s-brand-solid)]">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "data-[highlighted]:bg-[var(--c-contextmenu-item-hover-bg)] data-[highlighted]:text-[var(--c-contextmenu-item-hover-fg)]",
        "focus-visible:shadow-[var(--c-contextmenu-item-focus-ring)]",
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {/* Amber radio dot indicator (--s-brand-solid fill) */}
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center text-[var(--s-brand-solid)]">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        // DS spec: small uppercase mono label in muted ink
        "text-[var(--c-contextmenu-label-fg)] px-2 py-1.5 text-xs font-semibold uppercase tracking-wider font-mono",
        "data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-[var(--c-contextmenu-separator)] -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        // DS spec: JetBrains Mono for all keyboard shortcut / kbd text
        "text-[var(--c-contextmenu-shortcut-fg)] ml-auto text-xs font-mono tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
