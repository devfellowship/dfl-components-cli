import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Atoms/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Badge", variant: "default" },
};

export const Secondary: Story = {
  args: { children: "Secundário", variant: "secondary" },
};

export const Destructive: Story = {
  args: { children: "Erro", variant: "destructive" },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};
