// Origin: agent
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Roadmap, parseRoadmapDocument, type RoadmapDocument, type RoadmapNode } from "../components/organisms/roadmap";
import frontend from "../components/organisms/roadmap/__fixtures__/roadmapsh-frontend.json";
const node = (id: string, order: number, patch: Partial<RoadmapNode> = {}): RoadmapNode => ({ id, order, column: "center", kind: "topic", label: id, ...patch });
const doc = (nodes: RoadmapNode[], patch: Partial<RoadmapDocument> = {}): RoadmapDocument => ({ version: "roadmap/v1", direction: "down", columns: 3, nodes, edges: [], groups: [], ...patch });
const sequence = doc([node("Start", 0, { kind: "title", span: 3, label: "Frontend development" }), node("Internet", 1), node("HTML", 2), node("CSS", 3), node("JavaScript", 4)], { edges: ["Internet", "HTML", "CSS"].map((source, i) => ({ id: `sequence-${i}`, source, target: ["HTML", "CSS", "JavaScript"][i], style: "solid", route: "straight" })) });
const meta = { title: "Components/Organisms/Roadmap", component: Roadmap, parameters: { layout: "fullscreen" }, args: { document: sequence }, decorators: [(Story) => <div className="mx-auto w-full max-w-[1100px] py-6"><Story /></div>] } satisfies Meta<typeof Roadmap>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Sequence: Story = {};
export const FanOut: Story = { args: { document: doc([node("Fundamentals", 0), ...["HTML", "CSS", "JavaScript", "Accessibility", "Git", "Browser tools"].map((label, i) => node(`detail-${i}`, Math.floor(i / 2) + 1, { label, kind: "subtopic", column: i % 2 === 0 ? "left" : "right" }))], { edges: Array.from({ length: 6 }, (_, i) => ({ id: `branch-${i}`, source: "Fundamentals", target: `detail-${i}`, style: "dashed", route: "curve" })) }) } };
export const GroupTitled: Story = { args: { document: doc(sequence.nodes, { edges: sequence.edges, groups: [{ id: "basics", title: "The browser basics", from: 1, to: 4 }] }) } };
export const GroupDarkBackground: Story = { args: { document: doc(sequence.nodes, { edges: sequence.edges, groups: [{ id: "basics", title: "The browser basics", tone: "accent", from: 1, to: 4, columns: ["center"] }] }) } };
export const GroupColumnSubsets: Story = { args: { document: doc([node("Left", 0, { column: "left" }), node("Center", 0), node("Right", 0, { column: "right" })], { groups: [{ id: "sides", title: "Side tracks", from: 0, to: 0, columns: ["left", "right"] }, { id: "middle", title: "Main track", from: 0, to: 0, columns: ["center"] }] }) } };
export const NodeToneAccent: Story = { args: { document: doc([node("Learn", 0), node("Checkpoint", 1, { tone: "accent" }), node("Practice", 2)]) } };
export const IconLeft: Story = { args: { document: doc([node("Internet", 0, { icon: { name: "globe", side: "left", tone: "success" } })]) } };
export const IconRight: Story = { args: { document: doc([node("HTML", 0, { icon: { name: "check", side: "right", tone: "info" } })]) } };
export const NodeWithButton: Story = { args: { document: doc([node("Practice", 0, { kind: "paragraph", span: 3, description: "Build a semantic document. Use headings, links and a form.", action: { label: "Start exercise", actionId: "start" } })]), onAction: (_id, target) => window.alert(`Start: ${target.label}`) } };
export const TextKinds: Story = { args: { document: doc([node("Title", 0, { kind: "title", span: 3, label: "How the web works" }), node("Label", 1, { kind: "label", label: "Optional reading" }), node("Paragraph", 2, { kind: "paragraph", span: 3, description: "A browser requests a document from a server.", links: [{ label: "Read the reference", href: "https://developer.mozilla.org/en-US/docs/Learn_web_development" }] })]) } };
const withLegend = doc([node("Recommended", 0, { badge: "recommended" }), node("Alternative", 1, { badge: "alternative" }), node("Optional", 2, { badge: "optional" })], { legend: { placement: "top", entries: [{ id: "recommended", label: "Recommended", tone: "success", icon: "check" }, { id: "alternative", label: "Alternative", tone: "info", icon: "globe" }, { id: "optional", label: "Optional", tone: "muted", icon: "circle" }] } });
export const Legend: Story = { args: { document: withLegend } };
export const StateOverlay: Story = { args: { document: sequence, state: { version: "roadmap-state/v1", nodes: { Internet: "done", HTML: "learning", CSS: "skipped", JavaScript: "locked" } } } };
export const FixtureRoadmapshFrontend: Story = { args: { document: parseRoadmapDocument(frontend) } };

const edgeDocument = (patch: Partial<RoadmapDocument['edges'][number]> = {}) => doc([node("source", 0, { label: "Learn the fundamentals" }), node("target", 1, { label: "Build a small project", column: "right" })], { edges: [{ id: "connection", source: "source", target: "target", ...patch }] });
export const EdgeWithLabel: Story = { args: { document: edgeDocument({ label: "Then practice", tone: "info", arrow: "end" }) } };
export const EdgeWithoutLabel: Story = { args: { document: edgeDocument({ style: "solid" }) } };
export const EdgeDashed: Story = { args: { document: edgeDocument() } };
export const EdgeDottedElbowArrow: Story = { args: { document: doc([node("source", 0, { column: "left", label: "Start here" }), node("obstacle", 0, { label: "Optional vocabulary" }), node("target", 0, { column: "right", label: "Review concepts" })], { edges: [{ id: "elbow", source: "source", target: "target", style: "dotted", route: "elbow", arrow: "both", label: "Review", tone: "info" }] }) } };
export const GroupThreeColumns: Story = { args: { document: doc([
  node("html", 0, { column: "left", label: "Semantic document structure" }), node("css", 0, { label: "Responsive layout fundamentals" }), node("js", 0, { column: "right", label: "JavaScript event handlers" }),
  node("accessibility", 1, { column: "left", label: "Keyboard accessibility" }), node("practice", 1, { label: "Practice with a small project" }), node("review", 1, { column: "right", label: "Review browser behaviour" }),
], { groups: [{ id: "vocabulary", title: "Frontend vocabulary", from: 0, to: 1 }], edges: [{ id: "html-practice", source: "html", target: "practice" }, { id: "css-review", source: "css", target: "review" }, { id: "js-review", source: "js", target: "review", style: "solid" }] }) } };
