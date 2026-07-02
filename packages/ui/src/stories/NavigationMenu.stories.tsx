import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/navigation-menu";

/**
 * NavigationMenu — Organisms/NavigationMenu
 *
 * One story per state. States covered:
 *   Trigger/Default  — at rest, muted ink, transparent bg, chevron 0deg
 *   Trigger/Hover    — surface-elevated bg lift, primary ink (NOT amber fill)
 *   Trigger/Focus    — same as hover + DS uniform focus ring (2px gap + 1px amber)
 *   Trigger/Open     — amber-subtle tint + amber-300 text + amber border + chevron 180deg
 *   ContentItem/DefaultHoverFocus — three labeled items in an open panel
 *   ContentItem/Active — active item with left amber border; plus DirectLink/Active
 *
 * viewport=false is used where possible so the content panel renders inline
 * (no Radix Viewport animation needed for static state demos in Storybook).
 */
const meta: Meta<typeof NavigationMenu> = {
  title: "Components/Organisms/NavigationMenu",
  component: NavigationMenu,
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

/* ──────────────────────────────────────────────────────────────────────────
 * Story: Trigger / Default
 * Trigger at rest: muted secondary ink, transparent bg, chevron at 0deg, 0.7 opacity.
 * ────────────────────────────────────────────────────────────────────────── */
export const TriggerDefault: Story = {
  name: "Trigger/Default",
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Work</NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: Trigger / Hover
 * Surface-elevated bg lift (--c-nav-trigger-hover-bg = --s-surface-elevated #1f1c18),
 * primary ink, chevron opacity 1. The amber fill that was the bug is gone.
 * Demonstrated via className forced to the hover-state colors.
 * ────────────────────────────────────────────────────────────────────────── */
export const TriggerHover: Story = {
  name: "Trigger/Hover",
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {/* Force hover appearance via className override — shows DS surface lift, not amber */}
          <NavigationMenuTrigger
            className="bg-[var(--c-nav-trigger-hover-bg)] text-[var(--c-nav-trigger-hover-fg)]"
          >
            Learn
          </NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: Trigger / Focus
 * Same as hover + DS uniform focus ring:
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 *   transition: none (ring appears instantly — no animation)
 * Demonstrated via className forced to the focus-visible state.
 * ────────────────────────────────────────────────────────────────────────── */
export const TriggerFocus: Story = {
  name: "Trigger/Focus",
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {/* Force focus ring appearance — ring-1 ring-offset-2 matches the DS spec */}
          <NavigationMenuTrigger
            className={[
              "bg-[var(--c-nav-trigger-hover-bg)] text-[var(--c-nav-trigger-hover-fg)]",
              "ring-1 ring-[#E07A4A] ring-offset-2 ring-offset-[var(--s-surface-page)]",
            ].join(" ")}
          >
            Learn
          </NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: Trigger / Open
 * Amber-subtle bg tint (--c-nav-trigger-open-bg = --s-brand-subtle),
 * amber-300 text (--c-nav-trigger-open-fg = --s-brand-fg),
 * amber border (--c-nav-trigger-open-border = --s-brand-border),
 * chevron rotated 180deg.
 * Dropdown panel and indicator arrow visible below trigger.
 * viewport=false so the content renders inline without viewport animation.
 * ────────────────────────────────────────────────────────────────────────── */
export const TriggerOpen: Story = {
  name: "Trigger/Open",
  render: () => (
    <div style={{ paddingBottom: 180 }}>
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-[240px] p-1.5">
                <li>
                  <NavigationMenuLink href="#">
                    <span className="text-[13px] font-medium text-[var(--s-ink-secondary)]">Lesson Studio</span>
                    <span className="text-[12px] text-[var(--s-ink-muted)]">Create and record lessons</span>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">
                    <span className="text-[13px] font-medium text-[var(--s-ink-secondary)]">Learning Tracks</span>
                    <span className="text-[12px] text-[var(--s-ink-muted)]">Curated paths to mastery</span>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Work</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: ContentItem / Default–Hover–Focus
 * Three content link items in an open dropdown, each showing a distinct state.
 * Focus ring MUST be visible (the :focus:ring-0 suppressor is removed).
 * viewport=false so the panel renders inline.
 * ────────────────────────────────────────────────────────────────────────── */
export const ContentItemDefaultHoverFocus: Story = {
  name: "ContentItem/Default-Hover-Focus",
  render: () => (
    <div style={{ paddingBottom: 220 }}>
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-[260px] p-1.5">
                {/* Default — muted ink, transparent bg */}
                <li>
                  <p className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--s-ink-muted)]">
                    default
                  </p>
                  <NavigationMenuLink href="#">
                    <span className="text-[13px] font-medium">Progress Dashboard</span>
                    <span className="text-[12px] text-[var(--s-ink-muted)]">Track your learning activity</span>
                  </NavigationMenuLink>
                </li>
                {/* Hover — surface-elevated bg, primary ink (force via className) */}
                <li>
                  <p className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--s-ink-muted)]">
                    hover
                  </p>
                  <NavigationMenuLink
                    href="#"
                    className="bg-[var(--c-nav-item-hover-bg)] text-[var(--c-nav-item-hover-fg)]"
                  >
                    <span className="text-[13px] font-medium">Learning Tracks</span>
                    <span className="text-[12px] text-[var(--s-ink-muted)]">Curated paths to mastery</span>
                  </NavigationMenuLink>
                </li>
                {/* Focus — same as hover + DS ring (forced via className) */}
                <li>
                  <p className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--s-ink-muted)]">
                    focus
                  </p>
                  <NavigationMenuLink
                    href="#"
                    className={[
                      "bg-[var(--c-nav-item-hover-bg)] text-[var(--c-nav-item-hover-fg)]",
                      "ring-1 ring-[#E07A4A] ring-offset-2 ring-offset-[var(--s-surface-page)]",
                    ].join(" ")}
                  >
                    <span className="text-[13px] font-medium">Lesson Studio</span>
                    <span className="text-[12px] text-[var(--s-ink-muted)]">Create and record lessons</span>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: ContentItem / Active
 * Two active-state variants:
 *   1. Content item: 2px left amber border + brand-subtle bg + amber-300 title
 *      (current route indicator inside an open dropdown)
 *   2. DirectLink/Active: amber-subtle pill on the horizontal nav bar
 * ────────────────────────────────────────────────────────────────────────── */
export const ContentItemActive: Story = {
  name: "ContentItem/Active",
  render: () => (
    <div style={{ paddingBottom: 200 }}>
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {/* Trigger with active content item inside the dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-[260px] p-1.5">
                {/* Active content item: left amber border indicator */}
                <li>
                  <NavigationMenuLink
                    href="#"
                    active
                    className="border-l-2 border-l-[var(--c-nav-item-active-border)]"
                  >
                    <span className="text-[13px] font-medium">Lesson Studio</span>
                    <span className="text-[12px] text-[var(--s-brand-subtle)]">Current route</span>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">
                    <span className="text-[13px] font-medium">Learning Tracks</span>
                    <span className="text-[12px] text-[var(--s-ink-muted)]">Curated paths to mastery</span>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* DirectLink/Active — amber-subtle pill on the bar */}
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              active
              className="inline-flex h-[var(--c-nav-trigger-h,36px)] items-center px-[var(--c-nav-trigger-px,14px)] border border-[var(--c-nav-trigger-open-border,var(--s-brand-border))]"
            >
              Plans
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className="inline-flex h-[var(--c-nav-trigger-h,36px)] items-center px-[var(--c-nav-trigger-px,14px)]"
            >
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};
