"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        // Surface: --c-command-bg (#1a1714, surface-raised) with subtle border + shadow
        // Replaces: bg-popover (via compat alias, but now intentional via --c-command-*)
        "bg-[--c-command-bg] text-[--c-command-item-fg]",
        "flex h-full w-full flex-col overflow-hidden",
        "rounded-[--c-command-radius] border border-[--c-command-border]",
        "shadow-[--c-command-shadow]",
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      // Amber bottom border animates in on focus (focus-within targets the inner input).
      // Search icon brightens to amber on focus.
      className={cn(
        "flex h-12 items-center gap-2 border-b border-[--c-command-input-sep] px-3",
        "transition-colors duration-[--p-duration-fast]",
        "focus-within:border-[--c-command-focus-color]",
        "[&>svg]:text-[--c-command-group-fg] [&>svg]:opacity-70",
        "focus-within:[&>svg]:text-[--c-command-focus-color] focus-within:[&>svg]:opacity-100",
      )}
    >
      <SearchIcon className="size-4 shrink-0 transition-colors duration-[--p-duration-fast]" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          // Fix: replaces `outline-hidden` (silenced focus ring) with the uniform
          // DFL focus ring: box-shadow 0 0 0 2px bg-layer, 0 0 0 3px amber.
          "placeholder:text-[--c-command-group-fg]",
          "flex h-10 w-full rounded-sm bg-transparent py-3 text-sm",
          "text-[--c-command-item-fg]",
          "outline-none",
          "focus-visible:shadow-[0_0_0_2px_var(--c-command-bg),0_0_0_3px_var(--c-command-focus-color)]",
          "transition-shadow duration-[--p-duration-fast]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto p-1",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      // --c-command-empty-fg → --s-ink-muted; centered per spec
      className="py-6 text-center text-sm text-[--c-command-empty-fg]"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        // Group heading: --c-command-group-fg (--s-ink-muted)
        "overflow-hidden p-1 text-[--c-command-item-fg]",
        "[&_[cmdk-group-heading]]:text-[--c-command-group-fg]",
        "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5",
        "[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        "[&_[cmdk-group-heading]]:tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-[--c-command-sep] -mx-1 h-px", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        // Base layout
        "relative flex cursor-default select-none items-center gap-2",
        "rounded-[--p-radius-md] px-2 py-1.5 text-sm outline-none",
        // Base colours
        "text-[--c-command-item-fg]",
        // 2px left-border slot (transparent at rest; amber on hover/selected)
        "border-l-2 border-l-transparent",
        "transition-[background,color,border-color] duration-[--p-duration-instant]",
        // Icons: muted at rest, secondary on hover/selected
        "[&_svg:not([class*='text-'])]:text-[--c-command-group-fg]",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-[15px]",
        // Hover state: elevated bg (#1f1c18) + amber left indicator
        // Fix: was `data-[selected=true]:bg-accent` → amber CTA; now surface-elevated
        "hover:bg-[--c-command-item-hover-bg] hover:text-[--c-command-item-hover-fg]",
        "hover:border-l-[--c-command-item-sel-bar]",
        "hover:[&_svg:not([class*='text-'])]:text-[--c-command-item-icon-hover-fg]",
        // Keyboard-selected state (cmdk data attribute)
        "data-[selected=true]:bg-[--c-command-item-hover-bg]",
        "data-[selected=true]:text-[--c-command-item-hover-fg]",
        "data-[selected=true]:border-l-[--c-command-item-sel-bar]",
        "data-[selected=true]:[&_svg:not([class*='text-'])]:text-[--c-command-item-icon-hover-fg]",
        // Disabled: 0.38 opacity per DS convention (was 0.50)
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-[0.38]",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        // Fix: was `tracking-widest` with inherited Inter font.
        // Now uses --s-font-mono (JetBrains Mono) per DS spec for kbd/code strings.
        "ml-auto font-[--s-font-mono] text-[11px] tracking-[0.06em]",
        "text-[--c-command-shortcut-fg] opacity-75",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
