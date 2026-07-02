import type { Meta, StoryObj } from "@storybook/react";
import { Home, BookOpen, CreditCard, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../components/sidebar";

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
    },
    collapsible: {
      control: "inline-radio",
      options: ["offcanvas", "icon", "none"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const items = [
  { title: "Dashboard", icon: Home },
  { title: "Cursos", icon: BookOpen },
  { title: "Pagamentos", icon: CreditCard },
];

/** Expanded — the default open state showing labels + icons. */
export const Expanded: Story = {
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.title === "Dashboard"}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main style={{ padding: "24px" }}>
          <SidebarTrigger />
          <h1 style={{ color: "var(--foreground)" }}>Expandida</h1>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/** Collapsed — icon-rail state (defaultOpen={false} with collapsible="icon"). */
export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.title === "Dashboard"} tooltip={item.title}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main style={{ padding: "24px" }}>
          <SidebarTrigger />
          <h1 style={{ color: "var(--foreground)" }}>Recolhida (icon-rail)</h1>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/** WithGroups — multiple labelled groups (nav sections). */
export const WithGroups: Story = {
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader style={{ padding: "12px", fontWeight: 600 }}>DevFellowship</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users />
                    <span>Usuários</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main style={{ padding: "24px" }}>
          <SidebarTrigger />
          <h1 style={{ color: "var(--foreground)" }}>Grupos de navegação</h1>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};
