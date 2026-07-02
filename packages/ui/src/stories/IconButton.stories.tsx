import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import { Search, Trash2, Plus } from "lucide-react";
import { IconButton } from "../components/icon-button";

/**
 * IconButton — one state per story.
 *
 * Variants: ghost | outline | solid | destructive
 * Sizes:    xs (20×20) | sm (28×28) | default (34×34) | lg (40×40)
 *
 * `aria-label` is REQUIRED — icon-only buttons need an accessible name.
 *
 * Focus stories use a `play` function that programmatically focuses the
 * button so the two-layer DFL focus ring (2px page-gap + 1px solid amber)
 * is visible for visual regression / review.
 *
 * Pressed state (aria-pressed=true) applies --s-brand-subtle bg +
 * --s-brand-fg text (Toolbar "active" pattern).
 */
const meta: Meta<typeof IconButton> = {
  title: "Components/Atoms/IconButton",
  component: IconButton,
  argTypes: {
    variant: {
      control: "select",
      options: ["ghost", "outline", "solid", "destructive"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// ── Ghost ──────────────────────────────────────────────────────────────────

/** Ghost variant — resting state. Transparent bg, muted icon. */
export const GhostDefault: Story = {
  name: "Ghost/Default",
  args: { variant: "ghost", "aria-label": "Buscar" },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
};

/**
 * Ghost variant — keyboard focus state.
 * Shows the DFL uniform focus ring: 2px page-color gap + 1px solid amber,
 * applied via box-shadow (NOT a Tailwind ring halo).
 */
export const GhostFocus: Story = {
  name: "Ghost/Focus",
  args: { variant: "ghost", "aria-label": "Buscar" },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("button").focus();
  },
};

/** Ghost + aria-pressed=true — Toolbar "active" item (brand-subtle bg, brand-fg icon). */
export const GhostPressed: Story = {
  name: "Ghost/Pressed",
  args: { variant: "ghost", "aria-label": "Buscar", "aria-pressed": true },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
};

/** Ghost variant — disabled state. Opacity 50%, no pointer events. */
export const GhostDisabled: Story = {
  name: "Ghost/Disabled",
  args: { variant: "ghost", "aria-label": "Buscar", disabled: true },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
};

// ── Outline ──────────────────────────────────────────────────────────────────

/** Outline variant — resting state. Visible border, transparent bg. */
export const OutlineDefault: Story = {
  name: "Outline/Default",
  args: { variant: "outline", "aria-label": "Adicionar" },
  render: (args) => (
    <IconButton {...args}>
      <Plus />
    </IconButton>
  ),
};

/**
 * Outline variant — keyboard focus state.
 * The two-layer ring (2px gap + 1px amber) clears the visible border
 * visually — ring appears outside the border, not blended into it.
 */
export const OutlineFocus: Story = {
  name: "Outline/Focus",
  args: { variant: "outline", "aria-label": "Adicionar" },
  render: (args) => (
    <IconButton {...args}>
      <Plus />
    </IconButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("button").focus();
  },
};

/** Outline variant — disabled state. */
export const OutlineDisabled: Story = {
  name: "Outline/Disabled",
  args: { variant: "outline", "aria-label": "Adicionar", disabled: true },
  render: (args) => (
    <IconButton {...args}>
      <Plus />
    </IconButton>
  ),
};

// ── Solid ──────────────────────────────────────────────────────────────────

/** Solid variant — resting state. Amber-500 fill, page-color icon. */
export const SolidDefault: Story = {
  name: "Solid/Default",
  args: { variant: "solid", "aria-label": "Adicionar" },
  render: (args) => (
    <IconButton {...args}>
      <Plus />
    </IconButton>
  ),
};

/**
 * Solid variant — keyboard focus state.
 * The 2px page-color gap separates the amber fill from the 1px solid
 * amber outline, creating a visible ring even against the amber surface.
 */
export const SolidFocus: Story = {
  name: "Solid/Focus",
  args: { variant: "solid", "aria-label": "Adicionar" },
  render: (args) => (
    <IconButton {...args}>
      <Plus />
    </IconButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("button").focus();
  },
};

// ── Destructive ──────────────────────────────────────────────────────────────

/** Destructive variant — resting state. Transparent bg, danger-fg icon. */
export const DestructiveDefault: Story = {
  name: "Destructive/Default",
  args: { variant: "destructive", "aria-label": "Excluir" },
  render: (args) => (
    <IconButton {...args}>
      <Trash2 />
    </IconButton>
  ),
};

/**
 * Destructive variant — keyboard focus state.
 * Focus ring remains the uniform amber ring (not red) per brand spec.
 */
export const DestructiveFocus: Story = {
  name: "Destructive/Focus",
  args: { variant: "destructive", "aria-label": "Excluir" },
  render: (args) => (
    <IconButton {...args}>
      <Trash2 />
    </IconButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("button").focus();
  },
};

// ── Sizes (ghost / default state) ────────────────────────────────────────────

/** XS size — 20×20px touch target, 12px icon. Ghost variant at rest. */
export const SizeXS: Story = {
  name: "Size/XS",
  args: { variant: "ghost", size: "xs", "aria-label": "Buscar" },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
};

/** SM size — 28×28px touch target, 14px icon. Ghost variant at rest. */
export const SizeSM: Story = {
  name: "Size/SM",
  args: { variant: "ghost", size: "sm", "aria-label": "Buscar" },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
};

/** LG size — 40×40px touch target, 18px icon. Ghost variant at rest. */
export const SizeLG: Story = {
  name: "Size/LG",
  args: { variant: "ghost", size: "lg", "aria-label": "Buscar" },
  render: (args) => (
    <IconButton {...args}>
      <Search />
    </IconButton>
  ),
};
