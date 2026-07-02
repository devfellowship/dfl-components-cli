import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../components/switch";
import { Label } from "../components/label";

/**
 * Switch — one state per story (DS refactor: atoms-switch).
 *
 * Bugs fixed vs original shadcn output:
 *   - Thumb was `bg-background` → near-black #0a0908 (invisible on dark unchecked track).
 *     Now `--c-switch-thumb-bg` → warm off-white #f6f1e7.
 *   - Focus ring was shadcn `ring-2 ring-ring ring-offset-2` (outline).
 *     Now `--c-switch-focus-ring` → uniform DS box-shadow ring
 *     (2px page-bg gap + 1px amber, box-shadow only, no outline property).
 *
 * All values flow through `--c-switch-*` component tokens (Layer 3, tokens.css).
 */
const meta: Meta<typeof Switch> = {
  title: "Components/Atoms/Switch",
  component: Switch,
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

/**
 * Default off state. Warm off-white thumb (#f6f1e7) on elevated dark track (#1f1c18).
 * Subtle border ring from --c-switch-track-off-border. No focus ring visible.
 */
export const Unchecked: Story = {
  render: () => (
    <Switch id="switch-unchecked" aria-label="Unchecked switch" />
  ),
};

/**
 * Amber track (#E07A4A) from --c-switch-track-on-bg.
 * Warm off-white thumb translated to the right. No focus ring.
 */
export const Checked: Story = {
  render: () => (
    <Switch id="switch-checked" defaultChecked aria-label="Checked switch" />
  ),
};

/**
 * Keyboard focus on unchecked switch.
 * Shows uniform DS focus ring: 2px page-bg gap + 1px amber outline
 * via box-shadow (--c-switch-focus-ring). No outline property used.
 * Uses autoFocus to trigger :focus-visible on mount.
 */
export const Focus: Story = {
  render: () => (
    <Switch id="switch-focus" autoFocus aria-label="Focused unchecked switch" />
  ),
};

/**
 * Keyboard focus on checked switch.
 * Amber track (#E07A4A) + same uniform DS ring (--c-switch-focus-ring).
 */
export const FocusChecked: Story = {
  render: () => (
    <Switch id="switch-focus-checked" defaultChecked autoFocus aria-label="Focused checked switch" />
  ),
};

/**
 * Disabled unchecked state.
 * Off-white thumb on dark track at 40% opacity (--c-switch-disabled-opacity).
 * cursor: not-allowed from Tailwind `disabled:cursor-not-allowed`.
 */
export const DisabledUnchecked: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Switch id="switch-disabled-unchecked" disabled aria-label="Disabled unchecked switch" />
      <Label
        htmlFor="switch-disabled-unchecked"
        style={{ color: "var(--s-ink-muted)" }}
      >
        Desabilitado
      </Label>
    </div>
  ),
};

/**
 * Disabled checked state.
 * Amber track at 40% opacity, cursor: not-allowed.
 * Paired with muted label text (--s-ink-muted) to signal unavailability.
 */
export const DisabledChecked: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Switch
        id="switch-disabled-checked"
        disabled
        defaultChecked
        aria-label="Disabled checked switch"
      />
      <Label
        htmlFor="switch-disabled-checked"
        style={{ color: "var(--s-ink-muted)" }}
      >
        Ativado (desabilitado)
      </Label>
    </div>
  ),
};
