/**
 * ConfirmDialog stories — one state per story (DS "1 story = 1 state" rule).
 *
 * All stories render the dialog in its open state (open={true}) so the panel,
 * scrim, and buttons are immediately visible in the Storybook canvas without
 * needing to click a trigger.
 *
 * Focus-ring stories (ConfirmFocused / CancelFocused) use a play function that
 * simulates keyboard navigation — this triggers :focus-visible so the uniform
 * 2px gap + 1px amber ring is rendered.
 */
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/Organisms/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

/**
 * Default open state — primary amber confirm button (Publish), cancel outline
 * button. Verifies: surface-raised bg (#1a1714), 14px radius, warm scrim
 * (rgba(10,9,8,0.72)), and correct shadow depth.
 */
export const Default: Story = {
  render: () => (
    <ConfirmDialog
      open={true}
      onOpenChange={() => {}}
      title="Publish this lesson?"
      body="It will become visible to all fellows immediately."
      confirmLabel="Publish"
      cancelLabel="Cancel"
    />
  ),
};

/**
 * Destructive open state — danger confirm button (Delete) using
 * --s-danger-fg / --s-danger-border tokens, not raw red-600.
 * Cancel remains the standard outline button.
 */
export const Destructive: Story = {
  render: () => (
    <ConfirmDialog
      open={true}
      onOpenChange={() => {}}
      title="Delete this track?"
      body="This action cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      variant="destructive"
    />
  ),
};

/**
 * Confirm button receives keyboard focus. Must render the uniform DFL amber
 * ring: box-shadow 0 0 0 2px var(--background), 0 0 0 3px #E07A4A.
 * No browser default outline.
 */
export const ConfirmFocused: Story = {
  render: () => (
    <ConfirmDialog
      open={true}
      onOpenChange={() => {}}
      title="Publish this lesson?"
      body="It will become visible to all fellows immediately."
      confirmLabel="Publish"
      cancelLabel="Cancel"
    />
  ),
  play: async ({ canvasElement }) => {
    // Radix AlertDialog portals into document.body — query there, not canvasElement
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);
    // Simulate keyboard Tab so :focus-visible activates (not just :focus)
    await userEvent.tab();
    const confirmBtn = await canvas.findByRole("button", { name: /publish/i });
    confirmBtn.focus();
  },
};

/**
 * Cancel (outline) button focused — same uniform amber ring as the confirm
 * button. Verifies focus-ring parity between action and cancel elements.
 */
export const CancelFocused: Story = {
  render: () => (
    <ConfirmDialog
      open={true}
      onOpenChange={() => {}}
      title="Publish this lesson?"
      body="It will become visible to all fellows immediately."
      confirmLabel="Publish"
      cancelLabel="Cancel"
    />
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);
    await userEvent.tab();
    const cancelBtn = await canvas.findByRole("button", { name: /cancel/i });
    cancelBtn.focus();
  },
};

/**
 * confirmDisabled=true — confirm button is visually muted (opacity-50,
 * pointer-events:none disabled:opacity-50 from buttonVariants), not just
 * hiding the cursor. Cancel remains active.
 */
export const ConfirmDisabled: Story = {
  render: () => (
    <ConfirmDialog
      open={true}
      onOpenChange={() => {}}
      title="Publish this lesson?"
      body="Review all required fields before publishing."
      confirmLabel="Publish"
      cancelLabel="Cancel"
      confirmDisabled={true}
    />
  ),
};

/**
 * body prop omitted — dialog renders title + footer only with correct vertical
 * rhythm. Verifies the description slot is truly optional (no empty space or
 * layout shift when body is absent).
 */
export const TitleOnly: Story = {
  render: () => (
    <ConfirmDialog
      open={true}
      onOpenChange={() => {}}
      title="Are you sure you want to leave?"
      confirmLabel="Leave"
      cancelLabel="Stay"
    />
  ),
};
