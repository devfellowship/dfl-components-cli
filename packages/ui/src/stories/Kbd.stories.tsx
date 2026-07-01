import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "../components/kbd";

/**
 * Kbd — one state per story. Single-key chip. argTypes mirror the real cva:
 *   size: sm | default | lg
 * Combine chips for multi-key shortcuts (⌘ + K).
 */
const meta: Meta<typeof Kbd> = {
  title: "Components/Atoms/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  args: { children: "K", size: "default" },
};

export const Small: Story = {
  args: { children: "K", size: "sm" },
};

export const Large: Story = {
  args: { children: "K", size: "lg" },
};

/** Chips compose for multi-key shortcuts. */
export const Combination: Story = {
  render: () => (
    <span className="inline-flex items-center gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </span>
  ),
};
