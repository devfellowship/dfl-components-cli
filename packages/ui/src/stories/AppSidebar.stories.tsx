/**
 * AppSidebar stories — one story per state (DS Storybook rule).
 *
 * Story map:
 *   Default        — full app shell, expanded, first route active, user footer
 *   Collapsed      — icon-only, tooltip visible on active item, avatar-only footer
 *   NavItemActive  — single item in active/selected state (brand-subtle bg, amber-fg, 3px border)
 *   NavItemHover   — single item in hover state (surface-raised bg, ink-primary text)
 *   NavItemFocus   — single item in keyboard-focus state (DS uniform 2px-gap+1px-amber ring)
 *   NoUser         — expanded, no userInfo prop, copyright fallback at 11px ink-muted
 */
import type { Meta, StoryObj } from "@storybook/react";
import {
  BookOpen,
  CreditCard,
  FileText,
  Home,
  Settings,
  Users,
} from "lucide-react";

import { AppSidebar } from "../components/organisms/AppSidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../components/sidebar";

const meta: Meta<typeof AppSidebar> = {
  title: "Components/Organisms/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AppSidebar>;

/* ─── Shared fixtures ─────────────────────────────────────────────────── */

const navGroups = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", url: "/", icon: Home, exact: true },
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

/* ─── Story 1: Default ────────────────────────────────────────────────── */
/**
 * Expanded sidebar with defaultOpen=true, active item on first route ("/"),
 * and a user footer. Validates: header brand, group labels, default item
 * styles, active-state DS tokens, and the user avatar + email.
 */
export const Default: Story = {
  args: {
    navGroups,
    userInfo,
    appName: "DevFellowship",
    appLabel: "Plataforma",
    activeUrl: "/",
    defaultOpen: true,
  },
  render: (args) => (
    <div style={{ height: "100vh", display: "flex" }}>
      <AppSidebar {...args}>
        <main style={{ flex: 1, padding: "24px" }}>
          <h1 style={{ color: "var(--foreground)", marginBottom: "8px" }}>
            Conteúdo Principal
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
            O AppSidebar aparece à esquerda. O item Dashboard está ativo.
          </p>
        </main>
      </AppSidebar>
    </div>
  ),
};

/* ─── Story 2: Collapsed ──────────────────────────────────────────────── */
/**
 * Icon-only collapsed mode (defaultOpen=false). Active item ("Cursos") shows
 * the amber-subtle bg + left border indicator even in icon mode. Tooltip with
 * the item label appears on hover. Footer shows avatar only (no name/email).
 */
export const Collapsed: Story = {
  args: {
    navGroups,
    userInfo,
    appName: "DevFellowship",
    activeUrl: "/courses",
    defaultOpen: false,
  },
  render: (args) => (
    <div style={{ height: "100vh", display: "flex" }}>
      <AppSidebar {...args}>
        <main style={{ flex: 1, padding: "24px" }}>
          <h1 style={{ color: "var(--foreground)", marginBottom: "8px" }}>
            Sidebar Recolhida
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
            Apenas ícones visíveis. Tooltip revela o label no hover. Avatar
            permanece no footer; nome e email ficam ocultos.
          </p>
        </main>
      </AppSidebar>
    </div>
  ),
};

/* ─── Story 3: NavItemActive ──────────────────────────────────────────── */
/**
 * Isolated nav item in the ACTIVE / SELECTED state.
 * Validates: --c-appsidebar-item-active-bg (brand-subtle rgba tint),
 * --c-appsidebar-item-active-fg (amber-300 text),
 * and the 3px --c-appsidebar-item-active-border left indicator.
 */
export const NavItemActive: Story = {
  render: () => (
    <SidebarProvider
      defaultOpen
      style={
        { "--sidebar-background": "var(--c-appsidebar-bg)" } as React.CSSProperties
      }
    >
      <div style={{ display: "flex", width: "100%", padding: "32px" }}>
        <Sidebar collapsible="none" style={{ width: "240px", flexShrink: 0 }}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Active item — amber-subtle bg + amber-fg text + 3px left border */}
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* Default item — for contrast reference */}
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BookOpen className="h-4 w-4" />
                      <span>Cursos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div style={{ padding: "0 24px" }}>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "4px" }}>
            <strong style={{ color: "var(--foreground)" }}>Active state</strong>
          </p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>
            bg: --c-appsidebar-item-active-bg (brand-subtle)
            <br />
            text: --c-appsidebar-item-active-fg (amber-300)
            <br />
            border-left: 3px --c-appsidebar-item-active-border (amber-500)
          </p>
        </div>
      </div>
    </SidebarProvider>
  ),
};

/* ─── Story 4: NavItemHover ───────────────────────────────────────────── */
/**
 * Isolated nav item rendered in the HOVER visual state.
 * Uses className overrides to force the hover appearance so the state is
 * visible in the Storybook canvas without requiring a mouse-over interaction.
 * Validates: bg-sidebar-accent → --s-surface-raised (#2a2622), ink-primary text —
 * DISTINCT from the active state (no amber tint, no left border).
 */
export const NavItemHover: Story = {
  render: () => (
    <SidebarProvider
      defaultOpen
      style={
        { "--sidebar-background": "var(--c-appsidebar-bg)" } as React.CSSProperties
      }
    >
      <div style={{ display: "flex", width: "100%", padding: "32px" }}>
        <Sidebar collapsible="none" style={{ width: "240px", flexShrink: 0 }}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Force hover appearance via className — bg-sidebar-accent + accent-foreground */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Pagamentos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* Default for contrast */}
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText className="h-4 w-4" />
                      <span>Documentos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div style={{ padding: "0 24px" }}>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "4px" }}>
            <strong style={{ color: "var(--foreground)" }}>Hover state</strong>
          </p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>
            bg: --s-surface-raised (#2a2622)
            <br />
            text: --s-ink-primary (#f6f1e7)
            <br />
            No amber tint, no left border — distinct from Active
          </p>
        </div>
      </div>
    </SidebarProvider>
  ),
};

/* ─── Story 5: NavItemFocus ───────────────────────────────────────────── */
/**
 * Isolated nav item rendered in the KEYBOARD-FOCUS visual state.
 * Uses className overrides to force the DS uniform focus ring
 * (2px --s-surface-panel gap + 1px --s-brand-solid amber outline).
 * No background change — only the ring is applied.
 */
export const NavItemFocus: Story = {
  render: () => (
    <SidebarProvider
      defaultOpen
      style={
        { "--sidebar-background": "var(--c-appsidebar-bg)" } as React.CSSProperties
      }
    >
      <div style={{ display: "flex", width: "100%", padding: "32px" }}>
        <Sidebar collapsible="none" style={{ width: "240px", flexShrink: 0 }}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Force focus-ring appearance via className */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="[box-shadow:0_0_0_2px_var(--c-appsidebar-focus-ring-gap),0_0_0_3px_var(--c-appsidebar-focus-ring-color)] text-sidebar-foreground"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Documentos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* Default for contrast */}
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="h-4 w-4" />
                      <span>Usuários</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div style={{ padding: "0 24px" }}>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "4px" }}>
            <strong style={{ color: "var(--foreground)" }}>Keyboard-focus state</strong>
          </p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>
            ring: 0 0 0 2px --c-appsidebar-focus-ring-gap
            <br />
            {"      "}+ 0 0 0 3px --c-appsidebar-focus-ring-color
            <br />
            (2px panel-bg gap + 1px amber)
          </p>
        </div>
      </div>
    </SidebarProvider>
  ),
};

/* ─── Story 6: NoUser ─────────────────────────────────────────────────── */
/**
 * Expanded sidebar with no userInfo prop. Footer shows the copyright
 * fallback text at 11px ink-muted. Validates the conditional footer branch.
 */
export const NoUser: Story = {
  args: {
    navGroups,
    appName: "DevFellowship",
    appLabel: "Plataforma",
    activeUrl: "/",
    defaultOpen: true,
    copyright: `Dev Fellowship © ${new Date().getFullYear()}`,
  },
  render: (args) => (
    <div style={{ height: "100vh", display: "flex" }}>
      <AppSidebar {...args}>
        <main style={{ flex: 1, padding: "24px" }}>
          <h1 style={{ color: "var(--foreground)", marginBottom: "8px" }}>
            Sem Usuário
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
            Footer exibe o texto de copyright em 11px ink-muted (fallback quando
            userInfo não é fornecido).
          </p>
        </main>
      </AppSidebar>
    </div>
  ),
};
