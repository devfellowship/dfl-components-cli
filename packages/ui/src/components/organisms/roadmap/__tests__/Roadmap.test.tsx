// Origin: agent
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Roadmap } from "../../../index";
import type { RoadmapDocument } from "../contract";
afterEach(cleanup);
const document: RoadmapDocument = {
  version: "roadmap/v1", direction: "down", columns: 3, edges: [], groups: [],
  nodes: [
    { id: "right", column: "right", order: 0, kind: "topic", label: "Right", state: "done" },
    { id: "left", column: "left", order: 0, kind: "topic", label: "Left", href: "/left", action: { label: "Start", actionId: "start" } },
    { id: "bottom", column: "center", order: 2, kind: "paragraph", label: "Bottom", description: "Details" },
  ],
};
describe("Roadmap", () => {
  it("renders reading order and separates a node link from its action", () => {
    const onAction = vi.fn(); const onNodeClick = vi.fn();
    render(<Roadmap document={document} onAction={onAction} onNodeClick={onNodeClick} />);
    expect(screen.getAllByTestId("roadmap-node").map(n => n.getAttribute("data-node-id"))).toEqual(["left", "right", "bottom"]);
    expect(screen.getByRole("link", { name: "Left" }).getAttribute("href")).toBe("/left");
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(onAction).toHaveBeenCalledWith("start", document.nodes[1]);
    expect(onNodeClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Start" }).closest("a")).toBeNull();
  });
  it("lets the overlay win and makes locked nodes inert", () => {
    const click = vi.fn();
    render(<Roadmap document={document} state={{ version: "roadmap-state/v1", nodes: { right: "learning", left: "locked", unknown: "done" } }} onNodeClick={click} />);
    expect(screen.getAllByTestId("roadmap-node")[1].dataset.state).toBe("learning");
    expect(screen.queryByRole("link", { name: "Left" })).toBeNull();
    expect(screen.getByRole("button", { name: "Start" }).hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByText("Left"));
    expect(click).not.toHaveBeenCalled();
  });
  it("makes a simple href node's full border box a native link", () => {
    render(<Roadmap document={{ ...document, nodes: [{ ...document.nodes[1], action: undefined }] }} />);
    expect(screen.getByRole("link", { name: "Left" }).getAttribute("data-roadmap-node-box")).toBe("left");
  });
  it("supports keyboard activation through native buttons", () => {
    const click = vi.fn(); render(<Roadmap document={document} onNodeClick={click} />);
    fireEvent.click(screen.getByRole("button", { name: "Right" }));
    expect(click).toHaveBeenCalledWith(document.nodes[0]);
  });
  it("paints disjoint runs without swallowing the center column", () => {
    render(<Roadmap document={{ ...document, groups: [
      { id: "sides", title: "Sides", from: 0, to: 2, columns: ["left", "right"] },
      { id: "middle", title: "Middle", from: 0, to: 2, columns: ["center"] },
    ] }} />);
    const groups = screen.getAllByTestId("roadmap-group");
    expect(groups.map(g => g.style.gridColumn)).toEqual(["1 / span 1", "3 / span 1", "2 / span 1"]);
    expect(groups.every(g => g.style.gridRow === "1 / span 3")).toBe(true);
    expect(screen.getAllByText("Sides")).toHaveLength(1);
  });
  it.each(["top", "bottom", "inline"] as const)("renders the %s legend and matching badge", placement => {
    render(<Roadmap document={{ ...document, nodes: [{ ...document.nodes[0], badge: "recommended" }, { id: "legend", column: "left", order: 3, kind: "legend", label: "Legend" }], legend: { placement, entries: [{ id: "recommended", label: "Recommended", tone: "success", icon: "check" }] } }} />);
    expect(screen.getAllByTestId("roadmap-legend")).toHaveLength(1);
    expect(screen.getAllByLabelText("Recommended").length).toBeGreaterThanOrEqual(1);
  });
});

describe("Roadmap column collapse", () => {
  const center: RoadmapDocument = { ...document, nodes: [
    { id: "heading", column: "center", order: 0, span: 3, kind: "title", label: "Path" },
    { id: "only", column: "center", order: 1, kind: "topic", label: "A single path" },
  ] };
  it("uses the available width for a center path even with a full-width heading", () => {
    render(<Roadmap document={center} />);
    expect(screen.getByTestId("roadmap-grid").style.gridTemplateColumns).toBe("minmax(0, 0fr) minmax(0, 1.25fr) minmax(0, 0fr)");
    expect(Number.parseFloat(screen.getByTestId("roadmap-grid").style.columnGap)).toBe(0);
  });
  it("can reserve all three tracks explicitly", () => {
    render(<Roadmap document={center} collapseEmptyColumns={false} />);
    expect(screen.getByTestId("roadmap-grid").style.gridTemplateColumns).toBe("minmax(0, 1fr) minmax(0, 1.25fr) minmax(0, 1fr)");
  });
  it("retains every occupied lane including spanning content", () => {
    render(<Roadmap document={{ ...center, nodes: [{ id: "content", column: "left", order: 0, kind: "paragraph", span: 3, label: "All lanes" }] }} />);
    expect(screen.getByTestId("roadmap-grid").style.gridTemplateColumns).toBe("minmax(0, 1fr) minmax(0, 1.25fr) minmax(0, 1fr)");
  });
});
