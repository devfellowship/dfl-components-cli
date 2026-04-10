import type { Meta, StoryObj } from "@storybook/react";
import { LoginPage } from "../components/organisms/LoginPage";

const meta: Meta<typeof LoginPage> = {
  title: "Organismos/LoginPage",
  component: LoginPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    title: { control: "text" },
    defaultMode: {
      control: "select",
      options: ["login", "signup"],
    },
    redirectUrl: { control: "text" },
    termsUrl: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Login: Story = {
  args: {
    title: "welcome, fellow!",
    defaultMode: "login",
    redirectUrl: "/dashboard",
    onSuccess: (url) => alert(`Login bem-sucedido! Redirect: ${url}`),
    onError: (err) => console.error(err),
  },
};

export const Signup: Story = {
  args: {
    title: "Crie sua conta",
    defaultMode: "signup",
    redirectUrl: "/onboarding",
    termsUrl: "https://devfellowship.com/en/terms",
    onSuccess: (url) => alert(`Cadastro realizado! Redirect: ${url}`),
  },
};

export const CustomBrand: Story = {
  args: {
    title: "Acesse o Portal",
    logo: "https://devfellowship.s3.sa-east-1.amazonaws.com/media/1755889468274-DevFelloShip%2B1%2BSi%CC%81mbolo.png",
    defaultMode: "login",
  },
};
