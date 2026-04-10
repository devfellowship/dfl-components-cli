/**
 * AppSidebar organism
 * Generic collapsible sidebar for DFL apps.
 * Based on João's AppSidebar (dfl-notifications) + DFL design tokens.
 * Uses the Sidebar primitive from @dfl/components.
 */
import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../sidebar";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  /** Exact match for active state. Defaults to false. */
  exact?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export interface UserInfo {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface AppSidebarProps {
  /** Navigation groups rendered in the sidebar body. */
  navGroups: NavGroup[];
  /** User info shown in the sidebar footer. Optional. */
  userInfo?: UserInfo;
  /** Logo element or image src. Defaults to DFL logomark. */
  logo?: ReactNode | string;
  /** App name shown next to logo (collapsed in icon mode). */
  appName?: string;
  /** App sub-label (e.g. "Back Office"). */
  appLabel?: string;
  /** Called when a nav item is clicked. Use for router navigation. */
  onNavigate?: (url: string) => void;
  /** Currently active URL (compared against NavItem.url). */
  activeUrl?: string;
  /** Sidebar default open state. */
  defaultOpen?: boolean;
  /** Custom footer content. Replaces user info footer if provided. */
  footer?: ReactNode;
  /** Copyright year / text shown when sidebar is expanded. */
  copyright?: string;
  children?: ReactNode;
}

const DEFAULT_LOGO = "https://devfellowship.s3.sa-east-1.amazonaws.com/media/1755889468274-DevFelloShip%2B1%2BSi%CC%81mbolo.png";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SidebarInner({
  navGroups,
  userInfo,
  logo,
  appName = "DevFellowship",
  appLabel,
  onNavigate,
  activeUrl,
  footer,
  copyright = `Dev Fellowship © ${new Date().getFullYear()}`,
}: Omit<AppSidebarProps, "defaultOpen" | "children">) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const logoEl =
    logo === undefined ? (
      <img src={DEFAULT_LOGO} alt="Logo" className="w-6 h-6 object-contain" />
    ) : typeof logo === "string" ? (
      <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
    ) : (
      logo
    );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-accent,#F39325)] shrink-0">
            {logoEl}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{appName}</span>
              {appLabel && (
                <span className="text-xs text-muted-foreground truncate">{appLabel}</span>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, gi) => (
          <SidebarGroup key={gi}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = activeUrl
                    ? item.exact
                      ? activeUrl === item.url
                      : activeUrl.startsWith(item.url)
                    : false;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <button
                          type="button"
                          onClick={() => onNavigate?.(item.url)}
                          className="flex items-center gap-2 w-full"
                        >
                          {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                          <span className="truncate">{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {footer ? (
          footer
        ) : userInfo ? (
          <div className="px-2 py-3 flex items-center gap-2">
            <Avatar className="h-7 w-7 shrink-0">
              {userInfo.avatarUrl && <AvatarImage src={userInfo.avatarUrl} alt={userInfo.name} />}
              <AvatarFallback className="text-xs">{getInitials(userInfo.name)}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium truncate">{userInfo.name}</span>
                {userInfo.email && (
                  <span className="text-xs text-muted-foreground truncate">{userInfo.email}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          !isCollapsed && (
            <div className="px-2 py-3">
              <p className="text-xs text-muted-foreground">{copyright}</p>
            </div>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * AppSidebar wraps the Sidebar primitive with SidebarProvider.
 * Renders an optional trigger button + the sidebar itself.
 * Pass `children` to render the main content area next to the sidebar.
 */
export function AppSidebar({
  defaultOpen = true,
  children,
  ...props
}: AppSidebarProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full">
        <SidebarInner {...props} />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="p-2">
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
