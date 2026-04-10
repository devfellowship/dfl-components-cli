import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AppNavbar } from "../components/organisms/AppNavbar";
import { Button } from "../components/button";

const meta: Meta<typeof AppNavbar> = {
  title: "Organismos/AppNavbar",
  component: AppNavbar,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppNavbar>;

const breadcrumbs = [
  { label: "Dashboard", href: "/" },
  { label: "Cursos", href: "/courses" },
  { label: "React Avançado" },
];

const userInfo = {
  name: "João Silva",
  email: "joao@devfellowship.com",
  avatarUrl: "https://github.com/shadcn.png",
};

export const Default: Story = {
  args: {
    breadcrumbs,
    userInfo,
    theme: "light",
  },
};

export const Dark: Story = {
  args: {
    breadcrumbs,
    userInfo,
    theme: "dark",
  },
};

export const WithActions: Story = {
  args: {
    breadcrumbs,
    userInfo,
    actions: <Button size="sm">Nova Turma</Button>,
  },
};

export const Interactive: Story = {
  render: () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    return (
      <div
        className={theme === "dark" ? "dark" : ""}
        style={{ background: "var(--background)", minHeight: "120px" }}
      >
        <AppNavbar
          breadcrumbs={breadcrumbs}
          userInfo={userInfo}
          theme={theme}
          onThemeToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          onSignOut={() => alert("Sign out")}
          onProfileClick={() => alert("Profile")}
          onSettingsClick={() => alert("Settings")}
        />
      </div>
    );
  },
};

export const NoBreadcrumbs: Story = {
  args: {
    userInfo,
    theme: "light",
  },
};
