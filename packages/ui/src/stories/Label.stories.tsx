import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../components/label";
import { Input } from "../components/input";

/**
 * Label — one state per story. argTypes mirror the real cva:
 *   variant: default (Inter, form fields) | mono (JetBrains Mono uppercase, meta).
 */
const meta: Meta<typeof Label> = {
  title: "Components/Atoms/Label",
  component: Label,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "mono"],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: "Nome completo", variant: "default" },
};

/** mono — uppercase JetBrains Mono for "meta about meta" (table headers, key lists). */
export const Mono: Story = {
  args: { children: "created_at", variant: "mono" },
};

/** Paired with a form field via htmlFor. */
export const WithInput: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="voce@exemplo.com" />
    </div>
  ),
};
