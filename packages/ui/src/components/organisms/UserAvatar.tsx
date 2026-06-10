/**
 * UserAvatar organism
 * Avatar with a deterministic member-palette fallback hue.
 *
 * Behavior-agnostic: pass `name` (and optional `src`). When no image loads,
 * the initials are shown on one of the 10 `--member-*` hues, picked
 * deterministically from a stable hash of `id ?? name`. The same person
 * therefore always gets the same colour across every DFL app.
 */
import * as React from "react";

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

export interface UserAvatarProps
  extends React.ComponentPropsWithoutRef<typeof Avatar> {
  /** Display name — drives the initials and (by default) the hue. */
  name: string;
  /** Avatar image URL. Falls back to the coloured initials if absent/broken. */
  src?: string | null;
  /**
   * Stable identity used to pick the hue (e.g. user id). Defaults to `name`.
   * Pass a sticky id so the colour survives display-name changes.
   */
  colorSeed?: string;
}

/**
 * <UserAvatar name="Ada Lovelace" src={url} colorSeed={userId} />
 */
export const UserAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  UserAvatarProps
>(({ name, src, colorSeed, className, style, ...props }, ref) => {
  const hue = memberHueVar(colorSeed ?? name);
  return (
    <Avatar ref={ref} className={className} style={style} {...props}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback
        // Sand-950 ink reads on every member hue (all are mid-tone).
        className={cn("font-medium text-[var(--p-sand-950,#0a0908)]")}
        style={{ backgroundColor: hue }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
});
UserAvatar.displayName = "UserAvatar";
