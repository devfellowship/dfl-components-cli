/**
 * The hard limits of a Decision Card micro-chart (`context_facets.chart`).
 *
 * ONE SOURCE. This file has no import, so the package ships it as its own entry
 * (`@devfellowship/components/chart-limits`) and a service can load it without React.
 * `readChart` (the card, the last reader) uses these values. The post path
 * (dfl-services `dfl-os-commands`, `question-chart.ts`) has a test that reads this
 * entry and fails when its own limits differ. Plan
 * 20261115-dc-p4-micro-diagram-on-question, section "Limits (hard)", task CHART-LIMITS-ALIGN.
 *
 * Change a value here, release, and the service test fails until the service follows.
 */
export const QUESTION_CHART_LIMITS = Object.freeze({
  kinds: Object.freeze(["bar", "stacked_bar", "line"] as const),
  statuses: Object.freeze(["green", "red", "amber", "neutral"] as const),
  seriesMin: 1,
  seriesMax: 3,
  categoriesMin: 1,
  /** A line needs two points. */
  lineCategoriesMin: 2,
  categoriesMax: 8,
  /** A category, a series name, the unit and the title: all are labels of at most this many characters. */
  labelMax: 30,
  /** The title is a label: the same limit as every other label (it was 120 here until 2026-11-17). */
  titleMax: 30,
  sourceMax: 120,
});
