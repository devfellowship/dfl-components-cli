import { describe, it, expect } from "vitest";
import {
  classifyEmptiness,
  assertNotVacuouslyEmpty,
  VacuousVerificationError,
  iamMemberProbe,
  IAM_MEMBER_MIN_LEVEL,
  type PageLike,
  type LocatorLike,
  type SupabaseRpcClientLike,
} from "../index";

/**
 * A plain fake standing in for a Playwright `Page`. The fact that ~30 lines of
 * object literal satisfy `PageLike` is the point of the duck-typed interface:
 * no browser, no `@playwright/test` dependency, no adapter.
 */
function fakePage(spec: { text?: string; counts?: Record<string, number> }): PageLike {
  const counts = spec.counts ?? {};
  return {
    locator(selector: string): LocatorLike {
      return {
        async count() {
          return counts[selector] ?? 0;
        },
        async innerText() {
          if (selector === "body") return spec.text ?? "";
          return spec.text ?? "";
        },
      };
    },
  };
}

function fakeSupabase(result: { data?: unknown; error?: unknown }): SupabaseRpcClientLike {
  return {
    rpc: async () => ({ data: result.data ?? null, error: result.error ?? null }),
  };
}

describe("classifyEmptiness — the four verdicts", () => {
  it("populated: rows present, nothing to disambiguate", () => {
    const { verdict } = classifyEmptiness({
      rowCount: 17,
      deniedSignalPresent: false,
      viewerIsAuthorized: "unknown",
    });
    expect(verdict).toBe("populated");
  });

  it("populated wins even when the viewer is unauthorized (rows were rendered anyway)", () => {
    expect(
      classifyEmptiness({ rowCount: 3, deniedSignalPresent: true, viewerIsAuthorized: false })
        .verdict,
    ).toBe("populated");
  });

  it("denied: empty AND the app failed loud — asserting emptiness here is meaningful", () => {
    const { verdict, reason } = classifyEmptiness({
      rowCount: 0,
      deniedSignalPresent: true,
      viewerIsAuthorized: false,
    });
    expect(verdict).toBe("denied");
    expect(reason).toMatch(/failed loud/i);
  });

  it("genuinely-empty: empty, no denial, and an INDEPENDENT probe says the viewer could have seen rows", () => {
    const { verdict } = classifyEmptiness({
      rowCount: 0,
      deniedSignalPresent: false,
      viewerIsAuthorized: true,
    });
    expect(verdict).toBe("genuinely-empty");
  });

  it("vacuous: empty, no denial, viewer NOT authorized", () => {
    const { verdict, reason } = classifyEmptiness({
      rowCount: 0,
      deniedSignalPresent: false,
      viewerIsAuthorized: false,
    });
    expect(verdict).toBe("vacuous");
    expect(reason).toMatch(/indistinguishable from lack of access/i);
    expect(reason).toMatch(/proves nothing/i);
  });

  it("vacuous: 'unknown' authorization is treated exactly as harshly as false", () => {
    const unknown = classifyEmptiness({
      rowCount: 0,
      deniedSignalPresent: false,
      viewerIsAuthorized: "unknown",
    });
    expect(unknown.verdict).toBe("vacuous");
    expect(unknown.reason).toMatch(/could not be confirmed/i);
  });
});

describe("assertNotVacuouslyEmpty — the negative case is the point", () => {
  /**
   * THE REGRESSION. A populated surface (work.ai_spec_inputs held 17 rows)
   * viewed by the level-0 smoke identity: RLS returns 200 [], the page says
   * "0 registros", nothing renders a denied signal, and the old assertion
   * `expect(rows).toHaveCount(0)` went GREEN. This must go red.
   */
  it("THROWS on a populated surface viewed by a level-0 identity", async () => {
    const page = fakePage({ text: "0 registros" });

    await expect(
      assertNotVacuouslyEmpty(page, {
        surface: "spec-builder /history",
        countText: /^(\d+) registros?$/,
        deniedSelector: '[data-testid="access-denied"]',
        viewerIsAuthorized: false,
      }),
    ).rejects.toThrow(VacuousVerificationError);
  });

  it("the pre-fix spec-builder shape ('0 registros' + 'Nenhum histórico encontrado.', no denied signal) goes RED", async () => {
    const page = fakePage({
      text: ["Histórico de specs", "0 registros", "Nenhum histórico encontrado."].join("\n"),
      counts: { '[data-testid="access-denied"]': 0, "[data-testid='spec-row']": 0 },
    });

    let thrown: unknown;
    try {
      await assertNotVacuouslyEmpty(page, {
        surface: "spec-builder /history",
        countText: /^(\d+) registros?$/,
        rowSelector: "[data-testid='spec-row']",
        deniedSelector: '[data-testid="access-denied"]',
        viewerIsAuthorized: false,
      });
    } catch (err) {
      thrown = err;
    }

    expect(thrown).toBeInstanceOf(VacuousVerificationError);
    const error = thrown as VacuousVerificationError;
    expect(error.verdict).toBe("vacuous");
    expect(error.rowCount).toBe(0);
    expect(error.deniedSignalPresent).toBe(false);
    expect(error.viewerIsAuthorized).toBe(false);
    expect(error.message).toContain("spec-builder /history");
    expect(error.message).toMatch(/proves nothing/i);
    expect(error.message).toMatch(/NO permission-denied signal/);
  });

  it("the post-fix shape (app renders the denied signal) returns 'denied' instead of throwing", async () => {
    const page = fakePage({
      text: ["Histórico de specs", "0 registros", "Você não tem acesso a este recurso."].join("\n"),
      counts: { '[data-testid="access-denied"]': 1 },
    });

    await expect(
      assertNotVacuouslyEmpty(page, {
        surface: "spec-builder /history",
        countText: /^(\d+) registros?$/,
        deniedSelector: '[data-testid="access-denied"]',
        viewerIsAuthorized: false,
      }),
    ).resolves.toBe("denied");
  });

  it("returns 'populated' when the count text reports rows", async () => {
    const page = fakePage({ text: "17 registros" });
    await expect(
      assertNotVacuouslyEmpty(page, { countText: /^(\d+) registros?$/ }),
    ).resolves.toBe("populated");
  });

  it("returns 'populated' via rowSelector counting", async () => {
    const page = fakePage({ counts: { "tr[data-row]": 17 } });
    await expect(assertNotVacuouslyEmpty(page, { rowSelector: "tr[data-row]" })).resolves.toBe(
      "populated",
    );
  });

  it("returns 'genuinely-empty' only when an independent probe confirms authorization", async () => {
    const page = fakePage({ text: "0 registros" });
    await expect(
      assertNotVacuouslyEmpty(page, {
        countText: /^(\d+) registros?$/,
        viewerIsAuthorized: true,
      }),
    ).resolves.toBe("genuinely-empty");
  });

  it("omitting viewerIsAuthorized defaults to 'unknown' → still throws", async () => {
    const page = fakePage({ text: "0 registros" });
    await expect(
      assertNotVacuouslyEmpty(page, { countText: /^(\d+) registros?$/ }),
    ).rejects.toBeInstanceOf(VacuousVerificationError);
  });

  it("awaits a thunk authorization signal, and a throwing thunk degrades to 'unknown' (never true)", async () => {
    const page = fakePage({ text: "0 registros" });

    await expect(
      assertNotVacuouslyEmpty(page, {
        countText: /^(\d+) registros?$/,
        viewerIsAuthorized: async () => true,
      }),
    ).resolves.toBe("genuinely-empty");

    const boom = assertNotVacuouslyEmpty(page, {
      countText: /^(\d+) registros?$/,
      viewerIsAuthorized: async () => {
        throw new Error("probe network failure");
      },
    });
    await expect(boom).rejects.toBeInstanceOf(VacuousVerificationError);
  });

  it("refuses to guess when the count is unreadable", async () => {
    const page = fakePage({ text: "carregando…" });
    await expect(
      assertNotVacuouslyEmpty(page, { countText: /^(\d+) registros?$/ }),
    ).rejects.toThrow(/matched no line/);
  });

  it("refuses to run with neither countText nor rowSelector", async () => {
    await expect(assertNotVacuouslyEmpty(fakePage({}))).rejects.toThrow(
      /countText and\/or rowSelector/,
    );
  });
});

describe("iamMemberProbe — fails to 'unknown', never to true", () => {
  it("resolves true when a granted role clears the member level", async () => {
    await expect(
      iamMemberProbe(fakeSupabase({ data: [{ role_id: "admin", level: 100 }] })),
    ).resolves.toBe(true);
  });

  it("resolves false for the level-0 smoke identity", async () => {
    await expect(
      iamMemberProbe(fakeSupabase({ data: [{ role_id: "guest", level: 0 }] })),
    ).resolves.toBe(false);
  });

  it("uses the highest granted level against IAM_MEMBER_MIN_LEVEL", async () => {
    expect(IAM_MEMBER_MIN_LEVEL).toBe(50);
    await expect(
      iamMemberProbe(
        fakeSupabase({
          data: [
            { role_id: "guest", level: 0 },
            { role_id: "member", level: 50 },
          ],
        }),
      ),
    ).resolves.toBe(true);
  });

  it("an RPC error is 'unknown'", async () => {
    await expect(
      iamMemberProbe(fakeSupabase({ error: { message: "permission denied" } })),
    ).resolves.toBe("unknown");
  });

  it("an empty or null payload is 'unknown', not false and never true", async () => {
    await expect(iamMemberProbe(fakeSupabase({ data: [] }))).resolves.toBe("unknown");
    await expect(iamMemberProbe(fakeSupabase({ data: null }))).resolves.toBe("unknown");
  });

  it("rows with no readable level are 'unknown'", async () => {
    await expect(iamMemberProbe(fakeSupabase({ data: [{ role_id: "x" }] }))).resolves.toBe(
      "unknown",
    );
  });

  it("a thrown RPC is 'unknown'", async () => {
    const exploding: SupabaseRpcClientLike = {
      rpc: async () => {
        throw new Error("network down");
      },
    };
    await expect(iamMemberProbe(exploding)).resolves.toBe("unknown");
  });

  it("feeds straight into assertNotVacuouslyEmpty as the authorization thunk", async () => {
    const page = fakePage({ text: "0 registros" });
    const level0 = fakeSupabase({ data: [{ role_id: "guest", level: 0 }] });

    await expect(
      assertNotVacuouslyEmpty(page, {
        surface: "spec-builder /history",
        countText: /^(\d+) registros?$/,
        viewerIsAuthorized: () => iamMemberProbe(level0),
      }),
    ).rejects.toBeInstanceOf(VacuousVerificationError);
  });
});
