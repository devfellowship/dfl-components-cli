/**
 * UserAvatar stories — one story per state (DS rule: ONE STORY = ONE STATE).
 *
 * Focus ring spec (DS uniform):
 *   box-shadow: 0 0 0 2px var(--background), 0 0 0 3px #E07A4A
 *   Applied on the outer interactive wrapper (button/link), NOT on the
 *   avatar circle — overflow:hidden on the circle clips box-shadow.
 */
import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "../components/organisms/UserAvatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Components/Molecules/UserAvatar",
  component: UserAvatar,
  argTypes: {
    name: { control: "text" },
    src: { control: "text" },
    colorSeed: { control: "text" },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

// ─── 1. Initials ─────────────────────────────────────────────────────────────
/**
 * No src provided — initials rendered on the deterministic member hue.
 * Text colour is --s-ink-inverse (#0a0908), which reads on all 10 mid-tone hues.
 * "Ada Lovelace" → djb2 → --member-1 (amber).
 */
export const Initials: Story = {
  args: { name: "Ada Lovelace" },
};

// ─── 2. WithImage ─────────────────────────────────────────────────────────────
/**
 * src is provided and the image loads successfully.
 * Photo fills the circle; fallback is not visible.
 */
export const WithImage: Story = {
  args: {
    name: "shadcn",
    src: "https://github.com/shadcn.png",
  },
};

// ─── 3. BrokenImage ──────────────────────────────────────────────────────────
/**
 * src is provided but the image load fails (broken URL).
 * Initials + deterministic member hue fallback renders — exercises the
 * most-common prod path (user has a stale/missing avatar URL).
 */
export const BrokenImage: Story = {
  args: {
    name: "Grace Hopper",
    src: "https://broken.example.invalid/avatar-404.png",
  },
};

// ─── 4. SizeSm ───────────────────────────────────────────────────────────────
/**
 * size="sm" — 32 × 32 px variant.
 * Same deterministic member hue; text scales proportionally (11px semibold).
 */
export const SizeSm: Story = {
  args: {
    name: "Tainan Fidelis",
    size: "sm",
  },
};

// ─── 5. SizeLg ───────────────────────────────────────────────────────────────
/**
 * size="lg" — 56 × 56 px variant.
 * Confirms initials font-size (18px) and weight (medium) scale correctly
 * at larger size.
 */
export const SizeLg: Story = {
  args: {
    name: "Tainan Fidelis",
    size: "lg",
  },
};

// ─── 6. Focused ──────────────────────────────────────────────────────────────
/**
 * UserAvatar inside a <button> wrapper rendered in focus-visible state.
 * DS uniform focus ring: box-shadow 0 0 0 2px var(--background), 0 0 0 3px #E07A4A.
 *
 * The ring is on the WRAPPER (not the avatar circle) because overflow:hidden
 * on the circle would clip it. The story renders the ring statically via
 * inline style to keep the visual documenting-accurate regardless of browser
 * focus state.
 */
export const Focused: Story = {
  render: () => (
    <button
      type="button"
      style={{
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
        borderRadius: "999px",
        outline: "none",
        // Static focus ring for story documentation; in production this
        // activates via :focus-visible on the button wrapper.
        boxShadow:
          "0 0 0 2px var(--background), 0 0 0 3px #E07A4A",
      }}
    >
      <UserAvatar name="Ada Lovelace" colorSeed="member-1" />
    </button>
  ),
};
