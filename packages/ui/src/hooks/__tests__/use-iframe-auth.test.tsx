// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIframeAuth } from "../use-iframe-auth";
import { IframeContext } from "../../components/iframe/iframe-context";
import type { IframeContextValue } from "../../components/iframe/iframe-context";

function wrapper(value: IframeContextValue) {
  return ({ children }: { children: React.ReactNode }) => (
    <IframeContext.Provider value={value}>{children}</IframeContext.Provider>
  );
}

describe("useIframeAuth", () => {
  it("returns default context when no provider", () => {
    const { result } = renderHook(() => useIframeAuth());
    expect(result.current).toEqual({ token: null, userId: null, ready: false });
  });

  it("reads token and userId from context", () => {
    const { result } = renderHook(() => useIframeAuth(), {
      wrapper: wrapper({ token: "abc123", userId: "user-1", ready: true }),
    });
    expect(result.current.token).toBe("abc123");
    expect(result.current.userId).toBe("user-1");
    expect(result.current.ready).toBe(true);
  });
});
