/**
 * `@devfellowship/components/testing`
 *
 * Assertion helpers for fleet e2e suites. ZERO runtime dependencies — no
 * Playwright, no Supabase, no React — so importing this entry never pulls a
 * test runner into an app bundle and every helper is unit-testable with a
 * plain object.
 *
 * The problem it exists for: an agent-driven Playwright run uses a shared
 * smoke identity at IAM level 0. Supabase RLS hides rows as `200 []`, not
 * `403`, so a gated page renders "no results" and the suite goes green
 * without ever exercising the state under test.
 *
 * @see classifyEmptiness — the pure verdict
 * @see assertNotVacuouslyEmpty — the Playwright-facing adapter
 * @see iamMemberProbe — an independent authorization signal
 */

export { classifyEmptiness } from "./emptiness";
export type {
  EmptinessVerdict,
  ClassifyEmptinessInput,
  EmptinessClassification,
} from "./emptiness";

export {
  assertNotVacuouslyEmpty,
  VacuousVerificationError,
} from "./assert-not-vacuously-empty";
export type { AssertNotVacuouslyEmptyOptions } from "./assert-not-vacuously-empty";

export { iamMemberProbe, IAM_MEMBER_MIN_LEVEL } from "./iam-member-probe";

export type { PageLike, LocatorLike, SupabaseRpcClientLike } from "./page-like";
