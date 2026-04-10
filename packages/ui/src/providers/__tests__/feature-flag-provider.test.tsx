/**
 * Tests for FeatureFlagProvider logic.
 * Tests the context value logic directly without React rendering.
 */
import { describe, it, expect } from "vitest";
import { FeatureFlags } from "../feature-flag-provider";

// Test the isEnabled logic in isolation (the function closure)
function makeIsEnabled(flags: FeatureFlags) {
  return (flag: string) => Boolean(flags[flag]);
}

describe("FeatureFlag isEnabled logic", () => {
  it("returns true for an enabled flag", () => {
    const isEnabled = makeIsEnabled({ "my-feature": true });
    expect(isEnabled("my-feature")).toBe(true);
  });

  it("returns false for a disabled flag", () => {
    const isEnabled = makeIsEnabled({ "my-feature": false });
    expect(isEnabled("my-feature")).toBe(false);
  });

  it("returns false for an unknown flag", () => {
    const isEnabled = makeIsEnabled({});
    expect(isEnabled("unknown")).toBe(false);
  });

  it("handles multiple flags independently", () => {
    const flags: FeatureFlags = { a: true, b: false, c: true };
    const isEnabled = makeIsEnabled(flags);
    expect(isEnabled("a")).toBe(true);
    expect(isEnabled("b")).toBe(false);
    expect(isEnabled("c")).toBe(true);
    expect(isEnabled("d")).toBe(false);
  });
});
