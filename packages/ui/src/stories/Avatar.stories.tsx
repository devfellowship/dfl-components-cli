import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Atoms/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>DFL</AvatarFallback>
    </Avatar>
  ),
};

/** Broken/missing image src → the fallback initials render (single state). */
export const ImageError: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid.example/nope.png" alt="broken" />
      <AvatarFallback>DF</AvatarFallback>
    </Avatar>
  ),
};
