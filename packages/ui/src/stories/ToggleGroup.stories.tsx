import type { Meta, StoryObj } from "@storybook/react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";

/**
 * ToggleGroup — one state per story.
 * `type` chooses the selection model: "single" (one item at a time, value is a
 * string) or "multiple" (many items, value is an array). `variant`
 * (default | outline) and `size` (default | sm | lg) are set on the GROUP and
 * flow through React context to every ToggleGroupItem — set them once on the
 * group, not per item.
 */
const meta: Meta<typeof ToggleGroup> = {
  title: "Components/Molecules/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    type: { control: "inline-radio", options: ["single", "multiple"] },
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const SingleSelect: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Alinhar à esquerda">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Centralizar">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Alinhar à direita">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MultiSelect: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Alternar negrito">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Alternar itálico">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Alternar sublinhado">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="outline" defaultValue={["italic"]}>
      <ToggleGroupItem value="bold" aria-label="Alternar negrito">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Alternar itálico">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Alternar sublinhado">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Large: Story = {
  render: () => (
    <ToggleGroup type="single" size="lg" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Alinhar à esquerda">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Centralizar">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Alinhar à direita">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
