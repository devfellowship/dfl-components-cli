import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleItem,
  CollapsibleTrigger,
} from "../components/collapsible";

/**
 * Collapsible — Molecules / Collapsible
 *
 * One story per state (DS "1 story = 1 state" rule).
 *
 * Stories:
 *   Closed        — open=false; trigger chevron points down; content hidden.
 *   Open          — defaultOpen=true; content visible; elevated sand items.
 *   TriggerFocus  — open + trigger in forced focus-visible condition (autoFocus +
 *                   forced ring classes); amber 2px-gap + 1px ring visible.
 *   TriggerHover  — open + trigger in hover condition; amber fg + brand-subtle chip.
 *   Disabled      — disabled root; header + trigger at 45% opacity, cursor not-allowed.
 *
 * Tokens exercised:
 *   --c-collapsible-{bg, bg-hover, border, border-hover, radius}
 *   --c-collapsible-header-fg
 *   --c-collapsible-content-{bg, border}
 *   --c-collapsible-item-fg
 *   --c-collapsible-trigger-{fg, fg-hover, ring}
 */
const meta: Meta<typeof Collapsible> = {
  title: "Components/Molecules/Collapsible",
  component: Collapsible,
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

/** Shared content items used across stories. */
const ITEMS = ["button", "card", "dialog"] as const;

// ─── Story: Closed ───────────────────────────────────────────────────────────

/**
 * Closed state — open=false (default). The header row is visible; the content
 * area is hidden. The trigger chevron points DOWN indicating "expandable".
 */
export const Closed: Story = {
  render: () => (
    <Collapsible open={false}>
      <CollapsibleHeader>
        <span className="[font-family:var(--s-font-mono)]">
          @devfellowship/components
        </span>
        <CollapsibleTrigger>
          <ChevronDown className="size-[15px]" aria-hidden="true" />
          <span className="sr-only">Expand</span>
        </CollapsibleTrigger>
      </CollapsibleHeader>
      <CollapsibleContent>
        {ITEMS.map((item) => (
          <CollapsibleItem key={item}>{item}</CollapsibleItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

// ─── Story: Open ─────────────────────────────────────────────────────────────

/**
 * Open state — defaultOpen=true (uncontrolled). Content rows are visible with
 * the elevated sand background (--c-collapsible-content-bg) and muted ink
 * (--c-collapsible-item-fg). Trigger chevron points UP (rotate-180).
 */
export const Open: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <CollapsibleHeader>
        <span className="[font-family:var(--s-font-mono)]">
          @devfellowship/components
        </span>
        <CollapsibleTrigger>
          <ChevronDown
            className="size-[15px] rotate-180 transition-transform duration-[200ms]"
            aria-hidden="true"
          />
          <span className="sr-only">Collapse</span>
        </CollapsibleTrigger>
      </CollapsibleHeader>
      <CollapsibleContent>
        {ITEMS.map((item) => (
          <CollapsibleItem key={item}>{item}</CollapsibleItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

// ─── Story: TriggerFocus ─────────────────────────────────────────────────────

/**
 * TriggerFocus — open state with the trigger in a forced :focus-visible
 * condition (autoFocus + forced ring classes).
 *
 * Renders the uniform DS focus ring:
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 * Chevron colour shifts to amber (--s-brand-hover) + brand-subtle bg chip.
 *
 * The forced className mirrors the :focus-visible CSS rule so the ring is
 * always visible in the story canvas regardless of browser focus heuristics.
 */
export const TriggerFocus: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <CollapsibleHeader>
        <span className="[font-family:var(--s-font-mono)]">
          @devfellowship/components
        </span>
        {/* Forced focus ring: always-on classes + autoFocus for real keyboard state */}
        <CollapsibleTrigger
          autoFocus
          tabIndex={0}
          className={[
            "outline-none",
            "[box-shadow:var(--c-collapsible-trigger-ring)]",
            "text-[var(--s-brand-hover)]",
            "bg-[var(--s-brand-subtle)]",
          ].join(" ")}
        >
          <ChevronDown
            className="size-[15px] rotate-180"
            aria-hidden="true"
          />
          <span className="sr-only">Collapse</span>
        </CollapsibleTrigger>
      </CollapsibleHeader>
      <CollapsibleContent>
        {ITEMS.map((item) => (
          <CollapsibleItem key={item}>{item}</CollapsibleItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

// ─── Story: TriggerHover ─────────────────────────────────────────────────────

/**
 * TriggerHover — open state with the trigger in hover condition.
 *
 * Demonstrates the amber colour-shift affordance that replaces the previous
 * invisible ghost hover:
 *   fg  → --c-collapsible-trigger-fg-hover (--s-brand-solid, #E07A4A)
 *   bg  → --s-brand-subtle (rgba(224,122,74,0.10))
 *   border → --s-brand-border
 *
 * Forced via className so the hover state is always visible in the canvas.
 */
export const TriggerHover: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <CollapsibleHeader>
        <span className="[font-family:var(--s-font-mono)]">
          @devfellowship/components
        </span>
        {/* Forced hover state — matches the :hover CSS rule */}
        <CollapsibleTrigger
          className={[
            "text-[var(--c-collapsible-trigger-fg-hover)]",
            "bg-[var(--s-brand-subtle)]",
            "border-[var(--s-brand-border)]",
          ].join(" ")}
        >
          <ChevronDown
            className="size-[15px] rotate-180"
            aria-hidden="true"
          />
          <span className="sr-only">Collapse</span>
        </CollapsibleTrigger>
      </CollapsibleHeader>
      <CollapsibleContent>
        {ITEMS.map((item) => (
          <CollapsibleItem key={item}>{item}</CollapsibleItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

// ─── Story: Disabled ─────────────────────────────────────────────────────────

/**
 * Disabled — Radix root `disabled` prop set. No interaction is possible.
 *
 * Visual treatment (per DS spec):
 *   • Header row: 45% opacity, cursor not-allowed, pointer-events-none
 *   • Label: --s-ink-disabled colour
 *   • Trigger: disabled attr → disabled:opacity-45 + disabled:pointer-events-none
 *   • Content items: 45% opacity to signal unavailability
 */
export const Disabled: Story = {
  render: () => (
    <Collapsible disabled defaultOpen>
      <CollapsibleHeader
        className="opacity-45 cursor-not-allowed pointer-events-none"
      >
        <span
          className="[font-family:var(--s-font-mono)] text-[var(--s-ink-disabled)]"
        >
          @devfellowship/components
        </span>
        <CollapsibleTrigger disabled>
          <ChevronDown
            className="size-[15px] rotate-180"
            aria-hidden="true"
          />
          <span className="sr-only">Toggle (disabled)</span>
        </CollapsibleTrigger>
      </CollapsibleHeader>
      <CollapsibleContent>
        {ITEMS.map((item) => (
          <CollapsibleItem key={item} className="opacity-45">
            {item}
          </CollapsibleItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};
