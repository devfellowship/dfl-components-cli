import type { Meta, StoryObj } from "@storybook/react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarStatus,
} from "../components/avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Atoms/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// ── Core states ──────────────────────────────────────────────────────────────

/** Image loaded successfully — AvatarFallback is suppressed. */
export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
};

/** No src provided — AvatarFallback renders with --c-avatar-fallback-bg token. */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>DFL</AvatarFallback>
    </Avatar>
  ),
};

/** Broken/missing src — Radix swaps to AvatarFallback after load error. */
export const ImageError: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid.example/nope.png" alt="broken" />
      <AvatarFallback>DF</AvatarFallback>
    </Avatar>
  ),
};

// ── Size variants ─────────────────────────────────────────────────────────────

/** sm — 24 px circle, 8 px fallback text. */
export const SizeSm: Story = {
  name: "Size-sm",
  render: () => (
    <Avatar size="sm">
      <AvatarFallback>TF</AvatarFallback>
    </Avatar>
  ),
};

/** md — 32 px circle, 11 px fallback text. */
export const SizeMd: Story = {
  name: "Size-md",
  render: () => (
    <Avatar size="md">
      <AvatarFallback>TF</AvatarFallback>
    </Avatar>
  ),
};

/** lg — 48 px circle, 16 px fallback text. */
export const SizeLg: Story = {
  name: "Size-lg",
  render: () => (
    <Avatar size="lg">
      <AvatarFallback>TF</AvatarFallback>
    </Avatar>
  ),
};

/** xl — 64 px circle, 22 px fallback text. */
export const SizeXl: Story = {
  name: "Size-xl",
  render: () => (
    <Avatar size="xl">
      <AvatarFallback>TF</AvatarFallback>
    </Avatar>
  ),
};

// ── Interactive states ────────────────────────────────────────────────────────

/**
 * Avatar wrapped in a button trigger showing the DS uniform amber focus ring.
 *
 * Ring spec: outline 1px solid var(--s-border-focus) (#E07A4A), offset 3px,
 * transition: none. Applied on the wrapper element, not the Avatar itself,
 * so the full circle + ring are visible without clipping.
 *
 * In production, use :focus-visible so the ring only appears on keyboard focus.
 * This story renders it statically to make it visible in the canvas.
 */
export const FocusVisible: Story = {
  render: () => (
    <button
      type="button"
      aria-label="Open user menu"
      style={{
        appearance: "none",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        borderRadius: "999px",
        lineHeight: 0,
        // DS uniform focus ring — amber, 1 px, offset 3 px, no transition.
        // In real usage this lives under :focus-visible.
        outline: "1px solid var(--s-border-focus)",
        outlineOffset: "3px",
      }}
    >
      <Avatar>
        <AvatarFallback>TF</AvatarFallback>
      </Avatar>
    </button>
  ),
};

// ── Tones ─────────────────────────────────────────────────────────────────────

/** Brand tone — DFL amber fallback (--c-avatar-brand-bg), dark ink. */
export const BrandTone: Story = {
  name: "Tone-brand (amber)",
  render: () => (
    <Avatar>
      <AvatarFallback tone="brand">DF</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Member palette — deterministic colour hashed from the seed so a given person
 * is always the same colour. Twelve muted jewel tones (--c-avatar-member-N).
 */
export const MemberPalette: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST", "UV", "WX"].map(
        (s) => (
          <Avatar key={s}>
            <AvatarFallback tone="member" seed={s}>
              {s}
            </AvatarFallback>
          </Avatar>
        ),
      )}
    </div>
  ),
};

// ── Status indicator ──────────────────────────────────────────────────────────

/** Online — green presence dot, ringed in page colour. */
export const StatusOnline: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback tone="member" seed="TF">
        TF
      </AvatarFallback>
      <AvatarStatus status="online" />
    </Avatar>
  ),
};

/** Away — amber presence dot. */
export const StatusAway: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback tone="member" seed="AW">
        AW
      </AvatarFallback>
      <AvatarStatus status="away" />
    </Avatar>
  ),
};

/** Offline — grey presence dot. */
export const StatusOffline: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback tone="member" seed="OF">
        OF
      </AvatarFallback>
      <AvatarStatus status="offline" />
    </Avatar>
  ),
};

// ── Group ─────────────────────────────────────────────────────────────────────

/** Overlapping stack with page-coloured separator rings. */
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback tone="member" seed="AB">AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback tone="member" seed="CD">CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback tone="member" seed="EF">EF</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback tone="brand">DF</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

/** Overflow — max=3 collapses the remainder into a "+N" chip. */
export const GroupWithOverflow: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar>
        <AvatarFallback tone="member" seed="AB">AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback tone="member" seed="CD">CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback tone="member" seed="EF">EF</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback tone="member" seed="GH">GH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback tone="member" seed="IJ">IJ</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};
