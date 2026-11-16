/**
 * Fleet app registry — one read of `apps.apps`, cached.
 *
 * `AppMark` renders an app's icon and name from a registry row. This module
 * reads those rows ONCE per Supabase client and hands them to every mark below
 * an `AppsRegistryProvider`.
 *
 * Rules (plan 20261115-dc-p1-fleet-app-list-apps-registry, T5):
 *  - The read uses the CALLER'S client, so it carries the user session and RLS
 *    applies: a member reads every row (draft + published), a non-member and
 *    anon read the published rows only. Never pass a service-role client.
 *  - The columns are listed on purpose. `select('*')` fails with 42501, because
 *    the deploy-hook column of `apps.apps` is not readable by `anon` or
 *    `authenticated`.
 *  - The client is structural (like `PublishDrawerSupabase`), so the package
 *    never hard-depends on supabase-js.
 */
import * as React from "react";

/** The only columns the registry reads. Keep this list explicit (no `*`). */
export const APP_REGISTRY_COLUMNS = "slug,name,icon_slug,kind";

/** `kind` values of a registry row (checked by the apps tools, not by a constraint). */
export type AppKind = "app" | "module" | "library" | "service" | "product";

/** One row of `apps.apps`, as far as `AppMark` needs it. */
export interface AppRegistryRow {
  slug: string;
  name: string | null;
  /** Slug of the brand icon (`<base>/<icon_slug>/icon.svg`). Null = no icon yet. */
  icon_slug: string | null;
  kind?: AppKind | string | null;
}

/** Minimal subset of a `SupabaseClient` the registry read relies on. */
export interface AppsRegistrySupabase {
  schema: (name: string) => {
    from: (table: string) => {
      select: (
        columns: string,
      ) => PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>;
    };
  };
  /** Optional. Used to refetch when a different user signs in or out. */
  auth?: {
    onAuthStateChange: (
      cb: (event: string, session: { user?: { id?: string } | null } | null) => void,
    ) => { data: { subscription: { unsubscribe: () => void } } };
  };
}

export type AppsRegistryStatus = "idle" | "loading" | "ready" | "error";

export interface AppsRegistryValue {
  status: AppsRegistryStatus;
  rows: readonly AppRegistryRow[];
  /** Find a row by app slug, then by icon slug. Undefined when unknown. */
  find: (slug: string) => AppRegistryRow | undefined;
  /** Base URL of the brand mini-app icons. */
  iconBaseUrl: string;
}

/** Where the brand icons are served (`<base>/<icon_slug>/icon.svg`). */
export const DEFAULT_APP_ICON_BASE_URL = "https://brand.devfellowship.com/mini-apps";

const EMPTY: AppsRegistryValue = {
  status: "idle",
  rows: [],
  find: () => undefined,
  iconBaseUrl: DEFAULT_APP_ICON_BASE_URL,
};

const AppsRegistryContext = React.createContext<AppsRegistryValue>(EMPTY);

// One in-flight / settled read per client object. A failed read is dropped, so
// the next mount tries again.
const cache = new WeakMap<object, Promise<AppRegistryRow[]>>();

function toRow(raw: unknown): AppRegistryRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.slug !== "string" || r.slug === "") return null;
  return {
    slug: r.slug,
    name: typeof r.name === "string" ? r.name : null,
    icon_slug: typeof r.icon_slug === "string" && r.icon_slug !== "" ? r.icon_slug : null,
    kind: typeof r.kind === "string" ? r.kind : null,
  };
}

/** Read `apps.apps` once per client. Concurrent callers share one request. */
export function fetchAppsRegistry(
  supabase: AppsRegistrySupabase,
  opts: { force?: boolean } = {},
): Promise<AppRegistryRow[]> {
  const hit = cache.get(supabase);
  if (hit && !opts.force) return hit;
  const p = Promise.resolve(
    supabase.schema("apps").from("apps").select(APP_REGISTRY_COLUMNS),
  ).then(({ data, error }) => {
    if (error) throw new Error(error.message);
    return (data ?? []).map(toRow).filter((r): r is AppRegistryRow => r !== null);
  });
  cache.set(supabase, p);
  p.catch(() => {
    if (cache.get(supabase) === p) cache.delete(supabase);
  });
  return p;
}

export interface AppsRegistryProviderProps {
  /** The caller's client (user session). Not a service-role client. */
  supabase?: AppsRegistrySupabase;
  /** Rows you already hold (SSR, tests, stories). Skips the read. */
  rows?: readonly AppRegistryRow[];
  /** Override the brand icon base URL. */
  iconBaseUrl?: string;
  children?: React.ReactNode;
}

export function AppsRegistryProvider({
  supabase,
  rows: given,
  iconBaseUrl = DEFAULT_APP_ICON_BASE_URL,
  children,
}: AppsRegistryProviderProps) {
  const [state, setState] = React.useState<{ status: AppsRegistryStatus; rows: readonly AppRegistryRow[] }>(
    () => (given ? { status: "ready", rows: given } : { status: supabase ? "loading" : "idle", rows: [] }),
  );

  React.useEffect(() => {
    if (given) {
      setState({ status: "ready", rows: given });
      return;
    }
    if (!supabase) {
      setState({ status: "idle", rows: [] });
      return;
    }
    let alive = true;
    const load = (force: boolean) => {
      fetchAppsRegistry(supabase, { force }).then(
        (rows) => alive && setState({ status: "ready", rows }),
        () => alive && setState({ status: "error", rows: [] }),
      );
    };
    load(false);

    // A member sees more rows than anon. Refetch when the USER changes, not on
    // every token refresh (supabase-js emits SIGNED_IN on tab focus).
    let userId: string | null | undefined;
    const sub = supabase.auth?.onAuthStateChange((_event, session) => {
      const next = session?.user?.id ?? null;
      if (userId !== undefined && next !== userId) load(true);
      userId = next;
    });
    return () => {
      alive = false;
      sub?.data.subscription.unsubscribe();
    };
  }, [supabase, given]);

  const value = React.useMemo<AppsRegistryValue>(() => {
    const bySlug = new Map<string, AppRegistryRow>();
    const byIcon = new Map<string, AppRegistryRow>();
    for (const r of state.rows) {
      bySlug.set(r.slug, r);
      if (r.icon_slug && !byIcon.has(r.icon_slug)) byIcon.set(r.icon_slug, r);
    }
    return {
      status: state.status,
      rows: state.rows,
      find: (slug) => bySlug.get(slug) ?? byIcon.get(slug),
      iconBaseUrl,
    };
  }, [state, iconBaseUrl]);

  return <AppsRegistryContext.Provider value={value}>{children}</AppsRegistryContext.Provider>;
}

/** The registry of the nearest `AppsRegistryProvider` (status `idle` without one). */
export function useAppsRegistry(): AppsRegistryValue {
  return React.useContext(AppsRegistryContext);
}
