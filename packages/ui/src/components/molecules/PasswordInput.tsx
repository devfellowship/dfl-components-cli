/**
 * PasswordInput — DFL Design System v0 (Molecule)
 *
 * Opinionated password field: Input atom + reveal toggle (Eye/EyeOff).
 * Accepts optional label, help text, and error message.
 *
 * Tokens consumed (Layer 3 component tokens):
 *   --c-input-{bg,fg,placeholder,border,border-hover,border-focus,ring-focus,border-error,radius}
 *   --c-passwordinput-toggle-fg          — toggle idle color (--s-ink-muted)
 *   --c-passwordinput-toggle-fg-hover    — toggle hover color (--s-ink-primary)
 *
 * WCAG 2.1 SC 2.1.1: toggle button is keyboard-reachable (tabIndex=0, default
 * for <button>). The DS uniform focus ring (2px bg gap + 1px amber) is applied
 * via focus-visible ring utilities.
 *
 * Error border: delegated to the Input atom's aria-invalid styles which resolve
 * to --c-input-border-error (= --s-danger-solid, #e07a7a). No raw hex fallbacks.
 *
 * ATOMIC TIER: Molecule (Input atom + Eye/EyeOff icons + optional label/help/error)
 * Moved from organisms/ to molecules/ to match the atomic-tier map.
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
  /** Error text — also flips the border to danger via aria-invalid. */
  error?: string;
  /** Helper text shown when there is no error. */
  helpText?: string;
  /** Convenience callback receiving the raw string value. */
  onValueChange?: (value: string) => void;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      id,
      label,
      error,
      helpText,
      onValueChange,
      onChange,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = React.useState(false);
    const reactId = React.useId();
    const inputId = id ?? reactId;

    return (
      <div className="grid w-full items-center gap-1.5">
        {label && (
          <Label
            htmlFor={inputId}
            style={{ opacity: disabled ? 0.5 : undefined }}
          >
            {label}
          </Label>
        )}

        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={show ? "text" : "password"}
            disabled={disabled}
            className={cn(
              // right padding to clear the toggle button
              "pr-10",
              className,
            )}
            aria-invalid={error ? true : undefined}
            onChange={(e) => {
              onChange?.(e);
              onValueChange?.(e.target.value);
            }}
            {...props}
          />

          {/*
           * Reveal toggle — keyboard-reachable (tabIndex=0 / default).
           * Color via DS tokens (--c-passwordinput-toggle-fg/hover) instead of
           * Tailwind semantics (text-muted-foreground / hover:text-foreground).
           * DS uniform focus ring: 1px amber ring + 2px bg offset.
           * Disabled: opacity-50 + cursor-not-allowed (browser also blocks events).
           */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className={cn(
              // layout
              "absolute right-0 top-0 h-full w-9",
              "flex items-center justify-center",
              // shape
              "rounded-r-[var(--c-input-radius)]",
              // surface
              "bg-transparent border-none",
              // DS token-based ink (replacing Tailwind text-muted-foreground / hover:text-foreground)
              "text-[var(--c-passwordinput-toggle-fg)]",
              "hover:text-[var(--c-passwordinput-toggle-fg-hover)]",
              // motion (DS token for fast transitions)
              "transition-[color] duration-[var(--p-duration-fast)]",
              // cursor
              "cursor-pointer",
              "disabled:cursor-not-allowed disabled:opacity-50",
              // DS uniform focus ring — outline suppressed, ring via offset utilities
              "outline-none",
              "focus-visible:ring-1 focus-visible:ring-[var(--s-border-focus)]",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
              "focus-visible:rounded-[var(--p-radius-sm)]",
            )}
          >
            {show ? (
              <EyeOff className="h-[15px] w-[15px]" aria-hidden />
            ) : (
              <Eye className="h-[15px] w-[15px]" aria-hidden />
            )}
          </button>
        </div>

        {/* Error message — color via --s-danger-fg (no raw hex fallback) */}
        {error ? (
          <p className="text-[12px] text-[var(--s-danger-fg)]">{error}</p>
        ) : helpText ? (
          /* Help text — color via --s-ink-muted (no Tailwind text-muted-foreground) */
          <p className="text-[12px] text-[var(--s-ink-muted)]">{helpText}</p>
        ) : null}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
