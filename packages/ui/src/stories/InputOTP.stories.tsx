import type { Meta, StoryObj } from "@storybook/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/input-otp";

/**
 * InputOTP — one story per visual state (DS v0 rule: 1 story = 1 state).
 *
 * States: Default · Active · Filling · Error · Success · Disabled · FourDigit
 *
 * Component tokens consumed:
 *   --c-otp-slot-w/h     slot geometry (48×56px, up from 36×36px)
 *   --c-otp-font         JetBrains Mono for unambiguous digit rendering
 *   --c-otp-slot-border-* per-state border colours via --s-* semantics
 *   --c-otp-slot-bg-*    idle vs filled background
 *
 * Active focus ring (applied inline in InputOTPSlot):
 *   box-shadow: 0 0 0 2px var(--background), 0 0 0 3px #E07A4A
 *   The ONE uniform DFL ring — 2px page-bg gap + 1px amber outline.
 */
const meta: Meta<typeof InputOTP> = {
  title: "Components/Molecules/InputOTP",
  component: InputOTP,
  argTypes: {
    status: {
      control: "select",
      options: ["default", "error", "success"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

// ── Shared layout helper ─────────────────────────────────────────────────────

/** Standard 6-digit layout (two groups of 3, separated by a dash). */
function SixDigit() {
  return (
    <>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </>
  );
}

// ── Stories — one per state ──────────────────────────────────────────────────

/**
 * Default — all slots empty, warm sand border on --s-surface-raised bg.
 * JetBrains Mono applied via --c-otp-font.
 */
export const Default: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <SixDigit />
    </InputOTP>
  ),
};

/**
 * Active — slot 0 auto-focused on mount, blinking caret visible.
 * Amber border (--c-otp-slot-border-active) + uniform DFL focus ring:
 * box-shadow: 0 0 0 2px var(--background), 0 0 0 3px #E07A4A.
 */
export const Active: Story = {
  render: () => (
    <InputOTP maxLength={6} autoFocus>
      <SixDigit />
    </InputOTP>
  ),
};

/**
 * Filling — 3 of 6 digits entered (first group complete).
 * Active caret sits at slot 3. Filled slots use --c-otp-slot-bg-filled
 * (slightly elevated surface) to signal they contain content.
 */
export const Filling: Story = {
  render: () => (
    <InputOTP maxLength={6} defaultValue="482">
      <SixDigit />
    </InputOTP>
  ),
};

/**
 * Error — all slots filled with an invalid code.
 * Every slot: --s-danger-solid border + --s-danger-subtle bg tint + --s-danger-fg text.
 * Helper text in --s-danger-fg below the widget.
 */
export const Error: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <InputOTP maxLength={6} defaultValue="123456" status="error">
        <SixDigit />
      </InputOTP>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          lineHeight: 1.5,
          color: "var(--s-danger-fg)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 5v4M8 11v.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Código incorreto. Verifique e tente novamente.
      </p>
    </div>
  ),
};

/**
 * Success — all slots filled with a verified code.
 * Every slot: --s-success-solid border + --s-success-subtle bg tint + --s-success-fg text.
 * Helper text in --s-success-fg below the widget.
 * This state was absent in the original shadcn baseline.
 */
export const Success: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <InputOTP maxLength={6} defaultValue="482917" status="success">
        <SixDigit />
      </InputOTP>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          lineHeight: 1.5,
          color: "var(--s-success-fg)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5 8.5l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Código verificado com sucesso.
      </p>
    </div>
  ),
};

/**
 * Disabled — partially filled (3 of 6 digits), entire widget locked.
 * Container: opacity 0.40, pointer-events none (via has-[:disabled] on the container).
 * Digit colour inherits the reduced opacity — no separate --s-ink-disabled override needed.
 */
export const Disabled: Story = {
  render: () => (
    <InputOTP maxLength={6} defaultValue="482" disabled>
      <SixDigit />
    </InputOTP>
  ),
};

/**
 * FourDigit — single group, no separator. Used for short PIN entry (e.g. checkout PIN).
 * Active caret at slot 2 (2 digits filled).
 */
export const FourDigit: Story = {
  render: () => (
    <InputOTP maxLength={4} defaultValue="73">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
};
