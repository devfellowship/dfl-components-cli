import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../components/input";

/**
 * Input — one story per interactive state (DS v0 spec).
 *
 * States covered:
 *   Default    → idle, placeholder visible
 *   Hover      → border steps to --c-input-border-hover (#3a3530); simulated via className
 *   Focus      → 2-layer box-shadow ring (0 0 0 2px bg, 0 0 0 3px #E07A4A); autoFocus
 *   Disabled   → opacity-50, cursor-not-allowed
 *   Error      → aria-invalid, danger border (#e07a7a), no ring in idle
 *   ErrorFocus → aria-invalid + autoFocus; 2-layer danger ring (0 0 0 2px bg, 0 0 0 3px #e07a7a)
 */
const meta: Meta<typeof Input> = {
  title: "Components/Atoms/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/** Idle state — surface-raised bg, border-subtle, ink-muted placeholder. */
export const Default: Story = {
  args: { type: "text", placeholder: "Digite aqui..." },
};

/**
 * Hover state — border steps to --c-input-border-hover (#3a3530, border-strong).
 * Simulated via forced className so the border color is visible without interaction.
 */
export const Hover: Story = {
  render: () => (
    <Input
      type="text"
      placeholder="Digite aqui..."
      className="border-[var(--c-input-border-hover)]"
    />
  ),
};

/**
 * Focus state — 2-layer brand ring: 0 0 0 2px var(--background) (bg gap) +
 * 0 0 0 3px var(--c-input-border-focus) (solid amber #E07A4A).
 * autoFocus fires the real :focus-visible CSS so the corrected box-shadow is live.
 */
export const Focus: Story = {
  render: () => (
    <Input type="text" placeholder="Digite aqui..." autoFocus />
  ),
};

/** Disabled state — opacity-50, cursor-not-allowed, no ring. */
export const Disabled: Story = {
  args: { type: "text", placeholder: "Desabilitado", disabled: true },
};

/**
 * Error state (idle) — aria-invalid="true" applies danger border (#e07a7a).
 * No ring in idle — border alone signals the error.
 */
export const Error: Story = {
  render: () => (
    <Input type="text" defaultValue="invalid@" aria-invalid={true} />
  ),
};

/**
 * Error + Focus — aria-invalid="true" + autoFocus.
 * Renders 2-layer danger ring: 0 0 0 2px var(--background) (bg gap) +
 * 0 0 0 3px var(--c-input-border-error) (danger-solid #e07a7a).
 * The previous impl used --s-danger-subtle (rgba 0.12) — nearly invisible.
 */
export const ErrorFocus: Story = {
  render: () => (
    <Input
      type="text"
      defaultValue="invalid@"
      aria-invalid={true}
      autoFocus
    />
  ),
};
