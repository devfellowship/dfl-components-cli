import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { IframeAware } from "../iframe-aware";
import { useIframeAuth } from "../../../hooks/use-iframe-auth";

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    callback: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) { this.callback = cb; }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

function AuthDisplay() {
  const { token, userId, ready } = useIframeAuth();
  return (
    <div>
      <span data-testid="token">{token ?? "none"}</span>
      <span data-testid="userId">{userId ?? "none"}</span>
      <span data-testid="ready">{String(ready)}</span>
    </div>
  );
}

describe("IframeAware", () => {
  let parentPostMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    parentPostMessage = vi.fn();
    Object.defineProperty(window, "parent", {
      value: { postMessage: parentPostMessage },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "parent", {
      value: window,
      writable: true,
      configurable: true,
    });
  });

  it("sends DFL_READY on mount", () => {
    render(
      <IframeAware>
        <div>child</div>
      </IframeAware>,
    );

    expect(parentPostMessage).toHaveBeenCalledWith(
      { type: "DFL_READY" },
      "*",
    );
  });

  it("receives SET_TOKEN and provides auth context", async () => {
    render(
      <IframeAware>
        <AuthDisplay />
      </IframeAware>,
    );

    expect(screen.getByTestId("token").textContent).toBe("none");
    expect(screen.getByTestId("ready").textContent).toBe("false");

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "DFL_SET_TOKEN", token: "jwt-abc", userId: "u1" },
          origin: "https://learn.devfellowship.com",
        }),
      );
    });

    expect(screen.getByTestId("token").textContent).toBe("jwt-abc");
    expect(screen.getByTestId("userId").textContent).toBe("u1");
    expect(screen.getByTestId("ready").textContent).toBe("true");
  });

  it("rejects SET_TOKEN from disallowed origin", async () => {
    render(
      <IframeAware>
        <AuthDisplay />
      </IframeAware>,
    );

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "DFL_SET_TOKEN", token: "evil-token" },
          origin: "https://evil.com",
        }),
      );
    });

    expect(screen.getByTestId("token").textContent).toBe("none");
    expect(screen.getByTestId("ready").textContent).toBe("false");
  });
});
