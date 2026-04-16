import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../components/slider";

const meta: Meta<typeof Slider> = {
  title: "Primitivos/Slider",
  component: Slider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => (
    <Slider defaultValue={[40]} max={100} step={1} className="w-[320px]" />
  ),
};

export const Range: Story = {
  render: () => (
    <Slider defaultValue={[20, 70]} max={100} step={1} className="w-[320px]" />
  ),
};
