/**
 * DecisionCard — the display part of the DFL Decision Card: one card renders
 * every decision (a plan question, a schema change, any A/B/C choice).
 *
 * The source of truth is the dfl-os card (plans app / OS), moved here so the
 * fleet uses one card (Plans App Q 84ba7b63 = A; plan
 * 20261115-schema-p4-app-map-domain-table, task T7-DC-SHARED). It carries what
 * the Decision Card plans P1 to P4 added: the strip with app marks, type, door
 * and blocking; the card fields; the visual slot for a diagram or a chart.
 *
 * DISPLAY ONLY. No data fetch, no answer state, no app types. Props in, markup
 * out. An app that saves an answer (dfl-os) fills the `options` and `answer`
 * slots with its own controls; an app that only shows the card passes the
 * options as data and gets the read-only option list.
 *
 * Five fixed slots in this order, each with `data-slot`: strip, headline,
 * visual, options, answer. The slots are `display: contents`, so the host
 * class (`className`) owns the spacing. Import the styles once:
 *
 *   import "@devfellowship/components/decision-card.css";
 */
import type { HTMLAttributes, ReactNode } from "react";
import { DecisionStrip, type DecisionStripData } from "./DecisionStrip";
import { DecisionChart } from "./DecisionChart";
import { readChart, type QuestionChart } from "./chart";
import { readContextFacets } from "./facets";
import type { TypeForm } from "./marks";

export interface DecisionCardOptionData {
  /** `A`, `B`, ... */
  letter: string;
  label: ReactNode;
  description?: ReactNode | null;
  /** Marked as recommended (also set by the card `recommended` prop). */
  recommended?: boolean;
  /**
   * Optional consequence rows of the option (for example "What you get",
   * "What it costs", "Merge gate", "Door"). Shown as a definition list.
   */
  details?: ReadonlyArray<{ label: ReactNode; value: ReactNode }>;
  /** Any extra content under the option (for example an ER thumbnail). */
  body?: ReactNode;
}

export type DecisionCardSize = "display" | "focus" | "row" | "stack" | (string & {});

export interface DecisionCardProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The decision id: `data-decision-card`. */
  decisionId?: string;
  as?: "section" | "article" | "div";
  /** A class suffix `dc-card--<size>` and `data-size`. `display` (default) has its own frame style. */
  size?: DecisionCardSize;
  /** Slot 1: app marks, type, door, blocking, plan link, question number. A field set here wins over `contextFacets`. */
  strip?: DecisionStripData;
  /**
   * The context facets of the decision, as stored (`plans.plan_questions.context_facets`,
   * jsonb `{ kind, door, app_slugs, diagram_id, chart }`; an object or a JSON string).
   * They fill the strip (type, door, apps) and the chart. A `diagram_id` keeps the
   * visual slot for the host's diagram (`visual`) and drops the facets chart, and is
   * set as `data-diagram-id` on the slot.
   */
  contextFacets?: unknown;
  typeForm?: TypeForm;
  appDisplay?: "mark" | "name";
  planLinkNewTab?: boolean;
  /** Slot 2: the question. A string renders as the card heading; any other node renders as given. */
  headline: ReactNode;
  /** Under the headline, outside the slots (for example a "Show description" fold). */
  afterHeadline?: ReactNode;
  /** Slot 3: a diagram (any node). Wins over `chart`. */
  visual?: ReactNode;
  /** Slot 3: a micro-chart (`context_facets.chart`). Wins over the facets chart. Checked with `readChart`; a chart that is not valid renders nothing. */
  chart?: QuestionChart | unknown;
  /** Extra attributes of the visual slot element (for example `data-diagram-id`). */
  visualAttrs?: Record<string, string | undefined>;
  /** Slot 4: the options as data, shown as the read-only option list. */
  options?: ReadonlyArray<DecisionCardOptionData>;
  /** The recommended letter(s). Marks those options. */
  recommended?: string | ReadonlyArray<string> | null;
  /** The recommendation in words, under the options. */
  recommendation?: ReactNode;
  /** Slot 4 override: your own option controls. Replaces the read-only list. */
  optionsSlot?: ReactNode;
  /** Slot 5: your own answer controls. */
  answer?: ReactNode;
  /** Slot 5 default when `answer` is absent: an "Answer" link (for example to the question in the Plans App). */
  answerHref?: string | null;
  answerLabel?: ReactNode;
  answerNewTab?: boolean;
  /** After the slots (for example a modal). */
  after?: ReactNode;
}

const letters = (v: DecisionCardProps["recommended"]): string[] =>
  v == null ? [] : (typeof v === "string" ? [v] : [...v]).map((l) => l.trim().toUpperCase()).filter(Boolean);

export function DecisionCard({
  decisionId,
  as: Root = "section",
  size = "display",
  strip: stripProp,
  contextFacets,
  typeForm,
  appDisplay,
  planLinkNewTab,
  headline,
  afterHeadline,
  visual,
  chart,
  visualAttrs,
  options,
  recommended,
  recommendation,
  optionsSlot,
  answer,
  answerHref,
  answerLabel = "Answer",
  answerNewTab = false,
  after,
  className,
  ...rest
}: DecisionCardProps) {
  const facets = contextFacets != null ? readContextFacets(contextFacets) : null;
  const strip: DecisionStripData = {
    ...stripProp,
    kind: stripProp?.kind ?? facets?.kind ?? null,
    door: stripProp?.door ?? facets?.door ?? null,
    apps: stripProp?.apps ?? facets?.appSlugs ?? [],
    appsFrom: stripProp?.appsFrom ?? (stripProp?.apps ? undefined : facets?.appSlugs.length ? "card" : undefined),
    hasCard: stripProp?.hasCard ?? Boolean(facets),
  };
  const diagramId = facets?.diagramId ?? null;
  // A diagram wins over a chart (DC P4): the facets chart counts only without a facets diagram.
  const rawChart = chart ?? (diagramId ? null : facets?.chart ?? null);
  const optionLetters = (options ?? []).map((o) => o.letter);
  const checkedChart = visual == null && rawChart != null ? readChart(rawChart, optionLetters.length ? optionLetters : null) : null;
  const recLetters = letters(recommended);

  const headlineNode =
    typeof headline === "string" ? <h3 className="dc-headline" data-headline="">{headline}</h3> : headline;

  const optionsNode =
    optionsSlot !== undefined ? (
      optionsSlot
    ) : options && options.length > 0 ? (
      <>
        <ol className="dc-options" data-options="">
          {options.map((o) => (
            <DecisionOptionRow key={o.letter} option={o} recommended={Boolean(o.recommended) || recLetters.includes(o.letter.toUpperCase())} />
          ))}
        </ol>
        {recommendation ? (
          <p className="dc-rec" data-rec="">
            <span className="dc-rec-label">Recommendation</span> {recommendation}
          </p>
        ) : null}
      </>
    ) : recommendation ? (
      <p className="dc-rec" data-rec="">
        <span className="dc-rec-label">Recommendation</span> {recommendation}
      </p>
    ) : null;

  const answerNode =
    answer !== undefined ? (
      answer
    ) : answerHref ? (
      <div className="dc-answer">
        <a
          className="dc-answer-link"
          data-answer-link=""
          href={answerHref}
          {...(answerNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {answerLabel}
        </a>
      </div>
    ) : null;

  return (
    <Root
      className={`dc-card dc-card--${size}${className ? ` ${className}` : ""}`}
      data-decision-card={decisionId}
      data-size={size}
      {...rest}
    >
      <DecisionStrip strip={strip} typeForm={typeForm} appDisplay={appDisplay} planLinkNewTab={planLinkNewTab} />
      <div className="dc-slot" data-slot="headline">
        {headlineNode}
      </div>
      {afterHeadline}
      {/* One visual: a diagram or a chart. Empty, and so hidden, when there is none or the chart is not valid. */}
      <div className="dc-slot dc-visual" data-slot="visual" data-diagram-id={diagramId ?? undefined} data-chart-kind={checkedChart?.kind ?? undefined} {...visualAttrs}>
        {visual != null ? visual : checkedChart ? <DecisionChart chart={checkedChart} href={strip.plan?.href ?? null} /> : null}
      </div>
      <div className="dc-slot" data-slot="options">
        {optionsNode}
      </div>
      <div className="dc-slot" data-slot="answer">
        {answerNode}
      </div>
      {after}
    </Root>
  );
}

/** One read-only option row: letter, label, description, consequence rows, extra body, recommended mark. */
export function DecisionOptionRow({ option, recommended = false }: { option: DecisionCardOptionData; recommended?: boolean }) {
  return (
    <li
      className={`dc-option${recommended ? " dc-option--rec" : ""}`}
      data-option=""
      data-letter={option.letter}
      data-recommended={recommended ? "true" : undefined}
    >
      <span className="dc-option-letter" aria-hidden="true">
        {option.letter}
      </span>
      <span className="dc-option-body">
        <span className="dc-option-label">
          <span className="dc-sr">{`Option ${option.letter}: `}</span>
          {option.label}
          {recommended ? (
            <span className="dc-option-rec" data-option-recommended="">
              recommended
            </span>
          ) : null}
        </span>
        {option.description ? <span className="dc-option-desc">{option.description}</span> : null}
        {option.details && option.details.length > 0 ? (
          <dl className="dc-option-details">
            {option.details.map((d, i) => (
              <div key={i} className="dc-option-detail" data-option-detail="">
                <dt>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {option.body ?? null}
      </span>
    </li>
  );
}
