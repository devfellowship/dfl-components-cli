// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIframeNavigate } from "../use-iframe-navigate";

describe("useIframeNavigate", () => {
  const originalParent = window.parent;
  let postMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    postMessageSpy = vi.fn();
    Object.defineProperty(window, "parent", {
      value: { postMessage: postMessageSpy },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "parent", {
      value: originalParent,
      writable: true,
      configurable: true,
    });
  });

  it("sends DFL_NAVIGATE message to parent", () => {
    const { result } = renderHook(() => useIframeNavigate());

    act(() => {
      result.current("/some/path");
    });

    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: "DFL_NAVIGATE", path: "/some/path" },
      "*",
    );
  });

  it("does nothing when parent === window", () => {
    Object.defineProperty(window, "parent", {
      value: window,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIframeNavigate());

    act(() => {
      result.current("/test");
    });

    expect(postMessageSpy).not.toHaveBeenCalled();
  });
});
