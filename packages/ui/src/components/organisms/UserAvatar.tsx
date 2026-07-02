/**
 * UserAvatar organism
 * Avatar with a deterministic member-palette fallback hue.
 *
 * Behavior-agnostic: pass `name` (and optional `src`). When no image loads,
 * the initials are shown on one of the 10 `--member-*` hues, picked
 * deterministically from a stable hash of `colorSeed ?? name`. The same person
 * therefore always gets the same colour across every DFL app.
 *
 * Tokens consumed:
 *   --member-1..10         deterministic initials background
 *   --s-ink-inverse        initials text (dark ink, reads on all 10 mid-tones)
 *   --c-avatar-fallback-bg background for unknown/empty-name case
 *   --c-avatar-ring        stacking gap ring used by AvatarGroup (box-shadow on root)
 *
 * Focus ring (interactive wrapper): box-shadow 0 0 0 2px var(--background), 0 0 0 3px #E07A4A
 *   Applied on the wrapping <button>/<a> element, NOT on the avatar circle itself.
 *   (overflow:hidden on the circle clips the ring otherwise.)
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

/** Number of member hues defined as `--member-1..N` in tokens.css. */
export const MEMBER_PALETTE_SIZE = 10;

/** Up-to-two-letter uppercase initials from a display name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministic 1..MEMBER_PALETTE_SIZE index from an arbitrary seed string.
 * Pure + stable (djb2). Same seed → same hue, on any platform.
 */
export function memberHueIndex(
  seed: string,
  paletteSize: number = MEMBER_PALETTE_SIZE,
): number {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  // >>> 0 → unsigned; +1 so the result is 1-based to match --member-1..N.
  return ((hash >>> 0) % paletteSize) + 1;
}

/** The CSS var() expression for a seed's member hue (e.g. `var(--member-3)`). */
export function memberHueVar(seed: string): string {
  return `var(--member-${memberHueIndex(seed)})`;
}

// ─── CVA size variants ────────────────────────────────────────────────────────

/** CVA for the avatar root (width/height). */
const avatarSizeVariants = cva("", {
  variants: {
    size: {
      xs: "h-6 w-6",           // 24 × 24
      sm: "h-8 w-8",           // 32 × 32
      md: "h-10 w-10",         // 40 × 40 (default)
      lg: "h-14 w-14",         // 56 × 56
      xl: "h-[72px] w-[72px]", // 72 × 72
    },
  },
  defaultVariants: { size: "md" },
});

/** CVA for initials text size + weight inside the fallback. */
const fallbackTextVariants = cva("", {
  variants: {
    size: {
      xs: "text-[9px] font-semibold",
      sm: "text-[11px] font-semibold",
      md: "text-sm font-medium",
      lg: "text-lg font-medium",
      xl: "text-[22px] font-medium",
    },
  },
  defaultVariants: { size: "md" },
});

// ─── Props ────────────────────────────────────────────────────────────────────

export interface UserAvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Avatar>, "size">,
    VariantProps<typeof avatarSizeVariants> {
  /** Display name — drives the initials and (by default) the hue. */
  name: string;
  /** Avatar image URL. Falls back to coloured initials if absent/broken. */
  src?: string | null;
  /**
   * Stable identity used to pick the hue (e.g. user id). Defaults to `name`.
   * Pass a sticky id so the colour survives display-name changes.
   */
  colorSeed?: string;
  /**
   * Size variant (xs=24 / sm=32 / md=40 / lg=56 / xl=72 px).
   * Defaults to `md`. Replaces the previous workaround of passing raw className.
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * <UserAvatar name="Ada Lovelace" src={url} colorSeed={userId} size="md" />
 *
 * Interactive usage — wrap in a button/link for clickable profile targets:
 *   <button
 *     className="rounded-full outline-none
 *       focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_3px_#E07A4A]"
 *   >
 *     <UserAvatar name="Ada Lovelace" />
 *   </button>
 *
 * The focus ring MUST live on the outer wrapper, NOT on UserAvatar itself,
 * because overflow:hidden on the circle clips any box-shadow.
 */
export const UserAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  UserAvatarProps
>(({ name, src, colorSeed, size = "md", className, style, ...props }, ref) => {
  const isEmpty = !name || name.trim() === "";

  // Unknown/empty-name → use component token --c-avatar-fallback-bg.
  // Named user → deterministic member hue from djb2 hash.
  const bgColor = isEmpty
    ? "var(--c-avatar-fallback-bg)"
    : memberHueVar(colorSeed ?? name);

  // --s-ink-inverse (#0a0908) reads on all 10 mid-tone member hues.
  // Unknown user gets muted ink on the neutral fallback-bg.
  const textColor = isEmpty
    ? "var(--s-ink-muted)"
    : "var(--s-ink-inverse)";

  return (
    <Avatar
      ref={ref}
      className={cn(avatarSizeVariants({ size }), className)}
      style={style}
      {...props}
    >
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback
        className={cn(fallbackTextVariants({ size }))}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
});
UserAvatar.displayName = "UserAvatar";
