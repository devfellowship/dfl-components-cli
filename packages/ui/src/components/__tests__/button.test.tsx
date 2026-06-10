// @vitest-environment jsdom
/**
 * Button — regression tests for the `asChild` Radix Slot path.
 *
 * v1.2.0 crashed with `React.Children.only expected to receive a single
 * React element child` whenever a consumer used the standard shadcn
 * link-styled-button pattern `<Button asChild><a/></Button>`, because the
 * component injected sibling adornments (spinner / kbd / `null` literals)
 * INTO the Slot alongside `children`. The fix renders adornments only on the
 * non-asChild `<button>` path and passes a single child to `Slot`.
 *
 * Uses plain DOM assertions (no jest-dom matchers) to match this repo's RTL
 * test convention (the suite runs under the root node-env vitest config too).
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, buttonVariants } from "../button";

describe("Button asChild", () => {
  it("renders a single anchor child through Slot without the Children.only crash", () => {
    expect(() =>
      render(
        <Button asChild variant="primary">
          <a href="/dashboard">Go</a>
        </Button>,
      ),
    ).not.toThrow();

    const link = screen.getByRole("link", { name: "Go" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/dashboard");
  });

  it("merges buttonVariants classes onto the slotted child (keeps styling)", () => {
    render(
      <Button asChild variant="primary" size="lg">
        <a href="/x">Styled link</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Styled link" });
    // A representative class from buttonVariants must land on the child.
    expect(link.className).toContain("inline-flex");
    // And every class buttonVariants() would compute is present on the child.
    const expected = buttonVariants({ variant: "primary", size: "lg" });
    for (const cls of expected.split(/\s+/).filter(Boolean)) {
      expect(link.className).toContain(cls);
    }
  });

  it("forwards arbitrary props (e.g. data-*) onto the slotted child", () => {
    render(
      <Button asChild data-testid="cta">
        <a href="/y">CTA</a>
      </Button>,
    );
    expect(screen.getByTestId("cta").tagName).toBe("A");
  });

  it("does NOT inject the loading spinner into the Slot (single child only)", () => {
    // Even with loading=true, asChild must not add a sibling spinner svg —
    // that would re-introduce the multiple-children crash.
    expect(() =>
      render(
        <Button asChild loading>
          <a href="/z">No spinner here</a>
        </Button>,
      ),
    ).not.toThrow();
    const link = screen.getByRole("link", { name: "No spinner here" });
    expect(link.querySelector("svg")).toBeNull();
  });
});

describe("Button (default button element)", () => {
  it("renders a <button> with the merged classes", () => {
    render(<Button variant="secondary">Click</Button>);
    const btn = screen.getByRole("button", { name: "Click" });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.className).toContain("inline-flex");
  });

  it("shows a spinner and disables when loading", () => {
    render(<Button loading>Saving</Button>);
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute("data-loading")).toBe("");
    expect(btn.querySelector("svg")).not.toBeNull();
  });

  it("renders a kbd hint when provided", () => {
    render(<Button kbd="⌘K">Command</Button>);
    expect(screen.getByText("⌘K").tagName).toBe("KBD");
  });
});
