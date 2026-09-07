import { describe, it, expect } from "vitest";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { safeParseRoadmapDocument } from "../contract";
import { fromRoadmapSh } from "../convert/fromRoadmapSh";
import type { RoadmapShMap } from "../convert/fromRoadmapSh";
import { fixturePath, loadFixture } from "../__fixtures__/load";

/**
 * The converter is a dev tool (plan ADR-9). Two things are tested.
 *
 * 1. A hand-built map exercises every mapping rule once, with numbers a reader
 *    can follow: the column bands, the row clustering, a section that becomes a
 *    group range, the paragraph + button fold, the legend, the badge, the
 *    colorType and the edge style.
 * 2. THE CORPUS ROUND TRIP (verification row 5 of the plan): all 92 public
 *    roadmap.sh maps convert and validate with zero issues. It runs only when
 *    `ROADMAPSH_CORPUS_DIR` points at the corpus, because the corpus is not in
 *    git — the licence is NOASSERTION and one converted map is fixture enough.
 */

const FRONTEND_FIXTURE = "roadmapsh-frontend.json";
const FRONTEND_SOURCE_URL = "https://roadmap.sh/frontend.json";
const FRONTEND_META = {
  source: FRONTEND_SOURCE_URL,
  license:
    "roadmap.sh map content, licence NOASSERTION. Committed as a rendering fidelity fixture only. Not published in `dist`; see plan ADR-9 and question Q4.",
  converter: "convert/fromRoadmapSh.ts (roadmap/v1)",
  fetchedAt: "2026-09-07",
};

function corpusDir(): string | undefined {
  const fromEnv = process.env.ROADMAPSH_CORPUS_DIR;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  return undefined;
}

// ─── 1. The mapping rules, on a map small enough to reason about ─────────────

const box = (
  id: string,
  type: string,
  x: number,
  y: number,
  w: number,
  h: number,
  data: Record<string, unknown> = {},
) => ({ id, type, position: { x, y }, measured: { width: w, height: h }, data });

/**
 * Bounding box after the fold and the section-title removal: x from -250 to 250,
 * so the three bands are [-250,-83.3) left, [-83.3, 83.3) centre, [83.3, 250]
 * right. Every expectation below is derived from those numbers.
 */
const sampleMap: RoadmapShMap = {
  title: "Sample",
  slug: "sample",
  nodes: [
    box("legend1", "legend", -250, -150, 200, 100, {
      label: "",
      legends: [{ id: "L1", color: "#874efe", label: "Recommended" }],
    }),
    box("title1", "title", -50, 0, 100, 49, { label: "Sample map" }),
    box("topicA", "topic", -50, 100, 100, 49, { label: "Topic A" }),
    box("subLeft", "subtopic", -250, 105, 100, 49, {
      label: "Left detail",
      legend: { id: "UNKNOWN", color: "#4f7a28", position: "left-center" },
    }),
    box("subRight", "subtopic", 150, 100, 100, 49, {
      label: "Right detail",
      legend: { id: "L1", color: "#874efe", position: "right-center" },
    }),
    box("topicB", "topic", -50, 200, 100, 49, {
      label: "Topic B",
      style: { colorType: "a" },
    }),
    // The section rect and the label that titles it.
    { id: "sec1", type: "section", position: { x: -280, y: 280 }, measured: { width: 560, height: 200 }, data: { style: { backgroundColor: "#ffffff" } } },
    box("secLabel", "label", -60, 285, 120, 30, { label: "Section title" }),
    box("inGroup1", "topic", -50, 340, 100, 49, { label: "Inside 1" }),
    box("inGroup2", "topic", -50, 420, 100, 49, { label: "Inside 2" }),
    // A paragraph and a button drawn on top of each other = one node + action.
    box("para1", "paragraph", -250, 520, 300, 100, { label: "Continue with" }),
    box("btn1", "button", -150, 560, 100, 40, { label: "Go", href: "https://example.test/go" }),
    // Decorative types the contract does not model.
    box("rule1", "horizontal", -200, 700, 400, 20, { label: "horizontal node" }),
    box("todo1", "todo", -200, 740, 100, 40, { label: "a todo" }),
  ],
  edges: [
    { id: "x1", source: "topicA", target: "topicB", data: { edgeStyle: "solid" } },
    { id: "x2", source: "topicA", target: "subRight", data: {} },
    { id: "x3", source: "topicA", target: "does-not-exist", data: {} },
    { id: "x4", source: "topicB", target: "inGroup1", type: "step", markerEnd: { type: "arrow" }, data: { edgeStyle: "dashed" } },
  ],
};

describe("fromRoadmapSh — the mapping rules", () => {
  const { document, report } = fromRoadmapSh(sampleMap, { meta: { test: true } });
  const byId = new Map(document.nodes.map((node) => [node.id, node]));

  it("emits a valid roadmap/v1 document", () => {
    expect(safeParseRoadmapDocument(document).success).toBe(true);
    expect(document.version).toBe("roadmap/v1");
    expect(document.title).toBe("Sample");
  });

  it("buckets the horizontal centre into three bands", () => {
    expect(byId.get("subLeft")?.column).toBe("left");
    expect(byId.get("topicA")?.column).toBe("center");
    expect(byId.get("subRight")?.column).toBe("right");
    expect(byId.get("para1")?.column).toBe("left");
  });

  it("ranks rows by the vertical centre, with a 24 px tolerance", () => {
    // legend (cy -100) < title (24.5) < the three at 124.5/129.5 < topicB (224.5)
    expect(byId.get("legend1")?.order).toBe(0);
    expect(byId.get("title1")?.order).toBe(1);
    expect(byId.get("topicA")?.order).toBe(2);
    expect(byId.get("subLeft")?.order).toBe(2);
    expect(byId.get("subRight")?.order).toBe(2);
    expect(byId.get("topicB")?.order).toBe(3);
    expect(byId.get("inGroup1")?.order).toBe(4);
    expect(byId.get("inGroup2")?.order).toBe(5);
    expect(byId.get("para1")?.order).toBe(6);
  });

  it("turns a section rect into a group RANGE with the label as its title", () => {
    expect(document.groups).toEqual([
      {
        id: "sec1",
        from: 4,
        to: 5,
        columns: ["center"],
        tone: "neutral",
        title: "Section title",
      },
    ]);
    // The label node became the title, so it is no longer a node of its own.
    expect(byId.has("secLabel")).toBe(false);
    expect(report.dropped["label:section-title"]).toBe(1);
  });

  it("folds an overlapping paragraph and button into one node with an action", () => {
    expect(byId.has("btn1")).toBe(false);
    expect(byId.get("para1")?.action).toEqual({ label: "Go", href: "https://example.test/go" });
    expect(report.dropped["button:folded-into-paragraph"]).toBe(1);
  });

  it("lifts the legend node's entries to the document and badges the node", () => {
    expect(document.legend).toEqual({
      placement: "inline",
      entries: [{ id: "L1", label: "Recommended", tone: "info", icon: "check" }],
    });
    expect(byId.get("subRight")?.badge).toBe("L1");
    expect(byId.get("legend1")?.kind).toBe("legend");
    expect(byId.get("legend1")?.label).toBe("Legend");
  });

  it("falls back to an icon when the badge names no legend entry", () => {
    expect(byId.get("subLeft")?.badge).toBeUndefined();
    expect(byId.get("subLeft")?.icon).toEqual({ name: "check", side: "left", tone: "success" });
  });

  it("maps colorType to a tone token, never to a hex (ADR-6)", () => {
    expect(byId.get("topicB")?.tone).toBe("accent");
    for (const node of document.nodes) {
      expect(node.tone === undefined || !String(node.tone).startsWith("#")).toBe(true);
    }
  });

  it("keeps the roadmap.sh edge-style names and defaults the rest to dashed", () => {
    const edges = document.edges;
    expect(edges).toHaveLength(3);
    expect(edges.find((e) => e.source === "topicA" && e.target === "topicB")?.style).toBe("solid");
    expect(edges.find((e) => e.source === "topicA" && e.target === "subRight")?.style).toBe(
      "dashed",
    );
    const stepEdge = edges.find((e) => e.source === "topicB")!;
    expect(stepEdge.route).toBe("elbow");
    expect(stepEdge.arrow).toBe("end");
    expect(report.dropped["edge:dangling"]).toBe(1);
  });

  it("drops the decorative node types and counts them", () => {
    expect(report.dropped.horizontal).toBe(1);
    expect(report.dropped.todo).toBe(1);
    expect(report.counts.nodesIn).toBe(14);
    expect(report.counts.nodesOut).toBe(9);
  });

  it("drops every absolute coordinate and every handle", () => {
    const serialised = JSON.stringify(document);
    expect(serialised).not.toContain("position");
    expect(serialised).not.toContain("sourceHandle");
    expect(serialised).not.toContain("measured");
    // The provenance of each node survives in `meta`, which the component never reads.
    expect(byId.get("topicA")?.meta).toEqual({ roadmapsh: { id: "topicA", type: "topic" } });
  });

  it("repairs a cell collision by moving the later node down, and says so", () => {
    const collide: RoadmapShMap = {
      nodes: [
        box("a", "topic", 0, 0, 100, 49, { label: "A" }),
        // Same band, same row within the 24 px tolerance.
        box("b", "topic", 5, 10, 100, 49, { label: "B" }),
      ],
      edges: [],
    };
    const result = fromRoadmapSh(collide);
    const orders = result.document.nodes.map((n) => n.order).sort();
    expect(orders).toEqual([0, 1]);
    expect(result.report.warnings.some((w) => /moved to row 1/.test(w))).toBe(true);
  });

  it("is deterministic — the same input gives byte-identical output", () => {
    const first = JSON.stringify(fromRoadmapSh(sampleMap).document);
    const second = JSON.stringify(fromRoadmapSh(sampleMap).document);
    expect(first).toBe(second);
  });
});

// ─── 2. The corpus round trip — verification row 5 ───────────────────────────

const dir = corpusDir();

describe.skipIf(!dir)("fromRoadmapSh — the 92-map corpus round trip", () => {
  it("converts and validates every map with zero issues", () => {
    const files = readdirSync(dir!)
      .filter((name) => name.endsWith(".json") && name !== "pages.json")
      .sort();
    expect(files.length).toBeGreaterThan(0);

    const rows: string[] = [];
    const failures: string[] = [];
    let totalWarnings = 0;
    const droppedTotals: Record<string, number> = {};

    for (const file of files) {
      const slug = file.replace(/\.json$/, "");
      const map = JSON.parse(readFileSync(join(dir!, file), "utf8")) as RoadmapShMap;
      const { document, report } = fromRoadmapSh(map, {
        meta: { source: `https://roadmap.sh/${slug}.json` },
      });
      const parsed = safeParseRoadmapDocument(document);
      if (!parsed.success) {
        failures.push(`${slug}: ${JSON.stringify(parsed.error.issues.slice(0, 3))}`);
      }
      totalWarnings += report.warnings.length;
      for (const [reason, count] of Object.entries(report.dropped)) {
        droppedTotals[reason] = (droppedTotals[reason] ?? 0) + count;
      }
      rows.push(
        `| ${slug} | ${report.counts.nodesIn} | ${report.counts.nodesOut} | ${report.counts.groupsOut} | ${report.counts.edgesIn} | ${report.counts.edgesOut} | ${report.warnings.length} |`,
      );
    }

    const reportPath = process.env.ROADMAP_CORPUS_REPORT;
    if (reportPath) {
      const header = [
        `# roadmap.sh corpus round trip — ${files.length} maps`,
        "",
        `Converted with \`convert/fromRoadmapSh.ts\`; every document then re-validated with \`roadmapDocumentSchema\`.`,
        "",
        `- maps converted: **${files.length}**`,
        `- validation errors: **${failures.length}**`,
        `- warnings: **${totalWarnings}**`,
        `- dropped by reason: ${Object.entries(droppedTotals)
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => `\`${k}\` ${v}`)
          .join(", ")}`,
        "",
        "| slug | nodes in | nodes out | groups | edges in | edges out | warnings |",
        "|---|---|---|---|---|---|---|",
      ].join("\n");
      mkdirSync(dirname(reportPath), { recursive: true });
      writeFileSync(reportPath, `${header}\n${rows.join("\n")}\n`);
    }

    expect(failures).toEqual([]);
  });

  it("keeps the committed /frontend fixture in step with the converter", () => {
    const source = join(dir!, "frontend.json");
    expect(existsSync(source), `missing ${source}`).toBe(true);
    const map = JSON.parse(readFileSync(source, "utf8")) as RoadmapShMap;
    const { document } = fromRoadmapSh(map, { meta: FRONTEND_META });
    const serialised = `${JSON.stringify(document, null, 2)}\n`;

    const target = fixturePath(FRONTEND_FIXTURE);
    if (process.env.ROADMAP_WRITE_FIXTURES) {
      writeFileSync(target, serialised);
    }
    expect(readFileSync(target, "utf8")).toBe(serialised);
  });
});

describe("the committed /frontend fixture", () => {
  it("carries its provenance and stays a valid document", () => {
    const document = loadFixture(FRONTEND_FIXTURE) as Record<string, unknown>;
    const parsed = safeParseRoadmapDocument(document);
    expect(parsed.success).toBe(true);
    const meta = document.meta as Record<string, unknown>;
    expect(meta.source).toBe(FRONTEND_SOURCE_URL);
    expect(String(meta.license)).toMatch(/NOASSERTION/);
  });

  it("lives outside the published entry — no source file re-exports the converter", () => {
    const roadmapIndex = readFileSync(resolve(__dirname, "..", "index.ts"), "utf8");
    expect(roadmapIndex).not.toMatch(/from\s+["']\.\/convert/);
  });
});
