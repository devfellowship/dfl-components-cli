import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("dfl-components-cli smoke tests", () => {
  it("should pass a basic assertion", () => {
    expect(true).toBe(true);
  });

  it("should merge class names with cn()", () => {
    const result = cn("px-2", "py-1");
    expect(result).toBe("px-2 py-1");
  });

  it("should handle conflicting tailwind classes", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("should handle conditional classes", () => {
    const result = cn("base", false && "hidden", "flex");
    expect(result).toBe("base flex");
  });
});
