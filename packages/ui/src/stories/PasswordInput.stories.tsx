import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "../components/organisms/PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  title: "Components/Molecules/PasswordInput",
  component: PasswordInput,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    helpText: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: { label: "Password", placeholder: "••••••••" },
};

export const WithHelp: Story = {
  args: {
    label: "New password",
    helpText: "At least 6 characters.",
    placeholder: "••••••••",
  },
};

export const WithError: Story = {
  args: {
    label: "Password",
    error: "Incorrect password.",
    placeholder: "••••••••",
  },
};
