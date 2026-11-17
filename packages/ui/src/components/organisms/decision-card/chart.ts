/**
 * The micro-chart of a decision, for the visual slot of `DecisionCard`.
 *
 * Moved from dfl-os `ui/src/lib/questionChart.js` (plan
 * 20261115-dc-p4-micro-diagram-on-question, T5). The source of truth of the
 * card is now this package (Plans App Q 84ba7b63 = A).
 *
 * `card.chart` holds static numbers that the author copied from the context,
 * with a required `source` line. The post path checks the contract when a
 * question is posted (dfl-services dfl-os-commands, DC P4 T4). The card checks
 * it again here, because the card is the last reader: a chart that is not
 * valid, or is over a limit, renders NOTHING (no error text).
 *
 * SYNC HAZARD: keep QUESTION_CHART_LIMITS equal to the post-path chart limits.
 *
 * Pure functions only: the component maps `chartLayout` to SVG.
 */

export type ChartKind = "bar" | "stacked_bar" | "line";
export type ChartStatus = "green" | "red" | "amber" | "neutral";
export type ChartMark = { option: string; category: string } | { option: string; value: number };

export interface QuestionChart {
  kind: ChartKind;
  title: string | null;
  unit: string;
  categories: string[];
  series: { name: string; status: ChartStatus | null; values: number[] }[];
  marks: ChartMark[];
  source: string;
}

export const QUESTION_CHART_LIMITS = Object.freeze({
  kinds: Object.freeze(["bar", "stacked_bar", "line"] as const),
  statuses: Object.freeze(["green", "red", "amber", "neutral"] as const),
  seriesMax: 3,
  categoriesMax: 8,
  labelMax: 30,
  sourceMax: 120,
  // The title is a sentence, not a label.
  titleMax: 120,
});

/** Under this slot width a diagram or a chart is not legible: the slot shows a link. */
export const MIN_CHART_WIDTH = 320;

const len = (s: string) => [...s].length;
const text = (v: unknown, max: number): string | null =>
  typeof v === "string" && v.trim() && len(v.trim()) <= max ? v.trim() : null;
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/**
 * `card.chart` -> a clean chart, or null when it is not valid or over a limit.
 * `optionLetters` (the question's option letters): a mark must name one of them.
 */
export function readChart(raw: unknown, optionLetters: readonly string[] | null = null): QuestionChart | null {
  const L = QUESTION_CHART_LIMITS;
  if (!isObject(raw)) return null;
  const kind = (L.kinds as readonly string[]).includes(raw.kind as string) ? (raw.kind as ChartKind) : null;
  if (!kind) return null;
  let title: string | null = null;
  if (raw.title !== undefined && raw.title !== null) {
    title = text(raw.title, L.titleMax);
    if (!title) return null;
  }
  const unit = text(raw.unit, L.labelMax);
  const source = text(raw.source, L.sourceMax);
  if (!unit || !source) return null;

  if (!Array.isArray(raw.categories)) return null;
  const cats = raw.categories.map((c) => text(c, L.labelMax));
  const minCategories = kind === "line" ? 2 : 1;
  if (cats.length < minCategories || cats.length > L.categoriesMax || cats.includes(null)) return null;
  const categories = cats as string[];
  if (new Set(categories).size !== categories.length) return null;

  if (!Array.isArray(raw.series) || raw.series.length < 1 || raw.series.length > L.seriesMax) return null;
  const series: QuestionChart["series"] = [];
  for (const s of raw.series) {
    if (!isObject(s)) return null;
    const name = text(s.name, L.labelMax);
    if (!name || series.some((x) => x.name === name)) return null;
    let status: ChartStatus | null = null;
    if (s.status !== undefined && s.status !== null) {
      if (!(L.statuses as readonly string[]).includes(s.status as string)) return null;
      status = s.status as ChartStatus;
    }
    if (!Array.isArray(s.values) || s.values.length !== categories.length || !s.values.every(finite)) return null;
    const values = s.values as number[];
    // Bars start at 0: a negative bar has no place on that axis.
    if (kind !== "line" && values.some((v) => v < 0)) return null;
    series.push({ name, status, values: [...values] });
  }

  const marks: ChartMark[] = [];
  if (raw.marks !== undefined && raw.marks !== null) {
    if (!Array.isArray(raw.marks)) return null;
    const letters = Array.isArray(optionLetters) && optionLetters.length ? optionLetters : null;
    for (const m of raw.marks) {
      if (!isObject(m)) return null;
      const option = typeof m.option === "string" ? m.option.trim().toUpperCase() : "";
      if (!/^[A-Z]$/.test(option) || marks.some((x) => x.option === option)) return null;
      if (letters && !letters.includes(option)) return null;
      const hasCategory = m.category !== undefined && m.category !== null;
      const hasValue = m.value !== undefined && m.value !== null;
      if (hasCategory === hasValue) return null; // exactly one of the two
      if (hasCategory) {
        const category = typeof m.category === "string" ? m.category.trim() : null;
        if (!category || !categories.includes(category)) return null;
        marks.push({ option, category });
      } else {
        if (!finite(m.value)) return null;
        marks.push({ option, value: m.value });
      }
    }
  }
  return { kind, title, unit, categories, series, marks, source };
}

/** The smallest "nice" number (1, 2, 2.5, 5 x 10^n) at or above `v`. */
export function niceCeil(v: number): number {
  if (!(v > 0)) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v - 1e-9) return m * p;
  return 10 * p;
}

/** The value axis. Bars start at 0. A stacked bar sums the series of a category. A line includes 0 too. */
export function chartDomain(chart: QuestionChart): { min: number; max: number; ticks: number[] } {
  const all: number[] = [];
  if (chart.kind === "stacked_bar") {
    chart.categories.forEach((_, i) => all.push(chart.series.reduce((sum, s) => sum + s.values[i], 0)));
  } else {
    for (const s of chart.series) all.push(...s.values);
  }
  for (const m of chart.marks) if ("value" in m) all.push(m.value);
  const hi = Math.max(0, ...all);
  const lo = chart.kind === "line" ? Math.min(0, ...all) : 0;
  const max = hi > 0 ? niceCeil(hi) : lo < 0 ? 0 : 1;
  const min = lo < 0 ? -niceCeil(-lo) : 0;
  const ticks = min < 0 ? [min, 0, max].filter((t, i, a) => a.indexOf(t) === i) : [0, max / 2, max];
  return { min, max, ticks };
}

/** A tick label: at most 3 significant digits, no trailing zeros. */
export function formatTick(v: number): string {
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e6) return `${+(v / 1e6).toPrecision(3)}M`;
  if (a >= 1e4) return `${+(v / 1e3).toPrecision(3)}k`;
  return String(+v.toPrecision(3));
}

/** Cut a label to the room it has (about 6 px a character at 11 px). */
export function fitLabel(label: string, px: number): string {
  const room = Math.max(1, Math.floor(px / 6));
  const chars = [...label];
  return chars.length <= room ? label : `${chars.slice(0, Math.max(1, room - 1)).join("")}…`;
}

/** Series colour class: the status token, else the neutral palette by position. */
export function seriesTone(series: { status: ChartStatus | null }, index: number): string {
  return series.status ? series.status : `n${index % 3}`;
}

export interface ChartBar { x: number; y: number; w: number; h: number; tone: string; value: number; series: string }
export interface ChartGroup { category: string; label: string; x: number; w: number; cx: number; bars: ChartBar[]; top: number }
export interface ChartLayoutMark { option: string; kind: "category" | "value"; category?: string; value?: number; x: number; y: number }
export interface ChartLayout {
  width: number;
  height: number;
  padL: number;
  padR: number;
  padT: number;
  padB: number;
  plotW: number;
  plotH: number;
  y0: number;
  ticks: { value: number; y: number; label: string }[];
  groups: ChartGroup[];
  lines: { series: string; tone: string; points: { x: number; y: number; value: number }[] }[];
  marks: ChartLayoutMark[];
}

/** Pixel layout of a chart in a box of `width` x `height`. Pure: the component maps it to SVG. */
export function chartLayout(chart: QuestionChart, width: number, height: number): ChartLayout {
  const padL = 34;
  const padR = 8;
  const padT = 18; // room for the option letters above the tallest bar
  const padB = 18; // room for the category labels
  const plotW = Math.max(10, width - padL - padR);
  const plotH = Math.max(10, height - padT - padB);
  const { min, max, ticks } = chartDomain(chart);
  const y = (v: number) => padT + plotH - ((v - min) / (max - min)) * plotH;
  const y0 = y(0);
  const n = chart.categories.length;
  const band = plotW / n;
  const groups: ChartGroup[] = chart.categories.map((category, i) => {
    const gx = padL + i * band;
    const inner = band * 0.7;
    const ix = gx + (band - inner) / 2;
    const bars: ChartBar[] = [];
    if (chart.kind === "stacked_bar") {
      let acc = 0;
      chart.series.forEach((s, si) => {
        const v = s.values[i];
        const top = y(acc + v);
        const bottom = y(acc);
        bars.push({ x: ix, y: top, w: inner, h: Math.max(0, bottom - top), tone: seriesTone(s, si), value: v, series: s.name });
        acc += v;
      });
    } else if (chart.kind === "bar") {
      const k = chart.series.length;
      const w = inner / k;
      chart.series.forEach((s, si) => {
        const v = s.values[i];
        const top = y(v);
        bars.push({ x: ix + si * w, y: top, w: Math.max(1, w - (k > 1 ? 1 : 0)), h: Math.max(0, y0 - top), tone: seriesTone(s, si), value: v, series: s.name });
      });
    }
    const top = bars.length
      ? Math.min(...bars.map((b) => b.y))
      : Math.min(...chart.series.map((s) => y(Math.max(0, s.values[i]))));
    return { category, label: fitLabel(category, band - 2), x: gx, w: band, cx: gx + band / 2, bars, top };
  });
  const lines =
    chart.kind === "line"
      ? chart.series.map((s, si) => ({
          series: s.name,
          tone: seriesTone(s, si),
          points: s.values.map((v, i) => ({ x: groups[i].cx, y: y(v), value: v })),
        }))
      : [];
  if (chart.kind === "line") {
    for (const g of groups) {
      const i = chart.categories.indexOf(g.category);
      g.top = Math.min(...lines.map((l) => l.points[i].y));
    }
  }
  // Option letters: above the marked category; two letters on one category sit side by side.
  const perCategory = new Map<string, number>();
  const marks: ChartLayoutMark[] = chart.marks.map((m) => {
    if ("category" in m) {
      const g = groups[chart.categories.indexOf(m.category)];
      const k = perCategory.get(m.category) || 0;
      perCategory.set(m.category, k + 1);
      return { option: m.option, kind: "category", category: m.category, x: g.cx + k * 14, y: Math.max(10, g.top - 6) };
    }
    return { option: m.option, kind: "value", value: m.value, x: padL + plotW, y: y(m.value) };
  });
  // A second letter on one category shifts both, so the pair is centred.
  for (const [category, count] of perCategory) {
    if (count < 2) continue;
    for (const mk of marks) if (mk.category === category) mk.x -= ((count - 1) * 14) / 2;
  }
  return {
    width, height, padL, padR, padT, padB, plotW, plotH, y0,
    ticks: ticks.map((v) => ({ value: v, y: y(v), label: formatTick(v) })),
    groups, lines, marks,
  };
}
