import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";

import {
  DEFAULT_EDGE_ARROW,
  DEFAULT_EDGE_ROUTE,
  DEFAULT_EDGE_STYLE,
  DEFAULT_GROUP_TONE,
  parseRoadmapDocument,
  parseRoadmapStateOverlay,
  resolveEdgeArrow,
  resolveEdgeRoute,
  resolveEdgeStyle,
  resolveGroupColumns,
  resolveGroupTone,
  resolveNodeSpan,
  resolveNodeState,
  resolveNodeTone,
  safeParseRoadmapDocument,
  safeParseRoadmapStateOverlay,
} from "../contract";
import type { RoadmapDocument } from "../contract";
import { fixturePath, loadFixture } from "../__fixtures__/load";

/**
 * The contract is the deliverable of round R1. These tests hold two lines.
 *
 * 1. A DOCUMENT THAT IS WRONG IS REJECTED, at a named path. A schema that only
 *    accepts the good cases proves nothing; the malformed fixtures are the half
 *    that carries the information, so each one asserts the exact `path` a caller
 *    would show its author.
 * 2. Every shipped fixture parses. `vocabulary.json` is the compact example of
 *    the plan, `long-5000.json` is the tall map, `roadmapsh-frontend.json` is
 *    the converted 137-node fidelity map.
 */

const valid = () => loadFixture("vocabulary.json") as RoadmapDocument;

describe("roadmapDocumentSchema — the malformed documents are rejected", () => {
  const cases: { file: string; path: (string | number)[]; code?: string; match: RegExp }[] = [
    {
      file: "wrong-version.json",
      path: ["version"],
      code: "invalid_literal",
      match: /roadmap\/v1/,
    },
    { file: "duplicate-node-id.json", path: ["nodes", 1, "id"], match: /duplicate node id "a"/ },
    { file: "duplicate-cell.json", path: ["nodes", 1, "order"], match: /already taken/ },
    {
      file: "dangling-edge-target.json",
      path: ["edges", 0, "target"],
      match: /"nowhere" is not a node/,
    },
    {
      file: "hex-tone.json",
      path: ["nodes", 0, "tone"],
      code: "invalid_enum_value",
      match: /primary/,
    },
    {
      file: "group-from-after-to.json",
      path: ["groups", 0, "to"],
      match: /from \(3\) greater than to \(1\)/,
    },
  ];

  for (const testCase of cases) {
    it(`rejects ${testCase.file} at ${testCase.path.join(".")}`, () => {
      const result = safeParseRoadmapDocument(loadFixture("malformed", testCase.file));
      expect(result.success).toBe(false);
      if (result.success) return;
      const issue = result.error.issues.find(
        (candidate) => candidate.path.join(".") === testCase.path.join("."),
      );
      expect(
        issue,
        `no issue at path ${testCase.path.join(".")}; got ${JSON.stringify(
          result.error.issues.map((i) => i.path.join(".")),
        )}`,
      ).toBeDefined();
      if (testCase.code) expect(issue?.code).toBe(testCase.code);
      expect(issue?.message).toMatch(testCase.match);
    });
  }

  it("throws a ZodError from parseRoadmapDocument, not a plain Error", () => {
    expect(() => parseRoadmapDocument(loadFixture("malformed", "hex-tone.json"))).toThrowError(
      /tone/,
    );
  });
});

describe("roadmapDocumentSchema — the shipped fixtures parse", () => {
  it("parses the vocabulary fixture and returns it unchanged", () => {
    const raw = loadFixture("vocabulary.json");
    const parsed = parseRoadmapDocument(raw);
    // The parser applies no defaults: a document round-trips byte-stable, which
    // is what keeps an authored map diffable in git.
    expect(parsed).toEqual(raw);
    expect(parsed.nodes).toHaveLength(16);
    expect(parsed.edges).toHaveLength(10);
    expect(parsed.groups).toHaveLength(2);
  });

  it("parses the generated long map with at least 200 nodes", () => {
    const parsed = parseRoadmapDocument(loadFixture("long-5000.json"));
    expect(parsed.nodes.length).toBeGreaterThanOrEqual(200);
    expect(parsed.groups.length).toBeGreaterThan(0);
  });

  it("parses the converted roadmap.sh /frontend fixture", () => {
    const path = fixturePath("roadmapsh-frontend.json");
    expect(existsSync(path), `missing fixture ${path}`).toBe(true);
    const parsed = parseRoadmapDocument(loadFixture("roadmapsh-frontend.json"));
    expect(parsed.nodes.length).toBeGreaterThan(100);
    // Provenance travels with the fixture — the source URL and the licence note.
    expect(String(parsed.meta?.source)).toContain("roadmap.sh");
    expect(parsed.meta?.license).toBeDefined();
  });
});

describe("roadmapDocumentSchema — the cross-field invariants", () => {
  it("rejects a self-loop", () => {
    const doc = valid();
    doc.edges.push({ id: "loop", source: "net", target: "net" });
    const result = safeParseRoadmapDocument(doc);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.some((i) => /self-loop/.test(i.message))).toBe(true);
  });

  it("rejects a duplicate edge id", () => {
    const doc = valid();
    doc.edges.push({ id: "e1", source: "css", target: "html" });
    const result = safeParseRoadmapDocument(doc);
    expect(result.success).toBe(false);
  });

  it("rejects a badge that names no legend entry", () => {
    const doc = valid();
    doc.nodes[1].badge = "not-an-entry";
    const result = safeParseRoadmapDocument(doc);
    expect(result.success).toBe(false);
    if (result.success) return;
    const issue = result.error.issues.find((i) => i.path.join(".") === "nodes.1.badge");
    expect(issue?.message).toMatch(/not a legend entry/);
  });

  it("rejects a `span: 2` node on the right track — it runs past the grid", () => {
    const doc = valid();
    doc.nodes.push({ id: "wide", column: "right", order: 20, kind: "topic", label: "Wide", span: 2 });
    const result = safeParseRoadmapDocument(doc);
    expect(result.success).toBe(false);
    if (result.success) return;
    const issue = result.error.issues.find((i) => i.path.join(".") === "nodes.16.span");
    expect(issue?.message).toMatch(/runs past the last track/);
  });

  it("accepts a `span: 2` node on the left track and then rejects a node under it", () => {
    const doc = valid();
    doc.nodes.push({ id: "wide", column: "left", order: 20, kind: "topic", label: "Wide", span: 2 });
    expect(safeParseRoadmapDocument(doc).success).toBe(true);
    // A span-2 node occupies BOTH tracks it covers — the centre cell is taken.
    doc.nodes.push({ id: "under", column: "center", order: 20, kind: "topic", label: "Under" });
    expect(safeParseRoadmapDocument(doc).success).toBe(false);
  });

  it("lets two groups share rows only when their columns are disjoint (ADR-3)", () => {
    const disjoint = valid();
    disjoint.groups.push({ id: "g-side", from: 5, to: 5, columns: ["left", "right"] });
    expect(safeParseRoadmapDocument(disjoint).success).toBe(true);

    const clashing = valid();
    clashing.groups.push({ id: "g-clash", from: 5, to: 6, columns: ["center"] });
    const result = safeParseRoadmapDocument(clashing);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.some((i) => /overlaps rows/.test(i.message))).toBe(true);
  });

  it("requires exactly one of href or actionId on an action", () => {
    const both = valid();
    both.nodes[9].action = { label: "Go", href: "/x", actionId: "go" };
    const bothResult = safeParseRoadmapDocument(both);
    expect(bothResult.success).toBe(false);
    if (!bothResult.success) {
      expect(bothResult.error.issues[0].path.join(".")).toBe("nodes.9.action.href");
    }

    const neither = valid();
    neither.nodes[9].action = { label: "Go" };
    expect(safeParseRoadmapDocument(neither).success).toBe(false);

    const onlyActionId = valid();
    onlyActionId.nodes[9].action = { label: "Go", actionId: "open-nodejs" };
    expect(safeParseRoadmapDocument(onlyActionId).success).toBe(true);
  });

  it("rejects an unknown key — the schema is strict", () => {
    const doc = valid() as unknown as Record<string, unknown>;
    doc.layout = "auto";
    expect(safeParseRoadmapDocument(doc).success).toBe(false);
  });

  it("rejects an edge label longer than 40 characters", () => {
    const doc = valid();
    doc.edges[1].label = "x".repeat(41);
    expect(safeParseRoadmapDocument(doc).success).toBe(false);
  });

  it("rejects a node id that breaks the id pattern", () => {
    const doc = valid();
    doc.nodes[0].id = "has a space";
    const result = safeParseRoadmapDocument(doc);
    expect(result.success).toBe(false);
  });
});

describe("the documented defaults", () => {
  it("defaults an edge to dashed, auto and no arrow (ADR-5)", () => {
    const doc = parseRoadmapDocument(loadFixture("vocabulary.json"));
    const fanOut = doc.edges.find((edge) => edge.id === "e4");
    expect(fanOut?.style).toBeUndefined();
    expect(resolveEdgeStyle(fanOut!)).toBe("dashed");
    expect(DEFAULT_EDGE_STYLE).toBe("dashed");
    expect(resolveEdgeRoute(fanOut!)).toBe(DEFAULT_EDGE_ROUTE);
    expect(resolveEdgeArrow(fanOut!)).toBe(DEFAULT_EDGE_ARROW);
  });

  it("defaults a node tone by kind", () => {
    const doc = parseRoadmapDocument(loadFixture("vocabulary.json"));
    const byId = new Map(doc.nodes.map((node) => [node.id, node]));
    expect(resolveNodeTone(byId.get("net")!)).toBe("primary");
    expect(resolveNodeTone(byId.get("how")!)).toBe("secondary");
    expect(resolveNodeTone(byId.get("next")!)).toBe("primary");
    expect(resolveNodeTone(byId.get("go")!)).toBe("neutral");
    // An explicit tone always wins over the kind default.
    expect(resolveNodeTone(byId.get("chk")!)).toBe("accent");
    expect(resolveNodeSpan(byId.get("t")!)).toBe(3);
    expect(resolveNodeSpan(byId.get("net")!)).toBe(1);
  });

  it("defaults a group to neutral over all three columns", () => {
    const doc = parseRoadmapDocument(loadFixture("vocabulary.json"));
    const basics = doc.groups.find((group) => group.id === "g-basics")!;
    expect(resolveGroupTone(basics)).toBe(DEFAULT_GROUP_TONE);
    expect(resolveGroupColumns(basics)).toEqual(["left", "center", "right"]);
    const check = doc.groups.find((group) => group.id === "g-check")!;
    expect(resolveGroupColumns(check)).toEqual(["center"]);
  });
});

describe("RoadmapStateOverlay — the overlay wins (ADR-8)", () => {
  it("parses the overlay fixture", () => {
    const overlay = parseRoadmapStateOverlay(loadFixture("vocabulary.state.json"));
    expect(overlay.version).toBe("roadmap-state/v1");
    expect(overlay.nodes.net).toBe("done");
  });

  it("rejects an unknown state value", () => {
    const bad = { version: "roadmap-state/v1", nodes: { net: "finished" } };
    expect(safeParseRoadmapStateOverlay(bad).success).toBe(false);
  });

  it("overrides the authored state, and ignores an id that is not in the map", () => {
    const doc = parseRoadmapDocument(loadFixture("vocabulary.json"));
    const overlay = parseRoadmapStateOverlay(loadFixture("vocabulary.state.json"));
    const css = doc.nodes.find((node) => node.id === "css")!;
    const chk = doc.nodes.find((node) => node.id === "chk")!;
    // `css` is authored `learning`; the overlay also says `learning`.
    expect(resolveNodeState(css, overlay)).toBe("learning");
    // `html` is authored with no state; the overlay makes it `done`.
    const html = doc.nodes.find((node) => node.id === "html")!;
    expect(resolveNodeState(html)).toBe("todo");
    expect(resolveNodeState(html, overlay)).toBe("done");
    // `dns` is authored with no state; the overlay says `skipped`.
    expect(resolveNodeState(chk, overlay)).toBe("todo");
    // The overlay carries an id no node has. It is ignored, not an error.
    expect(Object.keys(overlay.nodes)).toContain("this-node-does-not-exist");
  });

  it("proves the overlay REALLY wins — a mutated overlay changes the answer", () => {
    const doc = parseRoadmapDocument(loadFixture("vocabulary.json"));
    const css = doc.nodes.find((node) => node.id === "css")!;
    expect(css.state).toBe("learning");
    expect(
      resolveNodeState(css, { version: "roadmap-state/v1", nodes: { css: "done" } }),
    ).toBe("done");
  });
});
