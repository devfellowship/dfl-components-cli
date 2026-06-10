/**
 * PasswordInput organism
 * Canonical password field with a show/hide reveal toggle.
 * Generalised from dfl-reviews' atoms/password-input. Optional label/error/help.
 * Uncontrolled-friendly: spreads native input props; `onValueChange` is a
 * convenience on top of the standard `onChange`.
 */
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "../../lib/utils";
import { Input } from "../input";
import { Label } from "../label";

export interface PasswordInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Input>, "type"> {
  /** Optional field label rendered above the input. */
  label?: React.ReactNode;
  /** Error text — also flips the border to danger. */
  error?: string;
  /** Helper text shown when there's no error. */
  helpText?: string;
  /** Convenience callback receiving the raw string value. */
  onValueChange?: (value: string) => void;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    { id, label, error, helpText, onValueChange, onChange, className, ...props },
    ref,
  ) => {
    const [show, setShow] = React.useState(false);
    const reactId = React.useId();
    const inputId = id ?? reactId;

    return (
      <div className="grid w-full items-center gap-1.5">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={show ? "text" : "password"}
            className={cn(
              "pr-10",
              error && "border-[var(--s-danger-border,#9c3b3b)]",
              className,
            )}
            aria-invalid={error ? true : undefined}
            onChange={(e) => {
              onChange?.(e);
              onValueChange?.(e.target.value);
            }}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute right-0 top-0 h-full px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error ? (
          <p className="text-xs text-[var(--s-danger-fg,#e89898)]">{error}</p>
        ) : helpText ? (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        ) : null}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
