import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "../components/organisms/UserAvatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Components/Molecules/UserAvatar",
  component: UserAvatar,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    src: { control: "text" },
    colorSeed: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Initials: Story = {
  args: { name: "Ada Lovelace" },
};

export const WithImage: Story = {
  args: { name: "shadcn", src: "https://github.com/shadcn.png" },
};

/**
 * `colorSeed` decouples the palette hash from the display name — two members
 * with the same name get distinct colours (single state).
 */
export const WithColorSeed: Story = {
  args: { name: "Grace Hopper", colorSeed: "member-42" },
};
