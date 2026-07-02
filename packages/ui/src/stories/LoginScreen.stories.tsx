import type { Meta, StoryObj } from "@storybook/react";
import { LoginScreen } from "../components/organisms/LoginScreen";

const meta: Meta<typeof LoginScreen> = {
  title: "Components/Organisms/LoginScreen",
  component: LoginScreen,
  parameters: { layout: "fullscreen" },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    submitLabel: { control: "text" },
    error: { control: "text" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof LoginScreen>;

export const Default: Story = {
  args: {
    title: "welcome, fellow!",
    subtitle: "Sign in to continue",
    onSubmit: (email) => alert(`submit: ${email}`),
  },
};

export const Loading: Story = {
  args: {
    title: "welcome, fellow!",
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    title: "welcome, fellow!",
    error: "Invalid email or password.",
    onSubmit: (email) => alert(`submit: ${email}`),
  },
};

export const WithFooter: Story = {
  args: {
    title: "Acesse o Portal",
    subtitle: "Use suas credenciais DFL",
    onSubmit: (email) => alert(`submit: ${email}`),
    footer: (
      <span>
        Don&apos;t have an account?{" "}
        <a href="#" style={{ color: "var(--s-brand-fg)" }}>
          Sign up
        </a>
      </span>
    ),
  },
};
