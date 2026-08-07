/**
 * Structural (duck-typed) subset of the Playwright surface this entry needs.
 *
 * WHY NOT `import type { Page } from "@playwright/test"`
 * -----------------------------------------------------
 * `@devfellowship/components` is a runtime dependency of every DFL app.
 * Adding Playwright — even as a type-only import — would put a ~100MB test
 * runner into the dependency graph of production bundles and would make this
 * entry impossible to unit-test without a browser. So we declare the three
 * methods we actually call and nothing else.
 *
 * A real Playwright `Page` / `Locator` satisfies these interfaces
 * structurally: no adapter, no cast, no `@playwright/test` in package.json.
 * A plain object literal satisfies them too, which is how the tests work.
 */

/** The slice of a Playwright `Locator` used here. */
export interface LocatorLike {
  /** Number of DOM elements the selector currently resolves to. */
  count(): Promise<number>;
  /** Rendered (visible) text of the resolved element. */
  innerText(): Promise<string>;
}

/** The slice of a Playwright `Page` used here. */
export interface PageLike {
  locator(selector: string): LocatorLike;
}

/**
 * Minimal shape of a `supabase-js` client — only `.rpc()`, only the fields
 * `iamMemberProbe` reads. Keeps `@supabase/supabase-js` out of this entry's
 * imports entirely (it is an OPTIONAL peer dependency of the package).
 */
export interface SupabaseRpcClientLike {
  rpc(
    fn: string,
    args?: Record<string, unknown>,
  ): PromiseLike<{ data: unknown; error: unknown }>;
}
