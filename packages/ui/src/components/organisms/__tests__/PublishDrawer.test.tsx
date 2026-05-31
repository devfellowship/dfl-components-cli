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
  type PublisherAccount,
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
