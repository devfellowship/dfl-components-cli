import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../components/switch";
import { Label } from "../components/label";

const meta: Meta<typeof Switch> = {
  title: "Primitivos/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Switch id="mode" />
      <Label htmlFor="mode">Modo escuro</Label>
    </div>
  ),
};

export const Enabled: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Switch id="enabled" defaultChecked />
      <Label htmlFor="enabled">Ativado</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Switch id="disabled" disabled />
      <Label htmlFor="disabled">Desabilitado</Label>
    </div>
  ),
};
