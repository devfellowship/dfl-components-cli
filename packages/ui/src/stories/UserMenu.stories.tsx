import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGrid } from "lucide-react";
import { UserMenu } from "../components/organisms/UserMenu";

/**
 * UserMenu — one story = one state (DS v0 "1-story-1-state" rule).
 *
 * Stories cover:
 *   TriggerDefault            — closed trigger, showName=true (baseline)
 *   TriggerFocus              — trigger keyboard-focused; amber ring must appear
 *   AvatarOnly                — showName=false compact trigger; ring still renders
 *   DropdownDefaultItems      — open panel, convenience handler path
 *   DropdownDestructiveItemFocus — destructive item keyboard-focused
 *   CustomItems               — items prop with separatorBefore=true
 *
 * Token chain for the trigger focus ring (inherited from Button ghost):
 *   box-shadow: 0 0 0 2px var(--c-button-focus-gap)   (#0a0908 page-bg gap)
 *               0 0 0 3px var(--c-button-focus-brand)  (#E07A4A amber ring)
 *
 * Item hover surface: --c-usermenu-item-hover-bg → --s-border-subtle (#2a2622)
 * Destructive fg:     --c-usermenu-danger-fg → --s-danger-fg (#e89898, no inline fallback)
 * Destructive hover:  --c-usermenu-danger-hover-bg → --s-danger-subtle (rgba 12%)
 */
const meta: Meta<typeof UserMenu> = {
  title: "Components/Organisms/UserMenu",
  component: UserMenu,
  parameters: { layout: "centered" },
  argTypes: {
    name: { control: "text" },
    email: { control: "text" },
    showName: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

/* ─── 1. TriggerDefault ────────────────────────────────────────────────── */

/**
 * Baseline render — trigger closed, showName=true, no interaction.
 * The ghost button should be transparent with no visible ring.
 * Tab to this story to manually verify the amber focus ring appears.
 */
export const TriggerDefault: Story = {
  args: {
    name: "Ada Lovelace",
    email: "ada@devfellowship.com",
    onProfile: () => {},
    onSettings: () => {},
    onSignOut: () => {},
    showName: true,
  },
};

/* ─── 2. TriggerFocus ──────────────────────────────────────────────────── */

/**
 * Trigger keyboard-focused.
 * MUST show the uniform 2px-gap amber ring:
 *   box-shadow: 0 0 0 2px #0a0908 (page-bg gap), 0 0 0 3px #E07A4A (amber)
 *
 * Applied via Button ghost → FOCUS_BRAND constant (atoms-button refactor).
 * Token chain: --c-button-focus-gap (--s-surface-page) + --c-button-focus-brand (--s-brand-solid).
 */
export const TriggerFocus: Story = {
  args: {
    name: "Ada Lovelace",
    email: "ada@devfellowship.com",
    onProfile: () => {},
    onSettings: () => {},
    onSignOut: () => {},
    showName: true,
  },
  play: async ({ canvasElement }) => {
    // Button trigger is NOT in a portal — direct DOM query works.
    const trigger = canvasElement.querySelector<HTMLButtonElement>("button");
    trigger?.focus();
  },
};

/* ─── 3. AvatarOnly ────────────────────────────────────────────────────── */

/**
 * showName=false — compact avatar-only trigger (no name label or chevron).
 * Verify the amber focus ring still renders correctly on the smaller button:
 *   tab to this story to see box-shadow around the avatar chip.
 * The ring is clipped by overflow:hidden on the Avatar circle itself, so it
 * MUST live on the outer Button wrapper — which it does (Button → FOCUS_BRAND).
 */
export const AvatarOnly: Story = {
  args: {
    name: "Alan Turing",
    email: "alan@devfellowship.com",
    showName: false,
    onSignOut: () => {},
  },
};

/* ─── 4. DropdownDefaultItems ──────────────────────────────────────────── */

/**
 * Open dropdown — convenience handler path (Profile / Settings / Sign out).
 *
 * Verify (hover or keyboard-navigate into each item):
 *   - Regular item hover bg = #2a2622 (--c-usermenu-item-hover-bg = --s-border-subtle)
 *     NOT the shadcn default amber bg-accent (#E07A4A)
 *   - Destructive "Sign out" text = #e89898 (--c-usermenu-danger-fg = --s-danger-fg)
 *     with NO hardcoded #e89898 fallback in the className string
 *   - Destructive item hover bg = rgba(224,122,122,0.12) (--c-usermenu-danger-hover-bg)
 */
export const DropdownDefaultItems: Story = {
  args: {
    name: "Ada Lovelace",
    email: "ada@devfellowship.com",
    onProfile: () => {},
    onSettings: () => {},
    onSignOut: () => {},
    defaultOpen: true,
  },
};

/* ─── 5. DropdownDestructiveItemFocus ──────────────────────────────────── */

/**
 * Destructive "Sign out" item keyboard-focused.
 *
 * Verify:
 *   - Background = --c-usermenu-danger-hover-bg (--s-danger-subtle, rgba 12% red)
 *   - Text color  = --c-usermenu-danger-fg (--s-danger-fg, #e89898) — NOT ink-primary
 *   - Focus ring  = 2px panel-bg gap + 1px danger-fg ring
 *     (--c-usermenu-item-danger-focus-ring:
 *      0 0 0 2px var(--s-surface-elevated), 0 0 0 3px var(--s-danger-fg))
 *
 * Must NOT show: amber bg-accent flood, text-accent-foreground revert, or amber outer ring.
 */
export const DropdownDestructiveItemFocus: Story = {
  args: {
    name: "Ada Lovelace",
    email: "ada@devfellowship.com",
    onProfile: () => {},
    onSettings: () => {},
    onSignOut: () => {},
    defaultOpen: true,
  },
  play: async () => {
    /*
     * Radix DropdownMenu renders into a portal at document.body — items are
     * NOT inside canvasElement. Query globally after defaultOpen mounts the portal.
     */
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const signOut = items[items.length - 1];
    signOut?.focus();
  },
};

/* ─── 6. CustomItems ───────────────────────────────────────────────────── */

/**
 * Custom items prop — overrides the default Profile/Settings/Sign out set.
 * Verify:
 *   - Panel renders with the custom item list (no default fallback)
 *   - separatorBefore=true on the destructive item creates a visible separator
 *   - Destructive item color (#e89898) appears without icon (icon is optional)
 */
export const CustomItems: Story = {
  args: {
    name: "Grace Hopper",
    email: "grace@devfellowship.com",
    items: [
      {
        label: "Switch workspace",
        icon: <LayoutGrid className="h-4 w-4" />,
        onSelect: () => {},
      },
      {
        label: "Sign out",
        destructive: true,
        separatorBefore: true,
        onSelect: () => {},
      },
    ],
    defaultOpen: true,
  },
};
