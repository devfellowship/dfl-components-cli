import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { FlowCanvas } from "../FlowCanvas";
import type { FlowCanvasNode } from "../types";

// React Flow measures its container and uses geometry APIs jsdom does not ship.
// Without these it renders no nodes at all.
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  global.DOMMatrixReadOnly ??= class {
    m22 = 1;
  } as unknown as typeof DOMMatrixReadOnly;

  // React Flow refuses to lay out a zero-sized container, and jsdom reports 0.
  Object.defineProperties(HTMLElement.prototype, {
    offsetHeight: { get: () => 800, configurable: true },
    offsetWidth: { get: () => 1200, configurable: true },
  });
});

afterEach(cleanup);

interface Payload {
  secret: string;
}

const NODES: FlowCanvasNode<Payload>[] = [
  { id: "one", title: "Screen one", subtitle: "/one", data: { secret: "alpha" } },
  { id: "two", title: "Screen two", subtitle: "/two", data: { secret: "beta" } },
];

const EDGES = [{ id: "one>two", source: "one", target: "two", label: "Continue" }];

describe("FlowCanvas", () => {
  it("renders exactly what the card slot returns, and hands the payload back untouched", () => {
    const seen: Payload[] = [];

    render(
      <FlowCanvas<Payload>
        nodes={NODES}
        edges={EDGES}
        testIdPrefix="probe"
        renderCard={(node) => {
          seen.push(node.data!);
          return <div data-testid={`card-${node.id}`}>slot content for {node.data!.secret}</div>;
        }}
      />,
    );

    // The slot ran for each node and received the consumer's own object.
    expect([...new Set(seen.map((s) => s.secret))].sort()).toEqual(["alpha", "beta"]);
    expect(seen[0]).toBe(NODES.find((n) => n.data!.secret === seen[0].secret)!.data);
    expect(screen.getByTestId("card-one").textContent).toBe("slot content for alpha");
    expect(screen.getByTestId("card-two").textContent).toBe("slot content for beta");
  });

  it("draws the caption from title and subtitle, and never from the payload", () => {
    render(
      <FlowCanvas<Payload> nodes={NODES} edges={EDGES} testIdPrefix="probe" renderCard={() => <span>—</span>} />,
    );

    expect(screen.getByText("Screen one").className).toContain("font-semibold");
    expect(screen.getByText("/one").className).toContain("font-mono");
    // `secret` lives in `data`. Nothing the canvas draws may leak it: the whole
    // reuse argument rests on the canvas not knowing what a card is about.
    expect(screen.queryByText(/alpha/)).toBeNull();
  });

  it("lets a lens override the caption without touching the canvas", () => {
    render(
      <FlowCanvas<Payload>
        nodes={NODES}
        edges={EDGES}
        testIdPrefix="probe"
        renderCard={() => <span>—</span>}
        renderCaption={(node) => <span data-testid={`caption-${node.id}`}>{node.data!.secret}</span>}
      />,
    );

    expect(screen.getByTestId("caption-one").textContent).toBe("alpha");
    expect(screen.queryByText("Screen one")).toBeNull();
  });

  it("prefixes every test id it emits, and addresses each card by node id", () => {
    render(
      <FlowCanvas<Payload> nodes={NODES} edges={EDGES} testIdPrefix="atlas" renderCard={() => <span>—</span>} />,
    );

    expect(screen.getByTestId("atlas-canvas")).not.toBeNull();
    expect(screen.getAllByTestId("atlas-node")).toHaveLength(2);
    expect(screen.getAllByTestId("atlas-node-content")).toHaveLength(2);
    expect(document.querySelector('[data-testid="atlas-node"][data-node-id="two"]')).not.toBeNull();
  });

  it("calls onNodeClick with the consumer's node, not with React Flow's", () => {
    const onNodeClick = vi.fn();
    render(
      <FlowCanvas<Payload>
        nodes={NODES}
        edges={EDGES}
        testIdPrefix="probe"
        renderCard={() => <span>—</span>}
        onNodeClick={onNodeClick}
      />,
    );

    fireEvent.click(document.querySelector('[data-testid="probe-node"][data-node-id="two"]')!);

    expect(onNodeClick).toHaveBeenCalledTimes(1);
    expect(onNodeClick.mock.calls[0][0]).toBe(NODES[1]);
  });

  it("draws no pointer affordance without a click handler, and one with it", () => {
    const { rerender } = render(
      <FlowCanvas<Payload> nodes={NODES} edges={EDGES} testIdPrefix="probe" renderCard={() => <span>—</span>} />,
    );
    // A canvas whose cards do nothing must not look clickable.
    expect(screen.getAllByTestId("probe-node")[0].className).not.toContain("cursor-pointer");

    rerender(
      <FlowCanvas<Payload>
        nodes={NODES}
        edges={EDGES}
        testIdPrefix="probe"
        renderCard={() => <span>—</span>}
        onNodeClick={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId("probe-node")[0].className).toContain("cursor-pointer");
  });
});

// NOT ASSERTED HERE: the drawn edges and their label chips. React Flow only
// paints an edge once it has MEASURED both endpoints' handles, and jsdom
// reports every element as zero-sized, so `react-flow__edges` stays empty no
// matter what the graph says. Faking the measurement would test the fake.
// Edge geometry and the reciprocal-pair de-collision are asserted where they
// are real: `layout.test.ts` for the pairIndex/pairCount maths, the Storybook
// stories for the rendering, and the ux-paths Playwright suite for the count
// of `.react-flow__edge` in a browser.
