import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGrid } from "lucide-react";
import { UserMenu } from "../components/organisms/UserMenu";

const meta: Meta<typeof UserMenu> = {
  title: "Components/Organisms/UserMenu",
  component: UserMenu,
  parameters: { layout: "centered" },
  argTypes: {
    name: { control: "text" },
    email: { control: "text" },
    showName: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {
  args: {
    name: "Ada Lovelace",
    email: "ada@devfellowship.com",
    onProfile: () => alert("profile"),
    onSettings: () => alert("settings"),
    onSignOut: () => alert("sign out"),
  },
};

export const AvatarOnly: Story = {
  args: {
    name: "Alan Turing",
    email: "alan@devfellowship.com",
    showName: false,
    onSignOut: () => alert("sign out"),
  },
};

export const CustomItems: Story = {
  args: {
    name: "Grace Hopper",
    email: "grace@devfellowship.com",
    items: [
      {
        label: "Switch workspace",
        icon: <LayoutGrid className="h-4 w-4" />,
        onSelect: () => alert("switch"),
      },
      {
        label: "Sign out",
        destructive: true,
        separatorBefore: true,
        onSelect: () => alert("sign out"),
      },
    ],
  },
};
