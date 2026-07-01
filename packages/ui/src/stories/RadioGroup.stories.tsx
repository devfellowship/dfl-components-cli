import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { Label } from "../components/label";

/**
 * RadioGroup — one state per story. Radix single-select group of RadioGroupItem.
 * States: default (with selection), disabled group, per-item disabled.
 */
const meta: Meta<typeof RadioGroup> = {
  title: "Components/Atoms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Padrão</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Confortável</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compacto</Label>
      </div>
    </RadioGroup>
  ),
};

/** Whole group disabled. */
export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" disabled>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="rd1" />
        <Label htmlFor="rd1">Padrão</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="rd2" />
        <Label htmlFor="rd2">Confortável</Label>
      </div>
    </RadioGroup>
  ),
};

/** A single item disabled while the rest stay interactive. */
export const ItemDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="ri1" />
        <Label htmlFor="ri1">Disponível</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="ri2" disabled />
        <Label htmlFor="ri2">Indisponível</Label>
      </div>
    </RadioGroup>
  ),
};
