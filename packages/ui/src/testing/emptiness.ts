/**
 * Layer 1 — the pure decision. No I/O, no Playwright, no Supabase.
 *
 * WHY THIS EXISTS
 * ---------------
 * Agents verify UI through Playwright using a shared smoke identity that has
 * IAM global level 0. Supabase RLS on `iam.is_member()`-gated tables returns
 * ZERO ROWS WITH HTTP 200 — not 403. So the page renders "no results" and an
 * assertion like `expect(rows).toHaveCount(0)` or "the page loaded without an
 * error" passes VACUOUSLY: satisfied by absence of permission rather than by
 * the state under test.
 *
 * Measured 2026-08-07: spec-builder `/history` showed "0 registros" to the
 * smoke account while `work.ai_spec_inputs` held 17 rows. Every assertion on
 * that page was green.
 *
 * THE HONEST PART
 * ---------------
 * PostgREST cannot tell "RLS hid it" from "genuinely empty" — both are
 * `200 []`. There is no detector that can recover the difference from the
 * response alone, and this module does not pretend otherwise. What it does
 * instead is NAME the ambiguity and refuse to let a test claim a green it did
 * not earn: an empty surface only proves something when we have an
 * INDEPENDENT signal that the viewer was authorized to see rows (or that the
 * app told us, loudly, that it was not).
 */

/**
 * The four states an empty-looking surface can actually be in.
 *
 * - `populated`       — rows are present. Nothing ambiguous.
 * - `denied`          — empty, and the app rendered a permission-denied
 *                       signal. The app failed LOUD; that is correct
 *                       behaviour, and asserting emptiness here is meaningful.
 * - `genuinely-empty` — empty, no denied signal, and we independently know the
 *                       viewer WAS authorized. Safe: the emptiness is real.
 * - `vacuous`         — empty, no denied signal, and the viewer's
 *                       authorization is `false` or could not be confirmed.
 *                       The check proves nothing. This is the failure.
 */
export type EmptinessVerdict = "populated" | "denied" | "genuinely-empty" | "vacuous";

export interface ClassifyEmptinessInput {
  /** How many rows/items the surface actually rendered. */
  rowCount: number;
  /**
   * Did the page render an explicit permission-denied affordance (banner,
   * `data-testid="access-denied"`, 403 state)? An app that fails loud is
   * verifiable; an app that renders a silent empty list is not.
   */
  deniedSignalPresent: boolean;
  /**
   * INDEPENDENT authorization signal — must NOT be derived from the same
   * response whose emptiness is in question, or the reasoning is circular.
   * `'unknown'` is the correct value when no independent probe ran; it is
   * deliberately treated exactly as harshly as `false`.
   */
  viewerIsAuthorized: boolean | "unknown";
}

export interface EmptinessClassification {
  verdict: EmptinessVerdict;
  /** Human-readable justification, safe to embed in a failure message. */
  reason: string;
}

/**
 * Classify what an (apparently) empty surface actually proves.
 *
 * Pure function: same input, same verdict, no clock, no network. Every I/O
 * concern lives in Layer 2 (`assertNotVacuouslyEmpty`).
 */
export function classifyEmptiness(input: ClassifyEmptinessInput): EmptinessClassification {
  const { rowCount, deniedSignalPresent, viewerIsAuthorized } = input;

  if (rowCount > 0) {
    return {
      verdict: "populated",
      reason: `Surface rendered ${rowCount} row(s); the result is non-empty, so there is no emptiness to disambiguate.`,
    };
  }

  if (deniedSignalPresent) {
    return {
      verdict: "denied",
      reason:
        "Surface rendered 0 rows AND an explicit permission-denied signal. The app failed loud, so the emptiness is attributable to a stated authorization failure rather than to a silent RLS filter — an assertion on this state is meaningful.",
    };
  }

  if (viewerIsAuthorized === true) {
    return {
      verdict: "genuinely-empty",
      reason:
        "Surface rendered 0 rows with no permission-denied signal, and an independent authorization probe confirmed the viewer COULD have seen rows. The emptiness therefore reflects the data, not the viewer's access.",
    };
  }

  const authClause =
    viewerIsAuthorized === false
      ? "an independent probe reported the viewer is NOT authorized"
      : "the viewer's authorization could not be confirmed (unknown)";

  return {
    verdict: "vacuous",
    reason:
      `Surface rendered 0 rows, the page rendered NO permission-denied signal, and ${authClause}. ` +
      "Supabase RLS hides unauthorized rows as HTTP 200 with an empty body, which is byte-identical to a genuinely empty result — " +
      "so this emptiness is indistinguishable from lack of access and the check proves nothing. " +
      "Fix by supplying an independent authorization signal (e.g. `iamMemberProbe`), by using an identity that can see rows, " +
      "or by making the surface render an explicit permission-denied state.",
  };
}
