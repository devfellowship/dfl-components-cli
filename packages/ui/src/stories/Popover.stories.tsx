import type { Meta, StoryObj } from "@storybook/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/popover";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";

/**
 * Popover — one state per story.
 * Radix Popover: Popover > PopoverTrigger + PopoverContent. `align`
 * (start | center | end) and `side` (top | right | bottom | left) on the
 * content position it relative to the trigger. `defaultOpen` renders it open
 * so the static story shows the floating content.
 */
const meta: Meta<typeof Popover> = {
  title: "Components/Molecules/Popover",
  component: Popover,
  argTypes: {
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Abrir popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">Dimensões</h4>
          <p className="text-sm text-muted-foreground">
            Defina as dimensões da camada.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Editar</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensões</h4>
            <p className="text-sm text-muted-foreground">
              Ajuste a largura e a altura.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Largura</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Altura</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignStart: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Alinhar ao início</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <p className="text-sm text-muted-foreground">
          Conteúdo alinhado à borda inicial do gatilho.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Alinhar ao fim</Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-sm text-muted-foreground">
          Conteúdo alinhado à borda final do gatilho.
        </p>
      </PopoverContent>
    </Popover>
  ),
};
