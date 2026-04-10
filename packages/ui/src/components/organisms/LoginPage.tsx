/**
 * LoginPage organism
 * Ported from dfl-learn's Login + AuthForm components.
 * Self-contained: uses @dfl/components primitives + useAuth hook.
 * No framer-motion dependency — plain CSS transitions.
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
}

const DEFAULT_LOGO = "https://devfellowship.s3.sa-east-1.amazonaws.com/media/1755889468274-DevFelloShip%2B1%2BSi%CC%81mbolo.png";

export function LoginPage({
  logo,
  title = "welcome, fellow!",
  redirectUrl = "/",
  onSuccess,
  onError,
  defaultMode = "login",
  termsUrl = "https://devfellowship.com/en/terms",
  className,
}: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
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
      onError?.(err instanceof Error ? err : new Error(String(err)));
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
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl p-8 shadow-xl border border-border text-center">
          {/* Logo */}
          <div className="mx-auto w-20 h-20 flex items-center justify-center mb-0">
            {logoEl}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-6 mt-4">{title}</h2>

          {/* Form */}
          <div className="w-full max-w-sm mx-auto space-y-5">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="lp-email" className="text-sm font-medium text-foreground/90">
                    Email
                  </Label>
                  <Input
                    id="lp-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-11 bg-secondary border-secondary text-foreground"
                    required
                  />
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="lp-password" className="text-sm font-medium text-foreground/90">
                    Password
                  </Label>
                  <Input
                    id="lp-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 bg-secondary border-secondary text-foreground"
                    required
                  />
                </div>

                {mode === "signup" && (
                  <div className="flex items-start gap-2 text-left">
                    <Checkbox
                      id="lp-terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="lp-terms"
                      className="text-sm text-foreground/80 cursor-pointer leading-relaxed"
                    >
                      I agree to the{" "}
                      <a
                        href={termsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--brand-accent,#F39325)] underline-offset-4 hover:underline"
                      >
                        Terms and Conditions
                      </a>
                      .
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-4 mt-6">
                <Button
                  type="submit"
                  className="w-full h-11 bg-[var(--brand-accent,#F39325)] hover:bg-[var(--brand-accent,#F39325)]/90 text-primary-foreground transition-colors duration-200"
                  disabled={isSubmitting || (mode === "signup" && !acceptedTerms)}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mx-auto" />
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-[var(--brand-accent,#F39325)] underline-offset-4 hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-[var(--brand-accent,#F39325)] underline-offset-4 hover:underline"
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
