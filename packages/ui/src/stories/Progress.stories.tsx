import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../components/progress";

const meta: Meta<typeof Progress> = {
  title: "Primitivos/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: { value: 60 },
  render: (args) => (
    <div style={{ width: "300px" }}>
      <Progress {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: { value: 0 },
  render: (args) => <div style={{ width: "300px" }}><Progress {...args} /></div>,
};

export const Full: Story = {
  args: { value: 100 },
  render: (args) => <div style={{ width: "300px" }}><Progress {...args} /></div>,
};
