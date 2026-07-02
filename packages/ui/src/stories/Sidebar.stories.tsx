import type { Meta, StoryObj } from "@storybook/react";
import {
  Home,
  BookOpen,
  CreditCard,
  Settings,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "../components/sidebar";

/**
 * Organisms/Sidebar — DFL DS v0 navigation primitive.
 *
 * Key DS fixes applied in this refactor (one story per state below):
 *   1. Active (isActive=true) → amber-subtle bg + 2px left-bar + amber text/icon
 *      via --c-sidebar-item-active-* tokens (was indistinguishable from hover).
 *   2. Focus ring → DS uniform spec: box-shadow 2px bg-gap + 1px amber
 *      on every interactive element (replaces legacy ring-2 + ring-sidebar-ring).
 *   3. Group labels → Barlow Condensed 10px uppercase 0.8px tracking
 *      via --c-sidebar-group-label-fg + var(--s-font-display).
 *   4. New --c-sidebar-item-* component tokens expose per-state knobs
 *      without touching --s-* semantics.
 */
const meta: Meta<typeof Sidebar> = {
  title: "Components/Organisms/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["left", "right"],
      description: "Which edge the sidebar docks to.",
    },
    variant: {
      control: "inline-radio",
      options: ["sidebar", "floating", "inset"],
      description: "Visual variant: sidebar (flush) | floating (card) | inset (padded).",
    },
    collapsible: {
      control: "inline-radio",
      options: ["offcanvas", "icon", "none"],
      description:
        "Collapse behaviour: offcanvas (slides off) | icon (icon-rail) | none (always visible).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

/* ─── shared fixtures ──────────────────────────────────────────────────── */

const principalItems = [
  { title: "Dashboard", icon: Home, active: true },
  { title: "Cursos", icon: BookOpen, active: false },
  { title: "Pagamentos", icon: CreditCard, active: false, badge: "3" },
];

const adminItems = [
  { title: "Usuários", icon: Users, active: false },
  { title: "Configurações", icon: Settings, active: false },
  { title: "Relatórios", icon: BarChart3, active: false, disabled: true },
];

/* ══════════════════════════════════════════════════════════════════════════
 * Story 1 — Expanded
 *   Full expanded sidebar: Barlow Condensed group labels, active amber item,
 *   normal items, disabled item, badge, and footer user row.
 * ══════════════════════════════════════════════════════════════════════════ */
/**
 * Expanded sidebar: Barlow Condensed group labels, amber active item, normal + disabled.
 *
 * Validates:
 *   - --c-sidebar-group-label-fg + var(--s-font-display) → 10px uppercase Barlow Condensed
 *   - Active item (Dashboard): amber-subtle bg + 2px left-bar + amber text/icon
 *   - Normal items: --c-sidebar-item-fg = var(--s-ink-secondary) resting foreground
 *   - Disabled item: opacity-50
 *   - Footer user row renders on var(--s-surface-page) bg
 */
export const Expanded: Story = {
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                background: "var(--s-brand-solid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--s-font-display)",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--s-ink-inverse)",
                flexShrink: 0,
              }}
            >
              DF
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
              DevFellowship
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {principalItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton disabled={item.disabled}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <div className="px-2 py-2 flex items-center gap-2">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "var(--s-brand-solid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--s-ink-inverse)",
                flexShrink: 0,
              }}
            >
              JS
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>
                João Silva
              </div>
              <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>
                joao@devfellowship.com
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div style={{ padding: "20px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 14,
              borderBottom: "1px solid var(--border)",
              marginBottom: 16,
            }}
          >
            <SidebarTrigger />
            <span
              style={{
                fontFamily: "var(--s-font-display)",
                fontSize: 20,
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              Dashboard
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            Group labels: Barlow Condensed 10px uppercase via --c-sidebar-group-label-fg
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/* ══════════════════════════════════════════════════════════════════════════
 * Story 2 — Collapsed (icon-rail)
 *   Verifies the 56px icon-rail active state: amber left-bar + amber icon.
 *   Tooltips appear on keyboard/mouse hover via the tooltip prop.
 * ══════════════════════════════════════════════════════════════════════════ */
/**
 * Collapsed icon-rail: active item shows amber left-bar + amber icon (no label).
 * Tooltip uses --c-tooltip-* tokens (surface-elevated bg, border-subtle border).
 *
 * Validates:
 *   - data-[active=true]:before:w-[var(--c-sidebar-item-active-bar-w)] in collapsed state
 *   - group-data-[collapsible=icon]:!size-8 !p-2 forces icon-only button
 *   - Tooltip hidden when sidebar is expanded; visible when collapsed
 */
export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {principalItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.slice(0, 2).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <SidebarTrigger />
            <span style={{ color: "var(--muted-foreground)", fontSize: 13 }}>
              Icon-rail — amber left-bar active · hover to see tooltip
            </span>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/* ══════════════════════════════════════════════════════════════════════════
 * Story 3 — MenuButton / Active
 *   Amber active treatment isolated for visual audit.
 * ══════════════════════════════════════════════════════════════════════════ */
/**
 * MenuButton active (isActive=true): amber-subtle bg + 2px amber left-bar + amber text/icon.
 *
 * Validates:
 *   - data-[active=true]:bg-[var(--c-sidebar-item-active-bg)] = var(--s-brand-subtle)
 *   - data-[active=true]:text-[var(--c-sidebar-item-active-fg)] = var(--s-brand-solid)
 *   - data-[active=true]:before:w-[var(--c-sidebar-item-active-bar-w)] = 2px left bar
 *   - Active ≠ hover (amber tint vs surface-raised — now visually distinguishable)
 */
export const MenuButtonActive: Story = {
  name: "MenuButton / Active",
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="none" style={{ width: 240 }}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Estado ativo</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <BookOpen />
                    <span>Cursos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <CreditCard />
                    <span>Pagamentos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--foreground)" }}>Active</strong> (Dashboard):
            amber-subtle bg + 2px left-bar + amber text
            <br />
            <strong style={{ color: "var(--foreground)" }}>Default</strong>:
            transparent bg + ink-secondary text
          </p>
          <p
            style={{
              fontFamily: "var(--s-font-mono)",
              fontSize: 11,
              color: "var(--muted-foreground)",
              marginTop: 10,
            }}
          >
            --c-sidebar-item-active-bg → var(--s-brand-subtle)
            <br />
            --c-sidebar-item-active-fg → var(--s-brand-solid)
            <br />
            --c-sidebar-item-active-bar-w → 2px
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/* ══════════════════════════════════════════════════════════════════════════
 * Story 4 — MenuButton / Hover
 *   Hover forced via className — must be visually distinct from active amber.
 * ══════════════════════════════════════════════════════════════════════════ */
/**
 * MenuButton hover: --c-sidebar-item-hover-bg (surface-raised) — distinct from active amber tint.
 *
 * Validates:
 *   - hover:bg-[var(--c-sidebar-item-hover-bg)] = var(--s-surface-raised) ≠ var(--s-brand-subtle)
 *   - Authors must not confuse this warm tint with the amber active treatment
 *   - Forced via className so the state is statically visible in the story canvas
 */
export const MenuButtonHover: Story = {
  name: "MenuButton / Hover",
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="none" style={{ width: 240 }}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Hover vs activo</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Force hover bg via className */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="bg-[var(--c-sidebar-item-hover-bg)] text-[var(--s-ink-primary)]"
                  >
                    <Users />
                    <span>Usuários (hover)</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* Default for contrast */}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* Active for contrast */}
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home />
                    <span>Dashboard (active)</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--foreground)" }}>Hover</strong> (Usuários):
            --c-sidebar-item-hover-bg = var(--s-surface-raised)
            <br />
            <strong style={{ color: "var(--foreground)" }}>Active</strong> (Dashboard):
            --c-sidebar-item-active-bg = var(--s-brand-subtle)
            <br />
            The two surfaces are now visually distinct.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/* ══════════════════════════════════════════════════════════════════════════
 * Story 5 — MenuButton / FocusVisible
 *   DS uniform focus ring forced via className (keyboard :focus-visible is not
 *   reproducible in static Storybook without a prior keyboard event).
 * ══════════════════════════════════════════════════════════════════════════ */
/**
 * MenuButton focus-visible: 2px bg-gap + 1px amber ring on interactive sidebar elements.
 *
 * Validates:
 *   - focus-visible:[box-shadow:0_0_0_2px_var(--c-sidebar-bg),0_0_0_3px_var(--c-sidebar-ring)]
 *   - Applies to SidebarMenuButton, SidebarGroupLabel, SidebarInput, SidebarTrigger
 *   - Replaces legacy ring-2 + ring-sidebar-ring (which had no background gap)
 *   - Active + focus-visible coexist: active ::before bar + outer focus ring (independent CSS props)
 */
export const MenuButtonFocusVisible: Story = {
  name: "MenuButton / FocusVisible",
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="none" style={{ width: 240 }}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Foco do teclado</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Force the DS ring via className (static visual — not interactive) */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="[box-shadow:0_0_0_2px_var(--c-sidebar-bg),0_0_0_3px_var(--c-sidebar-ring)]"
                  >
                    <Settings />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users />
                    <span>Usuários</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* Active item with focus ring simultaneously */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive
                    className="[box-shadow:0_0_0_2px_var(--c-sidebar-bg),0_0_0_3px_var(--c-sidebar-ring)]"
                  >
                    <Home />
                    <span>Dashboard (active + focused)</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--foreground)" }}>DS focus ring</strong>
            <br />
            box-shadow: 0 0 0 2px var(--c-sidebar-bg),
            <br />
            {"           "}0 0 0 3px var(--c-sidebar-ring)
          </p>
          <p
            style={{
              fontFamily: "var(--s-font-mono)",
              fontSize: 11,
              color: "var(--muted-foreground)",
              marginTop: 10,
            }}
          >
            --c-sidebar-bg → var(--s-surface-page) · #0a0908
            <br />
            --c-sidebar-ring → var(--s-border-focus) · #E07A4A
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/* ══════════════════════════════════════════════════════════════════════════
 * Story 6 — WithSkeleton (loading state)
 *   SidebarMenuSkeleton pulses on var(--s-surface-elevated) against sidebar bg.
 * ══════════════════════════════════════════════════════════════════════════ */
/**
 * Skeleton loading state: SidebarMenuSkeleton pulses on var(--s-surface-elevated).
 *
 * Validates:
 *   - Skeleton bg (var(--s-surface-elevated) = #1f1c18) is visible against sidebar bg (#0a0908)
 *   - DS motion: Skeleton uses animate-pulse (280ms ease-in-out per --p-duration-slow)
 *   - showIcon=true and showIcon=false variants both shown
 */
export const WithSkeleton: Story = {
  name: "WithSkeleton",
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Carregando…</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* showIcon=true — icon + text skeleton */}
                {[0, 1, 2].map((i) => (
                  <SidebarMenuItem key={`icon-${i}`}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Seção B</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* showIcon=false — text-only skeleton */}
                {[0, 1].map((i) => (
                  <SidebarMenuItem key={`text-${i}`}>
                    <SidebarMenuSkeleton showIcon={false} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div style={{ padding: "20px 24px" }}>
          <SidebarTrigger />
          <p
            style={{
              fontSize: 12,
              color: "var(--muted-foreground)",
              marginTop: 12,
              lineHeight: 1.6,
            }}
          >
            Skeleton bg: var(--s-surface-elevated) = #1f1c18
            <br />
            Visible against sidebar page bg #0a0908.
            <br />
            showIcon=true (top) · showIcon=false (bottom)
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/* ══════════════════════════════════════════════════════════════════════════
 * Story 7 — WithSubMenu
 *   Sub-menu active: amber text + amber-subtle bg, NO left-bar indicator.
 * ══════════════════════════════════════════════════════════════════════════ */
/**
 * SidebarMenuSubButton active: amber text + amber-subtle bg — NO left-bar (per spec).
 *
 * Validates:
 *   - data-[active=true]:bg-[var(--c-sidebar-item-active-bg)] on sub-button
 *   - data-[active=true]:text-[var(--c-sidebar-item-active-fg)] on sub-button
 *   - No ::before bar on sub-items (left-bar is top-level menu button only)
 */
export const WithSubMenu: Story = {
  name: "WithSubMenu",
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Documentos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FileText />
                    <span>Documentos</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive>
                        <span>Contratos</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Recibos</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Notas Fiscais</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div style={{ padding: "20px 24px" }}>
          <SidebarTrigger />
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 12, lineHeight: 1.6 }}>
            Sub active (Contratos): amber text + amber-subtle bg · NO left-bar.
            <br />
            Top-level active (Dashboard): amber + 2px left-bar.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
