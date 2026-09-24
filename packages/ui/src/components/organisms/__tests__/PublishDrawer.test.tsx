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
  sessionAccessToken,
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

describe("renderThumbnail (service only, no fallback)", () => {
  const body = { template_id: "tpl-1", render_params: { title: "T" } };
  const SERVICE = "https://services.example/thumbify/render";

  function jsonResponse(status: number, payload: unknown): Response {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  function makeFetch(respond: () => Response | Promise<Response>) {
    const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init });
      return respond();
    }) as unknown as typeof fetch;
    return { fetchImpl, fetchCalls };
  }

  it("calls the service URL once and returns its answer", async () => {
    const { fetchImpl, fetchCalls } = makeFetch(() => jsonResponse(200, { output_url: "https://svc/out.png" }));

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, fetchImpl, warn: () => {} });

    expect(fetchCalls).toHaveLength(1);
    expect(fetchCalls[0].url).toBe(SERVICE);
    expect(fetchCalls[0].init?.method).toBe("POST");
    expect(JSON.parse(String(fetchCalls[0].init?.body))).toEqual(body);
    expect(r).toEqual({ data: { output_url: "https://svc/out.png" }, error: null });
  });

  it.each([400, 404])("surfaces HTTP %i as an error", async (status) => {
    const { fetchImpl, fetchCalls } = makeFetch(() => jsonResponse(status, { error: "template_not_found" }));

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, fetchImpl, warn: () => {} });

    expect(fetchCalls).toHaveLength(1);
    expect(r.data).toBeNull();
    expect(r.error?.message).toContain(`thumbify_render_http_${status}`);
  });

  it.each([500, 502, 503])("surfaces HTTP %i as an error with exactly one fetch", async (status) => {
    const warnings: string[] = [];
    const { fetchImpl, fetchCalls } = makeFetch(() => jsonResponse(status, { error: "busy" }));

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, fetchImpl, warn: (m) => warnings.push(m) });

    expect(fetchCalls).toHaveLength(1);
    expect(r.data).toBeNull();
    expect(r.error?.message).toContain(`thumbify_render_http_${status}`);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain(`HTTP ${status}`);
  });

  it("surfaces a network error with exactly one fetch", async () => {
    const warnings: string[] = [];
    const { fetchImpl, fetchCalls } = makeFetch(() => {
      throw new TypeError("Failed to fetch");
    });

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, fetchImpl, warn: (m) => warnings.push(m) });

    expect(fetchCalls).toHaveLength(1);
    expect(r.data).toBeNull();
    expect(r.error?.message).toContain("thumbify_render_network_error");
    expect(warnings).toHaveLength(1);
  });

  it("does not call any Supabase edge function (no fallback path exists)", async () => {
    const { fetchImpl } = makeFetch(() => jsonResponse(503, { error: "busy" }));
    const invoked: string[] = [];
    const supabase: PublishDrawerSupabase = {
      functions: {
        invoke: async (name) => {
          invoked.push(name);
          return { data: null, error: null };
        },
      },
    };

    // A stray client in the input must be ignored.
    await renderThumbnail({ serviceUrl: SERVICE, body, fetchImpl, warn: () => {}, ...({ supabase } as object) });

    expect(invoked).toEqual([]);
  });

  it("sends the access token as a Bearer, and no Authorization without one", async () => {
    const { fetchImpl, fetchCalls } = makeFetch(() => jsonResponse(200, { output_url: "https://svc/out.png" }));

    await renderThumbnail({ serviceUrl: SERVICE, body, accessToken: "user-jwt", fetchImpl, warn: () => {} });
    await renderThumbnail({ serviceUrl: SERVICE, body, fetchImpl, warn: () => {} });

    const h0 = fetchCalls[0].init?.headers as Record<string, string>;
    const h1 = fetchCalls[1].init?.headers as Record<string, string>;
    expect(h0.Authorization).toBe("Bearer user-jwt");
    expect(h1.Authorization).toBeUndefined();
  });

  it("surfaces a 401 (no session) as an error", async () => {
    const { fetchImpl } = makeFetch(() => jsonResponse(401, { error: "Authentication required" }));

    const r = await renderThumbnail({ serviceUrl: SERVICE, body, fetchImpl, warn: () => {} });

    expect(r.error?.message).toContain("thumbify_render_http_401");
  });

  it("sessionAccessToken reads the injected client's session", async () => {
    const withSession = {
      auth: { getSession: async () => ({ data: { session: { access_token: "tok" } } }) },
    };
    const noSession = { auth: { getSession: async () => ({ data: { session: null } }) } };
    const throwing = {
      auth: {
        getSession: async (): Promise<{ data: { session: { access_token: string } | null } }> => {
          throw new Error("boom");
        },
      },
    };

    expect(await sessionAccessToken(withSession)).toBe("tok");
    expect(await sessionAccessToken(noSession)).toBeUndefined();
    expect(await sessionAccessToken({})).toBeUndefined();
    expect(await sessionAccessToken(throwing)).toBeUndefined();
  });

  it("defaults to the public dfl-services endpoint", () => {
    expect(DEFAULT_THUMBNAIL_RENDER_URL).toBe("https://services.devfellowship.com/thumbify/render");
  });
});
