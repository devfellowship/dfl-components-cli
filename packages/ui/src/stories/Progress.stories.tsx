import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../components/progress";

/**
 * Progress — one state per story (DS "1 story = 1 state" rule).
 *
 * argTypes mirror the real cva:
 *   size:    sm | md | lg
 *   variant: default | success | danger | warning | info
 *
 * Token layer: --c-progress-{track-bg,radius,h-{sm,md,lg},duration,easing}
 *              --c-progress-fill-{default,success,danger,warning,info}
 */
const meta: Meta<typeof Progress> = {
  title: "Components/Atoms/Progress",
  component: Progress,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "success", "danger", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

/** Default (amber fill) at 60% — verifies token-native amber via --c-progress-fill. */
export const Default: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="md" variant="default" value={60} />
    </div>
  ),
};

/** Track-only state — verifies track bg is visible against the page background. */
export const Empty: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="md" variant="default" value={0} />
    </div>
  ),
};

/** Completely filled — verifies fill covers the full track width. */
export const Full: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="md" variant="default" value={100} />
    </div>
  ),
};

/** Small (4px height) — verifies --c-progress-h-sm token. */
export const SizeSm: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="sm" variant="default" value={60} />
    </div>
  ),
};

/** Large (12px height) — verifies --c-progress-h-lg token. */
export const SizeLg: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="lg" variant="default" value={60} />
    </div>
  ),
};

/** Success variant — green fill via --c-progress-fill-success (#5ec27e). */
export const Success: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="md" variant="success" value={75} />
    </div>
  ),
};

/** Danger variant — red fill via --c-progress-fill-danger (#e07a7a). */
export const Danger: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="md" variant="danger" value={28} />
    </div>
  ),
};

/** Warning variant — yellow fill via --c-progress-fill-warning (#e0b04a). */
export const Warning: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="md" variant="warning" value={50} />
    </div>
  ),
};

/** Info variant — blue fill via --c-progress-fill-info (#7aa2e0). */
export const Info: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Progress size="md" variant="info" value={45} />
    </div>
  ),
};
