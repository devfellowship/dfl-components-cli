/**
 * Unit tests for UserAvatar's pure helpers.
 *
 * Logic-only (node-env safe) so it runs both under the package's jsdom vitest
 * config AND under the repo-root node-env vitest config (which CI executes).
 */
import { describe, it, expect } from "vitest";
import {
  getInitials,
  memberHueIndex,
  memberHueVar,
  MEMBER_PALETTE_SIZE,
} from "../UserAvatar";

describe("getInitials", () => {
  it("takes first + last initial for multi-word names", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
    expect(getInitials("Tim Berners Lee")).toBe("TL");
  });

  it("takes up to two letters for single-word names", () => {
    expect(getInitials("Grace")).toBe("GR");
    expect(getInitials("x")).toBe("X");
  });

  it("collapses extra whitespace", () => {
    expect(getInitials("  Ada   Lovelace  ")).toBe("AL");
  });

  it("returns '?' for blank input", () => {
    expect(getInitials("   ")).toBe("?");
    expect(getInitials("")).toBe("?");
  });
});

describe("memberHueIndex", () => {
  it("is deterministic for the same seed", () => {
    expect(memberHueIndex("Ada Lovelace")).toBe(memberHueIndex("Ada Lovelace"));
  });

  it("stays within 1..MEMBER_PALETTE_SIZE", () => {
    for (const seed of ["a", "bob", "user-123", "Ω≈ç√", "", "1234567890"]) {
      const idx = memberHueIndex(seed);
      expect(idx).toBeGreaterThanOrEqual(1);
      expect(idx).toBeLessThanOrEqual(MEMBER_PALETTE_SIZE);
    }
  });

  it("spreads across multiple buckets for varied seeds", () => {
    const seeds = Array.from({ length: 50 }, (_, i) => `member-${i}`);
    const buckets = new Set(seeds.map((s) => memberHueIndex(s)));
    // Not asserting perfect uniformity, just that it isn't degenerate.
    expect(buckets.size).toBeGreaterThan(3);
  });

  it("respects a custom palette size", () => {
    for (const seed of ["a", "b", "c", "d", "e"]) {
      const idx = memberHueIndex(seed, 4);
      expect(idx).toBeGreaterThanOrEqual(1);
      expect(idx).toBeLessThanOrEqual(4);
    }
  });
});

describe("memberHueVar", () => {
  it("produces a --member-N css var matching the index", () => {
    const seed = "Katherine Johnson";
    expect(memberHueVar(seed)).toBe(`var(--member-${memberHueIndex(seed)})`);
  });
});
