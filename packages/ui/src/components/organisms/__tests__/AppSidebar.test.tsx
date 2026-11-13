// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { AppSidebar } from "../AppSidebar";

beforeAll(() => {
  // The Sidebar primitive reads matchMedia via useIsMobile.
  window.matchMedia ??= ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

const navGroups = [{ items: [{ title: "Home", url: "/" }] }];
// Class-substring lookup by hand: the brackets in the Tailwind class are awkward in a CSS selector.
const amberBox = (c: HTMLElement) =>
  Array.from(c.querySelectorAll("*")).find((el) => el.className?.toString().includes("bg-[var(--brand-accent")) ?? null;

describe("AppSidebar logoMode", () => {
  it("default mode keeps the amber box", () => {
    const { container } = render(<AppSidebar navGroups={navGroups} logo="/x.svg" />);
    expect(amberBox(container)).not.toBeNull();
  });

  it("tile mode renders a bare 32px img, no amber box", () => {
    const { container } = render(
      <AppSidebar navGroups={navGroups} logo="/favicon.svg" logoMode="tile" appName="Demo" />,
    );
    expect(amberBox(container)).toBeNull();
    const img = container.querySelector('img[src="/favicon.svg"]')!;
    expect(img.className).toContain("h-8 w-8");
    expect(img.className).toContain("rounded-lg");
    expect(img.getAttribute("alt")).toBe("Demo");
  });

  it("tile mode wraps a node logo in h-8 w-8 without background", () => {
    const { container } = render(
      <AppSidebar navGroups={navGroups} logo={<span data-testid="n" />} logoMode="tile" />,
    );
    expect(amberBox(container)).toBeNull();
    expect(container.querySelector('[data-testid="n"]')!.parentElement!.className).toContain("h-8 w-8");
  });

  it("tile mode without a logo falls back to the box", () => {
    const { container } = render(<AppSidebar navGroups={navGroups} logoMode="tile" />);
    expect(amberBox(container)).not.toBeNull();
  });
});
