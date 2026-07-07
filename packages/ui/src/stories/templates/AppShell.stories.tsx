/**
 * Templates/AppShell — page-level composition, NOT a new component.
 *
 * Assembles the exported organisms `AppSidebar` (left rail, collapsible) +
 * `AppNavbar` (top breadcrumb/user bar) around a `<main>` content slot.
 * The SidebarTrigger lives in the AppNavbar `leftSlot` — one unified 56px topbar
 * per the DS `--c-header-h` token (no separate 48px trigger strip stacked above).
 *
 * DS fixes reflected here:
 *   1. Unified 56px topbar — SidebarTrigger in AppNavbar leftSlot, h-12 strip removed.
 *   2. Navbar bg = --c-navbar-bg → --s-surface-panel (#141210), visibly elevated.
 *   3. Active nav = DS amber trio (--c-appshell-nav-active-bg/fg/border).
 *   4. theme="dark" — dark-first; Sun icon renders correctly (switch to light).
 *   5. DS uniform focus ring (box-shadow 0 0 0 2px #0a0908, 0 0 0 3px #E07A4A).
 *
 * One story per state (CLAUDE.md non-negotiable rule).
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BookOpen, CreditCard, FileText, Home, LogOut, Settings, Users } from "lucide-react";
import { AppNavbar } from "../../components/organisms/AppNavbar";
import { AppSidebar } from "../../components/organisms/AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Button } from "../../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/card";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/sidebar";

const meta: Meta = {
  title: "Templates/AppShell",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

// ── Shared fixtures ────────────────────────────────────────────────────────────

const navGroups = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
      { title: "Cursos", url: "/courses", icon: BookOpen },
      { title: "Pagamentos", url: "/payments", icon: CreditCard },
      { title: "Documentos", url: "/documents", icon: FileText },
    ],
  },
  {
    label: "Administração",
    items: [
      { title: "Usuários", url: "/users", icon: Users },
      { title: "Configurações", url: "/settings", icon: Settings },
    ],
  },
];

const userInfo = {
  name: "João Silva",
  email: "joao@devfellowship.com",
  avatarUrl: "https://github.com/shadcn.png",
};

const breadcrumbs = [
  { label: "Dashboard", href: "/" },
  { label: "Cursos", href: "/courses" },
  { label: "React Avançado" },
];

// ── Shared page body ───────────────────────────────────────────────────────────

function PageBody() {
  return (
    <main
      style={{
        flex: 1,
        padding: "24px",
        background: "var(--background)",
        color: "var(--foreground)",
        overflow: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>React Avançado</h1>
          <p style={{ color: "var(--muted-foreground)", margin: "4px 0 0" }}>
            8 aulas · 3h20 · 42 fellows matriculados
          </p>
        </div>
        <Button size="sm">Nova Aula</Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {["Hooks avançados", "Context & Providers", "Performance", "Server Components"].map((t) => (
          <Card key={t}>
            <CardHeader>
              <CardTitle style={{ fontSize: 15 }}>{t}</CardTitle>
              <CardDescription>Aula · 25 min</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0 }}>
                Conteúdo com exemplos práticos.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

// ── Story 1 — Default (expanded, amber active, unified 56px topbar, theme=dark) ──

/**
 * Custom sidebar footer for the Default story: reproduces the AppSidebar user
 * block (avatar + name + email) and adds a full-width Logout button below it,
 * via the `footer` prop (which replaces the built-in user footer).
 */
function UserFooterWithLogout() {
  return (
    <div className="px-2 py-3 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage src={userInfo.avatarUrl} alt={userInfo.name} />
          <AvatarFallback className="text-[10px] font-bold text-[var(--s-brand-fg)]">JS</AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span className="text-[12px] font-medium truncate">{userInfo.name}</span>
          <span className="text-[11px] font-mono text-muted-foreground truncate">{userInfo.email}</span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full">
        <LogOut className="h-4 w-4 shrink-0" />
        Logout
      </Button>
    </div>
  );
}

/**
 * Default — sidebar expanded.
 *
 * - SidebarTrigger in AppNavbar leftSlot: single unified 56px topbar (no stacked strip).
 * - Active nav item (Cursos) uses DS amber trio: brand-subtle bg + brand-solid text + brand-border.
 * - theme="dark" (dark-first default): Sun icon renders, implying "switch to light".
 * - DS uniform focus ring (box-shadow, clip-safe) on all interactive elements.
 * - Custom `footer`: user info + Logout button below the e-mail.
 */
export const Default: Story = {
  render: () => (
    <AppSidebar
      navGroups={navGroups}
      userInfo={userInfo}
      appName="DevFellowship"
      appLabel="Plataforma"
      activeUrl="/courses"
      defaultOpen
      footer={<UserFooterWithLogout />}
    >
      <AppNavbar
        breadcrumbs={breadcrumbs}
        userInfo={userInfo}
        theme="dark"
        leftSlot={<SidebarTrigger />}
      />
      <PageBody />
    </AppSidebar>
  ),
};

// ── Story 2 — Collapsed (56px icon rail, same unified topbar, active icon amber) ──

/**
 * Collapsed — sidebar icon rail (56px).
 *
 * - Same unified topbar with SidebarTrigger in leftSlot.
 * - Active icon (Cursos) shows amber trio even in collapsed state.
 * - Tooltip on hover of non-active items (built-in SidebarMenuButton behavior).
 */
export const Collapsed: Story = {
  render: () => (
    <AppSidebar
      navGroups={navGroups}
      userInfo={userInfo}
      appName="DevFellowship"
      appLabel="Plataforma"
      activeUrl="/courses"
      defaultOpen={false}
    >
      <AppNavbar
        breadcrumbs={breadcrumbs}
        userInfo={userInfo}
        theme="dark"
        leftSlot={<SidebarTrigger />}
      />
      <PageBody />
    </AppSidebar>
  ),
};

// ── Isolated NavItem stories (wrap in SidebarProvider + Sidebar for context) ──

/**
 * Small wrapper that provides sidebar context for isolated SidebarMenuButton stories.
 * Renders as a minimal panel without the full AppShell chrome.
 */
function NavItemFrame({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen style={{ minHeight: "auto" }}>
      <Sidebar
        collapsible="none"
        style={{
          width: 220,
          minHeight: "auto",
          height: "auto",
          background: "var(--s-surface-page)",
          border: "1px solid var(--s-border-subtle)",
          borderRadius: 10,
          padding: "8px",
        }}
      >
        <SidebarContent>
          <SidebarMenu>{children}</SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

// ── Story 3 — NavItem/Default ────────────────────────────────────────────────

/**
 * NavItem/Default — SidebarMenuButton at rest.
 * Muted text, transparent background, no border. The DS baseline state.
 */
export const NavItemDefault: Story = {
  name: "NavItem/Default",
  parameters: { layout: "centered" },
  render: () => (
    <NavItemFrame>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={false}>
          <Home className="h-4 w-4 shrink-0" />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </NavItemFrame>
  ),
};

// ── Story 4 — NavItem/Hover ──────────────────────────────────────────────────

/**
 * NavItem/Hover — SidebarMenuButton hover state.
 * Surface raised (#1a1714) background + primary ink text (--s-ink-primary).
 * Simulated with inline style since pseudo-states addon is not installed.
 */
export const NavItemHover: Story = {
  name: "NavItem/Hover",
  parameters: { layout: "centered" },
  render: () => (
    <NavItemFrame>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={false}
          style={{
            background: "var(--c-appshell-nav-hover-bg)",
            color: "var(--c-appshell-nav-hover-fg)",
          }}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </NavItemFrame>
  ),
};

// ── Story 5 — NavItem/Active ─────────────────────────────────────────────────

/**
 * NavItem/Active — SidebarMenuButton active (current page) state.
 * DS amber trio: --c-appshell-nav-active-bg (10% amber) + --c-appshell-nav-active-fg
 * (#E07A4A text) + --c-appshell-nav-active-border (22% amber border).
 * Overrides the shadcn default (bg-sidebar-accent = raised surface = visually
 * identical to hover).
 */
export const NavItemActive: Story = {
  name: "NavItem/Active",
  parameters: { layout: "centered" },
  render: () => (
    <NavItemFrame>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive
          style={{
            background: "var(--c-appshell-nav-active-bg)",
            color: "var(--c-appshell-nav-active-fg)",
            border: "1px solid var(--c-appshell-nav-active-border)",
          }}
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          <span>Cursos</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </NavItemFrame>
  ),
};

// ── Story 6 — NavItem/Focus ──────────────────────────────────────────────────

/**
 * NavItem/Focus — SidebarMenuButton focus-visible state.
 * DS uniform focus ring: box-shadow 0 0 0 2px #0a0908 (bg gap) + 0 0 0 3px #E07A4A
 * (amber ring). Uses box-shadow so it isn't clipped by sidebar overflow:hidden.
 * No outline — the `.c-appshell-focus` class zeroes the default outline.
 * Simulated with inline style since pseudo-states addon is not installed.
 */
export const NavItemFocus: Story = {
  name: "NavItem/Focus",
  parameters: { layout: "centered" },
  render: () => (
    <NavItemFrame>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={false}
          className="c-appshell-focus"
          style={{
            outline: "none",
            boxShadow: "var(--c-appshell-focus-ring)",
          }}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </NavItemFrame>
  ),
};
