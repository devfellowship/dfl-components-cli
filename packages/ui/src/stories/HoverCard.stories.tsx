import type { Meta, StoryObj } from "@storybook/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/hover-card";
import { Button } from "../components/button";
import { Avatar, AvatarFallback } from "../components/avatar";

/**
 * HoverCard — one state per story (DS "1 story = 1 state" rule).
 *
 * Tokens verified:
 *   --c-hovercard-{bg,border,radius,padding,shadow,focus-ring}
 *
 * Trigger states show the link trigger at rest and with the DS uniform
 * focus ring (box-shadow: 0 0 0 2px page-bg, 0 0 0 3px #E07A4A).
 * Open-panel states use `open` prop to pin the panel visible.
 */
const meta: Meta<typeof HoverCard> = {
  title: "Components/Molecules/HoverCard",
  component: HoverCard,
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

/**
 * TriggerDefault — link trigger at rest.
 * Amber underlined text, no panel, border-radius-sm on the trigger.
 */
export const TriggerDefault: Story = {
  render: () => (
    <div className="p-8 text-[var(--s-ink-secondary)] text-sm leading-relaxed">
      Written by{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@devfellowship</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="text-[var(--s-ink-primary)] text-[13px] font-semibold">
            @devfellowship
          </p>
        </HoverCardContent>
      </HoverCard>{" "}
      on this platform.
    </div>
  ),
};

/**
 * TriggerFocused — trigger with keyboard focus showing DS uniform amber ring.
 * Static representation: box-shadow applied directly to demonstrate the
 * focus-visible state (0 0 0 2px page-bg + 0 0 0 3px #E07A4A).
 * The trigger renders as a plain button (no asChild) to avoid Button ring conflict.
 */
export const TriggerFocused: Story = {
  render: () => (
    <div className="p-8 text-[var(--s-ink-secondary)] text-sm leading-relaxed">
      Written by{" "}
      <HoverCard>
        <HoverCardTrigger
          className={[
            "text-[var(--s-brand-fg)] underline underline-offset-4 text-sm font-medium",
            "rounded-[var(--p-radius-sm)] outline-none",
            "[box-shadow:var(--c-hovercard-focus-ring)]",
          ].join(" ")}
        >
          @devfellowship
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="text-[var(--s-ink-primary)] text-[13px] font-semibold">
            @devfellowship
          </p>
        </HoverCardContent>
      </HoverCard>{" "}
      on this platform.
    </div>
  ),
};

/**
 * OpenBasic — panel open with simple handle + muted description text (no avatar).
 * Verifies: --c-hovercard-bg surface (#1a1714 raised), border-subtle border,
 * 10px radius (--p-radius-lg, NOT rounded-md = 6px), 16px padding.
 */
export const OpenBasic: Story = {
  render: () => (
    <div className="p-8 pt-20">
      <HoverCard open>
        <HoverCardTrigger asChild>
          <Button variant="link">@devfellowship</Button>
        </HoverCardTrigger>
        <HoverCardContent sideOffset={8}>
          <p className="text-[var(--s-ink-primary)] text-[13px] font-semibold mb-1">
            @devfellowship
          </p>
          <p className="text-[var(--s-ink-muted)] text-[13px] leading-relaxed">
            Shared UI primitives and hooks for the DFL fleet. Joined March 2026.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

/**
 * OpenProfile — panel open with 40px avatar (initials fallback), @handle in
 * JetBrains Mono, display name, bio line, and 'Joined ...' meta row.
 */
export const OpenProfile: Story = {
  render: () => (
    <div className="p-8 pt-20">
      <HoverCard open>
        <HoverCardTrigger asChild>
          <Button variant="link">@taigfs</Button>
        </HoverCardTrigger>
        <HoverCardContent sideOffset={8}>
          <div className="flex items-start gap-3 mb-2.5">
            <Avatar className="size-10 shrink-0 border-2 border-[var(--s-border-subtle)]">
              <AvatarFallback className="text-[var(--s-brand-solid)] text-[13px] font-semibold bg-[var(--s-surface-elevated)]">
                TF
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-mono text-[13px] font-semibold text-[var(--s-ink-primary)] tracking-tight">
                @taigfs
              </span>
              <span className="text-[12px] text-[var(--s-ink-muted)]">Tainan Fidelis</span>
            </div>
          </div>
          <p className="text-[13px] text-[var(--s-ink-secondary)] leading-relaxed mb-2.5">
            Building DevFellowship — the operating system for learning teams.
          </p>
          <p className="flex items-center gap-1 text-[11px] text-[var(--s-ink-muted)]">
            <span className="inline-block size-[3px] rounded-full bg-[var(--s-ink-muted)] shrink-0" />
            Joined January 2024
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

/**
 * OpenWithStats — panel open with profile header + footer stats row
 * (stat value in JetBrains Mono + muted label) separated by a border-subtle divider.
 */
export const OpenWithStats: Story = {
  render: () => (
    <div className="p-8 pt-20">
      <HoverCard open>
        <HoverCardTrigger asChild>
          <Button variant="link">@devfellowship</Button>
        </HoverCardTrigger>
        <HoverCardContent sideOffset={8}>
          <div className="flex items-start gap-3 mb-2.5">
            <Avatar className="size-10 shrink-0 border-2 border-[var(--s-border-subtle)]">
              <AvatarFallback className="text-[var(--s-success-fg)] text-[13px] font-semibold bg-[var(--s-surface-elevated)]">
                DS
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-mono text-[13px] font-semibold text-[var(--s-ink-primary)] tracking-tight">
                @devfellowship
              </span>
              <span className="text-[12px] text-[var(--s-ink-muted)]">DevFellowship Org</span>
            </div>
          </div>
          <p className="text-[13px] text-[var(--s-ink-secondary)] leading-relaxed mb-2.5">
            Shared UI primitives and hooks for the DFL fleet.
          </p>
          <div className="flex items-center gap-4 pt-2.5 border-t border-[var(--s-border-subtle)]">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[13px] font-semibold text-[var(--s-ink-primary)]">66</span>
              <span className="text-[11px] text-[var(--s-ink-muted)]">Components</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[13px] font-semibold text-[var(--s-ink-primary)]">12</span>
              <span className="text-[11px] text-[var(--s-ink-muted)]">Apps</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[13px] font-semibold text-[var(--s-ink-primary)]">Mar 2026</span>
              <span className="text-[11px] text-[var(--s-ink-muted)]">Founded</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

/**
 * OpenKeyboard — trigger in focused state simultaneously showing amber ring +
 * open panel, demonstrating that focus-visible triggers the same panel open as
 * hover. Focus ring applied directly (static representation of focus-visible state).
 */
export const OpenKeyboard: Story = {
  render: () => (
    <div className="p-8 pt-20 text-[var(--s-ink-secondary)] text-sm leading-relaxed">
      Discussion started by{" "}
      <HoverCard open>
        <HoverCardTrigger
          className={[
            "text-[var(--s-brand-fg)] underline underline-offset-4 text-sm font-medium",
            "rounded-[var(--p-radius-sm)] outline-none",
            "[box-shadow:var(--c-hovercard-focus-ring)]",
          ].join(" ")}
        >
          @taigfs
        </HoverCardTrigger>
        <HoverCardContent sideOffset={8}>
          <div className="flex items-start gap-3 mb-2">
            <Avatar className="size-10 shrink-0 border-2 border-[var(--s-border-subtle)]">
              <AvatarFallback className="text-[var(--s-brand-solid)] text-[13px] font-semibold bg-[var(--s-surface-elevated)]">
                TF
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-mono text-[13px] font-semibold text-[var(--s-ink-primary)] tracking-tight">
                @taigfs
              </span>
              <span className="text-[12px] text-[var(--s-ink-muted)]">Tainan Fidelis</span>
            </div>
          </div>
          <p className="text-[13px] text-[var(--s-ink-secondary)] leading-relaxed mb-2">
            Founder. Building the operating system for learning teams.
          </p>
          <p className="flex items-center gap-1 text-[11px] text-[var(--s-ink-muted)]">
            <span className="inline-block size-[3px] rounded-full bg-[var(--s-ink-muted)] shrink-0" />
            Member since January 2024
          </p>
        </HoverCardContent>
      </HoverCard>{" "}
      in channel{" "}
      <code className="font-mono text-xs text-[var(--s-ink-muted)] bg-[var(--s-surface-elevated)] px-1 py-0.5 rounded">
        #plans
      </code>.
    </div>
  ),
};
