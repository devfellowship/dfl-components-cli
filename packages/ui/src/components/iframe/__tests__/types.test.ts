import { describe, it, expect } from "vitest";
import { isAllowedOrigin } from "../types";

describe("isAllowedOrigin", () => {
  it("allows *.devfellowship.com", () => {
    expect(isAllowedOrigin("https://app.devfellowship.com")).toBe(true);
    expect(isAllowedOrigin("https://learn.devfellowship.com")).toBe(true);
    expect(isAllowedOrigin("http://staging.devfellowship.com")).toBe(true);
  });

  it("allows localhost with port", () => {
    expect(isAllowedOrigin("http://localhost:5173")).toBe(true);
    expect(isAllowedOrigin("http://localhost:3000")).toBe(true);
    expect(isAllowedOrigin("http://localhost")).toBe(true);
  });

  it("allows 127.0.0.1 with port", () => {
    expect(isAllowedOrigin("http://127.0.0.1:5173")).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1")).toBe(true);
  });

  it("rejects unknown origins", () => {
    expect(isAllowedOrigin("https://evil.com")).toBe(false);
    expect(isAllowedOrigin("https://devfellowship.com.evil.com")).toBe(false);
    expect(isAllowedOrigin("https://notdevfellowship.com")).toBe(false);
  });

  it("rejects empty origin", () => {
    expect(isAllowedOrigin("")).toBe(false);
  });
});
