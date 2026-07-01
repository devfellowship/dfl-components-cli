import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/button";

/**
 * Button — one state per story. argTypes mirror the real cva:
 *   variant: primary | secondary | outline | ghost | destructive | success | link
 *   size:    sm | default | lg | icon | icon-sm | icon-lg
 *   plus the additive props: loading, kbd, asChild.
 * (There is also a legacy `default` variant alias kept for back-compat, but the
 *  canonical name is `primary` — the control lists the canonical set.)
 */
const meta: Meta<typeof Button> = {
  title: "Components/Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "destructive", "success", "link"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "icon", "icon-sm", "icon-lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button", variant: "primary", size: "default" },
};

export const Outline: Story = {
  args: { children: "Cancelar", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Secondary: Story = {
  args: { children: "Secundário", variant: "secondary" },
};

export const Destructive: Story = {
  args: { children: "Deletar", variant: "destructive" },
};

export const WithIcon: Story = {
  render: () => (
    <Button variant="primary">
      Avançar <ArrowRight />
    </Button>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Button variant="outline" size="icon" aria-label="Avançar">
      <ArrowRight />
    </Button>
  ),
};

export const Loading: Story = {
  args: { children: "Salvando", loading: true, variant: "primary" },
};

export const Disabled: Story = {
  args: { children: "Desabilitado", disabled: true },
};

export const LongText: Story = {
  args: {
    children: "Confirmar e prosseguir para a próxima etapa do fluxo",
    variant: "primary",
  },
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
