import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";

const meta: Meta<typeof Button> = {
  title: "Primitivos/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button", variant: "default", size: "default" },
};

export const Destructive: Story = {
  args: { children: "Deletar", variant: "destructive" },
};

export const Outline: Story = {
  args: { children: "Cancelar", variant: "outline" },
};

export const Secondary: Story = {
  args: { children: "Secundário", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Link: Story = {
  args: { children: "Link", variant: "link" },
};

export const Small: Story = {
  args: { children: "Small", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg" },
};

export const Disabled: Story = {
  args: { children: "Desabilitado", disabled: true },
};

/**
 * `asChild` renders the Button styling onto its single child (Radix Slot) —
 * the canonical shadcn pattern for link-styled buttons
 * (`<Button asChild><a/></Button>` or with a router `<Link/>`).
 * Regression-guarded: must NOT throw `React.Children.only`.
 */
export const AsChildLink: Story = {
  render: () => (
    <Button asChild variant="primary">
      <a href="https://devfellowship.com" target="_blank" rel="noreferrer">
        Anchor styled as Button
      </a>
    </Button>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {(["default", "destructive", "outline", "secondary", "ghost", "link"] as const).map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};
