/**
 * AppNavbar organism
 * Top navigation bar with optional left slot (e.g. SidebarTrigger), breadcrumb,
 * user menu, and theme toggle. Works standalone — no router dependency.
 *
 * DS v0 tokens consumed (Layer 3 → Layer 2):
 *   --c-navbar-bg        → --s-surface-panel  (#141210 — elevated panel, NOT page flush)
 *   --c-navbar-border    → --s-border-subtle
 *   --c-navbar-h         → 56px               (same as --c-header-h)
 *   --c-navbar-px        → --p-space-4
 *   --c-navbar-breadcrumb-fg         → --s-ink-muted
 *   --c-navbar-breadcrumb-fg-current → --s-ink-primary
 *
 * leftSlot: embed a SidebarTrigger here so the sidebar toggle lives in the unified
 * 56px topbar rather than in a separate 48px strip (which would create 104px of dead
 * chrome). Pass <SidebarTrigger /> as leftSlot in the AppShell template.
 *
 * Focus ring: all interactive elements carry `.ds-focus-ring` (outline form, from
 * tokens.css) or `.c-appshell-focus` (box-shadow form, preferred in AppShell context).
 * The button's built-in `focus-visible:ring-*` is zeroed so only the DS ring shows.
 *
 * Sign-out item: uses --s-danger-fg / --s-danger-subtle directly — never
 * the raw `text-destructive` shadcn alias which breaks if compat mapping drifts.
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
import { cn } from "../../lib/utils";

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
  /**
   * Current theme — controls the toggle icon only (Moon ↔ Sun).
   * The navbar surface is ALWAYS --c-navbar-bg (--s-surface-page, #0a0908),
   * dark-first regardless of this prop. "light" mode is editorial-only in DFL DS v0.
   * Default is "dark" (dark-first per DFL DS v0).
   */
  theme?: "light" | "dark";
  /** Called when user clicks the theme toggle button. */
  onThemeToggle?: () => void;
  /** Called when user clicks Profile menu item. */
  onProfileClick?: () => void;
  /** Called when user clicks Settings menu item. */
  onSettingsClick?: () => void;
  /** Called when user clicks Sign Out menu item. */
  onSignOut?: () => void;
  /** Extra action elements rendered to the right of breadcrumbs (8px gap). */
  actions?: ReactNode;
  /**
   * Optional slot rendered to the LEFT of the breadcrumb row.
   * Embed a `<SidebarTrigger />` here so the sidebar toggle lives inside the
   * unified 56px topbar, replacing the redundant 48px trigger strip above it.
   */
  leftSlot?: ReactNode;
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
  theme = "dark",
  onThemeToggle,
  onProfileClick,
  onSettingsClick,
  onSignOut,
  actions,
  leftSlot,
  className,
}: AppNavbarProps) {
  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        // Component tokens (Layer 3) — change appearance here by overriding --c-navbar-* vars
        "h-[var(--c-navbar-h)] flex items-center justify-between",
        "px-[var(--c-navbar-px)] border-b border-[var(--c-navbar-border)]",
        "bg-[var(--c-navbar-bg)] shrink-0",
        className,
      )}
    >
      {/* Left: optional slot (SidebarTrigger, etc.) + Breadcrumbs + actions slot */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {leftSlot && (
          <div className="flex items-center shrink-0">{leftSlot}</div>
        )}
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage
                          className="text-[var(--c-navbar-breadcrumb-fg-current)] font-medium"
                        >
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href ?? "#"}
                          className={cn(
                            // breadcrumb ink from component tokens
                            "text-[var(--c-navbar-breadcrumb-fg)]",
                            "hover:text-[var(--c-navbar-breadcrumb-fg-current)] transition-colors",
                            // uniform DS focus ring — overrides any default outline
                            "ds-focus-ring rounded-sm",
                          )}
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
        {/* actions slot — 8px gap after breadcrumbs per DS spec */}
        {actions && (
          <div className="flex items-center gap-[var(--c-navbar-action-gap)] ml-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Right: Theme toggle + User menu */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Theme toggle — icon-sm ghost button with DS uniform focus ring */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
          className={cn(
            "text-[var(--s-ink-secondary)] hover:text-[var(--s-ink-primary)]",
            // zero out the Button's built-in brand-ring; ds-focus-ring provides the uniform amber ring
            "focus-visible:ring-0",
            "ds-focus-ring",
          )}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* User menu */}
        {userInfo && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 h-8 px-2",
                  // zero out the Button's built-in brand-ring; ds-focus-ring provides the uniform amber ring
                  "focus-visible:ring-0",
                  "ds-focus-ring",
                )}
              >
                <Avatar className="h-7 w-7 bg-[var(--s-surface-elevated)]">
                  {userInfo.avatarUrl && (
                    <AvatarImage src={userInfo.avatarUrl} alt={userInfo.name} />
                  )}
                  <AvatarFallback className="text-xs text-[var(--s-ink-secondary)]">
                    {getInitials(userInfo.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
                  {userInfo.name}
                </span>
                <ChevronDown className="h-3 w-3 text-[var(--s-ink-muted)]" />
              </Button>
            </DropdownMenuTrigger>

            {/* Dropdown panel — raised surface, strong border per DS spec */}
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[var(--s-surface-raised)] border-[var(--s-border-strong)]"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-[var(--s-ink-primary)]">{userInfo.name}</p>
                  {userInfo.email && (
                    <p className="text-xs text-[var(--s-ink-muted)] truncate">{userInfo.email}</p>
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
                /* Sign-out: semantic danger tokens, never raw text-destructive alias */
                <DropdownMenuItem
                  onClick={onSignOut}
                  className={cn(
                    "text-[var(--s-danger-fg)]",
                    "focus:bg-[var(--s-danger-subtle)] focus:text-[var(--s-danger-fg)]",
                  )}
                >
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
