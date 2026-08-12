import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "@xyflow/react/dist/style.css";
import "../styles/canvas.css";
import { FlowCanvas } from "../canvas";
import type { FlowCanvasEdge, FlowCanvasNode } from "../canvas";

/**
 * FlowCanvas — one canvas, N lenses.
 *
 * THE POINT OF THIS FILE: every story below draws the SAME graph with the SAME
 * component, and each one puts something completely different inside the card.
 * A low-fidelity wireframe, a real captured image, a coverage figure. The canvas
 * cannot tell them apart, because it never reads `node.data` — it only calls
 * `renderCard`. That is what makes a new lens a new render function rather than
 * a new canvas.
 */
const meta: Meta<typeof FlowCanvas> = {
  title: "Components/Organisms/FlowCanvas",
  component: FlowCanvas,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FlowCanvas>;

// ─── The graph every story shares ────────────────────────────────────────────

interface DemoScreen {
  archetype: "form" | "list" | "detail" | "dashboard";
  /** A captured image, when one exists. */
  capture?: string;
  /** Share of the screen's elements that resolved to a source file. */
  coverage?: number;
}

const NODES: FlowCanvasNode<DemoScreen>[] = [
  { id: "sign_in", title: "Sign in", subtitle: "/sign-in", data: { archetype: "form", coverage: 1 } },
  { id: "projects", title: "Projects", subtitle: "/projects", data: { archetype: "list", coverage: 0.82 } },
  { id: "editor", title: "Lesson editor", subtitle: "/projects/:id/edit", data: { archetype: "detail", coverage: 0.64 } },
  { id: "preview", title: "Preview", subtitle: "/projects/:id/preview", data: { archetype: "detail", coverage: 0.41 } },
  { id: "insights", title: "Insights", subtitle: "/insights", data: { archetype: "dashboard", coverage: 0.0 } },
];

const EDGES: FlowCanvasEdge[] = [
  { id: "sign_in>projects", source: "sign_in", target: "projects", label: "Sign in" },
  { id: "projects>editor", source: "projects", target: "editor", label: "Open project" },
  { id: "editor>preview", source: "editor", target: "preview", label: "Preview" },
  // Reciprocal pair — the two chips must not print on top of each other.
  { id: "preview>editor", source: "preview", target: "editor", label: "Back to editor" },
  { id: "projects>insights", source: "projects", target: "insights", label: "Insights" },
];

// ─── Slot 1: a low-fidelity wireframe ────────────────────────────────────────

// Paper and ink, NOT design-system tokens. A sketch built from DS tokens looks
// like a finished product, and that destroys the low-fidelity signal the sketch
// exists to send. The canvas around it is fully tokenised; this content is
// deliberately not. Both live together with no special case in the canvas.
const PAPER = "#F4F3EF";
const INK = "#2B2A28";
const RULE = "#C9C6BE";

function Wireframe({ archetype }: { archetype: DemoScreen["archetype"] }) {
  const bar = (w: string, h = 6) => (
    <div style={{ width: w, height: h, background: RULE, borderRadius: 2 }} />
  );

  return (
    <div
      style={{ background: PAPER, color: INK, width: "100%", height: "100%", padding: 10, display: "flex", flexDirection: "column", gap: 6 }}
    >
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {bar("28%", 8)}
        <div style={{ flex: 1 }} />
        {bar("14%", 8)}
      </div>
      <div style={{ height: 1, background: RULE }} />
      {archetype === "form" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingTop: 4 }}>
          {bar("40%")}
          <div style={{ height: 14, border: `1px solid ${RULE}`, borderRadius: 3 }} />
          {bar("34%")}
          <div style={{ height: 14, border: `1px solid ${RULE}`, borderRadius: 3 }} />
          <div style={{ height: 14, width: "38%", background: INK, borderRadius: 3, opacity: 0.75 }} />
        </div>
      ) : null}
      {archetype === "list" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 2 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, border: `1px solid ${RULE}`, borderRadius: 2 }} />
              {bar(`${70 - i * 6}%`)}
            </div>
          ))}
        </div>
      ) : null}
      {archetype === "detail" ? (
        <div style={{ display: "flex", gap: 6, flex: 1, paddingTop: 2 }}>
          <div style={{ width: "32%", border: `1px solid ${RULE}`, borderRadius: 3 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
            {bar("80%")}
            {bar("64%")}
            {bar("72%")}
            {bar("50%")}
          </div>
        </div>
      ) : null}
      {archetype === "dashboard" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, flex: 1, paddingTop: 2 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ border: `1px solid ${RULE}`, borderRadius: 3 }} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The sketch lens. Nothing here is a picture of a real product — every card is
 * derived from the spec at render time.
 */
export const WireframeCards: Story = {
  render: () => (
    <FlowCanvas<DemoScreen>
      nodes={NODES}
      edges={EDGES}
      testIdPrefix="wireframe"
      renderCard={(node) => <Wireframe archetype={node.data!.archetype} />}
    />
  ),
};

// ─── Slot 2: a captured screenshot ───────────────────────────────────────────

// Inline SVG data URIs stand in for real captures so the story renders offline
// and deterministically. In a real lens these are URLs of captured PNGs.
function capture(label: string, tint: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
    <rect width="320" height="200" fill="#17151300"/>
    <rect x="0" y="0" width="320" height="26" fill="${tint}"/>
    <rect x="10" y="8" width="70" height="10" rx="3" fill="#ffffff" opacity="0.85"/>
    <rect x="16" y="44" width="130" height="12" rx="3" fill="#e8e4dd"/>
    <rect x="16" y="66" width="288" height="60" rx="4" fill="#ffffff" opacity="0.14" stroke="${tint}"/>
    <rect x="16" y="136" width="200" height="10" rx="3" fill="#8d8880"/>
    <rect x="16" y="154" width="160" height="10" rx="3" fill="#8d8880"/>
    <text x="16" y="192" font-family="monospace" font-size="11" fill="${tint}">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const CAPTURED: FlowCanvasNode<DemoScreen>[] = NODES.map((n) => ({
  ...n,
  data: { ...n.data!, capture: capture(n.subtitle ?? n.id, "#E07A4A") },
}));

/**
 * The observed lens. Same canvas, same graph, same props — only `renderCard`
 * changed, and now every card is a real captured frame instead of a sketch.
 */
export const ScreenshotCards: Story = {
  render: () => (
    <FlowCanvas<DemoScreen>
      nodes={CAPTURED}
      edges={EDGES}
      testIdPrefix="observed"
      renderCard={(node) => (
        <img
          src={node.data!.capture}
          alt={node.title}
          loading="lazy"
          // object-contain, not cover: captures are often a different aspect
          // ratio than the card, and `cover` crops most of the frame away.
          className="h-full w-full object-contain"
        />
      )}
    />
  ),
};

// ─── Slot 3: a click handler and a card that reacts to selection ─────────────

/**
 * The interaction half of the contract. `onNodeClick` hands the lens the node
 * it drew; the lens decides what a click means — here, selecting a screen and
 * changing what its card renders.
 */
export const ClickToSelect: Story = {
  render: function ClickToSelectStory() {
    const [selected, setSelected] = useState<string | null>(null);
    const chosen = NODES.find((n) => n.id === selected);

    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground" data-testid="selection-readout">
          {chosen ? `Selected: ${chosen.title} (${chosen.subtitle})` : "Click a card — the lens decides what that means."}
        </p>
        <FlowCanvas<DemoScreen>
          nodes={NODES}
          edges={EDGES}
          testIdPrefix="coverage"
          onNodeClick={(node) => setSelected(node.id)}
          renderCard={(node) => {
            const pct = Math.round((node.data!.coverage ?? 0) * 100);
            const isSelected = node.id === selected;
            return (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-1"
                style={{ background: isSelected ? "rgba(224,122,74,0.18)" : undefined }}
              >
                <span className="font-mono text-3xl font-bold text-foreground">{pct}%</span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">source mapped</span>
              </div>
            );
          }}
        />
      </div>
    );
  },
};

/**
 * Top-to-bottom ranking. The card slot is unchanged from `WireframeCards` — only
 * the layout direction differs, and the handles follow it.
 */
export const TopDownDirection: Story = {
  render: () => (
    <FlowCanvas<DemoScreen>
      nodes={NODES}
      edges={EDGES}
      direction="TB"
      testIdPrefix="topdown"
      renderCard={(node) => <Wireframe archetype={node.data!.archetype} />}
    />
  ),
};
