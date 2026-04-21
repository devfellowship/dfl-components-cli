import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { DflRemote } from "../dfl-remote";

describe("DflRemote", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders iframe with correct src and title", () => {
    render(<DflRemote src="https://app.devfellowship.com/embed" title="Test App" />);
    const iframe = screen.getByTitle("Test App") as HTMLIFrameElement;
    expect(iframe.tagName).toBe("IFRAME");
    expect(iframe.src).toBe("https://app.devfellowship.com/embed");
  });

  it("renders fallback until DFL_READY is received", async () => {
    render(
      <DflRemote
        src="https://app.devfellowship.com"
        title="App"
        fallback={<div data-testid="loading">Loading...</div>}
      />,
    );

    expect(screen.getByTestId("loading")).toBeTruthy();

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "DFL_READY" },
          origin: "https://app.devfellowship.com",
        }),
      );
    });

    expect(screen.queryByTestId("loading")).toBeNull();
  });

  it("calls onNavigate when child sends DFL_NAVIGATE", async () => {
    const onNavigate = vi.fn();
    render(
      <DflRemote
        src="https://app.devfellowship.com"
        title="App"
        onNavigate={onNavigate}
      />,
    );

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "DFL_NAVIGATE", path: "/dashboard" },
          origin: "https://app.devfellowship.com",
        }),
      );
    });

    expect(onNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("updates iframe height on DFL_RESIZE", async () => {
    render(<DflRemote src="https://app.devfellowship.com" title="App" />);
    const iframe = screen.getByTitle("App") as HTMLIFrameElement;

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "DFL_RESIZE", height: 800 },
          origin: "https://app.devfellowship.com",
        }),
      );
    });

    expect(iframe.style.minHeight).toBe("800px");
  });

  it("ignores messages from disallowed origins", async () => {
    const onNavigate = vi.fn();
    render(
      <DflRemote
        src="https://app.devfellowship.com"
        title="App"
        onNavigate={onNavigate}
      />,
    );

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "DFL_NAVIGATE", path: "/hacked" },
          origin: "https://evil.com",
        }),
      );
    });

    expect(onNavigate).not.toHaveBeenCalled();
  });
});
