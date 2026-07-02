import type { Meta, StoryObj } from "@storybook/react";
// Alias to avoid merged-declaration collision with a hypothetical `Info` story export
import { Info as InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/tooltip";
import { Button } from "../components/button";

/**
 * Tooltip — one state per story.
 *
 * Radix Tooltip: wrap in TooltipProvider, then Tooltip > TooltipTrigger +
 * TooltipContent. `delayDuration` (on Provider/Root) tunes hover delay;
 * `side` on TooltipContent picks the placement. `defaultOpen` renders the
 * bubble open so every static story shows the popover immediately.
 *
 * Tokens consumed: --c-tooltip-{bg,fg,border,radius,shadow}
 * Focus ring: ds-focus-ring class on TooltipTrigger (outline: 1px amber, 3px offset)
 * Caret: Radix Arrow wired with fill=--c-tooltip-bg, stroke=--c-tooltip-border
 */
const meta: Meta<typeof Tooltip> = {
  title: "Components/Molecules/Tooltip",
  component: Tooltip,
  argTypes: {
    delayDuration: { control: "number" },
    defaultOpen: { control: "boolean" },
  },
  // Provide enough padding so the bubble + arrow aren't clipped by the canvas edge
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-16">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/**
 * OnButton — primary placement (side=top). Outline Button trigger.
 * Most common usage pattern; tests the default top placement and sideOffset=6.
 */
export const OnButton: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Passe o mouse</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Adicionar à biblioteca</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

/**
 * OnIcon — icon ghost trigger (side=top). Multi-line content.
 * Validates that the bubble handles longer / wrapped copy correctly (max-w-[220px]).
 */
export const OnIcon: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Mais informações">
            <InfoIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Estas configurações se aplicam a todos os projetos da sua organização.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

/**
 * SideBottom — bubble appears below the trigger (side=bottom).
 * Arrow points upward toward the trigger.
 */
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

/**
 * SideRight — bubble appears to the right of the trigger (side=right).
 * Arrow points left toward the trigger.
 */
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

/**
 * SideLeft — bubble appears to the left of the trigger (side=left).
 * Arrow points right toward the trigger. Previously missing story.
 */
export const SideLeft: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">À esquerda</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Dica exibida à esquerda</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

/**
 * OnDisabledTrigger — disabled button wrapped in a `<span>` per Radix pattern.
 * Disabled buttons suppress pointer events so the Tooltip never fires when the
 * trigger itself is disabled. Wrapping in a focusable/hoverable <span> lets the
 * tooltip appear while visually communicating the disabled state of the action.
 */
export const OnDisabledTrigger: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          {/* span intercepts pointer events that the disabled button swallows */}
          <span tabIndex={0} className="inline-flex cursor-not-allowed">
            <Button variant="outline" disabled className="pointer-events-none">
              Ação indisponível
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Esta ação não está disponível no momento</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
