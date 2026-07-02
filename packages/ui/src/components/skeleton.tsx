import { cn } from "../lib/utils";

/**
 * Skeleton — loading placeholder block.
 *
 * Renders a directional warm shimmer (sand-800 → sand-700 sweep) driven by
 * `--c-skeleton-*` component tokens defined in tokens.css. Animates via
 * `@keyframes skeleton-shimmer`; automatically static under
 * `prefers-reduced-motion: reduce` (WCAG 2.3.3).
 *
 * Radius defaults to `--c-skeleton-radius-sm` (4px). Override via `style`:
 *   borderRadius: "var(--c-skeleton-radius-lg)"     — hero / media blocks
 *   borderRadius: "var(--c-skeleton-radius-circle)" — circular avatars
 *   borderRadius: "var(--p-radius-pill)"            — pill / badge shapes
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("dfl-skeleton", className)} {...props} />;
}

export { Skeleton };
