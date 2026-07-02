import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../components/label";
import { Input } from "../components/input";

/**
 * Label — one state per story. argTypes mirror the real cva:
 *   variant: default (Inter 12px/500, form fields) | mono (JetBrains Mono uppercase, meta).
 *   state: default | error | disabled.
 *
 * Token layer: component reads --c-label-* (Layer 3) → --s-* (Layer 2).
 * Required asterisk uses --c-label-required-color (→ --s-brand-solid, amber).
 * Error label uses --c-label-fg-error (→ --s-danger-fg, #e89898).
 */
const meta: Meta<typeof Label> = {
  title: "Components/Atoms/Label",
  component: Label,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "mono"],
    },
    state: {
      control: "select",
      options: ["default", "error", "disabled"],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

/** Default — Inter 12px/500, --c-label-fg (--s-ink-secondary). Plain label, no pairing. */
export const Default: Story = {
  args: { children: "Nome completo", variant: "default" },
};

/** Mono — uppercase JetBrains Mono 10.5px, --c-label-fg-muted. For table headers / key lists. */
export const Mono: Story = {
  args: { children: "created_at", variant: "mono" },
};

/** WithInput — standard form-field composition; demonstrates htmlFor wiring. */
export const WithInput: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="demo-with-input">Email</Label>
      <Input id="demo-with-input" type="email" placeholder="voce@exemplo.com" />
    </div>
  ),
};

/**
 * Required — amber asterisk child (aria-hidden, --c-label-required-color = --s-brand-solid).
 * The asterisk is a presentational child span; screen readers skip it (aria-hidden).
 * Semantics are conveyed via aria-required on the paired input.
 */
export const Required: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="demo-required">
        Senha
        <span
          aria-hidden="true"
          style={{ color: "var(--c-label-required-color)", marginLeft: "2px" }}
        >
          *
        </span>
      </Label>
      <Input
        id="demo-required"
        type="password"
        placeholder="••••••••"
        aria-required="true"
      />
    </div>
  ),
};

/**
 * Optional — italic "(opcional)" suffix for non-required fields.
 * Uses --c-label-fg-muted to visually subordinate the hint without adding noise.
 * Keeps required / optional balance scannable across a form.
 */
export const Optional: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="demo-optional">
        Apelido{" "}
        <span className="font-normal italic text-[var(--c-label-fg-muted)]">
          (opcional)
        </span>
      </Label>
      <Input
        id="demo-optional"
        type="text"
        placeholder="Como prefere ser chamado"
      />
    </div>
  ),
};

/**
 * Error — label adopts --c-label-fg-error (--s-danger-fg, #e89898) via state="error".
 * Validates: label color mirrors field validity; hint message reuses the same token.
 * Input uses aria-invalid="true" which triggers --c-input-border-error via the DS.
 */
export const Error: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="demo-error" state="error">
        Email
      </Label>
      <Input
        id="demo-error"
        type="email"
        defaultValue="invalido@"
        aria-invalid="true"
      />
      <span
        className="text-[11px] leading-none"
        style={{ color: "var(--c-label-fg-error)" }}
      >
        Formato de e-mail inválido.
      </span>
    </div>
  ),
};

/**
 * Disabled — reduced opacity + cursor:not-allowed via state="disabled".
 * Validates: explicit disabled state for label-first layouts (where peer-disabled
 * cannot propagate because the input follows the label in DOM order).
 * The peer-disabled Tailwind classes remain on the base for reversed layouts.
 */
export const Disabled: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="demo-disabled" state="disabled">
        CPF
      </Label>
      <Input
        id="demo-disabled"
        type="text"
        defaultValue="000.000.000-00"
        disabled
      />
    </div>
  ),
};
