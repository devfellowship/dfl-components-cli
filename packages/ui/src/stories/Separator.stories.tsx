import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "../components/separator";

/**
 * Separator — one state per story. argTypes mirror the real prop:
 *   orientation: horizontal | vertical
 */
const meta: Meta<typeof Separator> = {
  title: "Components/Atoms/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <div className="text-sm">Deep Fellowship</div>
      <Separator className="my-3" orientation="horizontal" />
      <div className="text-sm text-muted-foreground">Comunidade de devs</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Sobre</span>
    </div>
  ),
};
