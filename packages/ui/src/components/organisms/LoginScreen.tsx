/**
 * LoginScreen organism
 * Shared, behavior-agnostic auth UI. Renders branding + email/password fields
 * (the password field is the canonical PasswordInput with a reveal toggle) and
 * calls `onSubmit(email, password)`. NO supabase/auth logic lives here — the
 * consuming app wires its existing handler to `onSubmit` and drives `error` /
 * `loading` from its own state.
 *
 * NOTE: this is the prop-driven login. The legacy `LoginPage` (which embeds the
 * `useAuth` hook) is kept for existing consumers; new apps should adopt
 * `LoginScreen`.
 *
 * DS token fixes applied (v1.5.x):
 *   • Title: Barlow Condensed 700 via --c-loginscreen-title-font (--s-font-display)
 *   • Outer wrapper: explicit background: var(--c-loginscreen-bg) (--s-surface-page)
 *   • Card: border-radius via --c-card-radius (10px), not rounded-xl (12px)
 *   • Error: color via --c-loginscreen-error-fg (--s-danger-fg), no raw hex fallback
 *   • Focus ring: DS uniform 2px gap + 1px amber ring on all focusable elements
 */
import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { PasswordInput } from "../molecules/PasswordInput";

const DEFAULT_LOGO =
  "https://devfellowship.s3.sa-east-1.amazonaws.com/media/1755889468274-DevFelloShip%2B1%2BSi%CC%81mbolo.png";

/**
 * DS uniform focus ring className.
 * ring-offset-2 creates the 2px "gap" filled with the page background colour
 * (--c-loginscreen-focus-gap = --s-surface-page = #0a0908).
 * ring-1 draws the 1px amber ring on top of the gap
 * (--c-loginscreen-focus-color = --s-border-focus = #E07A4A).
 * Applied to every focusable element inside the card so the visual matches
 * the DS spec: box-shadow 0 0 0 2px #0a0908, 0 0 0 3px #E07A4A.
 */
const DS_FOCUS_RING =
  "focus-visible:ring-1 focus-visible:ring-[var(--c-loginscreen-focus-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-loginscreen-focus-gap)]";

export interface LoginScreenProps {
  /** Logo element or image src. Defaults to the DFL logomark. */
  logo?: React.ReactNode | string;
  /** Heading. Defaults to "welcome, fellow!". */
  title?: React.ReactNode;
  /** Sub-heading shown under the title. */
  subtitle?: React.ReactNode;
  /** Email field label. Defaults to "Email". */
  emailLabel?: string;
  /** Password field label. Defaults to "Password". */
  passwordLabel?: string;
  /** Submit button label. Defaults to "Sign In". */
  submitLabel?: string;
  /** Called with the entered credentials. May be async. */
  onSubmit?: (email: string, password: string) => void | Promise<void>;
  /** Error message rendered above the submit button. */
  error?: string | null;
  /** Loading state — disables fields and shows a spinner on submit. */
  loading?: boolean;
  /** Extra content under the form (e.g. "Sign up" / "Forgot password?" links). */
  footer?: React.ReactNode;
  /** Outer wrapper class. */
  className?: string;
}

export function LoginScreen({
  logo,
  title = "welcome, fellow!",
  subtitle,
  emailLabel = "Email",
  passwordLabel = "Password",
  submitLabel = "Sign In",
  onSubmit,
  error,
  loading = false,
  footer,
  className,
}: LoginScreenProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    onSubmit?.(email, password);
  };

  const logoEl =
    logo === undefined ? (
      <img src={DEFAULT_LOGO} alt="DevFellowship" className="w-16 h-16 object-contain" />
    ) : typeof logo === "string" ? (
      <img src={logo} alt="" className="w-16 h-16 object-contain" />
    ) : (
      logo
    );

  return (
    /* Explicit background so the warm near-black page color (#0a0908) shows even
     * in consumer apps without a global body reset. */
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-4",
        className,
      )}
      style={{ background: "var(--c-loginscreen-bg)" }}
    >
      <div className="w-full max-w-md">
        {/* Card radius via --c-card-radius (10px) — not rounded-xl which is 12px. */}
        <div
          className="bg-card p-8 shadow-xl border border-border text-center"
          style={{ borderRadius: "var(--c-card-radius)" }}
        >
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            {logoEl}
          </div>

          {/* Title: Barlow Condensed 700 via --c-loginscreen-title-font (--s-font-display).
           * Previously incorrectly rendered as Inter via text-2xl font-bold. */}
          <h2
            className="text-foreground mb-1 mt-4"
            style={{
              fontFamily: "var(--c-loginscreen-title-font)",
              fontWeight: 700,
              fontSize: "var(--c-loginscreen-title-size)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-6 space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="login-email">{emailLabel}</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                required
                aria-invalid={error ? true : undefined}
                className={DS_FOCUS_RING}
              />
            </div>

            <div className="text-left">
              <PasswordInput
                id="login-password"
                label={passwordLabel}
                autoComplete="current-password"
                value={password}
                onValueChange={setPassword}
                placeholder="••••••••"
                disabled={loading}
                required
                aria-invalid={error ? true : undefined}
                className={DS_FOCUS_RING}
              />
            </div>

            {error && (
              /* Error color via --c-loginscreen-error-fg (--s-danger-fg = #e89898).
               * Removed the raw-hex fallback `#e89898` that previously leaked
               * when the semantic token wasn't loaded. */
              <p
                role="alert"
                className="text-sm text-left"
                style={{ color: "var(--c-loginscreen-error-fg)" }}
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className={cn("w-full", DS_FOCUS_RING)}
              disabled={loading}
              aria-busy={loading ? "true" : undefined}
            >
              {loading ? (
                <span
                  className="h-5 w-5 border-2 border-current/20 border-t-current rounded-full animate-spin"
                  aria-hidden="true"
                />
              ) : (
                submitLabel
              )}
            </Button>

            {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
