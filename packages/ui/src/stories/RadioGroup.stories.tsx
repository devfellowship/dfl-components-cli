import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem, RadioGroupRow } from "../components/radio-group";
import { Label } from "../components/label";

/**
 * RadioGroup — DS v0 token-native. One story per state.
 *
 * Key behaviours:
 *   - Unselected border: --c-radio-border → --s-border-strong (#3a3530), NOT amber.
 *   - Checked border + dot: --c-radio-border-checked → --s-brand-solid (#E07A4A).
 *   - Focus ring: box-shadow 0 0 0 2px page-bg, 0 0 0 3px #E07A4A (instant, no transition).
 *   - Indicator: pure CSS div, not a Lucide icon.
 *
 * Hover and Focus stories use inline style overrides on RadioGroupItem to snapshot
 * the interactive visual state on the story canvas (the real CSS `:hover` /
 * `:focus-visible` rules behave identically in the live component).
 */
const meta: Meta<typeof RadioGroup> = {
  title: "Components/Atoms/RadioGroup",
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/** Default — one item checked. Unselected items show --s-border-strong (neutral, not amber). */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <RadioGroupRow value="default" id="d1">Padrão</RadioGroupRow>
      <RadioGroupRow value="comfortable" id="d2">Confortável</RadioGroupRow>
      <RadioGroupRow value="compact" id="d3">Compacto</RadioGroupRow>
    </RadioGroup>
  ),
};

/**
 * Hover — unchecked item shows --s-ink-muted border; checked item shows --s-brand-hover.
 * Inline styles snapshot the hover visual state for the canvas.
 */
export const Hover: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      {/* Unchecked item: simulated hover → --c-radio-border-hover (#7d7568) */}
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem
          value="default"
          id="h1"
          style={{ borderColor: "var(--c-radio-border-hover)" }}
        />
        <Label htmlFor="h1" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Padrão (hover)
        </Label>
      </div>
      {/* Checked item: simulated hover → --s-brand-hover (#ea915a) */}
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem
          value="comfortable"
          id="h2"
          style={{ borderColor: "var(--s-brand-hover)" }}
        />
        <Label htmlFor="h2" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Confortável (hover + checked)
        </Label>
      </div>
      {/* Resting item (no hover) */}
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem value="compact" id="h3" />
        <Label htmlFor="h3" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Compacto
        </Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * FocusUnchecked — keyboard focus on an unchecked item.
 * Ring: box-shadow 0 0 0 2px page-bg, 0 0 0 3px #E07A4A (instant).
 * Border also turns amber on focus for ring contrast (focus-visible rule).
 */
export const FocusUnchecked: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      {/* Focused unchecked item: DFL ring + amber border */}
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem
          value="default"
          id="fu1"
          style={{
            borderColor: "var(--c-radio-border-checked)",
            boxShadow:
              "0 0 0 2px var(--s-surface-page), 0 0 0 3px var(--s-brand-solid)",
          }}
        />
        <Label htmlFor="fu1" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Padrão (focus)
        </Label>
      </div>
      {/* Checked item — not focused */}
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem value="comfortable" id="fu2" />
        <Label htmlFor="fu2" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Confortável
        </Label>
      </div>
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem value="compact" id="fu3" />
        <Label htmlFor="fu3" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Compacto
        </Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * FocusChecked — keyboard focus lands on the checked item.
 * Same uniform ring over the amber border + filled dot.
 */
export const FocusChecked: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem value="default" id="fc1" />
        <Label htmlFor="fc1" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Padrão
        </Label>
      </div>
      {/* Checked + focused: amber border + dot + DFL ring */}
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem
          value="comfortable"
          id="fc2"
          style={{
            borderColor: "var(--c-radio-border-checked)",
            boxShadow:
              "0 0 0 2px var(--s-surface-page), 0 0 0 3px var(--s-brand-solid)",
          }}
        />
        <Label htmlFor="fc2" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Confortável (focus + checked)
        </Label>
      </div>
      <div className="flex items-center gap-[var(--c-radio-label-gap)]">
        <RadioGroupItem value="compact" id="fc3" />
        <Label htmlFor="fc3" className="cursor-pointer select-none text-sm [color:var(--c-radio-label-fg)]">
          Compacto
        </Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Disabled — whole group disabled. Circle opacity 0.45; label uses --s-ink-disabled;
 * checked dot visible at reduced brand alpha (natural consequence of 0.45 opacity on circle).
 */
export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" disabled>
      <RadioGroupRow value="default" id="dis1" disabled>Padrão</RadioGroupRow>
      <RadioGroupRow value="comfortable" id="dis2" disabled>Confortável</RadioGroupRow>
      <RadioGroupRow value="compact" id="dis3" disabled>Compacto</RadioGroupRow>
    </RadioGroup>
  ),
};

/**
 * ItemDisabled — a single item is disabled while siblings remain interactive.
 * Disabled item: circle opacity 0.45, label --s-ink-disabled, cursor not-allowed.
 */
export const ItemDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="available">
      <RadioGroupRow value="available" id="id1">Disponível</RadioGroupRow>
      <RadioGroupRow value="unavailable" id="id2" disabled>Indisponível</RadioGroupRow>
      <RadioGroupRow value="other" id="id3">Outra opção</RadioGroupRow>
    </RadioGroup>
  ),
};
