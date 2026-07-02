import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "../lib/utils";

/** Size scale for Avatar — drives both the circle dimensions and fallback font-size. */
export type AvatarSize = "sm" | "md" | "default" | "lg" | "xl";

const sizeClasses: Record<AvatarSize, string> = {
  sm:      "h-6 w-6",    // 24 px
  md:      "h-8 w-8",    // 32 px
  default: "h-10 w-10",  // 40 px
  lg:      "h-12 w-12",  // 48 px
  xl:      "h-16 w-16",  // 64 px
};

/** Font-size applied to AvatarFallback initials — scales with circle size. */
const fallbackFontSizes: Record<AvatarSize, string> = {
  sm:      "text-[8px]",
  md:      "text-[11px]",
  default: "text-[13px]",
  lg:      "text-base",    // 16 px
  xl:      "text-[22px]",
};

/**
 * Internal context so AvatarFallback can read the parent Avatar size
 * without requiring a prop repetition at every callsite.
 */
const AvatarSizeContext = React.createContext<AvatarSize>("default");

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    /**
     * Circle diameter preset.
     * sm=24px · md=32px · default=40px · lg=48px · xl=64px
     *
     * For stacked avatar groups, add a separator ring via outline:
     *   `outline: 2px solid var(--c-avatar-ring)`
     */
    size?: AvatarSize;
  }
>(({ className, size = "default", ...props }, ref) => (
  <AvatarSizeContext.Provider value={size}>
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  </AvatarSizeContext.Provider>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, style, ...props }, ref) => {
  const size = React.useContext(AvatarSizeContext);
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        // Layout
        "flex h-full w-full items-center justify-center rounded-full",
        // Typography
        "font-semibold tracking-[0.3px] select-none",
        // Size-responsive font — read from parent Avatar via context
        fallbackFontSizes[size],
        className,
      )}
      // Consume component token (Layer 3) — resolves to --s-surface-elevated
      // → --p-sand-800 (#1f1c18). DO NOT use bg-muted (raw Tailwind palette leak).
      style={{
        backgroundColor: "var(--c-avatar-fallback-bg)",
        color: "var(--s-ink-primary)",
        ...style,
      }}
      {...props}
    />
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
export type { AvatarSize };
