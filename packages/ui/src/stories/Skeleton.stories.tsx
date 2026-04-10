import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../components/skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Primitivos/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "300px" }}>
      <Skeleton style={{ height: "20px", borderRadius: "4px" }} />
      <Skeleton style={{ height: "20px", borderRadius: "4px", width: "80%" }} />
      <Skeleton style={{ height: "20px", borderRadius: "4px", width: "60%" }} />
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "300px", padding: "16px", border: "1px solid var(--border)", borderRadius: "8px" }}>
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
