import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "../components/kbd";

/**
 * Kbd — one story per state/variant.
 *
 * Single-key chip with physical-key depth shadow.
 * Token layer: --c-kbd-* → --s-* → --p-*
 *
 *   --c-kbd-bg        → --s-surface-raised   resting key surface
 *   --c-kbd-bg-depth  → --s-surface-panel    bottom shadow ridge (3D depth)
 *   --c-kbd-border    → --s-border-subtle    key border
 *   --c-kbd-fg        → --s-ink-primary      label ink (upgraded from ink-secondary)
 *   --c-kbd-shine     rgba(255,255,255,0.055) top inner highlight
 *   --c-kbd-radius    → --p-radius-sm        4px
 */
const meta: Meta<typeof Kbd> = {
  title: "Atoms/Kbd",
  component: Kbd,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

/**
 * Default resting state — depth box-shadow gives the 3D "pressable" affordance.
 * Label uses --c-kbd-fg (→ --s-ink-primary) for full legibility at 10.5px mono.
 * Height: 20px · radius: 4px.
 */
export const Default: Story = {
  args: { children: "K", size: "default" },
};

/**
 * Small — 17px height, 3px radius, 9.5px mono uppercase.
 * Primary use: compact UI density, Button trailing shortcut hints.
 */
export const Small: Story = {
  args: { children: "K", size: "sm" },
};

/**
 * Large — 24px height, 4px radius, 12px mono uppercase.
 * Primary use: onboarding overlays, keyboard shortcut cheat sheets, empty states.
 */
export const Large: Story = {
  args: { children: "K", size: "lg" },
};

/**
 * Combination — ⌘+K and ⌘+⇧+P with '+' separator spans between chips.
 * The separator renders in --s-ink-muted / sans-serif so it is visually
 * distinct from the monospaced key labels.
 */
export const Combination: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {/* ⌘ K — command palette */}
      <span className="inline-flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <span
          aria-hidden="true"
          style={{
            color: "var(--s-ink-muted)",
            fontFamily: "var(--p-font-sans)",
            fontSize: "11px",
            margin: "0 2px",
          }}
        >
          +
        </span>
        <Kbd>K</Kbd>
      </span>
      {/* ⌘ ⇧ P — run command */}
      <span className="inline-flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <span
          aria-hidden="true"
          style={{
            color: "var(--s-ink-muted)",
            fontFamily: "var(--p-font-sans)",
            fontSize: "11px",
            margin: "0 2px",
          }}
        >
          +
        </span>
        <Kbd>⇧</Kbd>
        <span
          aria-hidden="true"
          style={{
            color: "var(--s-ink-muted)",
            fontFamily: "var(--p-font-sans)",
            fontSize: "11px",
            margin: "0 2px",
          }}
        >
          +
        </span>
        <Kbd>P</Kbd>
      </span>
    </div>
  ),
};

/**
 * SymbolKeys — grid of modifier / navigation symbols at default size.
 * Primary use-case: keyboard shortcut reference tables, onboarding overlays,
 * help panels listing available modifier keys.
 */
export const SymbolKeys: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      {(["⌘", "⌥", "⇧", "⌃", "↑", "↓", "←", "→", "⏎", "⌫", "Tab", "Esc"] as const).map(
        (key) => (
          <Kbd key={key}>{key}</Kbd>
        ),
      )}
    </div>
  ),
};

/**
 * InContext — Kbd chips rendered inline with surrounding prose text
 * and as a Button trailing shortcut hint.
 * Demonstrates vertical alignment at 13px body copy and inside a button-like element.
 */
export const InContext: Story = {
  render: () => (
    <div
      className="flex flex-col gap-4"
      style={{ color: "var(--s-ink-secondary)", fontSize: "13px", lineHeight: "1.7" }}
    >
      {/* Prose line 1 — command shortcut */}
      <p>
        Press{" "}
        <span className="inline-flex items-center">
          <Kbd>⌘</Kbd>
          <span
            aria-hidden="true"
            style={{
              color: "var(--s-ink-muted)",
              fontFamily: "var(--p-font-sans)",
              fontSize: "11px",
              margin: "0 2px",
            }}
          >
            +
          </span>
          <Kbd>K</Kbd>
        </span>{" "}
        to open the command palette.
      </p>
      {/* Prose line 2 — navigation keys */}
      <p>
        Use <Kbd>↑</Kbd> and <Kbd>↓</Kbd> to navigate, then <Kbd>⏎</Kbd> to confirm.
      </p>
      {/* Prose line 3 — dismiss key */}
      <p>
        Hit <Kbd>Esc</Kbd> to dismiss this dialog.
      </p>
      {/* Button trailing shortcut hint */}
      <div>
        <span
          className="inline-flex items-center gap-2"
          style={{
            background: "var(--s-surface-elevated)",
            border: "1px solid var(--s-border-subtle)",
            borderRadius: "6px",
            padding: "4px 10px 4px 12px",
            fontSize: "13px",
            color: "var(--s-ink-secondary)",
          }}
        >
          Open palette
          <span className="inline-flex items-center gap-0.5">
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">K</Kbd>
          </span>
        </span>
      </div>
    </div>
  ),
};
