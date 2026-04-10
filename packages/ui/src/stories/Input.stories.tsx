import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../components/input";

const meta: Meta<typeof Input> = {
  title: "Primitivos/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Digite aqui..." },
};

export const Email: Story = {
  args: { type: "email", placeholder: "email@exemplo.com" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Senha" },
};

export const Disabled: Story = {
  args: { placeholder: "Desabilitado", disabled: true },
};

export const WithValue: Story = {
  args: { value: "Valor preenchido", readOnly: true },
};
