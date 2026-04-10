import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../components/checkbox";
import { Label } from "../components/label";

const meta: Meta<typeof Checkbox> = {
  title: "Primitivos/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="terms" />
      <Label htmlFor="terms">Aceitar termos de uso</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Marcado</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled">Desabilitado</Label>
    </div>
  ),
};
