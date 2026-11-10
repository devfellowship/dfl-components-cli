// @vitest-environment jsdom
// Origin: agent
import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, useAuth, PROFILE_COLUMNS } from "../use-auth";

function fakeSupabase(selected: string[]) {
  const user = { id: "u1", email: "ada@example.com" };
  return {
    auth: {
      getSession: async () => ({ data: { session: { user } } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: (cols: string) => {
        selected.push(cols);
        // Prod behaviour: `*` includes `email`, which `authenticated` may not read.
        const denied = cols.includes("*") || cols.includes("email");
        return {
          eq: () => ({
            single: async () =>
              denied
                ? { data: null, error: { code: "42501", message: "permission denied for table profiles" } }
                : { data: { id: "u1", name: "Ada", avatar_url: "https://x/p.png" }, error: null },
          }),
        };
      },
    }),
  } as any;
}

describe("AuthProvider profile read", () => {
  it("reads explicit columns (never *), so the profile and its avatar_url load", async () => {
    const selected: string[] = [];
    const supabase = fakeSupabase(selected);
    const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider supabase={supabase}>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.profile).not.toBeNull());
    expect(selected[0]).toBe(PROFILE_COLUMNS);
    expect(selected[0]).not.toContain("*");
    expect(result.current.profile?.avatar_url).toBe("https://x/p.png");
    expect(result.current.profile?.email).toBe("ada@example.com");
  });
});
