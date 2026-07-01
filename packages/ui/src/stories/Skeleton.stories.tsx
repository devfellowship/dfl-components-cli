import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../components/skeleton";

/**
 * Skeleton — one loading state per story. These mirror the real loading
 * placeholders used across the DFL fleet (list, card grid, table rows,
 * detail page). Do NOT collapse them back into one gallery story.
 */
const meta: Meta<typeof Skeleton> = {
  title: "Components/Atoms/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/** Loading placeholder for a text list / feed. */
export const ListLoading: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "300px" }}>
      <Skeleton style={{ height: "20px", borderRadius: "4px" }} />
      <Skeleton style={{ height: "20px", borderRadius: "4px", width: "80%" }} />
      <Skeleton style={{ height: "20px", borderRadius: "4px", width: "60%" }} />
    </div>
  ),
};

/** Loading placeholder for a single content card (avatar + title + media). */
export const CardLoading: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "300px",
        padding: "16px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Skeleton style={{ height: "40px", width: "40px", borderRadius: "50%" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <Skeleton style={{ height: "14px", borderRadius: "4px" }} />
          <Skeleton style={{ height: "12px", borderRadius: "4px", width: "60%" }} />
        </div>
      </div>
      <Skeleton style={{ height: "120px", borderRadius: "8px" }} />
    </div>
  ),
};

/** Loading placeholder for a single table row (mirrors Table.SkeletonLoadingRows). */
export const TableRowLoading: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center", width: "480px" }}>
      <Skeleton style={{ height: "16px", width: "72px", borderRadius: "4px" }} />
      <Skeleton style={{ height: "16px", width: "120px", borderRadius: "4px" }} />
      <Skeleton style={{ height: "16px", width: "96px", borderRadius: "4px" }} />
      <Skeleton style={{ height: "16px", width: "64px", borderRadius: "4px", marginLeft: "auto" }} />
    </div>
  ),
};

/** Loading placeholder for a full detail page (title, meta, body blocks). */
export const DetailPageLoading: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "480px" }}>
      <Skeleton style={{ height: "32px", width: "70%", borderRadius: "6px" }} />
      <div style={{ display: "flex", gap: "8px" }}>
        <Skeleton style={{ height: "20px", width: "80px", borderRadius: "999px" }} />
        <Skeleton style={{ height: "20px", width: "80px", borderRadius: "999px" }} />
      </div>
      <Skeleton style={{ height: "200px", borderRadius: "8px" }} />
      <Skeleton style={{ height: "16px", borderRadius: "4px" }} />
      <Skeleton style={{ height: "16px", width: "90%", borderRadius: "4px" }} />
      <Skeleton style={{ height: "16px", width: "75%", borderRadius: "4px" }} />
    </div>
  ),
};
