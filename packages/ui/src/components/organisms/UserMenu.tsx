/**
 * UserMenu organism
 * UserAvatar trigger + dropdown menu. Fully prop-driven and
 * behavior-agnostic — the consuming app passes its own handlers/items;
 * no routing or auth logic lives here.
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
  className,
}: UserMenuProps) {
  const menuItems = items ?? buildDefaultItems({ onProfile, onSettings, onSignOut });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      <DropdownMenuContent align={align} className="w-52">
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
                item.destructive &&
                  "text-[var(--s-danger-fg,#e89898)] focus:text-[var(--s-danger-fg,#e89898)]",
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
