// @vitest-environment jsdom
/**
 * Improvements ("Melhorias") — launcher gate, entry points, Ctrl+V paste,
 * submit payload, the "Minhas melhorias" list (T11), and the default client.
 *
 * Plan 20261103-in-app-improvements-melhorias, Verification row 6: a pasted
 * PNG gives one thumbnail while the dialog is open; with the dialog closed
 * the same paste reaches the app untouched.
 *
 * Plain DOM assertions (no jest-dom matchers), as in the rest of this repo.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor, cleanup } from "@testing-library/react";
import * as React from "react";

import {
  ImprovementsLauncher,
  ImprovementsDialog,
  createImprovementsMenuItem,
  fabStyle,
} from "../Improvements";
import type { ImprovementRequestSummary } from "../../../lib/improvements";
import {
  createImprovementsClient,
  extractPastedImages,
  validateImprovementDraft,
  buildImprovementContext,
  isAllowedMediaUrl,
} from "../../../lib/improvements";

afterEach(() => cleanup());

const png = (name = "shot.png") => new File([new Uint8Array([137, 80, 78, 71])], name, { type: "image/png" });

function pasteEvent(files: File[], text?: string): Event {
  const ev = new Event("paste", { bubbles: true, cancelable: true });
  const items = [
    ...files.map((f) => ({ kind: "file", type: f.type, getAsFile: () => f })),
    ...(text ? [{ kind: "string", type: "text/plain", getAsFile: () => null }] : []),
  ];
  Object.defineProperty(ev, "clipboardData", { value: { items, files } });
  return ev;
}

const noop = async () => "https://media.devfellowship.com/x";

describe("ImprovementsLauncher gate", () => {
  it("renders nothing when not enabled (not a superadmin)", () => {
    const { container } = render(
      <ImprovementsLauncher enabled={false} appSlug="t" uploadImage={noop} onSubmit={async () => ({})} />,
    );
    expect(container.innerHTML).toBe("");
    expect(screen.queryByTestId("improvements-launcher")).toBeNull();
  });

  it("renders the floating button when enabled, and opens the dialog", () => {
    render(<ImprovementsLauncher enabled appSlug="t" uploadImage={noop} onSubmit={async () => ({})} />);
    const fab = screen.getByTestId("improvements-launcher");
    expect(fab.getAttribute("aria-label")).toBe("Melhorias");
    expect(screen.queryByTestId("improvements-dialog")).toBeNull();
    fireEvent.click(fab);
    expect(screen.getByTestId("improvements-dialog")).toBeTruthy();
  });

  it("fab={false} renders no button (menu-item only)", () => {
    render(<ImprovementsLauncher enabled fab={false} appSlug="t" uploadImage={noop} onSubmit={async () => ({})} />);
    expect(screen.queryByTestId("improvements-launcher")).toBeNull();
  });

  it("fabStyle places the button in the chosen corner", () => {
    expect(fabStyle("bottom-right")).toEqual({ position: "fixed", zIndex: 50, bottom: 24, right: 24 });
    expect(fabStyle("top-left", { x: 8, y: 96 })).toEqual({ position: "fixed", zIndex: 50, top: 96, left: 8 });
  });

  it("the menu item opens the same controlled dialog", () => {
    function App() {
      const [open, setOpen] = React.useState(false);
      const item = createImprovementsMenuItem(() => setOpen(true));
      return (
        <>
          <button onClick={item.onSelect}>{item.label}</button>
          <ImprovementsLauncher
            enabled
            fab={false}
            open={open}
            onOpenChange={setOpen}
            appSlug="t"
            uploadImage={noop}
            onSubmit={async () => ({})}
          />
        </>
      );
    }
    render(<App />);
    fireEvent.click(screen.getByText("Melhorias"));
    expect(screen.getByTestId("improvements-dialog")).toBeTruthy();
  });
});

describe("Ctrl+V paste", () => {
  it("adds one thumbnail per pasted image while the dialog is open, and prevents the default", async () => {
    const upload = vi.fn(async (f: File) => `https://media.devfellowship.com/${f.name}`);
    render(<ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={upload} onSubmit={async () => ({})} />);
    const ev = pasteEvent([png()]);
    act(() => {
      document.dispatchEvent(ev);
    });
    expect(ev.defaultPrevented).toBe(true);
    await waitFor(() => expect(screen.getAllByTestId("improvements-image")).toHaveLength(1));
    await waitFor(() =>
      expect(screen.getByTestId("improvements-image").getAttribute("data-status")).toBe("done"),
    );
    expect(upload).toHaveBeenCalledTimes(1);
  });

  it("keeps at most 3 images", async () => {
    render(<ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={async () => ({})} />);
    act(() => {
      document.dispatchEvent(pasteEvent([png("a.png"), png("b.png"), png("c.png"), png("d.png")]));
    });
    await waitFor(() => expect(screen.getAllByTestId("improvements-image")).toHaveLength(3));
  });

  it("leaves a paste alone when the dialog is closed (the app's handler still gets it)", () => {
    const upload = vi.fn(noop);
    const appHandler = vi.fn();
    document.addEventListener("paste", appHandler);
    render(<ImprovementsDialog open={false} onOpenChange={() => {}} appSlug="t" uploadImage={upload} onSubmit={async () => ({})} />);
    const ev = pasteEvent([png()]);
    document.dispatchEvent(ev);
    document.removeEventListener("paste", appHandler);
    expect(appHandler).toHaveBeenCalledTimes(1);
    expect(ev.defaultPrevented).toBe(false);
    expect(upload).not.toHaveBeenCalled();
  });

  it("does not block a text-only paste", () => {
    render(<ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={async () => ({})} />);
    const ev = pasteEvent([], "hello");
    document.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
  });
});

describe("submit", () => {
  it("sends app slug, trimmed text, uploaded image URLs and the route context", async () => {
    const onSubmit = vi.fn(async () => ({ thread_id: "th1" }));
    render(
      <ImprovementsDialog open onOpenChange={() => {}} appSlug="bmcanvas" uploadImage={noop} onSubmit={onSubmit} buildSha="abc123" />,
    );
    act(() => {
      document.dispatchEvent(pasteEvent([png()]));
    });
    await waitFor(() =>
      expect(screen.getByTestId("improvements-image").getAttribute("data-status")).toBe("done"),
    );
    fireEvent.change(screen.getByTestId("improvements-text"), { target: { value: "  Move the save button  " } });
    fireEvent.click(screen.getByTestId("improvements-submit"));
    await waitFor(() => expect(screen.getByTestId("improvements-sent")).toBeTruthy());
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = (onSubmit.mock.calls[0] as unknown[])[0] as Record<string, any>;
    expect(payload.app_slug).toBe("bmcanvas");
    expect(payload.text).toBe("Move the save button");
    expect(payload.image_urls).toEqual(["https://media.devfellowship.com/x"]);
    expect(payload.context.build_sha).toBe("abc123");
    expect(typeof payload.context.route).toBe("string");
  });

  it("sent state: green check, short text, thread link in a new tab, no raw URL", async () => {
    const onSubmit = vi.fn(async () => ({ thread_id: "th1", thread_url: "https://plans.devfellowship.com/agents/threads/th1" }));
    render(<ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByTestId("improvements-text"), { target: { value: "x" } });
    fireEvent.click(screen.getByTestId("improvements-submit"));
    await waitFor(() => expect(screen.getByTestId("improvements-sent")).toBeTruthy());
    expect(screen.getByTestId("improvements-sent-icon").getAttribute("class")).toContain("--s-success-fg");
    const link = screen.getByTestId("improvements-sent-thread") as HTMLAnchorElement;
    expect(link.textContent).toContain("Abrir thread");
    expect(link.getAttribute("href")).toBe("https://plans.devfellowship.com/agents/threads/th1");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(screen.getByText("Melhoria enviada")).toBeTruthy();
    expect(screen.getByText("Um agente vai responder no thread.")).toBeTruthy();
    expect(screen.queryByText("Pedir uma melhoria")).toBeNull();
    expect(screen.getByTestId("improvements-sent").textContent).not.toContain("https://");
  });

  it("sent state: no thread link when the service returns no thread_url", async () => {
    const onSubmit = vi.fn(async () => ({ thread_id: "th1" }));
    render(<ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByTestId("improvements-text"), { target: { value: "x" } });
    fireEvent.click(screen.getByTestId("improvements-submit"));
    await waitFor(() => expect(screen.getByTestId("improvements-sent")).toBeTruthy());
    expect(screen.queryByTestId("improvements-sent-thread")).toBeNull();
  });

  it("shows the service error and keeps the draft", async () => {
    const onSubmit = vi.fn(async () => {
      throw new Error("Apenas superadmins podem enviar melhorias.");
    });
    render(<ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByTestId("improvements-text"), { target: { value: "x" } });
    fireEvent.click(screen.getByTestId("improvements-submit"));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("superadmins"));
    expect((screen.getByTestId("improvements-text") as HTMLTextAreaElement).value).toBe("x");
  });

  it("keeps submit disabled for an empty text", () => {
    render(<ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={async () => ({})} />);
    expect((screen.getByTestId("improvements-submit") as HTMLButtonElement).disabled).toBe(true);
  });
});

const openReq: ImprovementRequestSummary = {
  thread_id: "th-open",
  subject: "Mover o botão Salvar",
  thread_status: "open",
  created_at: "2026-11-05T10:00:00Z",
  closed_at: null,
  task: { id: "t1", identifier: "DFL-101", status: "in_progress" },
  app_slug: "bmcanvas",
  result_url: null,
};
const doneReq: ImprovementRequestSummary = {
  thread_id: "th-done",
  subject: "Trocar a cor do header",
  thread_status: "closed",
  created_at: "2026-11-04T10:00:00Z",
  closed_at: "2026-11-04T12:00:00Z",
  task: { id: "t2", identifier: "DFL-100", status: "done" },
  app_slug: "bmcanvas",
  result_url: "https://github.com/devfellowship/dfl-bmcanvas/pull/1",
};

describe("Minhas melhorias list", () => {
  it("hides the tab when no listMine is given", () => {
    render(<ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={async () => ({})} />);
    expect(screen.queryByTestId("improvements-tab-mine")).toBeNull();
    expect(screen.getByTestId("improvements-text")).toBeTruthy();
  });

  it("lists the caller's requests with thread status, task status and the result link of a done one", async () => {
    const listMine = vi.fn(async () => [openReq, doneReq]);
    render(
      <ImprovementsDialog open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={async () => ({})} listMine={listMine} />,
    );
    expect(listMine).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("improvements-tab-mine"));
    await waitFor(() => expect(screen.getAllByTestId("improvements-mine-item")).toHaveLength(2));
    expect(listMine).toHaveBeenCalledTimes(1);
    const [first, second] = screen.getAllByTestId("improvements-mine-item");
    expect(first.textContent).toContain("Mover o botão Salvar");
    expect(first.textContent).toContain("DFL-101");
    expect(first.getAttribute("data-thread-status")).toBe("open");
    expect(first.getAttribute("data-task-status")).toBe("in_progress");
    expect(first.querySelector('[data-testid="improvements-mine-result"]')).toBeNull();
    const link = second.querySelector('[data-testid="improvements-mine-result"]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe(doneReq.result_url);
    expect(screen.getAllByTestId("improvements-mine-result")).toHaveLength(1);
  });

  it("shows the empty state", async () => {
    render(
      <ImprovementsDialog
        open
        onOpenChange={() => {}}
        appSlug="t"
        uploadImage={noop}
        onSubmit={async () => ({})}
        listMine={async () => []}
        initialView="mine"
      />,
    );
    await waitFor(() => expect(screen.getByTestId("improvements-mine-empty")).toBeTruthy());
    expect(screen.queryByTestId("improvements-mine-list")).toBeNull();
  });

  it("shows the error and retries", async () => {
    const listMine = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce([openReq]);
    render(
      <ImprovementsDialog
        open
        onOpenChange={() => {}}
        appSlug="t"
        uploadImage={noop}
        onSubmit={async () => ({})}
        listMine={listMine}
        initialView="mine"
      />,
    );
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("boom"));
    fireEvent.click(screen.getByText("Tentar de novo"));
    await waitFor(() => expect(screen.getAllByTestId("improvements-mine-item")).toHaveLength(1));
  });

  it("does not link a result URL that is not http(s)", async () => {
    render(
      <ImprovementsDialog
        open
        onOpenChange={() => {}}
        appSlug="t"
        uploadImage={noop}
        onSubmit={async () => ({})}
        listMine={async () => [{ ...doneReq, result_url: "javascript:alert(1)" }]}
        initialView="mine"
      />,
    );
    await waitFor(() => expect(screen.getAllByTestId("improvements-mine-item")).toHaveLength(1));
    expect(screen.queryByTestId("improvements-mine-result")).toBeNull();
  });

  it("refetches right after a submit, so the new request shows in the list", async () => {
    const store: ImprovementRequestSummary[] = [doneReq];
    const listMine = vi.fn(async () => [...store]);
    const onSubmit = vi.fn(async () => {
      store.unshift(openReq);
      return { thread_id: openReq.thread_id };
    });
    render(
      <ImprovementsLauncher enabled fab={false} open onOpenChange={() => {}} appSlug="t" uploadImage={noop} onSubmit={onSubmit} listMine={listMine} />,
    );
    // The launcher passes listMine through: the tab is there.
    fireEvent.click(screen.getByTestId("improvements-tab-mine"));
    await waitFor(() => expect(screen.getAllByTestId("improvements-mine-item")).toHaveLength(1));
    fireEvent.click(screen.getByTestId("improvements-tab-new"));
    fireEvent.change(screen.getByTestId("improvements-text"), { target: { value: "Mover o botão Salvar" } });
    fireEvent.click(screen.getByTestId("improvements-submit"));
    await waitFor(() => expect(screen.getByTestId("improvements-sent")).toBeTruthy());
    await waitFor(() => expect(listMine).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByTestId("improvements-tab-mine"));
    await waitFor(() => expect(screen.getAllByTestId("improvements-mine-item")).toHaveLength(2));
    expect(screen.getAllByTestId("improvements-mine-item")[0].textContent).toContain("Mover o botão Salvar");
  });
});

describe("pure helpers", () => {
  it("extractPastedImages takes image files only", () => {
    const f = png();
    expect(
      extractPastedImages({
        items: [
          { kind: "string", type: "text/plain", getAsFile: () => null },
          { kind: "file", type: "image/png", getAsFile: () => f },
        ],
      }),
    ).toEqual([f]);
    expect(extractPastedImages(null)).toEqual([]);
  });

  it("validateImprovementDraft refuses empty text, too many images and a foreign host", () => {
    expect(validateImprovementDraft("ok", [])).toEqual([]);
    expect(validateImprovementDraft("  ", [])[0].field).toBe("text");
    const four = Array.from({ length: 4 }, (_, i) => `https://media.devfellowship.com/${i}`);
    expect(validateImprovementDraft("ok", four)[0].field).toBe("images");
    expect(validateImprovementDraft("ok", ["https://evil.example/x"])[0].field).toBe("images");
  });

  it("isAllowedMediaUrl accepts https media.devfellowship.com only", () => {
    expect(isAllowedMediaUrl("https://media.devfellowship.com/abc")).toBe(true);
    expect(isAllowedMediaUrl("http://media.devfellowship.com/abc")).toBe(false);
    expect(isAllowedMediaUrl("https://media.devfellowship.com.evil.io/abc")).toBe(false);
    expect(isAllowedMediaUrl("not a url")).toBe(false);
  });

  it("buildImprovementContext reads route and viewport", () => {
    const ctx = buildImprovementContext(
      { location: { pathname: "/canvas/1", search: "?tab=a" }, innerWidth: 1280, innerHeight: 800 },
      undefined,
      new Date("2026-11-03T00:00:00Z"),
    );
    expect(ctx).toEqual({
      route: "/canvas/1?tab=a",
      viewport: { width: 1280, height: 800 },
      submitted_at: "2026-11-03T00:00:00.000Z",
    });
  });
});

describe("createImprovementsClient", () => {
  const supabase = { auth: { getSession: async () => ({ data: { session: { access_token: "jwt-1" } } }) } };

  it("uploads on the members tier with the caller's JWT", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ url: "https://media.devfellowship.com/m1" }), { status: 200 }),
    );
    const client = createImprovementsClient({
      supabase,
      supabaseUrl: "https://ref.supabase.co/",
      supabaseAnonKey: "anon",
      serviceUrl: "https://improvements.example",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(await client.uploadImage(png())).toBe("https://media.devfellowship.com/m1");
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://ref.supabase.co/functions/v1/upload-file");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer jwt-1");
    expect((init.body as FormData).get("visibility")).toBe("members");
  });

  it("refuses an upload answer outside media.devfellowship.com", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ url: "https://evil.example/x" }), { status: 200 }));
    const client = createImprovementsClient({
      supabase,
      supabaseUrl: "https://ref.supabase.co",
      supabaseAnonKey: "anon",
      serviceUrl: "https://improvements.example",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(client.uploadImage(png())).rejects.toThrow();
  });

  it("posts the request to /v1/requests and maps 403", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ thread_id: "th" }), { status: 201 }))
      .mockResolvedValueOnce(new Response("{}", { status: 403 }));
    const client = createImprovementsClient({
      supabase,
      supabaseUrl: "https://ref.supabase.co",
      supabaseAnonKey: "anon",
      serviceUrl: "https://improvements.example/",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    const payload = {
      app_slug: "t",
      text: "x",
      image_urls: [],
      context: { route: "/", viewport: { width: 1, height: 1 }, submitted_at: "now" },
    };
    expect(await client.submit(payload)).toEqual({ thread_id: "th" });
    expect((fetchImpl.mock.calls[0] as unknown[])[0]).toBe("https://improvements.example/v1/requests");
    await expect(client.submit(payload)).rejects.toThrow(/superadmins/);
  });

  it("listMine sends the bearer to GET /v1/requests?mine=1 and parses the body", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ requests: [openReq, doneReq] }), { status: 200 }));
    const client = createImprovementsClient({
      supabase,
      supabaseUrl: "https://ref.supabase.co",
      supabaseAnonKey: "anon",
      serviceUrl: "https://improvements.example/",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(await client.listMine()).toEqual([openReq, doneReq]);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://improvements.example/v1/requests?mine=1");
    expect(init.method).toBe("GET");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer jwt-1");
  });

  it("listMine throws a readable error on a non-2xx answer or a bad body", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "list_failed" }), { status: 502 }))
      .mockResolvedValueOnce(new Response("not json", { status: 500 }))
      .mockResolvedValueOnce(new Response("{}", { status: 403 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ nope: 1 }), { status: 200 }));
    const client = createImprovementsClient({
      supabase,
      supabaseUrl: "https://ref.supabase.co",
      supabaseAnonKey: "anon",
      serviceUrl: "https://improvements.example",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(client.listMine()).rejects.toThrow("list_failed");
    await expect(client.listMine()).rejects.toThrow(/Falha ao carregar melhorias \(500\)/);
    await expect(client.listMine()).rejects.toThrow(/superadmins/);
    await expect(client.listMine()).rejects.toThrow(/Resposta inválida/);
  });

  it("listMine refuses without a session", async () => {
    const client = createImprovementsClient({
      supabase: { auth: { getSession: async () => ({ data: { session: null } }) } },
      supabaseUrl: "https://ref.supabase.co",
      supabaseAnonKey: "anon",
      serviceUrl: "https://improvements.example",
      fetchImpl: vi.fn() as unknown as typeof fetch,
    });
    await expect(client.listMine()).rejects.toThrow(/Sessão expirada/);
  });
});
