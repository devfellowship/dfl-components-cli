import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatDateShort,
  formatMonthYear,
  formatRelativeTime,
  shortenId,
  formatDuration,
} from "../formatters";

describe("formatCurrency", () => {
  it("formats BRL currency", () => {
    expect(formatCurrency(1234.56)).toContain("1.234,56");
    expect(formatCurrency(0)).toContain("0,00");
    expect(formatCurrency(1000000)).toContain("1.000.000,00");
  });
});

describe("formatDate", () => {
  it("formats ISO date string to DD/MM/YYYY HH:MM format (pt-BR)", () => {
    const result = formatDate("2026-04-10T19:30:00.000Z");
    // Contains date parts: day, month, year
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe("formatDateShort", () => {
  it("formats ISO date string to DD/MM/YYYY", () => {
    const result = formatDateShort("2026-04-10T00:00:00.000Z");
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe("formatMonthYear", () => {
  it("formats to abbreviated month + year", () => {
    const result = formatMonthYear("2026-04-10T00:00:00.000Z");
    expect(result).toMatch(/\d{4}/);
  });
});

describe("formatRelativeTime", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T20:00:00.000Z"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns seconds ago for recent dates", () => {
    const result = formatRelativeTime("2026-04-10T19:59:30.000Z");
    expect(result).toContain("seconds ago");
  });

  it("returns minutes ago", () => {
    const result = formatRelativeTime("2026-04-10T19:55:00.000Z");
    expect(result).toContain("minutes ago");
  });

  it("returns hours ago", () => {
    const result = formatRelativeTime("2026-04-10T17:00:00.000Z");
    expect(result).toContain("hours ago");
  });

  it("returns days ago", () => {
    const result = formatRelativeTime("2026-04-08T20:00:00.000Z");
    expect(result).toContain("days ago");
  });

  it("handles singular forms", () => {
    expect(formatRelativeTime("2026-04-10T19:59:59.000Z")).toContain("second");
    expect(formatRelativeTime("2026-04-10T18:59:00.000Z")).toContain("hour");
    expect(formatRelativeTime("2026-04-09T19:59:00.000Z")).toContain("day");
  });
});

describe("shortenId", () => {
  it("shortens a UUID to prefix...suffix", () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const result = shortenId(id);
    expect(result).toBe("123e4567...14174000");
  });
});

describe("formatDuration", () => {
  it("returns 00:00 for zero/falsy", () => {
    expect(formatDuration(0)).toBe("00:00");
  });

  it("formats mm:ss for under an hour", () => {
    expect(formatDuration(90)).toBe("01:30");
    expect(formatDuration(3599)).toBe("59:59");
  });

  it("formats hh:mm:ss for over an hour", () => {
    expect(formatDuration(3600)).toBe("1:00:00");
    expect(formatDuration(3661)).toBe("1:01:01");
  });
});
