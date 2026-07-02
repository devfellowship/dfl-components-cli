import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { cn } from "../lib/utils";
import { Button } from "../components/button";

/**
 * DesignPlayground / ButtonLab — EXPERIMENTATION SANDBOX. NOT exported.
 *
 * Two active experiments:
 *
 *  A) RoundedExperiment — pill shape driven by --p-radius-pill token (NOT raw
 *     Tailwind `rounded-full`). The base Button gained a `rounded="pill"` prop
 *     that maps to --p-radius-pill: 999px, keeping the shape token-driven and
 *     themeable. All states of the pill form are exercised here.
 *
 *  B) RecordingExperiment — amber-brand recording indicator replacing the
 *     prior (wrong) `variant="destructive"` treatment. Recording is a
 *     brand/status signal, NOT an error state. Uses --c-buttonlab-recording-*
 *     tokens (see tokens.css, Layer 3 / ButtonLab block) that resolve to
 *     existing --s-brand-* / --s-ink-* / --s-border-* semantics.
 *
 * Stories: one export = one state (per the atomic hierarchy rule).
 * Focus ring fix: base Button now uses
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 * (DS v0 brand spec ch.5.2 — 2px page-bg gap + 1px solid amber, no alpha bleed).
 *
 * Graduation path: prototype wins here → add variant/prop to button.tsx cva
 * → add stories under Components/Atoms/Button → trim playground when promoted.
 *
 * NOT in src/index.ts, NOT in registry/registry.json, NOT via CLI.
 * CI guard `check-no-playground-export` fails if anything here leaks out.
 */
const meta: Meta<typeof Button> = {
  title: "DesignPlayground/ButtonLab",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ══════════════════════════════════════════════════════════════════════════
   Experiment A — RoundedExperiment (Pill shape, token-driven)
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Pill at default size, primary variant, idle state.
 * Verifies `rounded="pill"` consumes --p-radius-pill (999px) — NOT className
 * override with `rounded-full` which would bypass the token system.
 */
export const RoundedExperimentDefault: Story = {
  name: "RoundedExperiment/Default",
  render: () => (
    <Button rounded="pill">Pill button</Button>
  ),
};

/**
 * Pill with the corrected DS v0 focus ring.
 * Ring = box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 * — the 2px page-bg gap makes the ring crisply visible on the dark surface.
 * Contrast: old ring-3 + rgba(224,122,74,.45) had no gap and bled into bg.
 */
export const RoundedExperimentFocus: Story = {
  name: "RoundedExperiment/Focus",
  render: () => {
    const ref = React.useRef<HTMLButtonElement>(null);
    React.useEffect(() => {
      ref.current?.focus();
    }, []);
    return (
      <Button ref={ref} rounded="pill">
        Pill button
      </Button>
    );
  },
};

/**
 * Pill with `loading` prop — spinner visible, button auto-disabled, width stable.
 * The spinner replaces the leading icon slot; layout does not shift.
 */
export const RoundedExperimentLoading: Story = {
  name: "RoundedExperiment/Loading",
  render: () => (
    <Button rounded="pill" loading>
      Pill button
    </Button>
  ),
};

/**
 * Pill with `disabled` prop — 50% opacity, pointer-events none.
 * Shape and sizing are preserved; no interactive affordance.
 */
export const RoundedExperimentDisabled: Story = {
  name: "RoundedExperiment/Disabled",
  render: () => (
    <Button rounded="pill" disabled>
      Pill button
    </Button>
  ),
};

/* ══════════════════════════════════════════════════════════════════════════
   Experiment B — RecordingExperiment (amber-brand status indicator)
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Local wrapper — uses --c-buttonlab-recording-* tokens from tokens.css
 * (Layer 3 / ButtonLab block). Not exported outside the playground.
 *
 * The pulsing dot is a positioned <span> (not CSS ::before) so the animation
 * class can be toggled in TSX without a stylesheet dependency.
 */
function RecordingButton({
  recording = true,
  className,
}: {
  recording?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        // Layout — mirrors base Button default size (34px, 13px)
        "relative inline-flex items-center justify-center gap-2 select-none",
        "h-[34px] pl-7 pr-[14px] text-[13px] font-medium whitespace-nowrap",
        // Shape — token-driven (matches --c-button-radius default = 6px)
        "rounded-[var(--c-button-radius)]",
        // DS v0 focus ring (same spec as base Button ch.5.2)
        "outline-none focus-visible:shadow-[0_0_0_2px_var(--s-surface-page),_0_0_0_3px_#E07A4A]",
        "transition-[background-color,border-color,color,box-shadow] duration-150",
        "border",
        recording
          ? [
              "bg-[var(--c-buttonlab-recording-bg)]",
              "text-[var(--c-buttonlab-recording-fg)]",
              "border-[var(--c-buttonlab-recording-border)]",
            ].join(" ")
          : [
              "bg-[var(--c-buttonlab-recording-idle-bg)]",
              "text-[var(--c-buttonlab-recording-idle-fg)]",
              "border-[var(--c-buttonlab-recording-idle-border)]",
            ].join(" "),
        className,
      )}
    >
      {/* Status dot — amber color in active state, dimmed in idle */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[10px] size-[7px] rounded-full bg-current",
          recording
            ? "animate-[pulse_1.4s_ease-in-out_infinite]"
            : "opacity-30",
        )}
      />
      {recording ? "Gravando…" : "Parado"}
    </button>
  );
}

/**
 * Recording — Active state.
 * Pulsing amber dot + "Gravando…" label.
 * Uses amber-brand treatment (--c-buttonlab-recording-* tokens) — NOT the
 * destructive/danger variant. Recording is a status signal, not an error.
 */
export const RecordingExperimentActive: Story = {
  name: "RecordingExperiment/Active",
  render: () => <RecordingButton recording={true} />,
};

/**
 * Recording — Idle (stopped) state.
 * Static dimmed dot + neutral "Parado" label.
 * Demonstrates the paired stopped-state alongside Active so both states are
 * documented and visually comparable in Storybook.
 */
export const RecordingExperimentIdle: Story = {
  name: "RecordingExperiment/Idle",
  render: () => <RecordingButton recording={false} />,
};
