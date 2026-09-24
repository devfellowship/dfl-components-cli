/**
 * Unit tests for PublishDrawer pure helpers.
 *
 * Logic-only (node-env safe) so it runs both under the package's jsdom vitest
 * config AND under the repo-root node-env vitest config (which CI executes).
 */
import { describe, it, expect } from "vitest";
import {
  parseTags,
  filterPublishableAccounts,
  validatePublishForm,
  renderThumbnail,
  DEFAULT_THUMBNAIL_RENDER_URL,
  type PublisherAccount,
  type PublishDrawerSupabase,
} from "../PublishDrawer";

describe("parseTags", () => {
  it("splits on commas and trims", () => {
    expect(parseTags("a, b ,c")).toEqual(["a", "b", "c"]);
  });

  it("splits on newlines too", () => {
    expect(parseTags("a\nb\nc")).toEqual(["a", "b", "c"]);
  });

  it("drops empty fragments", () => {
    expect(parseTags("a,, ,b,")).toEqual(["a", "b"]);
  });

  it("returns empty array for blank input", () => {
    expect(parseTags("   ")).toEqual([]);
  });
});

describe("filterPublishableAccounts (v1 = YouTube only)", () => {
  const accounts: PublisherAccount[] = [
    { id: "1", platform: "youtube", account_id: "yt-1", account_name: "Main", is_active: true },
    { id: "2", platform: "instagram", account_id: "ig-1", account_name: "IG", is_active: true },
    { id: "3", platform: "tiktok", account_id: "tt-1", account_name: "TT", is_active: true },
    { id: "4", platform: "youtube", account_id: "yt-2", account_name: "Old", is_active: false },
  ];

  it("keeps only active youtube accounts", () => {
    const result = filterPublishableAccounts(accounts);
    expect(result.map((a) => a.account_id)).toEqual(["yt-1"]);
  });

  it("treats undefined is_active as active", () => {
    const result = filterPublishableAccounts([
      { id: "5", platform: "youtube", account_id: "yt-3", account_name: null },
    ]);
    expect(result).toHaveLength(1);
  });

  it("returns empty when no youtube accounts", () => {
    const result = filterPublishableAccounts([accounts[1], accounts[2]]);
    expect(result).toEqual([]);
  });
});

describe("validatePublishForm", () => {
  const valid = {
    videoUrl: "https://x/v.mp4",
    title: "T",
    description: "D",
    accountId: "yt-1",
  };

  it("returns null when complete", () => {
    expect(validatePublishForm(valid)).toBeNull();
  });

  it("flags missing video", () => {
    expect(validatePublishForm({ ...valid, videoUrl: "" })).toBe("video_url_required");
  });

  it("flags missing title", () => {
    expect(validatePublishForm({ ...valid, title: "  " })).toBe("title_required");
  });

  it("flags missing description", () => {
    expect(validatePublishForm({ ...valid, description: "" })).toBe("description_required");
  });

  it("flags missing account", () => {
    expect(validatePublishForm({ ...valid, accountId: null })).toBe("account_required");
  });
});

describe("renderThumbnail (service first, one edge fallback)", () => {
  const body = { template_id: "tpl-1", render_params: { title: "T" } };
  const SERVICE = "https://services.example/thumbify/render";

  function makeSupabase() {
    const calls: Array<{ name: string; options?: { body?: unknown } }> = [];
    const supabase: PublishDrawerSupabase = {
      functions: {
        invoke: async (name, options) => {
          calls.push({ name, options });
          return { data: { output_url: "https://edge/out.png" }, error: null };
        },
      },
    };
    return { supabase, calls };
  }

  function jsonResponse(status: number, payload: unknown): Response {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  it("calls the service URL first and does not touch the edge fn on success", async () => {
    const { supabase, calls } = makeSupabase();
    const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init });
      return jsonResponse(200, { output_url: "https://svc/out.png" });
    }) as unknown as typeof fetch;

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, supabase, fetchImpl, warn: () => {} });

    expect(fetchCalls).toHaveLength(1);
    expect(fetchCalls[0].url).toBe(SERVICE);
    expect(fetchCalls[0].init?.method).toBe("POST");
    expect(JSON.parse(String(fetchCalls[0].init?.body))).toEqual(body);
    expect(calls).toHaveLength(0);
    expect(r).toEqual({ data: { output_url: "https://svc/out.png" }, error: null, via: "service" });
  });

  it("falls back ONCE to the edge fn on a network error", async () => {
    const { supabase, calls } = makeSupabase();
    const warnings: string[] = [];
    const fetchImpl = (async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, supabase, fetchImpl, warn: (m) => warnings.push(m) });

    expect(calls).toEqual([{ name: "render-design-template", options: { body } }]);
    expect(r.via).toBe("edge-fallback");
    expect(r.data).toEqual({ output_url: "https://edge/out.png" });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("render-design-template");
  });

  it.each([500, 502, 503])("falls back ONCE to the edge fn on HTTP %i", async (status) => {
    const { supabase, calls } = makeSupabase();
    const fetchImpl = (async () => jsonResponse(status, { error: "busy" })) as unknown as typeof fetch;

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, supabase, fetchImpl, warn: () => {} });

    expect(calls).toHaveLength(1);
    expect(r.via).toBe("edge-fallback");
  });

  it.each([400, 404])("does NOT fall back on HTTP %i and returns an error", async (status) => {
    const { supabase, calls } = makeSupabase();
    const fetchImpl = (async () => jsonResponse(status, { error: "template_not_found" })) as unknown as typeof fetch;

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, supabase, fetchImpl, warn: () => {} });

    expect(calls).toHaveLength(0);
    expect(r.via).toBe("service");
    expect(r.data).toBeNull();
    expect(r.error?.message).toContain(`thumbify_render_http_${status}`);
  });

  it("defaults to the public dfl-services endpoint", () => {
    expect(DEFAULT_THUMBNAIL_RENDER_URL).toBe("https://services.devfellowship.com/thumbify/render");
  });
});
