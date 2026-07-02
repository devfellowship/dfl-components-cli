/**
 * DropdownMenu — DFL Design System v0
 *
 * Tokens consumed (Layer 3 — all defined in tokens.css):
 *   --c-dropdownmenu-bg               popover surface (--s-surface-raised, #1a1714)
 *   --c-dropdownmenu-border           panel border (--s-border-subtle, #2a2622)
 *   --c-dropdownmenu-radius           panel corner radius (--p-radius-md, 6px)
 *   --c-dropdownmenu-item-radius      item corner radius (--p-radius-sm, 4px)
 *   --c-dropdownmenu-shadow           panel drop-shadow (multi-layer)
 *   --c-dropdownmenu-item-fg          default item text (--s-ink-secondary, #e8e0d0)
 *   --c-dropdownmenu-item-bg-hover    item hover/highlight bg (--s-surface-elevated, #1f1c18)
 *   --c-dropdownmenu-item-fg-hover    item hover/highlight text (--s-ink-primary, #f6f1e7)
 *   --c-dropdownmenu-label-fg         section-label colour (--s-ink-muted, #7d7568)
 *   --c-dropdownmenu-separator        separator hairline (--s-border-subtle, #2a2622)
 *   --c-dropdownmenu-shortcut-fg      shortcut key colour (--s-ink-muted, #7d7568)
 *   --c-dropdownmenu-check-color      checkbox checkmark (--s-brand-solid, #E07A4A)
 *   --c-dropdownmenu-destructive-fg   danger item text (--s-danger-fg, #e89898)
 *   --c-dropdownmenu-destructive-bghov danger item hover bg (--s-danger-subtle)
 *   --c-dropdownmenu-focus-ring       uniform DS ring: 2px bg-gap + 1px amber
 *
 * Brand fixes vs vanilla shadcn:
 *   - Focus ring: replaced amber bg-flood (focus:bg-accent) with uniform DS ring.
 *     data-[highlighted] drives the bg/text shift for BOTH pointer and keyboard;
 *     focus-visible:shadow-[...] drives the amber ring for keyboard ONLY.
 *   - Separator: was bg-muted (#1a1714 == popover bg, zero contrast, invisible).
 *     Now bg-[var(--c-dropdownmenu-separator)] (#2a2622, visible hairline).
 *   - Label: was full ink-secondary (no visual hierarchy vs item text).
 *     Now --c-dropdownmenu-label-fg (muted) + uppercase + tight tracking.
 *   - Shortcut: added [font-family:var(--p-font-mono)] (JetBrains Mono per brand spec).
 *     Removed opacity-60 — muted ink colour meets contrast floor without it.
 */

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "../lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2",
      "rounded-[var(--c-dropdownmenu-item-radius)] px-2 py-1.5 text-sm",
      "text-[var(--c-dropdownmenu-item-fg)] outline-none",
      "transition-[background-color,color,box-shadow] duration-100",
      // Highlight: both pointer-hover and keyboard shift bg+text via data-[highlighted]
      "data-[highlighted]:bg-[var(--c-dropdownmenu-item-bg-hover)]",
      "data-[highlighted]:text-[var(--c-dropdownmenu-item-fg-hover)]",
      // Sub-menu open: same surface as highlighted
      "data-[state=open]:bg-[var(--c-dropdownmenu-item-bg-hover)]",
      "data-[state=open]:text-[var(--c-dropdownmenu-item-fg-hover)]",
      // Keyboard-only ring (focus-visible): amber ring, NOT shown on pointer hover
      "focus-visible:shadow-[var(--c-dropdownmenu-focus-ring)]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden",
      "rounded-[var(--c-dropdownmenu-radius)] border border-[var(--c-dropdownmenu-border)]",
      "bg-[var(--c-dropdownmenu-bg)] text-[var(--c-dropdownmenu-item-fg)]",
      "p-1 shadow-[var(--c-dropdownmenu-shadow)]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden",
        "rounded-[var(--c-dropdownmenu-radius)] border border-[var(--c-dropdownmenu-border)]",
        "bg-[var(--c-dropdownmenu-bg)] text-[var(--c-dropdownmenu-item-fg)]",
        "p-1 shadow-[var(--c-dropdownmenu-shadow)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2",
      "rounded-[var(--c-dropdownmenu-item-radius)] px-2 py-1.5 text-sm",
      "text-[var(--c-dropdownmenu-item-fg)] outline-none",
      "transition-[background-color,color,box-shadow] duration-100",
      // Highlight: both pointer-hover and keyboard shift bg+text via data-[highlighted]
      "data-[highlighted]:bg-[var(--c-dropdownmenu-item-bg-hover)]",
      "data-[highlighted]:text-[var(--c-dropdownmenu-item-fg-hover)]",
      // Keyboard-only ring (focus-visible): amber ring, NOT shown on pointer hover
      "focus-visible:shadow-[var(--c-dropdownmenu-focus-ring)]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center",
      "rounded-[var(--c-dropdownmenu-item-radius)] py-1.5 pl-8 pr-2 text-sm",
      "text-[var(--c-dropdownmenu-item-fg)] outline-none",
      "transition-[background-color,color,box-shadow] duration-100",
      "data-[highlighted]:bg-[var(--c-dropdownmenu-item-bg-hover)]",
      "data-[highlighted]:text-[var(--c-dropdownmenu-item-fg-hover)]",
      "focus-visible:shadow-[var(--c-dropdownmenu-focus-ring)]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        {/* Amber checkmark via --c-dropdownmenu-check-color → --s-brand-solid (#E07A4A) */}
        <Check className="h-4 w-4 text-[var(--c-dropdownmenu-check-color)]" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center",
      "rounded-[var(--c-dropdownmenu-item-radius)] py-1.5 pl-8 pr-2 text-sm",
      "text-[var(--c-dropdownmenu-item-fg)] outline-none",
      "transition-[background-color,color,box-shadow] duration-100",
      "data-[highlighted]:bg-[var(--c-dropdownmenu-item-bg-hover)]",
      "data-[highlighted]:text-[var(--c-dropdownmenu-item-fg-hover)]",
      "focus-visible:shadow-[var(--c-dropdownmenu-focus-ring)]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current text-[var(--c-dropdownmenu-check-color)]" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      // Muted colour + uppercase + tight tracking = visual hierarchy vs item text
      // Fix: was text-sm font-semibold inheriting full ink-secondary (same as items)
      "px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.8px]",
      "text-[var(--c-dropdownmenu-label-fg)]",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    // Fix: was bg-muted which resolves to --s-surface-raised (#1a1714) = same as
    // popover bg = zero contrast = separator invisible at runtime.
    // Now uses --c-dropdownmenu-separator → --s-border-subtle (#2a2622) — visible.
    className={cn("-mx-1 my-1 h-px bg-[var(--c-dropdownmenu-separator)]", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest",
        // JetBrains Mono per brand spec — shortcut keys (⌘E, ⌘D, ⌘⌫) render in mono
        "[font-family:var(--p-font-mono)]",
        // Muted ink — accessible without opacity hack (was opacity-60 → too dim)
        "text-[var(--c-dropdownmenu-shortcut-fg)]",
        className,
      )}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
