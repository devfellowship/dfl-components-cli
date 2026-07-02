"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";

import { cn } from "../lib/utils";

/**
 * Visual validation status for the OTP widget.
 *
 * - default: idle / filling — warm sand borders, no tint
 * - error:   rejected code — --s-danger-solid border, --s-danger-subtle bg
 * - success: verified code — --s-success-solid border, --s-success-subtle bg
 *
 * Provided to all child InputOTPSlots via InputOTPStatusContext so the caller
 * sets it once on the <InputOTP> root, not on every slot.
 */
export type OTPStatus = "default" | "error" | "success";

const InputOTPStatusContext = React.createContext<OTPStatus>("default");

function InputOTP({
  className,
  containerClassName,
  status = "default",
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
  /** Visual validation status applied uniformly to all slots. */
  status?: OTPStatus;
}) {
  return (
    <InputOTPStatusContext.Provider value={status}>
      <OTPInput
        data-slot="input-otp"
        data-status={status}
        containerClassName={cn(
          "flex items-center gap-[var(--c-otp-group-gap)]",
          // Disabled: 40% opacity + pointer-events none (matches proposed HTML spec)
          "has-[:disabled]:opacity-40 has-[:disabled]:pointer-events-none",
          containerClassName,
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </InputOTPStatusContext.Provider>
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      // No inter-slot gap — slots are flush/joined; gap is only between groups
      className={cn("flex items-stretch", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const status = React.useContext(InputOTPStatusContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  const isFilled = Boolean(char);

  // ── Resolve state-driven visual tokens ─────────────────────────────────

  const borderColor =
    status === "error"
      ? "var(--c-otp-slot-border-error)"
      : status === "success"
      ? "var(--c-otp-slot-border-success)"
      : isActive
      ? "var(--c-otp-slot-border-active)"
      : "var(--c-otp-slot-border)";

  const background =
    status === "error"
      ? "var(--s-danger-subtle)"
      : status === "success"
      ? "var(--s-success-subtle)"
      : isFilled || isActive
      ? "var(--c-otp-slot-bg-filled)"
      : "var(--c-otp-slot-bg)";

  const color =
    status === "error"
      ? "var(--s-danger-fg)"
      : status === "success"
      ? "var(--s-success-fg)"
      : "var(--c-otp-slot-fg)";

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={isFilled}
      data-status={status}
      className={cn(
        // Layout
        "relative flex items-center justify-center select-none",
        // Border collapse: all sides minus right; last slot restores right.
        // Each subsequent slot's left border acts as the internal divider.
        "border border-r-0 last:border-r",
        // Radius: left on first, right on last of each group
        "first:rounded-l-[6px] last:rounded-r-[6px]",
        // Active slot: restore right border so the ring encloses the full slot
        isActive && "border-r z-10",
        // Motion
        "transition-[background,border-color] duration-100 ease-out",
        className,
      )}
      style={{
        // Component tokens: slot geometry
        width: "var(--c-otp-slot-w)",
        height: "var(--c-otp-slot-h)",
        // JetBrains Mono — unambiguous digit rendering (0 vs O, 1 vs l)
        fontFamily: "var(--c-otp-font)",
        fontSize: "var(--c-otp-font-size)",
        fontWeight: "var(--c-otp-font-weight)" as React.CSSProperties["fontWeight"],
        letterSpacing: "0.02em",
        // State-driven fills
        background,
        borderColor,
        color,
        // DFL uniform focus ring on the active slot:
        //   2px page-bg gap creates the "halo gap", then 1px amber outline.
        //   box-shadow is preferred over outline so it doesn't affect layout.
        ...(isActive
          ? { boxShadow: "0 0 0 2px var(--background), 0 0 0 3px #E07A4A" }
          : {}),
        ...style,
      }}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Blinking caret — uses caret-blink @keyframes from index.css / tw-animate-css */}
          <div
            style={{
              width: "2px",
              height: "22px",
              borderRadius: "1px",
              background: "var(--s-ink-primary)",
              animation: "caret-blink 1.25s ease-out infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      // Flat 2px bar — intentional width-controlled design vs the Lucide MinusIcon SVG
      className={cn("shrink-0 self-center", className)}
      style={{
        width: "16px",
        height: "2px",
        background: "var(--s-border-strong)",
        borderRadius: "1px",
      }}
      {...props}
    />
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
