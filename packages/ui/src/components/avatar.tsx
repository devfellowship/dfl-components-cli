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
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    /** Background tone — default | brand (amber) | member (hashed). */
    tone?: AvatarTone;
    /** Seed for deterministic member colour (only used when tone="member"). */
    seed?: string;
  }
>(({ className, style, tone = "default", seed, children, ...props }, ref) => {
  const size = React.useContext(AvatarSizeContext);

  // Resolve tone → background + foreground tokens.
  let backgroundColor = "var(--c-avatar-fallback-bg)";
  let color = "var(--c-avatar-fallback-fg)";
  if (tone === "brand") {
    backgroundColor = "var(--c-avatar-brand-bg)";
    color = "var(--c-avatar-brand-fg)";
  } else if (tone === "member") {
    backgroundColor = avatarMemberColor(
      seed ?? (typeof children === "string" ? children : ""),
    );
    color = "var(--s-ink-primary)";
  }

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
      // Consume component token (Layer 3). DO NOT use bg-muted (raw palette leak).
      style={{ backgroundColor, color, ...style }}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/* ─── Member palette + tones ──────────────────────────────────────────────── */

/** Fallback background tone.
 *   default — neutral elevated surface (--c-avatar-fallback-bg).
 *   brand   — DFL amber (--c-avatar-brand-bg), the "branded" avatar.
 *   member  — deterministic colour hashed from `seed` (member palette).
 */
export type AvatarTone = "default" | "brand" | "member";

/** Number of colours in the deterministic member palette (--c-avatar-member-N). */
export const AVATAR_MEMBER_PALETTE_SIZE = 12;

/**
 * Deterministic member colour — hashes a seed (name / initials / id) into a
 * stable `var(--c-avatar-member-N)` token so a given person is ALWAYS the same
 * colour across the app.
 */
export function avatarMemberColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const n = (h % AVATAR_MEMBER_PALETTE_SIZE) + 1;
  return `var(--c-avatar-member-${n})`;
}

/* ─── AvatarStatus — presence dot ─────────────────────────────────────────── */

export type AvatarStatusValue = "online" | "away" | "offline";

const statusColors: Record<AvatarStatusValue, string> = {
  online:  "var(--c-avatar-status-online)",
  away:    "var(--c-avatar-status-away)",
  offline: "var(--c-avatar-status-offline)",
};

/** Dot diameter per Avatar size. */
const statusSizes: Record<AvatarSize, string> = {
  sm:      "h-2 w-2",
  md:      "h-2.5 w-2.5",
  default: "h-3 w-3",
  lg:      "h-3.5 w-3.5",
  xl:      "h-4 w-4",
};

/**
 * Presence indicator — a coloured dot pinned to the bottom-right of the Avatar,
 * ringed in the page colour. Render as a sibling of AvatarImage/AvatarFallback
 * INSIDE <Avatar> (which is `position: relative`).
 */
const AvatarStatus = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { status?: AvatarStatusValue }
>(({ className, style, status = "online", ...props }, ref) => {
  const size = React.useContext(AvatarSizeContext);
  return (
    <span
      ref={ref}
      aria-label={status}
      className={cn(
        "absolute bottom-0 right-0 z-10 block rounded-full",
        statusSizes[size],
        className,
      )}
      style={{
        backgroundColor: statusColors[status],
        boxShadow: "0 0 0 2px var(--c-avatar-status-ring)",
        ...style,
      }}
      {...props}
    />
  );
});
AvatarStatus.displayName = "AvatarStatus";

/* ─── AvatarGroup — overlapping stack ─────────────────────────────────────── */

/**
 * Overlapping avatar stack. Each child avatar gets a page-coloured separator
 * ring (box-shadow) and a negative left margin so they tuck under the previous
 * one. `max` truncates and appends a "+N" fallback avatar.
 */
const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Overlap amount in px (negative margin). Default 8. */
    spacing?: number;
    /** Show at most `max` avatars; the rest collapse into a "+N" chip. */
    max?: number;
  }
>(({ className, children, spacing = 8, max, style, ...props }, ref) => {
  const items = React.Children.toArray(children);
  const shown = typeof max === "number" ? items.slice(0, max) : items;
  const overflow = typeof max === "number" ? items.length - shown.length : 0;

  const ringStyle: React.CSSProperties = {
    boxShadow: "0 0 0 2px var(--c-avatar-group-ring)",
    borderRadius: "9999px",
  };

  return (
    <div
      ref={ref}
      className={cn("flex items-center", className)}
      style={style}
      {...props}
    >
      {shown.map((child, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{ ...ringStyle, marginLeft: i === 0 ? 0 : -spacing }}
        >
          {child}
        </div>
      ))}
      {overflow > 0 && (
        <div className="rounded-full" style={{ ...ringStyle, marginLeft: -spacing }}>
          <Avatar>
            <AvatarFallback>{`+${overflow}`}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
});
AvatarGroup.displayName = "AvatarGroup";

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatus,
  AvatarGroup,
};
