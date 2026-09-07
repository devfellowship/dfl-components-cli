// Origin: agent
import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Roadmap, parseRoadmapDocument, type RoadmapDocument, type RoadmapNode } from "../components/organisms/roadmap";
import vocabulary from "../components/organisms/roadmap/__fixtures__/vocabulary.json";
import longMap from "../components/organisms/roadmap/__fixtures__/long-5000.json";
import frontend from "../components/organisms/roadmap/__fixtures__/roadmapsh-frontend.json";
const node = (id: string, order: number, patch: Partial<RoadmapNode> = {}): RoadmapNode => ({ id, order, column: "center", kind: "topic", label: id, ...patch });
const doc = (nodes: RoadmapNode[], patch: Partial<RoadmapDocument> = {}): RoadmapDocument => ({ version: "roadmap/v1", direction: "down", columns: 3, nodes, edges: [], groups: [], ...patch });
const sequence = doc([node("Start", 0, { kind: "title", span: 3, label: "Frontend development" }), node("Internet", 1), node("HTML", 2), node("CSS", 3), node("JavaScript", 4)], { edges: ["Internet", "HTML", "CSS"].map((source, i) => ({ id: `sequence-${i}`, source, target: ["HTML", "CSS", "JavaScript"][i], style: "solid", route: "straight" })) });
const meta = { title: "Components/Organisms/Roadmap", component: Roadmap, parameters: { layout: "fullscreen" }, args: { document: sequence }, decorators: [(Story) => <div className="mx-auto w-full max-w-[1280px] py-6"><Story /></div>] } satisfies Meta<typeof Roadmap>;
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

// A fixed-width wrapper still responds to its own width inside a wide canvas.
const viewport = (width: number): Story => ({ render: args => <div style={{ width, maxWidth: "100%" }}><Roadmap {...args} /></div>, args: { document: parseRoadmapDocument(vocabulary) } });
export const Viewport360: Story = viewport(360);
export const Viewport390: Story = viewport(390);
export const Viewport768: Story = viewport(768);
export const Viewport1280: Story = viewport(1280);
export const FixtureLong5000: Story = { args: { document: parseRoadmapDocument(longMap) } };
export const CenterColumnOnly: Story = { args: { document: sequence } };
export const ReservedEmptyColumns: Story = { args: { document: sequence, collapseEmptyColumns: false } };

function PerfRecompute() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ median: number; count: number }>();
  const [error, setError] = useState<string>();
  async function run() {
    setRunning(true); setResult(undefined); setError(undefined);
    try {
      await document.fonts.ready;
      performance.clearMeasures("roadmap:edges");
      const samples: number[] = [];
      for (let i = 0; i < 20; i++) {
        if (!wrapper.current) return;
        const before = performance.getEntriesByName("roadmap:edges").length;
        wrapper.current.style.width = i % 2 === 0 ? "900px" : "1280px";
        const timeout = performance.now() + 3000;
        while (performance.getEntriesByName("roadmap:edges").length <= before) {
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          if (performance.now() > timeout) throw new Error("Resize produced no edge measurement. Open this story at 1280px or wider.");
        }
        samples.push(performance.getEntriesByName("roadmap:edges").at(-1)!.duration);
      }
      samples.sort((a, b) => a - b);
      setResult({ median: (samples[9] + samples[10]) / 2, count: samples.length });
    } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
    finally { setRunning(false); }
  }
  return <>
    <div className="px-3 text-sm">
      <button type="button" disabled={running} onClick={run} className="rounded border px-3 py-2">{running ? "Measure…" : "Measure 20 resizes"}</button>
      <output className="ml-3" data-testid="roadmap-perf-ms" data-samples={result?.count ?? 0}>{result ? `${result.median.toFixed(2)} ms median` : "No measurement yet"}</output>
      {error && <p role="alert">{error}</p>}
    </div>
    <div ref={wrapper} style={{ width: 1280, maxWidth: "100%" }}><Roadmap document={parseRoadmapDocument(frontend)} debugPerf /></div>
  </>;
}
export const PerfRecompute137: Story = { render: () => <PerfRecompute /> };

// The reference is the Front-end → Internet chain and its first five branches.
// Match labels, topology, side, icon placement and relative vertical order.
// The source crop cuts off the bottom of DNS; the equivalent excerpt shows it whole.
const fidelityExcerpt = doc([
  node("front-end", 0, { kind: "title", column: "left", label: "Front-end" }),
  node("internet", 3, { column: "left", label: "Internet" }),
  ...["How does the internet work?", "What is HTTP?", "What is Domain Name?", "What is hosting?", "DNS and how it works?"].map((label, order) => node(`internet-detail-${order}`, order, { column: "center", kind: "subtopic", label, icon: { name: "check", side: "right", tone: "info" } })),
], { title: "Front-end: Internet excerpt", edges: [
  { id: "chain", source: "front-end", target: "internet", style: "solid", route: "straight" },
  ...Array.from({ length: 5 }, (_, i) => ({ id: `fan-${i}`, source: "internet", target: `internet-detail-${i}`, style: "dashed" as const, route: "curve" as const })),
] });
export const FidelitySideBySide: Story = { render: () => <div className="grid min-w-0 grid-cols-1 gap-4 px-3 md:grid-cols-2">
  <figure className="m-0 min-w-0"><figcaption className="mb-3 text-sm">roadmap.sh /frontend · reference crop · 2026-09-07</figcaption><img src="/roadmap-fidelity/crop-chain-and-fanout.png" alt="roadmap.sh Front-end title, Internet topic and five Internet subtopics" className="h-auto w-full" /></figure>
  <figure className="m-0 min-w-0"><figcaption className="mb-3 text-sm">DFL Roadmap · same chain and five branches · dark design system</figcaption><Roadmap document={fidelityExcerpt} /></figure>
</div> };
