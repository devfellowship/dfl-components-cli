import type { Meta, StoryObj } from "@storybook/react";
import { LoginScreen } from "../components/organisms/LoginScreen";

/**
 * LoginScreen — one story per state.
 *
 * Verifies the four DS token regressions fixed in v1.5.x:
 *   1. Title renders in Barlow Condensed 700 (--s-font-display), not Inter.
 *   2. Every focusable element shows the DS uniform focus ring
 *      (box-shadow 0 0 0 2px #0a0908, 0 0 0 3px #E07A4A).
 *   3. Error text resolves via --s-danger-fg (no raw hex #e89898 fallback).
 *   4. Outer wrapper carries background: var(--s-surface-page) (#0a0908).
 *
 * Layout: fullscreen so the outer bg / centered card alignment is visible.
 */
const meta: Meta<typeof LoginScreen> = {
  title: "Components/Organisms/LoginScreen",
  component: LoginScreen,
  parameters: { layout: "fullscreen" },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    submitLabel: { control: "text" },
    error: { control: "text" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof LoginScreen>;

/**
 * Idle empty form — the baseline.
 *
 * Verify:
 *   • Card uses --c-card-radius (10px), NOT 12px (rounded-xl).
 *   • Title renders in Barlow Condensed 700 (display font).
 *   • Outer wrapper background is var(--s-surface-page) warm near-black #0a0908.
 */
export const Default: Story = {
  args: {
    title: "welcome, fellow!",
    subtitle: "Sign in to continue",
    onSubmit: (email) => alert(`submit: ${email}`),
  },
};

/**
 * Email input in :focus-visible state.
 *
 * Verify:
 *   • Amber border (--c-input-border-focus) on the email field.
 *   • DS uniform focus ring visible: 2px dark gap + 1px amber outer ring
 *     (--c-loginscreen-focus-gap / --c-loginscreen-focus-color).
 */
export const InputFocused: Story = {
  args: {
    title: "welcome, fellow!",
    subtitle: "Sign in to continue",
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>("#login-email");
    input?.focus();
  },
};

/**
 * Submit button in keyboard-focus state.
 *
 * Verify:
 *   • DS uniform focus ring appears on the button:
 *     box-shadow 0 0 0 2px #0a0908, 0 0 0 3px #E07A4A.
 *   • No bare browser outline visible.
 */
export const ButtonFocused: Story = {
  args: {
    title: "welcome, fellow!",
    subtitle: "Sign in to continue",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>("button[type='submit']");
    button?.focus();
  },
};

/**
 * error prop set — credential mismatch state.
 *
 * Verify:
 *   • Error text color resolves via --s-danger-fg semantic token (#e89898).
 *     Inspect the DOM: no raw hex fallback in the style attribute.
 *   • Email and password inputs show the danger border (--c-input-border-error)
 *     via aria-invalid.
 */
export const WithError: Story = {
  args: {
    title: "welcome, fellow!",
    error: "Invalid email or password.",
    onSubmit: (email) => alert(`submit: ${email}`),
  },
};

/**
 * loading=true — in-flight network request.
 *
 * Verify:
 *   • Both email and password inputs are disabled (opacity 50%, cursor not-allowed).
 *   • Submit button shows the CSS border-spin spinner (aria-hidden on the span).
 *   • Button carries aria-busy="true" for screen-reader parity.
 */
export const Loading: Story = {
  args: {
    title: "welcome, fellow!",
    loading: true,
  },
};

/**
 * footer slot populated — sign-up prompt.
 *
 * Verify:
 *   • Footer link renders in --s-brand-fg (#f0a872 amber).
 *   • Card height expands cleanly; center alignment is preserved.
 *   • No layout overflow or broken flex centering.
 */
export const WithFooter: Story = {
  args: {
    title: "Acesse o Portal",
    subtitle: "Use suas credenciais DFL",
    onSubmit: (email) => alert(`submit: ${email}`),
    footer: (
      <span>
        Don&apos;t have an account?{" "}
        <a href="#" style={{ color: "var(--s-brand-fg)", fontWeight: 500 }}>
          Sign up
        </a>
      </span>
    ),
  },
};
