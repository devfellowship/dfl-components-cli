/**
 * LoginPage organism
 * Ported from dfl-learn's Login + AuthForm components.
 * Self-contained: uses @dfl/components primitives + useAuth hook.
 * No framer-motion dependency — plain CSS transitions.
 *
 * v1.1 — DS token hygiene pass:
 *   - Removed raw hex overrides (#E07A4A); CTA consumes --c-button-primary-bg
 *     via the Button primary variant. Mode-switch <button> and terms <a> use
 *     --s-brand-solid via CSS var class.
 *   - Uniform DS focus ring (box-shadow: 0 0 0 2px --s-surface-page, 0 0 0 3px
 *     --s-border-focus) on mode-switch button and terms link via
 *     --c-loginpage-focus-ring; Input + Button components carry their own rings.
 *   - Inputs consume --c-input-* tokens natively (bg-secondary/border-secondary
 *     compatibility aliases removed); aria-invalid drives error-border + bg.
 *   - Error state: error banner (--c-loginpage-error-*), inputs get aria-invalid.
 *   - Disabled CTA (signup + no terms) shows --s-surface-elevated bg +
 *     --s-ink-disabled fg via inline style override.
 */
import React, { useState, ReactNode } from "react";

import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Checkbox } from "../checkbox";
import { useAuth } from "../../hooks/use-auth";

export interface LoginPageProps {
  /** Logo element or image src string. Defaults to DFL logo. */
  logo?: ReactNode | string;
  /** App title shown below logo. Defaults to "welcome, fellow!" */
  title?: string;
  /** Redirect URL after successful login. Passed to onSuccess. */
  redirectUrl?: string;
  /** Called after successful login/signup. Receives the redirect URL. */
  onSuccess?: (redirectUrl: string) => void;
  /** Called on authentication error. */
  onError?: (error: Error) => void;
  /** Initial form mode. Defaults to "login". */
  defaultMode?: "login" | "signup";
  /** Terms URL shown in signup mode. */
  termsUrl?: string;
  /** Custom CSS class for the outer wrapper. */
  className?: string;
  /**
   * Pre-seed an error message for Storybook / SSR error hand-off.
   * Renders the component in the post-submit error state (banner + input borders).
   */
  initialErrorMessage?: string;
  /** Pre-seed the submitting/loading state (Storybook). */
  initialIsSubmitting?: boolean;
  /** Pre-seed accepted-terms for signup stories (Storybook). */
  initialAcceptedTerms?: boolean;
  /**
   * Auto-focus a specific field on mount.
   * Used by the LoginInputFocused story to demonstrate the DS focus ring.
   */
  focusField?: "email" | "password";
}

const DEFAULT_LOGO =
  "https://devfellowship.s3.sa-east-1.amazonaws.com/media/1755889468274-DevFelloShip%2B1%2BSi%CC%81mbolo.png";

/**
 * DS focus ring applied to plain HTML interactive elements (mode-switch button,
 * terms link) that carry no built-in ring from their own component.
 * Resolves to: box-shadow 0 0 0 2px var(--s-surface-page), 0 0 0 3px var(--s-border-focus)
 * via the --c-loginpage-focus-ring token appended to tokens.css.
 */
const LINK_FOCUS_RING =
  "focus-visible:outline-none focus-visible:[box-shadow:var(--c-loginpage-focus-ring)]";

export function LoginPage({
  logo,
  title = "welcome, fellow!",
  redirectUrl = "/",
  onSuccess,
  onError,
  defaultMode = "login",
  termsUrl = "https://devfellowship.com/en/terms",
  className,
  initialErrorMessage,
  initialIsSubmitting = false,
  initialAcceptedTerms = false,
  focusField,
}: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(initialAcceptedTerms);
  const [isSubmitting, setIsSubmitting] = useState(initialIsSubmitting);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    initialErrorMessage,
  );

  const { login, signup } = useAuth();

  const hasError = Boolean(errorMessage);
  // Terms gate: CTA is disabled when in signup mode without accepting terms.
  // This is independent of isSubmitting (loading uses the Button `loading` prop).
  const termsGate = mode === "signup" && !acceptedTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMessage(undefined);
    try {
      if (mode === "login") {
        const { error } = await login(email, password);
        if (error) throw error;
      } else {
        const { error } = await signup(email, password);
        if (error) throw error;
      }
      onSuccess?.(redirectUrl);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setErrorMessage(error.message);
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoEl =
    logo === undefined ? (
      <img src={DEFAULT_LOGO} alt="DevFellowship Logo" className="w-16 h-16" />
    ) : typeof logo === "string" ? (
      <img src={logo} alt="App Logo" className="w-16 h-16 object-contain" />
    ) : (
      logo
    );

  return (
    <div
      className={[
        "min-h-screen flex flex-col items-center justify-center px-4",
        "[background:var(--s-surface-page)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="w-full max-w-md">
        {/* Card — uses --c-loginpage-* tokens (appended to tokens.css Layer 3) */}
        <div
          className="border text-center"
          style={{
            background: "var(--c-loginpage-card-bg)",
            borderColor: "var(--c-loginpage-card-border)",
            borderRadius: "var(--c-loginpage-card-radius)",
            boxShadow: "var(--c-loginpage-card-shadow)",
            padding: "30px 26px 26px",
          }}
        >
          {/* Logo */}
          <div className="mx-auto w-20 h-20 flex items-center justify-center mb-0">
            {logoEl}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 mt-4 [color:var(--s-ink-primary)]">
            {title}
          </h2>

          {/* Error banner — only visible after a failed submit */}
          {hasError && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-md px-4 py-3 mb-5 text-sm text-left border"
              style={{
                background: "var(--c-loginpage-error-bg)",
                borderColor: "var(--c-loginpage-error-border)",
                color: "var(--c-loginpage-error-fg)",
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <div className="w-full max-w-sm mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2 text-left">
                  <Label
                    htmlFor="lp-email"
                    className="text-sm font-medium [color:var(--s-ink-secondary)]"
                  >
                    Email
                  </Label>
                  <Input
                    id="lp-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoFocus={focusField === "email"}
                    // aria-invalid activates --c-input-border-error via the Input component's
                    // built-in aria-invalid:border-[var(--c-input-border-error)] class.
                    aria-invalid={hasError || undefined}
                    className={[
                      "h-11",
                      // When error: add danger-subtle background (Input handles border via aria-invalid).
                      hasError && "[background:var(--s-danger-subtle)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2 text-left">
                  <Label
                    htmlFor="lp-password"
                    className="text-sm font-medium [color:var(--s-ink-secondary)]"
                  >
                    Password
                  </Label>
                  <Input
                    id="lp-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoFocus={focusField === "password"}
                    aria-invalid={hasError || undefined}
                    className={[
                      "h-11",
                      hasError && "[background:var(--s-danger-subtle)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                </div>

                {/* Terms checkbox (signup only) */}
                {mode === "signup" && (
                  <div className="flex items-start gap-2 text-left">
                    <Checkbox
                      id="lp-terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) =>
                        setAcceptedTerms(checked as boolean)
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="lp-terms"
                      className="text-sm [color:var(--s-ink-secondary)] cursor-pointer leading-relaxed"
                    >
                      I agree to the{" "}
                      <a
                        href={termsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={[
                          "[color:var(--s-brand-solid)]",
                          "underline-offset-4 hover:underline",
                          "rounded-sm",
                          LINK_FOCUS_RING,
                        ].join(" ")}
                      >
                        Terms and Conditions
                      </a>
                      .
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-4 mt-6">
                {/*
                 * CTA Button
                 * — Default (enabled): primary variant → --c-button-primary-bg (amber).
                 * — Loading: `loading` prop → Button shows its built-in Spinner; amber preserved.
                 * — Disabled (terms not accepted): inline style forces --s-surface-elevated bg
                 *   + --s-ink-disabled fg + opacity:1 (overrides disabled:opacity-50 from cva).
                 */}
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  disabled={termsGate}
                  className="w-full h-11"
                  style={
                    termsGate
                      ? {
                          backgroundColor: "var(--s-surface-elevated)",
                          color: "var(--s-ink-disabled)",
                          opacity: 1,
                          borderColor: "transparent",
                        }
                      : undefined
                  }
                >
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Button>

                {/* Mode-switch — plain <button>, needs explicit focus ring + brand color */}
                <p className="text-center text-sm [color:var(--s-ink-muted)]">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signup");
                          setErrorMessage(undefined);
                        }}
                        disabled={isSubmitting}
                        className={[
                          "[color:var(--s-brand-solid)]",
                          "underline-offset-4 hover:underline",
                          "bg-transparent border-none cursor-pointer rounded-sm",
                          LINK_FOCUS_RING,
                          isSubmitting && "opacity-40 cursor-not-allowed",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setErrorMessage(undefined);
                        }}
                        disabled={isSubmitting}
                        className={[
                          "[color:var(--s-brand-solid)]",
                          "underline-offset-4 hover:underline",
                          "bg-transparent border-none cursor-pointer rounded-sm",
                          LINK_FOCUS_RING,
                          isSubmitting && "opacity-40 cursor-not-allowed",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
