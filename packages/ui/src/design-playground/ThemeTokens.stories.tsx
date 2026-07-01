import type { Meta, StoryObj } from "@storybook/react";

/**
 * DesignPlayground / ThemeTokens — EXPERIMENTATION SANDBOX. NOT exported.
 *
 * A scratch surface to eyeball the shared design tokens (the SAME CSS custom
 * properties the real components consume) under the 3 themes. Useful when
 * proposing new tokens before they land in `src/styles/*`.
 *
 * NOT distributed via the registry / npm package.
 */
const meta: Meta = {
  title: "DesignPlayground/ThemeTokens",
};

export default meta;
type Story = StoryObj;

const SURFACE_TOKENS = [
  "--s-ink-primary",
  "--s-ink-secondary",
  "--s-ink-muted",
  "--s-surface-raised",
  "--s-border-subtle",
  "--s-border-strong",
  "--s-brand-fg",
  "--s-brand-ring",
];

function Swatch({ token }: { token: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          border: "1px solid var(--s-border-subtle)",
          background: `var(${token})`,
        }}
      />
      <code style={{ fontSize: 12 }}>{token}</code>
    </div>
  );
}

/** Experiment: render every shared surface token as a swatch. */
export const SurfaceTokens: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {SURFACE_TOKENS.map((t) => (
        <Swatch key={t} token={t} />
      ))}
    </div>
  ),
};
