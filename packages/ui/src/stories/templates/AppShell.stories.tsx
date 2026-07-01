import type { Meta, StoryObj } from "@storybook/react";
import { BookOpen, CreditCard, FileText, Home, Settings, Users } from "lucide-react";
import { AppNavbar } from "../../components/organisms/AppNavbar";
import { AppSidebar } from "../../components/organisms/AppSidebar";
import { Button } from "../../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/card";

/**
 * Templates/AppShell — page-level composition, NOT a new component.
 *
 * Assembles the exported organisms `AppSidebar` (left rail, collapsible via its
 * built-in trigger) + `AppNavbar` (top breadcrumb/user bar) around a `<main>`
 * content slot. This is the shell ~every DFL app wraps its pages in
 * (lesson-studio AppShell, reviews app-layout, task-assigner Layout,
 * learn AppLayout). Nothing here is a new export — it only COMPOSES existing
 * `@devfellowship/components` primitives.
 */
const meta: Meta = {
  title: "Templates/AppShell",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

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

/** Realistic page body that fills the AppShell content slot. */
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

/**
 * Default AppShell — sidebar expanded. The `AppSidebar` `children` slot holds
 * an `AppNavbar` topbar plus the page body, so the whole app chrome is visible.
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
    >
      <AppNavbar breadcrumbs={breadcrumbs} userInfo={userInfo} theme="light" />
      <PageBody />
    </AppSidebar>
  ),
};

/**
 * Collapsed AppShell — same composition with the sidebar rail collapsed to
 * icons (`defaultOpen={false}`). Content column keeps full width.
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
      <AppNavbar breadcrumbs={breadcrumbs} userInfo={userInfo} theme="light" />
      <PageBody />
    </AppSidebar>
  ),
};
