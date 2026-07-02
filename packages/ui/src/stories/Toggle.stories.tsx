import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Bold as BoldIcon, Italic as ItalicIcon } from "lucide-react";
import { Toggle } from "../components/toggle";

/**
 * Toggle — DFL Design System v0 · one state per story.
 *
 * Brand-gate fixes verified by these stories:
 *   · On-state: --c-toggle-bg-on (brand-subtle, 10% tint) + --c-toggle-fg-on
 *     (brand-fg, amber-300) — reads as "selected", NOT a primary CTA button.
 *   · Focus ring: 2px page-coloured gap + 1px amber #E07A4A, transition:none
 *     (instant, no animated ring).
 *   · Outline hover: step-up surface (--s-surface-raised), NOT solid amber fill.
 *   · Disabled: 38 % opacity, pointer-events-none.
 *
 * Token layer: --c-toggle-* (Layer 3) → --s-{ink,surface,brand,border}-* (Layer 2).
 */
const meta: Meta<typeof Toggle> = {
  title: "Components/Atoms/Toggle",
  component: Toggle,
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

/**
 * Default / Idle — icon-only toggle, default variant, no pressed state.
 * Verifies base --c-toggle-bg (transparent) + --c-toggle-fg (ink-secondary).
 */
export const DefaultIdle: Story = {
  name: "Default / Idle",
  render: () => (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
};

/**
 * Default / On — defaultPressed=true.
 * Verifies on-state renders --c-toggle-bg-on (brand-subtle) + --c-toggle-fg-on
 * (brand-fg, amber-300) — NOT solid amber fill.
 */
export const DefaultOn: Story = {
  name: "Default / On",
  render: () => (
    <Toggle aria-label="Toggle bold" defaultPressed>
      <BoldIcon />
    </Toggle>
  ),
};

/**
 * Default / Focus — keyboard-focused toggle.
 * Verifies the uniform DFL focus ring:
 *   box-shadow: 0 0 0 2px var(--background), 0 0 0 3px #E07A4A
 *   transition: none (instant, no animation).
 * Element is focused on mount via useEffect so the ring is visible immediately.
 */
export const DefaultFocus: Story = {
  name: "Default / Focus",
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wrapRef = React.useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const el = wrapRef.current?.querySelector<HTMLElement>('[data-slot="toggle"]');
      el?.focus();
    }, []);
    return (
      <div ref={wrapRef}>
        <Toggle aria-label="Toggle bold">
          <BoldIcon />
        </Toggle>
      </div>
    );
  },
};

/**
 * Default / Disabled — disabled prop applied.
 * Verifies 38 % opacity (disabled:opacity-[.38]) and pointer-events-none;
 * no hover or active state should apply.
 */
export const DefaultDisabled: Story = {
  name: "Default / Disabled",
  render: () => (
    <Toggle aria-label="Toggle bold" disabled>
      <BoldIcon />
    </Toggle>
  ),
};

/**
 * Outline / On — outline variant in pressed/active state.
 * Verifies brand-subtle bg + brand-border (same on-state treatment as default
 * variant) and confirms NO solid-amber hover leak: the outline-idle border
 * (--c-toggle-outline-border) is overridden by border-on on press, and
 * outline hover uses --s-surface-raised step-up, not bg-accent.
 */
export const OutlineOn: Story = {
  name: "Outline / On",
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic" defaultPressed>
      <ItalicIcon />
    </Toggle>
  ),
};

/**
 * WithText / On — icon + text label, pressed state.
 * Verifies text colour shifts to --c-toggle-fg-on (amber-300) at correct weight
 * without solid amber bleed; confirms layout with gap-2 between icon and label.
 */
export const WithTextOn: Story = {
  name: "WithText / On",
  render: () => (
    <Toggle aria-label="Toggle bold" defaultPressed>
      <BoldIcon />
      Negrito
    </Toggle>
  ),
};
