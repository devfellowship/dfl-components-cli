import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "../components/organisms/UserAvatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Components/Molecules/UserAvatar",
  component: UserAvatar,
  argTypes: {
    name: { control: "text" },
    src: { control: "text" },
    colorSeed: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

/** Default 40 px avatar — initials fallback with deterministic member-palette hue. */
export const Initials: Story = {
  args: { name: "Ada Lovelace" },
};

/** Image loaded — AvatarFallback suppressed, member hue invisible. */
export const WithImage: Story = {
  args: { name: "shadcn", src: "https://github.com/shadcn.png" },
};

/**
 * `colorSeed` decouples the palette hash from the display name — two members
 * with the same name get distinct colours (single state).
 */
export const WithColorSeed: Story = {
  args: { name: "Grace Hopper", colorSeed: "member-42" },
};

/**
 * Online status indicator — absolute-positioned dot using --p-green-500.
 *
 * Separator border: 2px solid var(--c-avatar-ring) — resolves to
 * --s-surface-panel (#141210) so the gap visually separates the dot from the
 * avatar edge on a dark card surface.
 *
 * Wrapper is `position:relative; display:inline-flex` — the UserAvatar itself
 * does not carry status state; the dot is composed by the callsite.
 */
export const StatusOnline: Story = {
  render: () => (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        flexShrink: 0,
      }}
    >
      <UserAvatar name="Ada Lovelace" />
      {/* Status dot — 11 px at default (40 px) avatar size */}
      <span
        aria-label="Online"
        style={{
          position: "absolute",
          bottom: "1px",
          right: "1px",
          width: "11px",
          height: "11px",
          borderRadius: "999px",
          backgroundColor: "var(--p-green-500)",
          // Separator uses --c-avatar-ring token (vs raw page-bg) so the dot
          // reads correctly on card surfaces as well as the page background.
          border: "2px solid var(--c-avatar-ring)",
          display: "block",
        }}
      />
    </span>
  ),
};
