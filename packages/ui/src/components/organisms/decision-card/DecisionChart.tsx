/**
 * DecisionChart — the micro-chart in the visual slot of `DecisionCard`. It
 * draws a checked chart (`readChart`) as hand-written inline SVG: no chart
 * library, so the card bundle grows by a few kB only.
 *
 * Moved from dfl-os (plan 20261115-dc-p4-micro-diagram-on-question, T5,
 * dfl-os PR #478).
 *
 *   bar          one bar per series in each category group
 *   stacked_bar  the status split of each category (for example red / green)
 *   line         one line per series, a point per category
 *
 * Bars start at 0. Colours are the status tokens (`decision-card.css`
 * `.dc-chart-t--*`), so the chart follows the theme. Each option mark is the
 * option letter on its category (or a dashed line at its value). The `source`
 * line sits under the chart. The SVG is hidden from screen readers; a visually
 * hidden table carries the same numbers.
 *
 * The figure has the fixed height of the diagram box: the options never move.
 * In a slot narrower than 320 px the slot shows a link (`href`) in place of
 * the chart; the hidden table stays.
 */
import { useLayoutEffect, useState } from "react";
import { chartLayout, MIN_CHART_WIDTH, seriesTone, type QuestionChart } from "./chart";

/** The SVG height inside the 220 px box (box padding, title row, source row). */
const SVG_H = 150;
/** Before the first measure (the layout effect runs before paint). */
const DEFAULT_W = 480;

export interface DecisionChartProps {
  chart: QuestionChart;
  /** Where the narrow-slot link goes (for example the plan of the question). No link when null. */
  href?: string | null;
}

export function DecisionChart({ chart, href = null }: DecisionChartProps) {
  const [el, ref] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!el) return;
    const read = () => setWidth(Math.round(el.getBoundingClientRect().width));
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);

  const name = chart.title || `Chart (${chart.unit})`;
  const table = <ChartTable chart={chart} name={name} />;

  if (width !== null && width > 0 && width < MIN_CHART_WIDTH) {
    return (
      <div ref={ref} className="dc-diagram dc-diagram--link dc-chart--link" data-chart-state="link" data-testid="dc-chart">
        {href ? (
          <a className="dc-diagram-open" href={href} data-testid="dc-chart-open">
            Chart: {name} · open the plan ↗
          </a>
        ) : (
          <span className="dc-diagram-open">Chart: {name}</span>
        )}
        <p className="dc-chart-source">Source: {chart.source}</p>
        {table}
      </div>
    );
  }

  // The SVG takes the content width of the figure (10 px padding and 1 px border a side).
  const svgW = Math.max(MIN_CHART_WIDTH - 22, (width ?? DEFAULT_W) - 22);
  const L = chartLayout(chart, svgW, SVG_H);
  const legend = chart.series.length > 1 || chart.kind !== "bar";
  return (
    <figure
      ref={ref}
      className="dc-diagram dc-chart"
      data-chart-state="chart"
      data-chart-kind={chart.kind}
      data-testid="dc-chart"
      data-slot-width={width ?? undefined}
      aria-label={`Chart: ${name}`}
    >
      <div className="dc-chart-head">
        <span className="dc-chart-title" title={name}>
          {name}
        </span>
        <span className="dc-chart-unit">{chart.unit}</span>
        {legend ? (
          <span className="dc-chart-legend" aria-hidden="true">
            {chart.series.map((s, i) => (
              <span key={s.name} className="dc-chart-key">
                <i className={`dc-chart-sw dc-chart-t--${seriesTone(s, i)}`} />
                {s.name}
              </span>
            ))}
          </span>
        ) : null}
      </div>
      <svg
        className="dc-chart-svg"
        width={svgW}
        height={SVG_H}
        viewBox={`0 0 ${svgW} ${SVG_H}`}
        aria-hidden="true"
        focusable="false"
        data-testid="dc-chart-svg"
      >
        {L.ticks.map((t) => (
          <g key={t.value} className="dc-chart-tick">
            <line x1={L.padL} x2={L.padL + L.plotW} y1={t.y} y2={t.y} className={t.value === 0 ? "dc-chart-axis" : "dc-chart-grid"} />
            <text x={L.padL - 4} y={t.y} dy="0.32em" textAnchor="end" className="dc-chart-ticklabel">
              {t.label}
            </text>
          </g>
        ))}
        {L.groups.map((g) => (
          <g key={g.category} data-chart-group={g.category}>
            {g.bars.map((b) => (
              <rect
                key={b.series}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                className={`dc-chart-bar dc-chart-t--${b.tone}`}
                data-chart-bar={b.series}
                data-value={b.value}
              />
            ))}
            <text x={g.cx} y={L.padT + L.plotH + 13} textAnchor="middle" className="dc-chart-catlabel">
              {g.label}
              {g.label !== g.category ? <title>{g.category}</title> : null}
            </text>
          </g>
        ))}
        {L.lines.map((l) => (
          <g key={l.series} data-chart-line={l.series} className={`dc-chart-t--${l.tone}`}>
            <polyline className="dc-chart-line" points={l.points.map((p) => `${p.x},${p.y}`).join(" ")} />
            {l.points.map((p, i) => (
              <circle key={i} className="dc-chart-dot" cx={p.x} cy={p.y} r={3} data-value={p.value} />
            ))}
          </g>
        ))}
        {L.marks.map((m) => (
          <g
            key={m.option}
            className="dc-chart-mark"
            data-chart-mark={m.option}
            data-mark-category={m.category ?? undefined}
            data-mark-value={m.value ?? undefined}
          >
            {m.kind === "value" ? <line x1={L.padL} x2={m.x} y1={m.y} y2={m.y} className="dc-chart-markline" /> : null}
            <circle cx={m.kind === "value" ? m.x - 7 : m.x} cy={m.kind === "value" ? m.y - 8 : m.y - 5} r={7} className="dc-chart-markdot" />
            <text
              x={m.kind === "value" ? m.x - 7 : m.x}
              y={m.kind === "value" ? m.y - 8 : m.y - 5}
              dy="0.35em"
              textAnchor="middle"
              className="dc-chart-markletter"
            >
              {m.option}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="dc-chart-source">Source: {chart.source}</figcaption>
      {table}
    </figure>
  );
}

/** The same numbers for a screen reader: one row per category, one column per series, then the marks. */
function ChartTable({ chart, name }: { chart: QuestionChart; name: string }) {
  const marksOf = (category: string) =>
    chart.marks.filter((m) => "category" in m && m.category === category).map((m) => m.option);
  const valueMarks = chart.marks.filter((m): m is { option: string; value: number } => "value" in m);
  return (
    // A table ignores a 1 px width: the wrapper is the visually hidden box.
    <div className="dc-chart-sr">
      <table data-testid="dc-chart-table">
        <caption>{`${name} (${chart.unit}). Source: ${chart.source}`}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            {chart.series.map((s) => (
              <th key={s.name} scope="col">
                {s.name}
              </th>
            ))}
            <th scope="col">Options</th>
          </tr>
        </thead>
        <tbody>
          {chart.categories.map((c, i) => (
            <tr key={c}>
              <th scope="row">{c}</th>
              {chart.series.map((s) => (
                <td key={s.name}>{s.values[i]}</td>
              ))}
              <td>{marksOf(c).map((o) => `Option ${o}`).join(", ")}</td>
            </tr>
          ))}
          {valueMarks.map((m) => (
            <tr key={m.option}>
              <th scope="row">{`Option ${m.option}`}</th>
              <td colSpan={chart.series.length + 1}>{`${m.value} ${chart.unit}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
