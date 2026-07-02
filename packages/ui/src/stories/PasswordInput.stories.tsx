/**
 * PasswordInput stories — Components/Molecules/PasswordInput
 *
 * One story per state (DS rule: 1 story = 1 state, no galleries).
 * 11 states covering the full spec:
 *   Default | Hover | Focused | ToggleFocused | Filled | Revealed |
 *   WithHelp | WithError | WithErrorFocused | Disabled | NoLabel
 *
 * Import path updated: organisms → molecules (tier-fix).
 */
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "../components/molecules/PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  title: "Components/Molecules/PasswordInput",
  component: PasswordInput,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    helpText: { control: "text" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

/** Empty field with label and placeholder ••••••••. Eye toggle is keyboard-reachable (tabIndex=0). */
export const Default: Story = {
  args: { label: "Password", placeholder: "••••••••" },
};

/**
 * Border lifts to --c-input-border-hover on pointer-over.
 * Static preview forced via className override; in prod this is a CSS :hover transition.
 */
export const Hover: Story = {
  args: {
    label: "Password",
    placeholder: "••••••••",
    className: "border-[var(--c-input-border-hover)]",
  },
};

/** Input focused: amber border (--c-input-border-focus) + DS uniform ring (box-shadow 0 0 0 2px bg, 0 0 0 3px #E07A4A). */
export const Focused: Story = {
  args: {
    label: "Password",
    placeholder: "••••••••",
    autoFocus: true,
  },
};

/**
 * Keyboard focus lands on the reveal toggle button — DS uniform focus ring visible.
 * Verifies the WCAG 2.1 SC 2.1.1 fix: tabIndex=-1 removed, toggle is reachable by Tab.
 */
const ToggleFocusedDemo = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const btn = wrapperRef.current?.querySelector<HTMLButtonElement>(
      "button[type='button']",
    );
    btn?.focus();
  }, []);
  return (
    <div ref={wrapperRef} style={{ width: 320 }}>
      <PasswordInput label="Password" defaultValue="hunter2" />
    </div>
  );
};

export const ToggleFocused: Story = {
  render: () => <ToggleFocusedDemo />,
};

/** Field has a value typed in; dots rendered (type=password). Eye toggle ready. */
export const Filled: Story = {
  args: {
    label: "Password",
    defaultValue: "hunter2secret",
  },
};

/**
 * Toggle was pressed: EyeOff icon shown, plain text visible in the field.
 * Rendered by programmatically clicking the toggle on mount.
 */
const RevealedDemo = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const btn = wrapperRef.current?.querySelector<HTMLButtonElement>(
      "button[type='button']",
    );
    btn?.click();
  }, []);
  return (
    <div ref={wrapperRef} style={{ width: 320 }}>
      <PasswordInput label="Password" defaultValue="hunter2secret" />
    </div>
  );
};

export const Revealed: Story = {
  render: () => <RevealedDemo />,
};

/** Label + input + helper text below in --s-ink-muted. */
export const WithHelp: Story = {
  args: {
    label: "New password",
    helpText: "At least 8 characters.",
    placeholder: "••••••••",
  },
};

/**
 * Error state: danger border (--c-input-border-error = --s-danger-solid = #e07a7a)
 * applied via aria-invalid on the Input atom. Error message in --s-danger-fg.
 * No raw hex fallback in either border or text token.
 */
export const WithError: Story = {
  args: {
    label: "Password",
    error: "Incorrect password.",
    placeholder: "••••••••",
  },
};

/**
 * Error + input focused: danger border persists; danger-tinted focus ring
 * (via Input atom's aria-invalid:focus-visible:ring-[--s-danger-subtle] styling).
 */
export const WithErrorFocused: Story = {
  args: {
    label: "Password",
    error: "Incorrect password.",
    placeholder: "••••••••",
    autoFocus: true,
  },
};

/** Input and toggle both at 50% opacity, cursor not-allowed; label also dimmed. Not interactive. */
export const Disabled: Story = {
  args: {
    label: "Password",
    placeholder: "••••••••",
    disabled: true,
  },
};

/** No label prop — bare field with placeholder text only. */
export const NoLabel: Story = {
  args: { placeholder: "Enter password" },
};
