import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/badge";

/**
 * Badge — one state per story.
 *
 * argTypes mirror the real cva variants + shape prop.
 * Focus ring: tab into any badge below to see the DS uniform amber ring
 * (badge must receive tabIndex + role for interactive contexts).
 */
const meta: Meta<typeof Badge> = {
  title: "Components/Atoms/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "danger", "outline", "success", "warning", "info"],
    },
    shape: {
      control: "select",
      options: ["pill", "square"],
    },
    fill: {
      control: "select",
      options: ["subtle", "solid"],
    },
    dot: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

/**
 * Default — subtle brand (amber) tinted label.
 * bg: --s-brand-subtle · text: --s-brand-fg · border: --s-brand-border
 * Replaces the old solid bg-primary (#E07A4A) fill that competed with buttons.
 */
export const Default: Story = {
  args: { children: "In Review", variant: "default", shape: "pill" },
};

/**
 * Secondary — neutral surface label for draft / archived / inactive states.
 * bg: --s-surface-raised · text: --s-ink-secondary · border: --s-border-subtle
 */
export const Secondary: Story = {
  args: { children: "Draft", variant: "secondary", shape: "pill" },
};

/**
 * Danger — subtle danger pattern (renamed from Destructive).
 * bg: --s-danger-subtle · text: --s-danger-fg · border: --s-danger-border
 * Replaces the old solid bg-destructive (#e07a7a) fill.
 */
export const Danger: Story = {
  args: { children: "Blocked", variant: "danger", shape: "pill" },
};

/**
 * Outline — transparent bg, explicit --s-border-strong border.
 * Was inheriting raw Tailwind `border` with no explicit token reference.
 */
export const Outline: Story = {
  args: { children: "v1.0.0", variant: "outline", shape: "pill" },
};

/**
 * Success — new variant for completed / active / published states.
 * bg: --s-success-subtle · text: --s-success-fg · border: --s-success-border
 */
export const Success: Story = {
  args: { children: "Published", variant: "success", shape: "pill" },
};

/**
 * Warning — new variant for pending / expiring / attention states.
 * bg: --s-warning-subtle · text: --s-warning-fg · border: --s-warning-border
 */
export const Warning: Story = {
  args: { children: "Pending", variant: "warning", shape: "pill" },
};

/**
 * Info — new variant for in-progress / beta / informational states.
 * bg: --s-info-subtle · text: --s-info-fg · border: --s-info-border
 *
 * Also exercises the `shape` prop: switch to shape="square" in the controls
 * to wire --c-badge-radius (4px) instead of --c-pill-radius (999px).
 */
export const InfoVariant: Story = {
  name: "Info",
  args: { children: "In Progress", variant: "info", shape: "pill" },
};

/**
 * Shape — square radius via --c-badge-radius (4px).
 * Preferred for dense table cells and list rows.
 */
export const ShapeSquare: Story = {
  args: { children: "Category", variant: "default", shape: "square" },
};

// ── Solid fill (count indicators / emphatic status) ───────────────────────────

/** Solid default — amber fill + inverse ink (--c-badge-solid-default-bg). */
export const SolidDefault: Story = {
  args: { children: "New", variant: "default", fill: "solid" },
};

/** Solid success — count / "Done" chip on a solid green fill. */
export const SolidSuccess: Story = {
  args: { children: "Done", variant: "success", fill: "solid" },
};

/** Solid danger — emphatic "Blocked" on a solid red fill. */
export const SolidDanger: Story = {
  args: { children: "Blocked", variant: "danger", fill: "solid" },
};

/** Solid info — numeric count indicator on solid blue. */
export const SolidCount: Story = {
  args: { children: "12", variant: "info", fill: "solid", shape: "pill" },
};

// ── Status dot ────────────────────────────────────────────────────────────────

/** With status dot — leading dot coloured by the badge's intent (currentColor). */
export const WithStatusDot: Story = {
  args: { children: "Active", variant: "success", dot: true },
};

/** Status dot on a pending (warning) chip. */
export const WithStatusDotPending: Story = {
  name: "WithStatusDot-Pending",
  args: { children: "Pending", variant: "warning", dot: true },
};
