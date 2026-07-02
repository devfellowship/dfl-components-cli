/**
 * LoginPage stories — one story per state (DS "1 story = 1 state" rule).
 *
 * States covered:
 *   Login             — default empty fields, CTA enabled via --c-button-primary-bg.
 *   LoginInputFocused — email field auto-focused; verifies DS focus ring + --c-input-border-focus.
 *   LoginLoading      — isSubmitting=true; Button shows built-in Spinner, mode-switch dimmed.
 *   LoginError        — post-submit error; banner (--c-loginpage-error-*) + aria-invalid inputs.
 *   Signup            — signup mode, terms unchecked; CTA disabled (--s-surface-elevated bg).
 *   SignupTermsAccepted — terms checked; CTA enables amber via --c-button-primary-bg.
 */
import type { Meta, StoryObj } from "@storybook/react";
import { LoginPage } from "../components/organisms/LoginPage";

const meta: Meta<typeof LoginPage> = {
  title: "Components/Organisms/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    title: { control: "text" },
    defaultMode: {
      control: "select",
      options: ["login", "signup"],
    },
    redirectUrl: { control: "text" },
    termsUrl: { control: "text" },
    initialErrorMessage: { control: "text" },
    initialIsSubmitting: { control: "boolean" },
    initialAcceptedTerms: { control: "boolean" },
    focusField: {
      control: "select",
      options: [undefined, "email", "password"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

/**
 * Login — default state.
 * Empty email + password fields with placeholders, CTA enabled.
 * Verifies: card surface (#141210 via --c-loginpage-card-bg), input bg (#1a1714
 * via --c-input-bg), and amber CTA via --c-button-primary-bg.
 */
export const Login: Story = {
  args: {
    title: "welcome, fellow!",
    defaultMode: "login",
    redirectUrl: "/dashboard",
    onSuccess: (url) => alert(`Login bem-sucedido! Redirect: ${url}`),
    onError: (err) => console.error(err),
  },
};

/**
 * LoginInputFocused — email input in focused state.
 * Uses autoFocus on mount to demonstrate the DS uniform focus ring:
 *   box-shadow 0 0 0 2px var(--s-surface-page), 0 0 0 3px var(--s-border-focus)
 * Also verifies --c-input-border-focus (#E07A4A) active on the field.
 */
export const LoginInputFocused: Story = {
  args: {
    title: "welcome, fellow!",
    defaultMode: "login",
    focusField: "email",
  },
};

/**
 * LoginLoading — isSubmitting=true.
 * CTA renders the Button built-in Spinner (no text), pointer-events disabled.
 * Mode-switch link is dimmed (opacity-40, cursor-not-allowed).
 * Verifies the loading affordance.
 */
export const LoginLoading: Story = {
  args: {
    title: "welcome, fellow!",
    defaultMode: "login",
    initialIsSubmitting: true,
  },
};

/**
 * LoginError — post-submit invalid-credentials state.
 * Error banner: --c-loginpage-error-bg (--s-danger-subtle) bg +
 *               --c-loginpage-error-border (--s-danger-border) border.
 * Both inputs: aria-invalid → --c-input-border-error (--s-danger-solid) border
 *              + --s-danger-subtle background.
 * Verifies the error UI path (previously unimplemented).
 */
export const LoginError: Story = {
  args: {
    title: "welcome, fellow!",
    defaultMode: "login",
    initialErrorMessage:
      "Invalid email or password. Please check your credentials and try again.",
    onError: (err) => console.error(err),
  },
};

/**
 * Signup — signup mode, terms checkbox unchecked.
 * CTA renders in disabled style: --s-surface-elevated bg + --s-ink-disabled fg.
 * Verifies the disabled-CTA guard before terms are accepted.
 */
export const Signup: Story = {
  args: {
    title: "Crie sua conta",
    defaultMode: "signup",
    redirectUrl: "/onboarding",
    termsUrl: "https://devfellowship.com/en/terms",
    initialAcceptedTerms: false,
    onSuccess: (url) => alert(`Cadastro realizado! Redirect: ${url}`),
  },
};

/**
 * SignupTermsAccepted — terms checkbox checked.
 * CTA switches to --c-button-primary-bg (amber), enabled.
 * Verifies the checked-to-enabled transition.
 */
export const SignupTermsAccepted: Story = {
  args: {
    title: "Crie sua conta",
    defaultMode: "signup",
    redirectUrl: "/onboarding",
    termsUrl: "https://devfellowship.com/en/terms",
    initialAcceptedTerms: true,
    onSuccess: (url) => alert(`Cadastro realizado! Redirect: ${url}`),
  },
};
