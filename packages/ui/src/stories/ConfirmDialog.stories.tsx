import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Organismos/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    title: "Publish this lesson?",
    body: "It will become visible to all fellows immediately.",
    confirmLabel: "Publish",
    onConfirm: () => alert("confirmed"),
    trigger: <Button>Publish</Button>,
  },
};

export const Destructive: Story = {
  args: {
    title: "Delete this track?",
    body: "This action cannot be undone.",
    confirmLabel: "Delete",
    variant: "destructive",
    onConfirm: () => alert("deleted"),
    trigger: <Button variant="destructive">Delete track</Button>,
  },
};
