import type { Meta, StoryObj } from "@storybook/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";

/**
 * ToggleGroup — one state per story (per the DS "1 story = 1 state" rule).
 *
 * Token contract verified by each story:
 *   • Active bg  → --c-toggle-bg-active  (--s-brand-subtle, amber wash)
 *   • Active fg  → --c-toggle-fg-active  (--s-brand-fg, amber-300)
 *   • Focus ring → --c-toggle-focus-ring (0 0 0 2px page-bg + 0 0 0 3px #E07A4A)
 *   • Borders    → --c-toggle-border     (--s-border-subtle)
 *   • Disabled   → 40% opacity + pointer-events:none
 *
 * `type` ("single" | "multiple") controls the selection model.
 * `variant` and `size` are set on the group and flow via React context.
 */
const meta: Meta<typeof ToggleGroup> = {
  title: "Components/Molecules/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    type: { control: "inline-radio", options: ["single", "multiple"] },
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

/**
 * DefaultSingleSelect — default variant, single-select type, center item
 * pre-selected. Verify: active item shows amber-wash bg (--s-brand-subtle)
 * and amber-300 fg (--s-brand-fg), NOT the generic --accent / --muted tokens.
 */
export const DefaultSingleSelect: Story = {
  render: () => (
    <ToggleGroup type="single" variant="default" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Alinhar à esquerda">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Centralizar">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Alinhar à direita">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * DefaultMultiSelect — default variant, multiple-select type, two items
 * active simultaneously. Verify: each active item independently shows
 * brand-subtle wash; unselected items remain at ink-muted fg.
 */
export const DefaultMultiSelect: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="default" defaultValue={["bold", "italic"]}>
      <ToggleGroupItem value="bold" aria-label="Negrito">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Itálico">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Sublinhado">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * OutlineRest — outline variant, all items unselected. Verify: outer border
 * + inter-item dividers use --c-toggle-border (--s-border-subtle); no
 * double-border artifacts; no active amber wash visible.
 */
export const OutlineRest: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Negrito">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Itálico">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Sublinhado">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * OutlineActive — outline variant, one or more items active. Verify:
 * brand-subtle amber wash on active items; inset top-highlight
 * (--c-toggle-outline-active-shadow: inset 0 1px 0 rgba(224,122,74,.3))
 * renders inside the outlined container.
 */
export const OutlineActive: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="outline" defaultValue={["bold", "underline"]}>
      <ToggleGroupItem value="bold" aria-label="Negrito">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Itálico">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Sublinhado">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * FocusRing — default variant, first item keyboard-focused (autoFocus).
 * Verify: box-shadow is exactly 0 0 0 2px page-bg + 0 0 0 3px #E07A4A
 * (--c-toggle-focus-ring); focused item has z-index:10 so ring is NOT
 * clipped by adjacent siblings.
 */
export const FocusRing: Story = {
  render: () => (
    <ToggleGroup type="single" variant="default" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Alinhar à esquerda" autoFocus>
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Centralizar">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Alinhar à direita">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * Disabled — whole group disabled + partial per-item disabled shown side-by-side.
 * Verify: 40% opacity on disabled items; pointer-events:none; active state
 * still visually readable at reduced opacity to preserve context.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Whole group disabled — all items at 40% opacity */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-[var(--s-ink-muted)] uppercase tracking-wide">
          Whole group disabled
        </span>
        <ToggleGroup type="single" variant="default" defaultValue="center" disabled>
          <ToggleGroupItem value="left" aria-label="Alinhar à esquerda">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Centralizar">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Alinhar à direita">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Per-item disabled — only middle item disabled */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-[var(--s-ink-muted)] uppercase tracking-wide">
          Per-item disabled (center item)
        </span>
        <ToggleGroup type="single" variant="default" defaultValue="left">
          <ToggleGroupItem value="left" aria-label="Alinhar à esquerda">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Centralizar" disabled>
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Alinhar à direita">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};
