import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";

/**
 * DesignPlayground / ButtonLab — EXPERIMENTATION SANDBOX. NOT exported.
 *
 * Prototyping button treatments not yet in the shared cva:
 *   rounded   — pill shape via the `rounded="pill"` modifier
 *   toolbar   — ghost icon button for dense toolbars
 *   kanban    — compact secondary for kanban "add card" actions
 *   recording — destructive-toned inline stop/record control
 *
 * NOT distributed via the registry / npm package.
 * One story per treatment — conforms to the one-state-per-story rule.
 */
const meta: Meta = {
  title: "Design Playground/ButtonLab",
};

export default meta;
type Story = StoryObj;

function Lab({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--s-surface-page)",
        padding: 24,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

/** rounded — pill shape treatment via `rounded="pill"` modifier. */
export const Rounded: Story = {
  render: () => (
    <Lab>
      <Button variant="primary" size="sm" rounded="pill">
        Primary pill sm
      </Button>
      <Button variant="primary" size="default" rounded="pill">
        Primary pill
      </Button>
      <Button variant="secondary" rounded="pill">
        Secondary pill
      </Button>
      <Button variant="outline" rounded="pill">
        Outline pill
      </Button>
    </Lab>
  ),
};

/** toolbar — ghost icon button for dense toolbar contexts. */
export const Toolbar: Story = {
  render: () => (
    <Lab>
      <Button variant="ghost" size="icon-sm" aria-label="Bold">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Italic">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Underline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      </Button>
    </Lab>
  ),
};

/** kanban — compact secondary "add card" action in list/kanban contexts. */
export const Kanban: Story = {
  render: () => (
    <Lab>
      <Button variant="ghost" size="sm">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add card
      </Button>
      <Button variant="outline" size="sm">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add card
      </Button>
    </Lab>
  ),
};

/** recording — destructive-toned stop/record inline control. */
export const Recording: Story = {
  render: () => (
    <Lab>
      <Button variant="destructive" size="sm">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
        </svg>
        Record
      </Button>
      <Button variant="destructive" size="sm" loading>
        Recording…
      </Button>
      <Button variant="outline" size="sm">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
        Stop
      </Button>
    </Lab>
  ),
};
