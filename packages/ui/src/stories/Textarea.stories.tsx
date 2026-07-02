import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../components/textarea";

/**
 * Textarea — one state per story. Multi-line input sharing --c-input-* tokens.
 *
 * Focus ring spec (DS v0 ch.5.2):
 *   Normal:  box-shadow 0 0 0 2px #0a0908 (bg gap), 0 0 0 3px #E07A4A (amber outer ring)
 *   Error:   box-shadow 0 0 0 2px #0a0908 (bg gap), 0 0 0 3px #e07a7a (danger outer ring)
 */
const meta: Meta<typeof Textarea> = {
  title: "Components/Atoms/Textarea",
  component: Textarea,
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/** Idle, empty. Placeholder rendered in --c-input-placeholder (#7d7568 / ink-muted). */
export const Default: Story = {
  args: { placeholder: "Escreva sua mensagem..." },
};

/** Idle with typed content. Text in --c-input-fg (#f6f1e7 / ink-primary). */
export const WithValue: Story = {
  args: { defaultValue: "Deep Fellowship é uma comunidade de desenvolvedores." },
};

/**
 * :hover — border steps from --c-input-border (subtle) to --c-input-border-hover (strong).
 * Simulated via injected CSS scoped to this story's wrapper because
 * @storybook/addon-pseudo-states is not in this project.
 */
export const Hover: Story = {
  args: { placeholder: "Escreva sua mensagem..." },
  render: (args) => (
    <div className="hover-sim-textarea" style={{ width: "320px" }}>
      <style>{`.hover-sim-textarea textarea { border-color: var(--c-input-border-hover) !important; }`}</style>
      <Textarea {...args} />
    </div>
  ),
};

/**
 * :focus-visible — amber border + DS v0 uniform focus ring.
 * Ring: box-shadow 0 0 0 2px #0a0908 (bg gap), 0 0 0 3px #E07A4A (amber).
 */
export const Focus: Story = {
  args: {
    placeholder: "Escreva sua mensagem...",
    autoFocus: true,
  },
};

/** disabled=true — opacity 0.50, cursor not-allowed, non-interactive. */
export const Disabled: Story = {
  args: { placeholder: "Escreva sua mensagem...", disabled: true },
};

/**
 * aria-invalid=true, idle — danger border (#e07a7a) only; no ring until focused.
 */
export const Error: Story = {
  args: {
    defaultValue: "Texto inválido",
    "aria-invalid": true,
  },
};

/**
 * aria-invalid=true + :focus-visible — danger border + danger focus ring.
 * Ring: box-shadow 0 0 0 2px #0a0908 (bg gap), 0 0 0 3px #e07a7a (red).
 */
export const ErrorFocus: Story = {
  args: {
    defaultValue: "Texto com dado inválido",
    "aria-invalid": true,
    autoFocus: true,
  },
};
