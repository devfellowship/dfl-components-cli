import { classifyEmptiness, type EmptinessVerdict } from "./emptiness";
import type { PageLike } from "./page-like";

/**
 * Thrown when a surface's emptiness is indistinguishable from lack of access.
 *
 * This is NOT "the page is broken" — it is "this check cannot tell you whether
 * the page is broken", which is the more dangerous state, because the default
 * assertion would have passed.
 */
export class VacuousVerificationError extends Error {
  readonly verdict: EmptinessVerdict = "vacuous";
  readonly surface: string;
  readonly rowCount: number;
  readonly deniedSignalPresent: boolean;
  readonly viewerIsAuthorized: boolean | "unknown";
  readonly reason: string;

  constructor(details: {
    surface: string;
    rowCount: number;
    deniedSignalPresent: boolean;
    viewerIsAuthorized: boolean | "unknown";
    reason: string;
  }) {
    super(
      [
        `Vacuous verification on "${details.surface}": this check proves nothing.`,
        "",
        `  • the surface returned ${details.rowCount} rows (nothing to assert against)`,
        "  • the page rendered NO permission-denied signal, so the app did not fail loud",
        details.viewerIsAuthorized === false
          ? "  • the viewer is known NOT to be authorized"
          : "  • the viewer's authorization could NOT be confirmed",
        "",
        details.reason,
      ].join("\n"),
    );
    this.name = "VacuousVerificationError";
    this.surface = details.surface;
    this.rowCount = details.rowCount;
    this.deniedSignalPresent = details.deniedSignalPresent;
    this.viewerIsAuthorized = details.viewerIsAuthorized;
    this.reason = details.reason;
  }
}

export interface AssertNotVacuouslyEmptyOptions {
  /**
   * Regex matched against the surface's rendered text, LINE BY LINE (each line
   * trimmed), so anchored patterns work — e.g. `/^(\d+) registros?$/`.
   * Capture group 1 must be the count.
   */
  countText?: RegExp;
  /** CSS/testid selector whose element holds the count text. Default `body`. */
  countTextSelector?: string;
  /** Alternative to `countText`: count the elements matching this selector. */
  rowSelector?: string;
  /**
   * Selector for the element/testid the app renders on permission denial.
   * If the app has no such affordance, omit it — but then a denied surface is
   * unverifiable by construction, which is exactly what `vacuous` reports.
   */
  deniedSelector?: string;
  /**
   * INDEPENDENT authorization signal. A thunk (e.g. `() => iamMemberProbe(sb)`)
   * is awaited; if it throws, the result is `'unknown'`.
   * Omitted defaults to `'unknown'` — treated as harshly as `false`.
   */
  viewerIsAuthorized?: boolean | "unknown" | (() => Promise<boolean | "unknown">);
  /** Label used in the failure message. Default `unnamed surface`. */
  surface?: string;
}

async function resolveAuthorization(
  input: AssertNotVacuouslyEmptyOptions["viewerIsAuthorized"],
): Promise<boolean | "unknown"> {
  if (input === undefined) return "unknown";
  if (typeof input !== "function") return input;
  try {
    const result = await input();
    return result === true || result === false ? result : "unknown";
  } catch {
    return "unknown";
  }
}

async function resolveRowCount(
  page: PageLike,
  opts: AssertNotVacuouslyEmptyOptions,
): Promise<number> {
  if (opts.countText) {
    const text = await page.locator(opts.countTextSelector ?? "body").innerText();
    for (const rawLine of text.split("\n")) {
      const match = opts.countText.exec(rawLine.trim());
      if (match) {
        const parsed = Number(match[1]);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
    if (!opts.rowSelector) {
      throw new Error(
        `assertNotVacuouslyEmpty: countText ${String(opts.countText)} matched no line of "${
          opts.countTextSelector ?? "body"
        }". The row count is unreadable, so no verdict is possible — fix the pattern or pass rowSelector.`,
      );
    }
  }

  if (opts.rowSelector) return page.locator(opts.rowSelector).count();

  throw new Error(
    "assertNotVacuouslyEmpty: pass countText and/or rowSelector — without one there is no row count to classify.",
  );
}

/**
 * Layer 2 — the e2e adapter. Reads the three facts off a Playwright-ish page,
 * hands them to the pure {@link classifyEmptiness}, and refuses to return a
 * green it cannot justify.
 *
 * Returns the {@link EmptinessVerdict} for `populated`, `denied` and
 * `genuinely-empty`. Throws {@link VacuousVerificationError} for `vacuous`.
 *
 * @example
 * // Fails today against the level-0 smoke identity — by design.
 * await assertNotVacuouslyEmpty(page, {
 *   surface: "spec-builder /history",
 *   countText: /^(\d+) registros?$/,
 *   deniedSelector: '[data-testid="access-denied"]',
 *   viewerIsAuthorized: () => iamMemberProbe(supabase),
 * });
 */
export async function assertNotVacuouslyEmpty(
  page: PageLike,
  opts: AssertNotVacuouslyEmptyOptions = {},
): Promise<EmptinessVerdict> {
  const surface = opts.surface ?? "unnamed surface";
  const rowCount = await resolveRowCount(page, opts);
  const deniedSignalPresent = opts.deniedSelector
    ? (await page.locator(opts.deniedSelector).count()) > 0
    : false;
  const viewerIsAuthorized = await resolveAuthorization(opts.viewerIsAuthorized);

  const { verdict, reason } = classifyEmptiness({
    rowCount,
    deniedSignalPresent,
    viewerIsAuthorized,
  });

  if (verdict === "vacuous") {
    throw new VacuousVerificationError({
      surface,
      rowCount,
      deniedSignalPresent,
      viewerIsAuthorized,
      reason,
    });
  }

  return verdict;
}
