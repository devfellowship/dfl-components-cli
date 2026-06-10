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
 */
import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { PasswordInput } from "./PasswordInput";

const DEFAULT_LOGO =
  "https://devfellowship.s3.sa-east-1.amazonaws.com/media/1755889468274-DevFelloShip%2B1%2BSi%CC%81mbolo.png";

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
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-4",
        className,
      )}
    >
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl p-8 shadow-xl border border-border text-center">
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            {logoEl}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1 mt-4">{title}</h2>
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
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-[var(--s-danger-fg,#e89898)] text-left"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-current/20 border-t-current rounded-full animate-spin" />
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
