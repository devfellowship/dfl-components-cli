import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../components/skeleton";

/**
 * Skeleton — one loading state per story.
 *
 * Each story mirrors a real DFL fleet loading placeholder.
 * Radii reference `--c-skeleton-radius-*` and `--p-radius-pill` component
 * tokens (defined in tokens.css) rather than raw pixel literals.
 * Do NOT collapse these back into a single gallery story.
 */
const meta: Meta<typeof Skeleton> = {
  title: "Components/Atoms/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/**
 * Text feed / list placeholder.
 * Three staggered lines (full → 80% → 60%) using `--c-skeleton-radius-sm`.
 */
export const ListLoading: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "300px" }}>
      <Skeleton style={{ height: "20px", borderRadius: "var(--c-skeleton-radius-sm)" }} />
      <Skeleton style={{ height: "20px", width: "80%", borderRadius: "var(--c-skeleton-radius-sm)" }} />
      <Skeleton style={{ height: "20px", width: "60%", borderRadius: "var(--c-skeleton-radius-sm)" }} />
    </div>
  ),
};

/**
 * Content card placeholder.
 * Circular avatar (`--c-skeleton-radius-circle`) + two meta lines +
 * hero media block (`--c-skeleton-radius-lg`).
 */
export const CardLoading: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "300px",
        padding: "16px",
        border: "1px solid var(--s-border-subtle)",
        borderRadius: "var(--c-skeleton-radius-lg)",
        background: "var(--s-surface-page)",
      }}
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Skeleton
          style={{
            height: "40px",
            width: "40px",
            flexShrink: 0,
            borderRadius: "var(--c-skeleton-radius-circle)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <Skeleton style={{ height: "14px", borderRadius: "var(--c-skeleton-radius-sm)" }} />
          <Skeleton style={{ height: "12px", width: "60%", borderRadius: "var(--c-skeleton-radius-sm)" }} />
        </div>
      </div>
      <Skeleton style={{ height: "120px", borderRadius: "var(--c-skeleton-radius-lg)" }} />
    </div>
  ),
};

/**
 * Single table row placeholder.
 * Four inline columns (72px / 140px / 96px / 64px trailing) mirror table
 * data density. All use `--c-skeleton-radius-sm`.
 */
export const TableRowLoading: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center", width: "540px" }}>
      <Skeleton style={{ height: "16px", width: "72px", borderRadius: "var(--c-skeleton-radius-sm)" }} />
      <Skeleton style={{ height: "16px", width: "140px", borderRadius: "var(--c-skeleton-radius-sm)" }} />
      <Skeleton style={{ height: "16px", width: "96px", borderRadius: "var(--c-skeleton-radius-sm)" }} />
      <Skeleton
        style={{ height: "16px", width: "64px", marginLeft: "auto", borderRadius: "var(--c-skeleton-radius-sm)" }}
      />
    </div>
  ),
};

/**
 * Full detail page placeholder.
 * Display-height title (`--c-skeleton-radius-md`) + pill-badge row
 * (`--p-radius-pill`) + hero block (`--c-skeleton-radius-lg`) +
 * three body-copy lines (`--c-skeleton-radius-sm`).
 * Exercises all three radius tiers plus pill.
 */
export const DetailPageLoading: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "480px" }}>
      {/* Display title */}
      <Skeleton style={{ height: "32px", width: "70%", borderRadius: "var(--c-skeleton-radius-md)" }} />
      {/* Badge row */}
      <div style={{ display: "flex", gap: "8px" }}>
        <Skeleton style={{ height: "22px", width: "80px", borderRadius: "var(--p-radius-pill)" }} />
        <Skeleton style={{ height: "22px", width: "80px", borderRadius: "var(--p-radius-pill)" }} />
      </div>
      {/* Hero media */}
      <Skeleton style={{ height: "200px", borderRadius: "var(--c-skeleton-radius-lg)" }} />
      {/* Body copy lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Skeleton style={{ height: "16px", borderRadius: "var(--c-skeleton-radius-sm)" }} />
        <Skeleton style={{ height: "16px", width: "90%", borderRadius: "var(--c-skeleton-radius-sm)" }} />
        <Skeleton style={{ height: "16px", width: "75%", borderRadius: "var(--c-skeleton-radius-sm)" }} />
      </div>
    </div>
  ),
};

/**
 * Reduced-motion fallback — ListLoading layout with animation disabled.
 *
 * Simulates `@media (prefers-reduced-motion: reduce)` by scoping
 * `animation: none` to the demo wrapper. Confirms the sand-800 static fill
 * (`--c-skeleton-bg`) is visible with no motion artifact. The real
 * production guard lives in `tokens.css` via the @media rule.
 */
export const ReducedMotion: Story = {
  render: () => (
    <div>
      {/* Scope override mirrors what tokens.css does under prefers-reduced-motion */}
      <style>{`.sk-rm-demo .dfl-skeleton { animation: none; background: var(--c-skeleton-bg); }`}</style>
      <div
        className="sk-rm-demo"
        style={{ display: "flex", flexDirection: "column", gap: "8px", width: "300px" }}
      >
        <Skeleton style={{ height: "20px", borderRadius: "var(--c-skeleton-radius-sm)" }} />
        <Skeleton style={{ height: "20px", width: "80%", borderRadius: "var(--c-skeleton-radius-sm)" }} />
        <Skeleton style={{ height: "20px", width: "60%", borderRadius: "var(--c-skeleton-radius-sm)" }} />
      </div>
    </div>
  ),
};
