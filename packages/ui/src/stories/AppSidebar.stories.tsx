import type { Meta, StoryObj } from "@storybook/react";
import { Home, BookOpen, CreditCard, FileText, Settings, Users } from "lucide-react";
import { AppSidebar } from "../components/organisms/AppSidebar";

const meta: Meta<typeof AppSidebar> = {
  title: "Organismos/AppSidebar",
  component: AppSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AppSidebar>;

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
        <main style={{ flex: 1, padding: "24px", background: "var(--background)" }}>
          <h1 style={{ color: "var(--foreground)" }}>Conteúdo Principal</h1>
          <p style={{ color: "var(--muted-foreground)" }}>O AppSidebar aparece à esquerda.</p>
        </main>
      </AppSidebar>
    </div>
  ),
};

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
        <main style={{ flex: 1, padding: "24px", background: "var(--background)" }}>
          <h1 style={{ color: "var(--foreground)" }}>Sidebar Recolhida</h1>
        </main>
      </AppSidebar>
    </div>
  ),
};

export const NoUser: Story = {
  args: {
    navGroups,
    appName: "DevFellowship",
    defaultOpen: true,
  },
  render: (args) => (
    <div style={{ height: "100vh", display: "flex" }}>
      <AppSidebar {...args}>
        <main style={{ flex: 1, padding: "24px", background: "var(--background)" }}>
          <h1 style={{ color: "var(--foreground)" }}>Sem Usuário</h1>
        </main>
      </AppSidebar>
    </div>
  ),
};
