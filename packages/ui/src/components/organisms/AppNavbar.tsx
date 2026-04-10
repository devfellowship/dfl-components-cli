/**
 * AppNavbar organism
 * Top navigation bar with breadcrumb, user menu, and theme toggle.
 * Works standalone — no router dependency.
 */
import React, { ReactNode } from "react";
import { Sun, Moon, ChevronDown, LogOut, User, Settings } from "lucide-react";

import { Button } from "../button";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../breadcrumb";

export interface BreadcrumbEntry {
  label: string;
  /** URL for the breadcrumb link. Omit for the current (last) page. */
  href?: string;
}

export interface NavbarUserInfo {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface AppNavbarProps {
  /** Ordered list of breadcrumb entries. Last entry is treated as current page. */
  breadcrumbs?: BreadcrumbEntry[];
  /** User info for the avatar menu. */
  userInfo?: NavbarUserInfo;
  /** Current theme. Toggles between "light" and "dark". */
  theme?: "light" | "dark";
  /** Called when user clicks the theme toggle button. */
  onThemeToggle?: () => void;
  /** Called when user clicks Profile menu item. */
  onProfileClick?: () => void;
  /** Called when user clicks Settings menu item. */
  onSettingsClick?: () => void;
  /** Called when user clicks Sign Out menu item. */
  onSignOut?: () => void;
  /** Extra action buttons rendered to the right of breadcrumbs. */
  actions?: ReactNode;
  /** Custom CSS class for the navbar wrapper. */
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppNavbar({
  breadcrumbs = [],
  userInfo,
  theme = "light",
  onThemeToggle,
  onProfileClick,
  onSettingsClick,
  onSignOut,
  actions,
  className,
}: AppNavbarProps) {
  const isDark = theme === "dark";

  return (
    <header
      className={[
        "h-14 flex items-center justify-between px-4 border-b border-border bg-background shrink-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href ?? "#"}
                          className="hover:text-foreground transition-colors"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        {actions && <div className="flex items-center gap-2 ml-2">{actions}</div>}
      </div>

      {/* Right: Theme toggle + User menu */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
          className="h-8 w-8"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* User menu */}
        {userInfo && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-8 px-2">
                <Avatar className="h-7 w-7">
                  {userInfo.avatarUrl && (
                    <AvatarImage src={userInfo.avatarUrl} alt={userInfo.name} />
                  )}
                  <AvatarFallback className="text-xs">
                    {getInitials(userInfo.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
                  {userInfo.name}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userInfo.name}</p>
                  {userInfo.email && (
                    <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {onProfileClick && (
                <DropdownMenuItem onClick={onProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              )}
              {onSettingsClick && (
                <DropdownMenuItem onClick={onSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              )}
              {(onProfileClick || onSettingsClick) && onSignOut && <DropdownMenuSeparator />}
              {onSignOut && (
                <DropdownMenuItem onClick={onSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
