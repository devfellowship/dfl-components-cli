import type { Meta, StoryObj } from "@storybook/react";
import { Search, Trash2, Plus } from "lucide-react";
import { IconButton } from "../components/icon-button";

/**
 * IconButton — one state per story. argTypes mirror the real cva:
 *   variant: ghost | outline | solid | destructive
 *   size:    xs | sm | default | lg
 * `aria-label` is REQUIRED (icon-only buttons need an accessible name).
 */
const meta: Meta<typeof IconButton> = {
  title: "Components/Atoms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["ghost", "outline", "solid", "destructive"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Ghost: Story = {
  args: { variant: "ghost", "aria-label": "Buscar" },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
};

export const Outline: Story = {
  args: { variant: "outline", "aria-label": "Adicionar" },
  render: (args) => (
    <IconButton {...args}>
      <Plus />
    </IconButton>
  ),
};

export const Solid: Story = {
  args: { variant: "solid", "aria-label": "Adicionar" },
  render: (args) => (
    <IconButton {...args}>
      <Plus />
    </IconButton>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive", "aria-label": "Excluir" },
  render: (args) => (
    <IconButton {...args}>
      <Trash2 />
    </IconButton>
  ),
};

/** aria-pressed paints the Toolbar "active" state (brand-subtle bg). */
export const Pressed: Story = {
  args: { variant: "ghost", "aria-label": "Buscar", "aria-pressed": true },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
};

export const Disabled: Story = {
  args: { variant: "outline", "aria-label": "Adicionar", disabled: true },
  render: (args) => (
    <IconButton {...args}>
      <Plus />
    </IconButton>
  ),
};
