import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "../components/organisms/UserAvatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Organismos/UserAvatar",
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

export const MemberPalette: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 360 }}>
      {[
        "Ada Lovelace",
        "Alan Turing",
        "Grace Hopper",
        "Linus Torvalds",
        "Margaret Hamilton",
        "Dennis Ritchie",
        "Barbara Liskov",
        "Ken Thompson",
        "Radia Perlman",
        "Tim Berners-Lee",
        "Katherine Johnson",
        "Donald Knuth",
      ].map((name) => (
        <UserAvatar key={name} name={name} />
      ))}
    </div>
  ),
};
