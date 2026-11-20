// @vitest-environment jsdom
// Origin: agent
import { describe, it, expect, beforeAll } from "vitest";
import { render, within } from "@testing-library/react";
import { DecisionCard } from "../DecisionCard";
import { DecisionStrip } from "../DecisionStrip";
import type { AppRegistryRow } from "../../../../hooks/use-apps-registry";
import { TypeGlyph, DoorMark, BlockingMark, looseKind, KIND_LABELS, DECISION_KINDS } from "../marks";

beforeAll(() => {
  (globalThis as any).ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const CHART = {
  kind: "stacked_bar",
  title: "Agent PRs red, by size",
  unit: "% of PRs",
  categories: ["<=50", "51-200", "201-500"],
  series: [
    { name: "red", status: "red", values: [8.6, 13.3, 19.6] },
    { name: "green", status: "green", values: [91.4, 86.7, 80.4] },
  ],
  marks: [{ option: "A", category: "201-500" }],
  source: "plan example, 3,700 PRs, 30 days",
};

const OPTIONS = [
  { letter: "A", label: "Add the column", description: "Nullable, no default." },
  {
    letter: "B",
    label: "New table",
    details: [
      { label: "What you get", value: "Clean shape" },
      { label: "Merge gate", value: "Tainan" },
    ],
  },
  { letter: "C", label: "Do nothing" },
];

const slots = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>("[data-slot]")).map((el) => el.dataset.slot);

describe("DecisionCard (display)", () => {
  it("renders the five slots in the fixed order", () => {
    const { container } = render(<DecisionCard decisionId="q1" strip={{}} headline="Which shape?" options={OPTIONS} />);
    const card = container.querySelector<HTMLElement>("[data-decision-card='q1']")!;
    expect(card.className).toBe("dc-card dc-card--display");
    expect(card.dataset.size).toBe("display");
    expect(slots(card)).toEqual(["strip", "headline", "visual", "options", "answer"]);
  });

  it("a string headline renders as the card heading; a node renders as given", () => {
    const a = render(<DecisionCard strip={{}} headline="Which shape?" />);
    expect(a.container.querySelector("h3.dc-headline")!.textContent).toBe("Which shape?");
    const b = render(<DecisionCard strip={{}} headline={<h1 id="custom">Custom</h1>} />);
    expect(b.container.querySelector("h3.dc-headline")).toBeNull();
    expect(b.container.querySelector("#custom")!.textContent).toBe("Custom");
  });

  it("lists the options read-only, with letter, label, description and consequence rows", () => {
    const { container } = render(<DecisionCard strip={{}} headline="Q" options={OPTIONS} />);
    const rows = container.querySelectorAll<HTMLElement>("[data-option]");
    expect(rows).toHaveLength(3);
    expect(Array.from(rows).map((r) => r.dataset.letter)).toEqual(["A", "B", "C"]);
    expect(within(rows[0]).getByText("Nullable, no default.")).toBeTruthy();
    expect(rows[1].querySelectorAll("[data-option-detail]")).toHaveLength(2);
    expect(rows[1].querySelector("dt")!.textContent).toBe("What you get");
    // No buttons: display only.
    expect(container.querySelector("button")).toBeNull();
  });

  it("marks the recommended options from the prop and from the option field", () => {
    const { container } = render(
      <DecisionCard
        strip={{}}
        headline="Q"
        options={[...OPTIONS.slice(0, 2), { letter: "C", label: "x", recommended: true }]}
        recommended="b"
        recommendation="B keeps the table count low."
      />,
    );
    const rec = Array.from(container.querySelectorAll<HTMLElement>("[data-option][data-recommended='true']")).map((r) => r.dataset.letter);
    expect(rec).toEqual(["B", "C"]);
    expect(container.querySelector("[data-rec]")!.textContent).toContain("B keeps the table count low.");
  });

  it("the answer slot is an Answer link when answerHref is set, and empty without it", () => {
    const a = render(<DecisionCard strip={{}} headline="Q" answerHref="https://plans.devfellowship.com/questions?q=1" answerNewTab />);
    const link = a.container.querySelector<HTMLAnchorElement>("[data-answer-link]")!;
    expect(link.textContent).toBe("Answer");
    expect(link.getAttribute("href")).toBe("https://plans.devfellowship.com/questions?q=1");
    expect(link.getAttribute("target")).toBe("_blank");
    const b = render(<DecisionCard strip={{}} headline="Q" />);
    expect(b.container.querySelector("[data-slot='answer']")!.childNodes).toHaveLength(0);
  });

  it("optionsSlot and answer replace the defaults (an app with its own controls)", () => {
    const { container } = render(
      <DecisionCard
        size="focus"
        className="qv-stage"
        data-question-id="7"
        strip={{}}
        headline="Q"
        options={OPTIONS}
        optionsSlot={<div id="mine">mine</div>}
        answer={<button type="button">Send</button>}
        answerHref="/ignored"
      />,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toBe("dc-card dc-card--focus qv-stage");
    expect(card.dataset.questionId).toBe("7");
    expect(container.querySelector("[data-option]")).toBeNull();
    expect(container.querySelector("#mine")).toBeTruthy();
    expect(container.querySelector("[data-answer-link]")).toBeNull();
    expect(container.querySelector("[data-slot='answer'] button")!.textContent).toBe("Send");
  });
});

describe("DecisionCard visual slot", () => {
  it("draws a valid chart as SVG with the source line and a hidden table", () => {
    const { container } = render(<DecisionCard strip={{}} headline="Q" options={OPTIONS} chart={CHART} />);
    const slot = container.querySelector<HTMLElement>("[data-slot='visual']")!;
    expect(slot.dataset.chartKind).toBe("stacked_bar");
    expect(slot.querySelectorAll("[data-chart-group]")).toHaveLength(3);
    expect(slot.querySelectorAll("rect[data-chart-bar]")).toHaveLength(6);
    expect(slot.querySelector("[data-chart-mark='A']")).toBeTruthy();
    expect(slot.querySelector(".dc-chart-source")!.textContent).toBe(`Source: ${CHART.source}`);
    expect(slot.querySelector("[data-testid='dc-chart-table']")).toBeTruthy();
  });

  it("a chart that is not valid renders nothing (the slot stays empty)", () => {
    const { container } = render(<DecisionCard strip={{}} headline="Q" chart={{ ...CHART, kind: "pie" }} />);
    const slot = container.querySelector<HTMLElement>("[data-slot='visual']")!;
    expect(slot.childNodes).toHaveLength(0);
    expect(slot.dataset.chartKind).toBeUndefined();
  });

  it("a chart mark for an option the card does not have makes the chart invalid", () => {
    const { container } = render(
      <DecisionCard strip={{}} headline="Q" options={[{ letter: "B", label: "b" }]} chart={CHART} />,
    );
    expect(container.querySelector("[data-slot='visual']")!.childNodes).toHaveLength(0);
  });

  it("a visual node wins over the chart and gets the slot attributes", () => {
    const { container } = render(
      <DecisionCard strip={{}} headline="Q" chart={CHART} visual={<figure id="er" />} visualAttrs={{ "data-diagram-id": "d1" }} />,
    );
    const slot = container.querySelector<HTMLElement>("[data-slot='visual']")!;
    expect(slot.querySelector("#er")).toBeTruthy();
    expect(slot.querySelector("[data-testid='dc-chart']")).toBeNull();
    expect(slot.dataset.diagramId).toBe("d1");
  });
});

describe("DecisionStrip", () => {
  it("name mode: the dfl-os text strip (slugs joined, tooltip by source)", () => {
    const { container } = render(
      <DecisionStrip
        appDisplay="name"
        strip={{ apps: ["os", "schema"], appsFrom: "plan", kind: "schema_data", door: "one_way", blocking: true, plan: { title: "P4", href: "/p4", slug: "p4" }, number: 2, round: 1, hasCard: true }}
      />,
    );
    const strip = container.querySelector<HTMLElement>("[data-slot='strip']")!;
    expect(strip.dataset.hasCard).toBe("true");
    const app = strip.querySelector<HTMLElement>("[data-strip='app']")!;
    expect(app.textContent).toBe("os + schema");
    expect(app.dataset.tip).toBe("App of the plan · os + schema");
    expect(strip.querySelector<HTMLElement>("[data-strip='type']")!.textContent).toBe("Schema/Data");
    expect(strip.querySelector<HTMLElement>("[data-strip='door']")!.className).toBe("dc-door dc-door--one_way");
    expect(strip.querySelector<HTMLElement>("[data-strip='blocking']")!.dataset.blocking).toBe("true");
    const plan = strip.querySelector<HTMLAnchorElement>("[data-strip='plan']")!;
    expect(plan.getAttribute("href")).toBe("/p4");
    expect(plan.dataset.tip).toBe("Open plan · p4");
    expect(strip.querySelector<HTMLElement>("[data-strip='number']")!.dataset.tip).toBe("Question 2 of round 1");
  });

  it("mark mode (default): the apps as an AppMark stack, at most 3", () => {
    const { container } = render(<DecisionStrip strip={{ apps: ["os", "schema", "board", "wiki"] }} />);
    const app = container.querySelector<HTMLElement>("[data-strip='app']")!;
    expect(app.dataset.apps).toBe("os schema board");
    expect(app.querySelector("[data-appmark-stack]")).toBeTruthy();
    expect(app.querySelectorAll("[data-appmark]")).toHaveLength(3);
  });

  it("mark mode keeps ONE app tooltip (data-tip) and shows the names next to the marks", () => {
    const { container } = render(<DecisionStrip strip={{ apps: ["seo", "campanhas"], appsFrom: "card" }} />);
    const app = container.querySelector<HTMLElement>("[data-strip='app']")!;
    expect(app.dataset.tip).toBe("App · seo + campanhas");
    expect(app.tabIndex).toBe(0);
    expect(app.querySelector(".dc-app-name")!.textContent).toBe("seo + campanhas");
    // The inner marks carry no tooltip and no tab stop of their own: one tip, one stop.
    expect(app.querySelectorAll("[data-appmark][tabindex]")).toHaveLength(0);
    const plan = render(<DecisionStrip strip={{ apps: ["os"], appsFrom: "plan" }} />).container.querySelector<HTMLElement>("[data-strip='app']")!;
    expect(plan.dataset.tip).toBe("App of the plan · os");
  });

  it("mark mode shows the registry name when the row is passed", () => {
    const row = { slug: "seo", name: "SEO", icon_slug: "seo" } as unknown as AppRegistryRow;
    const { container } = render(<DecisionStrip strip={{ apps: [row] }} />);
    const app = container.querySelector<HTMLElement>("[data-strip='app']")!;
    expect(app.querySelector(".dc-app-name")!.textContent).toBe("SEO");
    expect(app.dataset.tip).toBe("App · seo");
  });

  it("no apps, no type, no door: those parts render nothing; blocking off still renders", () => {
    const { container } = render(<DecisionStrip strip={{}} />);
    const strip = container.querySelector<HTMLElement>("[data-slot='strip']")!;
    expect(strip.querySelector("[data-strip='app']")).toBeNull();
    expect(strip.querySelector("[data-strip='type']")).toBeNull();
    expect(strip.querySelector("[data-strip='door']")).toBeNull();
    expect(strip.querySelector<HTMLElement>("[data-strip='blocking']")!.dataset.blocking).toBe("false");
    expect(strip.querySelector(".dc-meta")).toBeNull();
  });

  it("the type renders as the glyph and the word with typeForm labeled (strip 1)", () => {
    const { container } = render(<DecisionStrip strip={{ kind: "strategy" }} typeForm="labeled" />);
    const t = container.querySelector<HTMLElement>("[data-strip='type']")!;
    expect(t.className).toBe("dc-type dc-type--labeled");
    expect(t.dataset.glyphForm).toBe("labeled");
    expect(t.textContent).toBe("Strategy");
    expect(t.querySelector("svg")).toBeTruthy();
    expect(t.dataset.tip).toBe("Decision type · Strategy · direction, market, positioning");
  });

  it("the type renders as an icon with strip 2", () => {
    const { container } = render(<DecisionStrip strip={{ kind: "money" }} typeForm="icon" />);
    const t = container.querySelector<HTMLElement>("[data-strip='type']")!;
    expect(t.className).toBe("dc-type dc-type--icon");
    expect(t.getAttribute("aria-label")).toBe("Decision type · Money · cost, price, budget");
    expect(t.querySelector("svg")).toBeTruthy();
  });
});

describe("marks", () => {
  it("null values render nothing; an unknown raw type is a neutral dot", () => {
    expect(render(<TypeGlyph kind={null} />).container.firstChild).toBeNull();
    expect(render(<DoorMark door={null} />).container.firstChild).toBeNull();
    const raw = render(<TypeGlyph kind={null} raw="legal" />).container.querySelector<HTMLElement>("[data-glyph-form='icon']")!;
    expect(raw.title).toBe("Decision type · legal");
    expect(raw.querySelector("circle")).toBeTruthy();
    expect(render(<BlockingMark on={false} />).container.querySelector("[data-blocking='false']")).toBeTruthy();
  });

  it("looseKind maps loose spellings to the closed list", () => {
    expect(looseKind("Schema")).toBe("schema_data");
    expect(looseKind("ux")).toBe("product_ux");
    expect(looseKind("tech")).toBe("architecture");
    expect(looseKind("")).toBeNull();
    expect(looseKind("weather")).toBeNull();
    expect(DECISION_KINDS.every((k) => KIND_LABELS[k])).toBe(true);
  });
});

describe("contextFacets (plans.plan_questions.context_facets)", () => {
  it("fills the strip and the chart from the stored facets", () => {
    const { container } = render(
      <DecisionCard
        headline="Q"
        options={OPTIONS}
        contextFacets={{ kind: "schema_data", door: "two-way", app_slugs: ["schema", " schema ", "os"], chart: CHART }}
      />,
    );
    const strip = container.querySelector<HTMLElement>("[data-slot='strip']")!;
    expect(strip.dataset.hasCard).toBe("true");
    expect(strip.querySelector<HTMLElement>("[data-strip='type']")!.dataset.kind).toBe("schema_data");
    expect(strip.querySelector<HTMLElement>("[data-strip='door']")!.dataset.door).toBe("two_way");
    expect(strip.querySelector<HTMLElement>("[data-strip='app']")!.dataset.apps).toBe("schema os");
    expect(container.querySelector<HTMLElement>("[data-slot='visual']")!.dataset.chartKind).toBe("stacked_bar");
  });

  it("a JSON string works; strip fields win; an unknown kind is dropped", () => {
    const { container } = render(
      <DecisionCard headline="Q" strip={{ door: "one_way" }} contextFacets={JSON.stringify({ kind: "weather", door: "two_way" })} />,
    );
    expect(container.querySelector("[data-strip='type']")).toBeNull();
    expect(container.querySelector<HTMLElement>("[data-strip='door']")!.dataset.door).toBe("one_way");
  });

  it("a facets diagram keeps the slot for the host diagram and drops the facets chart", () => {
    const { container } = render(<DecisionCard headline="Q" contextFacets={{ diagram_id: "d9", chart: CHART }} />);
    const slot = container.querySelector<HTMLElement>("[data-slot='visual']")!;
    expect(slot.dataset.diagramId).toBe("d9");
    expect(slot.querySelector("[data-testid='dc-chart']")).toBeNull();
  });

  it("no facets: hasCard false, nothing filled", () => {
    const { container } = render(<DecisionCard headline="Q" contextFacets={null} />);
    expect(container.querySelector<HTMLElement>("[data-slot='strip']")!.dataset.hasCard).toBe("false");
  });
});
