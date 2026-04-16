import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "../components/aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "Primitivos/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  ),
};
