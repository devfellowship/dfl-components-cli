/**
 * AppMark — the icon and the name of a DFL fleet app.
 *
 * Data: a registry row of `apps.apps` (`{ slug, name, icon_slug }`). Pass the
 * row as `app`, or pass a `slug` and mount an `AppsRegistryProvider` once
 * (it reads `apps.apps` with the caller's session and caches the rows).
 * AppMark never fetches rows itself and never needs a service-role client.
 *
 * Icon: `<iconBaseUrl>/<icon_slug>/icon.svg`, the brand mini-app set that
 * `dfl-components favicon --app` installs. When `icon_slug` is null, the slug is
 * unknown, or the image fails to load, the neutral fleet mark shows instead.
 * The fallback is inline, so it never depends on the network.
 *
 * Tooltip: the app name shows on hover, on keyboard focus and on tap
 * (approved canvas rule 1, plan 20261115-decision-card-yield-per-decision).
 *
 * Without a provider, a `slug` is used as the icon slug and the name is the
 * slug, so a known icon still renders and an unknown one falls back.
 */
import * as React from "react";

import { cn } from "../../lib/utils";
import {
  DEFAULT_APP_ICON_BASE_URL,
  useAppsRegistry,
  type AppRegistryRow,
} from "../../hooks/use-apps-registry";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";

export type AppMarkSize = 16 | 20 | 32;

const SLUG_RE = /^[a-z0-9-]+$/;

const NAME_CLASS: Record<AppMarkSize, string> = {
  16: "text-xs",
  20: "text-sm",
  32: "text-base",
};

/** Inline copy of the brand `fleet` mark (4 × 4 dots, one orange). Offline-safe. */
function FleetMark({ size }: { size: number }) {
  const dots: React.ReactNode[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const last = row === 3 && col === 3;
      dots.push(
        <rect
          key={`${row}-${col}`}
          x={14 + col * 12}
          y={14 + row * 12}
          width={8}
          height={8}
          rx={4}
          fill={last ? "#E07A4A" : "#F6F1E7"}
        />,
      );
    }
  }
  return (
    <svg
      data-appmark-fallback=""
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 72 72"
      width={size}
      height={size}
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width={72} height={72} rx={14.4} fill="#0a0908" />
      {dots}
    </svg>
  );
}

/** The icon URL of a row, or null when it has no usable `icon_slug`. */
export function appIconUrl(iconSlug: string | null | undefined, baseUrl = DEFAULT_APP_ICON_BASE_URL): string | null {
  if (!iconSlug || !SLUG_RE.test(iconSlug)) return null;
  return `${baseUrl.replace(/\/+$/, "")}/${iconSlug}/icon.svg`;
}

interface Resolved {
  name: string;
  iconSlug: string | null;
  loading: boolean;
}

function useResolved(slug: string | undefined, app: AppRegistryRow | undefined): Resolved & { baseUrl: string } {
  const registry = useAppsRegistry();
  return React.useMemo(() => {
    const baseUrl = registry.iconBaseUrl;
    if (app) return { name: app.name || app.slug, iconSlug: app.icon_slug, loading: false, baseUrl };
    const key = slug ?? "";
    const row = key ? registry.find(key) : undefined;
    if (row) return { name: row.name || row.slug, iconSlug: row.icon_slug, loading: false, baseUrl };
    if (registry.status === "loading") return { name: key, iconSlug: null, loading: true, baseUrl };
    // No provider (idle) -> try the slug as an icon slug. Loaded but unknown (or error) -> neutral mark.
    const tryRaw = registry.status === "idle" ? key || null : null;
    return { name: key, iconSlug: tryRaw, loading: false, baseUrl };
  }, [app, slug, registry]);
}

export interface AppMarkProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** App slug (`apps.apps.slug`). Needs an `AppsRegistryProvider` to resolve the row. */
  slug?: string;
  /** A registry row. Wins over `slug`. */
  app?: AppRegistryRow;
  /** Icon edge in px. Default 20. */
  size?: AppMarkSize;
  /** Show the name next to the icon. Default true. The tooltip shows either way. */
  showName?: boolean;
  /** Override the brand icon base URL (default: the registry's, else brand.devfellowship.com). */
  iconBaseUrl?: string;
}

/** Icon (+ name) of one fleet app, with a name tooltip. */
export const AppMark = React.forwardRef<HTMLSpanElement, AppMarkProps>(function AppMark(
  { slug, app, size = 20, showName = true, iconBaseUrl, className, ...rest },
  ref,
) {
  const resolved = useResolved(slug, app);
  const url = appIconUrl(resolved.iconSlug, iconBaseUrl ?? resolved.baseUrl);
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
  const showIcon = url !== null && failedUrl !== url && !resolved.loading;

  const [open, setOpen] = React.useState(false);
  const touchRef = React.useRef(false);
  const label = resolved.name || "App";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <span
            ref={ref}
            tabIndex={0}
            data-appmark=""
            data-state-icon={showIcon ? "icon" : resolved.loading ? "loading" : "fallback"}
            aria-label={showName ? undefined : label}
            role={showName ? undefined : "img"}
            {...rest}
            className={cn("inline-flex items-center gap-1.5 align-middle", resolved.loading && "animate-pulse", className)}
            onPointerDown={(e) => {
              touchRef.current = e.pointerType === "touch";
              rest.onPointerDown?.(e);
            }}
            onClick={(e) => {
              rest.onClick?.(e);
              // Touch has no hover: a tap toggles the tooltip. Radix would close it on click.
              if (touchRef.current) {
                e.preventDefault();
                setOpen((o) => !o);
              }
            }}
          >
            {showIcon ? (
              <img
                src={url}
                alt=""
                width={size}
                height={size}
                draggable={false}
                className="shrink-0 rounded-[20%]"
                style={{ width: size, height: size }}
                onError={() => setFailedUrl(url)}
              />
            ) : (
              <FleetMark size={size} />
            )}
            {showName ? <span className={cn("truncate", NAME_CLASS[size])}>{label}</span> : null}
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export interface AppMarkStackProps {
  /** Slugs to show. Needs an `AppsRegistryProvider`. */
  slugs?: readonly string[];
  /** Registry rows to show. Wins over `slugs`. */
  apps?: readonly AppRegistryRow[];
  size?: AppMarkSize;
  /** Icons shown before the count. Default and maximum 3. */
  max?: number;
  className?: string;
}

/** Up to 3 overlapped icons, then a `+N` count. Each icon has its own tooltip. */
export function AppMarkStack({ slugs, apps, size = 20, max = 3, className }: AppMarkStackProps) {
  const registry = useAppsRegistry();
  const items: Array<{ key: string; slug?: string; app?: AppRegistryRow }> = apps
    ? apps.map((a) => ({ key: a.slug, app: a }))
    : (slugs ?? []).map((s) => ({ key: s, slug: s }));
  const limit = Math.max(1, Math.min(3, Math.floor(max)));
  const shown = items.slice(0, limit);
  const hidden = items.slice(limit);
  if (items.length === 0) return null;

  const hiddenNames = hidden
    .map((i) => i.app?.name || i.app?.slug || registry.find(i.slug ?? "")?.name || i.slug || "")
    .filter(Boolean)
    .join(", ");

  return (
    <span data-appmark-stack="" className={cn("inline-flex items-center", className)}>
      {shown.map((i, idx) => (
        <AppMark
          key={i.key}
          slug={i.slug}
          app={i.app}
          size={size}
          showName={false}
          className={cn("rounded-[20%] ring-2 ring-background", idx > 0 && "-ml-1.5")}
        />
      ))}
      {hidden.length > 0 ? (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                tabIndex={0}
                data-appmark-count=""
                aria-label={`${hidden.length} more: ${hiddenNames}`}
                className="-ml-1.5 inline-flex items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground ring-2 ring-background"
                style={{ height: size, minWidth: size }}
              >
                +{hidden.length}
              </span>
            </TooltipTrigger>
            <TooltipContent>{hiddenNames}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </span>
  );
}
