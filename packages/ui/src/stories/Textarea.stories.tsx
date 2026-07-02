import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../components/textarea";

/**
 * Textarea — one state per story. Multi-line input sharing Input tokens.
 * States: default, with value, placeholder, disabled, error (aria-invalid).
 */
const meta: Meta<typeof Textarea> = {
  title: "Components/Atoms/Textarea",
  component: Textarea,
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Escreva sua mensagem..." },
};

export const WithValue: Story = {
  args: { defaultValue: "Deep Fellowship é uma comunidade de desenvolvedores." },
};

export const Disabled: Story = {
  args: { placeholder: "Escreva sua mensagem...", disabled: true },
};

/** aria-invalid paints the error border + danger ring. */
export const Error: Story = {
  args: {
    defaultValue: "Texto inválido",
    "aria-invalid": true,
  },
};

export const LongContent: Story = {
  args: {
    defaultValue:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
  },
};
