import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "../components/scroll-area";
import { Separator } from "../components/separator";

/**
 * ScrollArea — one state per story. Radix custom-scrollbar container.
 * States: vertical (long list), horizontal (wide content).
 */
const meta: Meta<typeof ScrollArea> = {
  title: "Components/Atoms/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 30 }).map((_, i) => `Tag ${i + 1}`);

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-48 w-56 rounded-md border">
      <div className="p-4">
        <div className="mb-2 text-sm font-medium">Tags</div>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="py-1 text-sm">{tag}</div>
            <Separator className="my-1" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-72 rounded-md border whitespace-nowrap">
      <div className="flex gap-3 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md border text-sm"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
