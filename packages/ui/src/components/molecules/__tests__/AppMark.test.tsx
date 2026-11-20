// @vitest-environment jsdom
// Origin: agent
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { AppMark, AppMarkStack, appIconUrl } from "../AppMark";
import {
  AppsRegistryProvider,
  APP_REGISTRY_COLUMNS,
  fetchAppsRegistry,
  type AppRegistryRow,
} from "../../../hooks/use-apps-registry";

beforeAll(() => {
  // jsdom has no PointerEvent; the touch test needs `pointerType`.
  (globalThis as any).PointerEvent ??= class extends MouseEvent {
    pointerType: string;
    constructor(type: string, init: any = {}) {
      super(type, init);
      this.pointerType = init.pointerType ?? "";
    }
  };
  // Radix Tooltip positions with these.
  (globalThis as any).ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const BASE = "https://brand.devfellowship.com/mini-apps";
const OS: AppRegistryRow = { slug: "os", name: "DFL OS", icon_slug: "os", kind: "app" };
const CAMPAIGNS: AppRegistryRow = { slug: "campaigns", name: "DFL Campaigns", icon_slug: "campanhas", kind: "app" };
const DIAGRAMS_NO_ICON: AppRegistryRow = { slug: "iam", name: "DFL IAM", icon_slug: null, kind: "app" };

const img = (c: HTMLElement) => c.querySelector("img");
const fallback = (c: HTMLElement) => c.querySelector("[data-appmark-fallback]");

function fakeSupabase(rows: unknown[] | null, error: { message: string } | null = null) {
  const selects: Array<{ schema: string; table: string; cols: string }> = [];
  const client = {
    schema: (schema: string) => ({
      from: (table: string) => ({
        select: async (cols: string) => {
          selects.push({ schema, table, cols });
          return { data: rows, error };
        },
      }),
    }),
  };
  return { client, selects };
}

describe("appIconUrl", () => {
  it("builds the brand icon URL", () => {
    expect(appIconUrl("os")).toBe(`${BASE}/os/icon.svg`);
    expect(appIconUrl("campanhas", `${BASE}/`)).toBe(`${BASE}/campanhas/icon.svg`);
  });
  it("refuses null, empty and path-like slugs", () => {
    expect(appIconUrl(null)).toBeNull();
    expect(appIconUrl("")).toBeNull();
    expect(appIconUrl("../x")).toBeNull();
    expect(appIconUrl("a/b")).toBeNull();
  });
});

describe("AppMark with a row", () => {
  it("renders the icon from icon_slug and the row name", () => {
    const { container } = render(<AppMark app={OS} />);
    expect(img(container)!.getAttribute("src")).toBe(`${BASE}/os/icon.svg`);
    expect(container.textContent).toContain("DFL OS");
    expect(fallback(container)).toBeNull();
  });

  it("uses icon_slug, not slug (campaigns -> campanhas)", () => {
    const { container } = render(<AppMark app={CAMPAIGNS} />);
    expect(img(container)!.getAttribute("src")).toBe(`${BASE}/campanhas/icon.svg`);
  });

  it("null icon_slug shows the neutral mark, no request, and keeps the name", () => {
    const { container } = render(<AppMark app={DIAGRAMS_NO_ICON} />);
    expect(img(container)).toBeNull();
    expect(fallback(container)).not.toBeNull();
    expect(container.textContent).toContain("DFL IAM");
  });

  it("a broken icon URL falls back to the neutral mark", () => {
    const { container } = render(<AppMark app={OS} />);
    fireEvent.error(img(container)!);
    expect(img(container)).toBeNull();
    expect(fallback(container)).not.toBeNull();
    expect(container.textContent).toContain("DFL OS");
  });

  it("a different icon after a failure tries the new URL again", () => {
    const { container, rerender } = render(<AppMark app={OS} />);
    fireEvent.error(img(container)!);
    rerender(<AppMark app={CAMPAIGNS} />);
    expect(img(container)!.getAttribute("src")).toBe(`${BASE}/campanhas/icon.svg`);
  });

  it("falls back to the slug when the row has no name", () => {
    const { container } = render(<AppMark app={{ slug: "x-y", name: null, icon_slug: null }} />);
    expect(container.textContent).toContain("x-y");
  });

  it.each([16, 20, 32] as const)("renders the icon at %ipx", (size) => {
    const { container } = render(<AppMark app={OS} size={size} />);
    const el = img(container)!;
    expect(el.getAttribute("width")).toBe(String(size));
    expect(el.getAttribute("height")).toBe(String(size));
  });

  it("showName=false hides the text but keeps an accessible name", () => {
    const { container } = render(<AppMark app={OS} showName={false} />);
    expect(container.textContent).toBe("");
    expect(screen.getByRole("img", { name: "DFL OS" })).toBeTruthy();
  });
});

describe("AppMark tooltip", () => {
  it("tooltip=false: no tab stop and no tooltip on focus (the host owns one tooltip)", async () => {
    const { container } = render(<AppMarkStack apps={[OS]} tooltip={false} />);
    const mark = container.querySelector("[data-appmark]") as HTMLElement;
    expect(mark.hasAttribute("tabindex")).toBe(false);
    act(() => mark.focus());
    await new Promise((r) => setTimeout(r, 50));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("opens on keyboard focus with the app name", async () => {
    const { container } = render(<AppMark app={OS} showName={false} />);
    act(() => (container.querySelector("[data-appmark]") as HTMLElement).focus());
    expect((await screen.findAllByText("DFL OS")).length).toBeGreaterThan(0);
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain("DFL OS");
  });

  it("opens on hover", async () => {
    const { container } = render(<AppMark app={OS} showName={false} />);
    fireEvent.pointerMove(container.querySelector("[data-appmark]")!, { pointerType: "mouse" });
    await waitFor(() => expect(document.querySelector('[role="tooltip"]')).not.toBeNull());
  });

  it("opens on a touch tap", async () => {
    const { container } = render(<AppMark app={OS} showName={false} />);
    const el = container.querySelector("[data-appmark]")!;
    fireEvent.pointerDown(el, { pointerType: "touch" });
    fireEvent.click(el);
    await waitFor(() => expect(document.querySelector('[role="tooltip"]')).not.toBeNull());
  });
});

describe("AppMark with a registry", () => {
  it("resolves a slug through the provider", () => {
    const { container } = render(
      <AppsRegistryProvider rows={[OS, CAMPAIGNS]}>
        <AppMark slug="campaigns" />
      </AppsRegistryProvider>,
    );
    expect(img(container)!.getAttribute("src")).toBe(`${BASE}/campanhas/icon.svg`);
    expect(container.textContent).toContain("DFL Campaigns");
  });

  it("an unknown slug in a loaded registry shows the neutral mark and the slug", () => {
    const { container } = render(
      <AppsRegistryProvider rows={[OS]}>
        <AppMark slug="nope" />
      </AppsRegistryProvider>,
    );
    expect(img(container)).toBeNull();
    expect(fallback(container)).not.toBeNull();
    expect(container.textContent).toContain("nope");
  });

  it("without a provider, a known icon slug still renders and an unknown one can fall back", () => {
    const { container } = render(<AppMark slug="os" />);
    expect(img(container)!.getAttribute("src")).toBe(`${BASE}/os/icon.svg`);
    fireEvent.error(img(container)!);
    expect(fallback(container)).not.toBeNull();
  });

  it("while the registry loads it shows a placeholder, then the icon", async () => {
    const { client } = fakeSupabase([{ slug: "os", name: "DFL OS", icon_slug: "os", kind: "app" }]);
    const { container } = render(
      <AppsRegistryProvider supabase={client}>
        <AppMark slug="os" />
      </AppsRegistryProvider>,
    );
    expect(container.querySelector('[data-state-icon="loading"]')).not.toBeNull();
    await waitFor(() => expect(img(container)).not.toBeNull());
    expect(container.textContent).toContain("DFL OS");
  });

  it("a failed read shows the neutral mark", async () => {
    const { client } = fakeSupabase(null, { message: "boom" });
    const { container } = render(
      <AppsRegistryProvider supabase={client}>
        <AppMark slug="os" />
      </AppsRegistryProvider>,
    );
    await waitFor(() => expect(fallback(container)).not.toBeNull());
    expect(img(container)).toBeNull();
  });
});

describe("registry read", () => {
  it("reads apps.apps once per client with explicit columns, never *", async () => {
    const { client, selects } = fakeSupabase([
      { slug: "os", name: "DFL OS", icon_slug: "os", kind: "app" },
      { slug: "bad" , name: 5, icon_slug: "" },
      null,
      { name: "no slug" },
    ]);
    const a = await fetchAppsRegistry(client);
    const b = await fetchAppsRegistry(client);
    expect(selects).toEqual([{ schema: "apps", table: "apps", cols: APP_REGISTRY_COLUMNS }]);
    expect(APP_REGISTRY_COLUMNS).not.toContain("*");
    expect(APP_REGISTRY_COLUMNS).not.toContain("hook");
    expect(a).toBe(b);
    expect(a.map((r) => r.slug)).toEqual(["os", "bad"]);
    expect(a[1]).toMatchObject({ name: null, icon_slug: null });
  });

  it("many marks under one provider make one request", async () => {
    const { client, selects } = fakeSupabase([OS, CAMPAIGNS]);
    render(
      <AppsRegistryProvider supabase={client}>
        <AppMark slug="os" />
        <AppMark slug="campaigns" />
        <AppMarkStack slugs={["os", "campaigns"]} />
      </AppsRegistryProvider>,
    );
    await waitFor(() => expect(selects.length).toBe(1));
    await new Promise((r) => setTimeout(r, 20));
    expect(selects.length).toBe(1);
  });

  it("a failed read is not cached", async () => {
    let calls = 0;
    const client = {
      schema: () => ({
        from: () => ({
          select: async () => (++calls === 1 ? { data: null, error: { message: "x" } } : { data: [OS], error: null }),
        }),
      }),
    };
    await expect(fetchAppsRegistry(client)).rejects.toThrow("x");
    await expect(fetchAppsRegistry(client)).resolves.toHaveLength(1);
  });

  it("refetches when a different user signs in", async () => {
    let calls = 0;
    let listener: ((e: string, s: any) => void) | undefined;
    const client = {
      schema: () => ({
        from: () => ({
          select: async () => ({ data: calls++ === 0 ? [OS] : [OS, CAMPAIGNS], error: null }),
        }),
      }),
      auth: {
        onAuthStateChange: (cb: any) => {
          listener = cb;
          return { data: { subscription: { unsubscribe() {} } } };
        },
      },
    };
    const { container } = render(
      <AppsRegistryProvider supabase={client}>
        <AppMark slug="campaigns" />
      </AppsRegistryProvider>,
    );
    await waitFor(() => expect(container.textContent).toContain("campaigns"));
    act(() => listener!("INITIAL_SESSION", { user: null }));
    act(() => listener!("SIGNED_IN", { user: null })); // token refresh, same user: no refetch
    expect(calls).toBe(1);
    act(() => listener!("SIGNED_IN", { user: { id: "u1" } }));
    await waitFor(() => expect(container.textContent).toContain("DFL Campaigns"));
    expect(calls).toBe(2);
  });
});

describe("AppMarkStack", () => {
  const four: AppRegistryRow[] = [
    OS,
    CAMPAIGNS,
    { slug: "board", name: "DFL Board", icon_slug: "board" },
    { slug: "wiki", name: "DFL Wiki", icon_slug: "wiki" },
  ];

  it("a stack of 4 shows 3 icons and +1", () => {
    const { container } = render(<AppMarkStack apps={four} />);
    expect(container.querySelectorAll("img").length).toBe(3);
    expect(container.querySelector("[data-appmark-count]")!.textContent).toBe("+1");
    expect(container.querySelector("[data-appmark-count]")!.getAttribute("aria-label")).toContain("DFL Wiki");
  });

  it("3 or fewer shows no count", () => {
    const { container } = render(<AppMarkStack apps={four.slice(0, 3)} />);
    expect(container.querySelectorAll("img").length).toBe(3);
    expect(container.querySelector("[data-appmark-count]")).toBeNull();
  });

  it("max cannot exceed 3", () => {
    const { container } = render(<AppMarkStack apps={four} max={9} />);
    expect(container.querySelectorAll("img").length).toBe(3);
  });

  it("an empty stack renders nothing", () => {
    const { container } = render(<AppMarkStack apps={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("an unknown slug in the stack shows the neutral mark", () => {
    const { container } = render(
      <AppsRegistryProvider rows={[OS]}>
        <AppMarkStack slugs={["os", "ghost"]} />
      </AppsRegistryProvider>,
    );
    expect(container.querySelectorAll("img").length).toBe(1);
    expect(fallback(container)).not.toBeNull();
  });
});
