import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../components/checkbox";
import { Label } from "../components/label";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Atoms/Checkbox",
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// ── Helper — auto-focuses the Checkbox on mount to show the focus ring ────────

/**
 * Wraps a Checkbox and focuses it via ref on mount, so Storybook's canvas
 * renders the uniform DFL two-layer amber focus ring without requiring a tab key.
 */
function AutoFocused({
  children,
}: {
  children: React.ReactElement<{ ref?: React.Ref<HTMLButtonElement> }>;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, []);
  return React.cloneElement(children, { ref });
}

// ── Unchecked ─────────────────────────────────────────────────────────────────

/**
 * Rest state — unchecked, no fill, default label.
 * Renamed from "Default" for consistency with DFL one-state-per-story naming.
 */
export const Unchecked: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="unchecked" />
      <Label htmlFor="unchecked">Aceitar termos de uso</Label>
    </div>
  ),
};

/**
 * Keyboard focus on unchecked box.
 * Demonstrates the uniform DFL two-layer amber ring:
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px var(--c-checkbox-focus-ring)
 */
export const Focus: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px" }}>
      <AutoFocused>
        <Checkbox id="focus-unchecked" />
      </AutoFocused>
      <Label htmlFor="focus-unchecked">Aceitar termos de uso</Label>
    </div>
  ),
};

// ── Checked ───────────────────────────────────────────────────────────────────

/**
 * Checked — amber fill + inverse checkmark, label.
 */
export const Checked: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Marcado</Label>
    </div>
  ),
};

/**
 * Checked + keyboard focus — amber ring rendered over the amber fill.
 */
export const CheckedFocus: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px" }}>
      <AutoFocused>
        <Checkbox id="checked-focus" defaultChecked />
      </AutoFocused>
      <Label htmlFor="checked-focus">Marcado</Label>
    </div>
  ),
};

// ── Indeterminate ─────────────────────────────────────────────────────────────

/**
 * Indeterminate — `checked="indeterminate"` Radix prop.
 * Renders a Minus dash icon with the same amber fill as checked.
 * Common for select-all parent rows with partial sub-selection.
 */
export const Indeterminate: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="indeterminate" checked="indeterminate" onCheckedChange={() => {}} />
      <Label htmlFor="indeterminate">Parcialmente selecionado</Label>
    </div>
  ),
};

/**
 * Indeterminate + keyboard focus — two-layer amber ring over the dash/amber box.
 */
export const IndeterminateFocus: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px" }}>
      <AutoFocused>
        <Checkbox id="indeterminate-focus" checked="indeterminate" onCheckedChange={() => {}} />
      </AutoFocused>
      <Label htmlFor="indeterminate-focus">Parcialmente selecionado</Label>
    </div>
  ),
};

// ── Disabled ──────────────────────────────────────────────────────────────────

/**
 * Disabled unchecked — `disabled` prop, 40% opacity via --c-checkbox-disabled-opacity,
 * not-allowed cursor, muted label color.
 */
export const DisabledUnchecked: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="disabled-unchecked" disabled />
      <Label
        htmlFor="disabled-unchecked"
        style={{ color: "var(--s-ink-disabled)", cursor: "not-allowed" }}
      >
        Desabilitado
      </Label>
    </div>
  ),
};

/**
 * Disabled + checked — amber fill at 40% opacity, not-allowed cursor.
 */
export const DisabledChecked: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="disabled-checked" disabled defaultChecked />
      <Label
        htmlFor="disabled-checked"
        style={{ color: "var(--s-ink-disabled)", cursor: "not-allowed" }}
      >
        Desabilitado
      </Label>
    </div>
  ),
};

// ── Error / Danger ────────────────────────────────────────────────────────────

/**
 * Error — danger red border variant for form-field validation.
 * Pass `aria-invalid={true}` (mirrors the Input/Textarea error pattern).
 * Renders a red border + very subtle red tint fill (6% opacity via --c-checkbox-danger-bg).
 */
export const ErrorState: Story = {
  name: "Error",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Checkbox id="error" aria-invalid={true} />
      <Label htmlFor="error" style={{ color: "var(--s-danger-fg)" }}>
        Campo obrigatório
      </Label>
    </div>
  ),
};
