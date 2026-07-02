/**
 * Select — DFL Design System v0
 *
 * One story per state (strict DS v0 convention).
 * Token hierarchy: --c-select-* → --s-* → --p-*
 *
 * State catalogue:
 *   Default    — empty trigger, placeholder visible
 *   WithValue  — trigger showing a selected value
 *   Hover      — border escalated to --c-select-border-hover (sand-600) [forced visual]
 *   Focus      — canonical DFL focus ring + amber border [forced visual]
 *   Open       — dropdown visible; chevron rotated 180° + amber; items: default/selected/highlighted/disabled
 *   Disabled   — opacity 0.45, cursor not-allowed
 *   Error      — danger-solid border + danger-fg helper text
 *   WithLabel  — field composition: Label ↑, trigger, helper text ↓ (default resting state)
 */

import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../components/select";

const meta: Meta<typeof Select> = {
  title: "Components/Molecules/Select",
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

/* ── Shared items used across multiple stories ─────────────────────────── */
const NivelItems = () => (
  <>
    <SelectItem value="basico">Opção 1 — Básico</SelectItem>
    <SelectItem value="avancado">Opção 2 — Avançado</SelectItem>
    <SelectItem value="expert">Opção 3 — Expert</SelectItem>
    <SelectSeparator />
    <SelectItem value="master">Opção 4 — Master</SelectItem>
  </>
);

/* ── 1. Default — empty trigger, placeholder ──────────────────────────── */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger style={{ width: "240px" }}>
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent>
        <NivelItems />
      </SelectContent>
    </Select>
  ),
};

/* ── 2. WithValue — trigger displaying a selected value ───────────────── */
export const WithValue: Story = {
  render: () => (
    <Select defaultValue="avancado">
      <SelectTrigger style={{ width: "240px" }}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <NivelItems />
      </SelectContent>
    </Select>
  ),
};

/* ── 3. Hover — border escalated to sand-600 (forced visual state) ─────
 *  Simulates :hover by overriding borderColor inline; the chevron
 *  inherits from --c-select-icon-color-hover via CSS cascade on the
 *  trigger's --c-select-icon-color local override.
 * ─────────────────────────────────────────────────────────────────────── */
export const Hover: Story = {
  render: () => (
    <Select>
      <SelectTrigger
        style={
          {
            width: "240px",
            borderColor: "var(--c-select-border-hover)",
            /* override icon-color token locally so ChevronDown picks it up */
            "--c-select-icon-color": "var(--c-select-icon-color-hover)",
          } as React.CSSProperties
        }
      >
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent>
        <NivelItems />
      </SelectContent>
    </Select>
  ),
};

/* ── 4. Focus — amber border + canonical DFL focus ring (forced visual) ─
 *  Simulates :focus-visible by applying outline inline.
 *  Real focus ring is delivered by .ds-focus-ring:focus-visible in tokens.css.
 * ─────────────────────────────────────────────────────────────────────── */
export const Focus: Story = {
  render: () => (
    <Select>
      <SelectTrigger
        style={{
          width: "240px",
          borderColor: "var(--c-select-border-focus)",
          outline: "1px solid var(--c-select-border-focus)",
          outlineOffset: "3px",
        }}
      >
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent>
        <NivelItems />
      </SelectContent>
    </Select>
  ),
};

/* ── 5. Open — dropdown expanded; chevron rotated 180° + amber ──────────
 *  Uses defaultOpen + defaultValue so the selected item has the amber check.
 *  Wrapper padding keeps the dropdown visible inside the story canvas.
 * ─────────────────────────────────────────────────────────────────────── */
export const Open: Story = {
  render: () => (
    <div style={{ paddingBottom: "220px" }}>
      <Select defaultOpen defaultValue="avancado">
        <SelectTrigger style={{ width: "240px" }}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Nível</SelectLabel>
            <SelectItem value="basico">Opção 1 — Básico</SelectItem>
            <SelectItem value="avancado">Opção 2 — Avançado</SelectItem>
            <SelectItem value="expert">Opção 3 — Expert</SelectItem>
            <SelectSeparator />
            <SelectItem value="master" disabled>
              Opção 4 — Master (desabilitado)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

/* ── 6. Disabled — opacity 0.45, cursor not-allowed ───────────────────── */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger style={{ width: "240px" }}>
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent>
        <NivelItems />
      </SelectContent>
    </Select>
  ),
};

/* ── 7. Error — danger-solid border + danger-fg helper text ────────────── */
export const Error: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "240px" }}>
      <Select>
        <SelectTrigger style={{ width: "240px" }} error>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <NivelItems />
        </SelectContent>
      </Select>
      <span
        style={{
          fontSize: "12px",
          color: "var(--s-danger-fg)",
          lineHeight: 1.4,
        }}
      >
        Este campo é obrigatório.
      </span>
    </div>
  ),
};

/* ── 8. WithLabel — field stack: Label above, trigger, helper text below ─
 *  Uses the DFL Label atom with default variant (12px / weight 500 / sand-200).
 * ─────────────────────────────────────────────────────────────────────── */
export const WithLabel: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "240px" }}>
      <label
        htmlFor="select-nivel"
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--s-ink-secondary)",
          lineHeight: 1.4,
        }}
      >
        Nível do curso
      </label>
      <Select>
        <SelectTrigger id="select-nivel" style={{ width: "240px" }}>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <NivelItems />
        </SelectContent>
      </Select>
      <span
        style={{
          fontSize: "12px",
          color: "var(--s-ink-muted)",
          lineHeight: 1.4,
        }}
      >
        Escolha o nível de dificuldade
      </span>
    </div>
  ),
};
