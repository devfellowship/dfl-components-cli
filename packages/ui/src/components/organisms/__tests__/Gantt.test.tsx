/**
 * Unit tests for Gantt's pure layout helpers.
 *
 * Logic-only (node-env safe) so it runs under the repo-root node-env vitest
 * config that CI executes — same pattern as UserAvatar.test.tsx.
 */
import { describe, it, expect } from "vitest";
import {
  clampPct,
  stageProgress,
  resolveWeekCount,
  resolveWeekLabels,
  barGridColumn,
  type GanttStage,
} from "../Gantt";

const stage = (over: Partial<GanttStage>): GanttStage => ({
  id: "s",
  title: "Stage",
  weekStart: 1,
  weekSpan: 2,
  ...over,
});

describe("clampPct", () => {
  it("rounds and clamps to 0..100", () => {
    expect(clampPct(40.4)).toBe(40);
    expect(clampPct(40.6)).toBe(41);
    expect(clampPct(-10)).toBe(0);
    expect(clampPct(150)).toBe(100);
  });
  it("treats nullish / NaN as 0", () => {
    expect(clampPct(undefined)).toBe(0);
    expect(clampPct(NaN)).toBe(0);
  });
});

describe("stageProgress", () => {
  it("prefers explicit progress", () => {
    expect(stageProgress(stage({ progress: 73 }))).toBe(73);
  });
  it("derives from done/total milestones when progress absent", () => {
    expect(
      stageProgress(
        stage({
          milestones: [
            { id: "a", title: "A", done: true },
            { id: "b", title: "B", done: true },
            { id: "c", title: "C" },
            { id: "d", title: "D" },
          ],
        }),
      ),
    ).toBe(50);
  });
  it("is 0 with no milestones and no explicit progress", () => {
    expect(stageProgress(stage({}))).toBe(0);
    expect(stageProgress(stage({ milestones: [] }))).toBe(0);
  });
  it("rounds derived percentages", () => {
    expect(
      stageProgress(
        stage({
          milestones: [
            { id: "a", title: "A", done: true },
            { id: "b", title: "B" },
            { id: "c", title: "C" },
          ],
        }),
      ),
    ).toBe(33);
  });
});

describe("resolveWeekCount", () => {
  it("honors an explicit number", () => {
    expect(resolveWeekCount([], 8)).toBe(8);
  });
  it("honors an explicit label array length", () => {
    expect(resolveWeekCount([], ["W1", "W2", "W3"])).toBe(3);
  });
  it("derives from the furthest stage end", () => {
    expect(resolveWeekCount([stage({ weekStart: 6, weekSpan: 5 })])).toBe(10);
  });
  it("derives from the furthest milestone end past the stage", () => {
    expect(
      resolveWeekCount([
        stage({
          weekStart: 1,
          weekSpan: 1,
          milestones: [{ id: "m", title: "M", weekStart: 11, weekSpan: 2 }],
        }),
      ]),
    ).toBe(12);
  });
  it("never returns less than 1", () => {
    expect(resolveWeekCount([])).toBe(1);
    expect(resolveWeekCount([], 0)).toBe(1);
  });
});

describe("resolveWeekLabels", () => {
  it("passes explicit labels through", () => {
    expect(resolveWeekLabels(2, ["Sprint A", "Sprint B"])).toEqual([
      "Sprint A",
      "Sprint B",
    ]);
  });
  it("generates W1..Wn otherwise", () => {
    expect(resolveWeekLabels(3)).toEqual(["W1", "W2", "W3"]);
  });
});

describe("barGridColumn", () => {
  it("maps a 1-based week range to start + span", () => {
    expect(barGridColumn(3, 4, 12)).toEqual({ start: 3, span: 4 });
  });
  it("clamps a bar that overflows the axis", () => {
    expect(barGridColumn(10, 5, 12)).toEqual({ start: 10, span: 3 });
  });
  it("clamps a start beyond the axis to the last column", () => {
    expect(barGridColumn(20, 2, 12)).toEqual({ start: 12, span: 1 });
  });
  it("enforces a minimum span of 1", () => {
    expect(barGridColumn(5, 0, 12)).toEqual({ start: 5, span: 1 });
  });
  it("clamps a start below 1 to 1", () => {
    expect(barGridColumn(0, 3, 12)).toEqual({ start: 1, span: 3 });
  });
});
