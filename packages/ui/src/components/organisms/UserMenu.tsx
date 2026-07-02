/**
 * UserMenu organism
 * UserAvatar trigger + dropdown menu. Fully prop-driven and
 * behavior-agnostic — the consuming app passes its own handlers/items;
 * no routing or auth logic lives here.
 *
 * Tokens consumed (Layer 3 — --c-usermenu-*):
 *   --c-usermenu-panel-bg              dropdown panel background
 *   --c-usermenu-panel-width           panel fixed width (replaces hardcoded w-52)
 *   --c-usermenu-item-hover-bg         item hover/highlighted surface (#2a2622)
 *   --c-usermenu-danger-fg             destructive item fg (--s-danger-fg, no inline fallback)
 *   --c-usermenu-danger-hover-bg       destructive item hover bg (--s-danger-subtle)
 *   --c-usermenu-item-focus-ring       DS uniform focus ring for regular items
 *   --c-usermenu-item-danger-focus-ring danger-fg ring for destructive items
 *
 * Trigger focus ring: inherited from Button variant="ghost" via
 *   --c-button-focus-gap + --c-button-focus-brand (atoms-button refactor, 2026-07-02).
 *   box-shadow: 0 0 0 2px var(--c-button-focus-gap), 0 0 0 3px var(--c-button-focus-brand).
 *   No additional trigger-level override required in UserMenu.
 */
import * as React from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { UserAvatar } from "./UserAvatar";

export interface UserMenuItem {
  /** Visible label. */
  label: string;
  /** Optional leading icon (lucide component or any node). */
  icon?: React.ReactNode;
  /** Click handler. */
  onSelect?: () => void;
  /** Render as a destructive (danger-fg) item. */
  destructive?: boolean;
  /** Insert a separator before this item. */
  separatorBefore?: boolean;
}

export interface UserMenuProps {
  /** Display name shown in the label + driving the avatar. */
  name: string;
  /** Optional email shown under the name. */
  email?: string;
  /** Avatar image URL. */
  avatarUrl?: string | null;
  /** Stable identity for the avatar hue (defaults to name). */
  colorSeed?: string;
  /** Show the name + chevron next to the avatar (default true). */
  showName?: boolean;
  /**
   * Custom menu items. When omitted, a default Profile / Settings / Sign out
   * set is rendered from the convenience handlers below.
   */
  items?: UserMenuItem[];
  /** Convenience: rendered as the "Profile" item when `items` is not given. */
  onProfile?: () => void;
  /** Convenience: rendered as the "Settings" item when `items` is not given. */
  onSettings?: () => void;
  /** Convenience: rendered as the destructive "Sign out" item. */
  onSignOut?: () => void;
  /** Dropdown alignment. Defaults to "end". */
  align?: "start" | "center" | "end";
  /**
   * Open the dropdown on mount (uncontrolled). Useful for stories / tests
   * that need to show the open panel without user interaction.
   */
  defaultOpen?: boolean;
  className?: string;
}

function buildDefaultItems({
  onProfile,
  onSettings,
  onSignOut,
}: Pick<UserMenuProps, "onProfile" | "onSettings" | "onSignOut">): UserMenuItem[] {
  const items: UserMenuItem[] = [];
  if (onProfile)
    items.push({ label: "Profile", icon: <User className="h-4 w-4" />, onSelect: onProfile });
  if (onSettings)
    items.push({ label: "Settings", icon: <Settings className="h-4 w-4" />, onSelect: onSettings });
  if (onSignOut)
    items.push({
      label: "Sign out",
      icon: <LogOut className="h-4 w-4" />,
      onSelect: onSignOut,
      destructive: true,
      separatorBefore: items.length > 0,
    });
  return items;
}

export function UserMenu({
  name,
  email,
  avatarUrl,
  colorSeed,
  showName = true,
  items,
  onProfile,
  onSettings,
  onSignOut,
  align = "end",
  defaultOpen,
  className,
}: UserMenuProps) {
  const menuItems = items ?? buildDefaultItems({ onProfile, onSettings, onSignOut });

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        {/*
         * Trigger focus ring is supplied by Button variant="ghost" via FOCUS_BRAND
         * (atoms-button refactor): focus-visible:shadow-[0_0_0_2px_var(--c-button-focus-gap),
         * 0_0_0_3px_var(--c-button-focus-brand)].
         * Token chain: --c-button-focus-gap → --s-surface-page (#0a0908 page bg gap)
         *              --c-button-focus-brand → --s-brand-solid (#E07A4A amber)
         */}
        <Button
          variant="ghost"
          className={cn("flex items-center gap-2 h-9 px-2", className)}
          aria-label={`Open menu for ${name}`}
        >
          <UserAvatar
            name={name}
            src={avatarUrl}
            colorSeed={colorSeed}
            className="h-7 w-7 text-xs"
          />
          {showName && (
            <>
              <span className="text-sm font-medium hidden sm:inline-block max-w-[140px] truncate">
                {name}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      {/*
       * Panel: override shadcn's bg-popover (--s-surface-raised #1a1714) with
       * --c-usermenu-panel-bg (--s-surface-elevated #1f1c18) per DS spec.
       * Width from --c-usermenu-panel-width (208px) replaces hardcoded w-52.
       */}
      <DropdownMenuContent
        align={align}
        className="w-[var(--c-usermenu-panel-width)] bg-[var(--c-usermenu-panel-bg)]"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{name}</p>
            {email && (
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        {menuItems.length > 0 && <DropdownMenuSeparator />}
        {menuItems.map((item, i) => (
          <React.Fragment key={`${item.label}-${i}`}>
            {item.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onSelect={() => item.onSelect?.()}
              className={cn(
                /*
                 * Override shadcn's amber `focus:bg-accent` with the DS item
                 * hover surface (#2a2622 = --c-usermenu-item-hover-bg).
                 * tailwind-merge deduplicates bg-* so this wins over the base class.
                 */
                "focus:bg-[var(--c-usermenu-item-hover-bg)] focus:text-[var(--s-ink-primary)]",
                /*
                 * DS uniform item focus ring: 2px panel-bg gap + 1px amber.
                 * (--c-usermenu-item-focus-ring = 0 0 0 2px --s-surface-elevated,
                 *  0 0 0 3px --s-border-focus)
                 */
                "focus:shadow-[var(--c-usermenu-item-focus-ring)]",
                item.destructive && [
                  /*
                   * Foreground via --c-usermenu-danger-fg → --s-danger-fg (#e89898).
                   * No inline #e89898 fallback — fallback lives in the token layer only.
                   */
                  "text-[var(--c-usermenu-danger-fg)]",
                  /*
                   * Hover/highlighted bg: --s-danger-subtle (rgba 12% red).
                   * Overrides the regular item hover bg set above.
                   */
                  "focus:bg-[var(--c-usermenu-danger-hover-bg)]",
                  /* Keep danger fg colour on focus (don't revert to ink-primary). */
                  "focus:text-[var(--c-usermenu-danger-fg)]",
                  /*
                   * Danger focus ring: 2px panel-bg gap + 1px danger-fg ring.
                   * (--c-usermenu-item-danger-focus-ring = 0 0 0 2px --s-surface-elevated,
                   *  0 0 0 3px --s-danger-fg)
                   * Overrides the amber ring set above for destructive items.
                   */
                  "focus:shadow-[var(--c-usermenu-item-danger-focus-ring)]",
                ].join(" ")
              )}
            >
              {item.icon && <span className="mr-2 inline-flex">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
