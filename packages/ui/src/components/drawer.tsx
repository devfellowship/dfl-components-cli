"use client";

/**
 * Drawer — DFL Design System v0
 *
 * Tokens consumed (Layer 3 — already defined in tokens.css):
 *   --c-dialog-bg     → --s-surface-raised (#1a1714) — elevated overlay, NOT page bg
 *   --c-dialog-border → --s-border-subtle
 *   --c-dialog-radius → --p-radius-xl (14px)
 *   --c-dialog-shadow → --p-shadow-overlay
 *   --c-dialog-scrim  → --s-surface-scrim (rgba(10,9,8,0.72))
 *
 * Focus ring (uniform DS spec, all interactive children):
 *   box-shadow: 0 0 0 2px var(--background), 0 0 0 3px #E07A4A
 *   Applied via `focus-visible:` on DrawerClose; footer buttons use Button's ring.
 *
 * Direction rounding (leading corners only, matching the spec):
 *   bottom → top corners rounded   (border-radius on tl + tr)
 *   top    → bottom corners rounded (border-radius on bl + br)
 *   right  → left corners rounded   (border-radius on tl + bl)
 *   left   → right corners rounded  (border-radius on tr + br)
 */

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "../lib/utils";

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      className={cn(
        // DS focus ring: 2px gap matching the dialog surface, then 1px amber ring
        "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--c-dialog-bg),0_0_0_3px_#E07A4A]",
        className,
      )}
      {...props}
    />
  );
}

function DrawerOverlay({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
        className,
      )}
      style={{ background: "var(--c-dialog-scrim)", ...style }}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          // Base
          "group/drawer-content fixed z-50 flex h-auto flex-col",
          // Border color driven by DS token (all directions share this)
          "border-[var(--c-dialog-border)]",
          // Bottom direction — top corners rounded
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh]",
          "data-[vaul-drawer-direction=bottom]:rounded-tl-[var(--c-dialog-radius)] data-[vaul-drawer-direction=bottom]:rounded-tr-[var(--c-dialog-radius)]",
          "data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=bottom]:border-l data-[vaul-drawer-direction=bottom]:border-r",
          // Top direction — bottom corners rounded
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh]",
          "data-[vaul-drawer-direction=top]:rounded-bl-[var(--c-dialog-radius)] data-[vaul-drawer-direction=top]:rounded-br-[var(--c-dialog-radius)]",
          "data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=top]:border-l data-[vaul-drawer-direction=top]:border-r",
          // Right direction — left corners rounded
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=right]:rounded-tl-[var(--c-dialog-radius)] data-[vaul-drawer-direction=right]:rounded-bl-[var(--c-dialog-radius)]",
          // Left direction — right corners rounded
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:rounded-tr-[var(--c-dialog-radius)] data-[vaul-drawer-direction=left]:rounded-br-[var(--c-dialog-radius)]",
          className,
        )}
        style={{
          // Critical fix: use --c-dialog-bg (--s-surface-raised, #1a1714) so the
          // panel is VISIBLE against the page (#0a0908). bg-background was wrong.
          background: "var(--c-dialog-bg)",
          boxShadow: "var(--c-dialog-shadow)",
          ...style,
        }}
        {...props}
      >
        {/* Drag handle — visible only for bottom direction via group variant */}
        <div
          className={cn(
            "mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full",
            "bg-[var(--s-border-strong)]",
            "group-data-[vaul-drawer-direction=bottom]/drawer-content:block",
          )}
        />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1.5 p-4",
        "border-b border-[var(--c-dialog-border)]",
        className,
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 p-4",
        "border-t border-[var(--c-dialog-border)]",
        className,
      )}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "text-[var(--s-ink-primary)] font-semibold text-[var(--p-text-15)] leading-snug",
        className,
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "text-[var(--s-ink-muted)] text-[var(--p-text-13)] leading-normal",
        className,
      )}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
