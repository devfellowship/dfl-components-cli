import type { Meta, StoryObj } from "@storybook/react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/tooltip";
import { Button } from "../components/button";

/**
 * Tooltip — one state per story.
 * Radix Tooltip: wrap in TooltipProvider, then Tooltip > TooltipTrigger +
 * TooltipContent. `delayDuration` (on Provider/Root) tunes hover delay;
 * `side` on the content picks the placement. `defaultOpen` renders it open
 * so a static story shows the popover content.
 */
const meta: Meta<typeof Tooltip> = {
  title: "Components/Molecules/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    delayDuration: { control: "number" },
    defaultOpen: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const OnButton: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Passe o mouse</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adicionar à biblioteca</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const OnIcon: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Mais informações">
            <Info />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Estas configurações se aplicam a todos os projetos.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const SideRight: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">À direita</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Dica exibida à direita</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const SideBottom: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Abaixo</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Dica exibida abaixo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
