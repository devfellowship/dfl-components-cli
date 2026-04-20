import type { Meta, StoryObj } from "@storybook/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/hover-card";
import { Button } from "../components/button";

const meta: Meta<typeof HoverCard> = {
  title: "Primitivos/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@devfellowship</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">@devfellowship</h4>
          <p className="text-sm text-muted-foreground">
            Shared UI primitives and hooks for the DFL fleet. Joined March 2026.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
