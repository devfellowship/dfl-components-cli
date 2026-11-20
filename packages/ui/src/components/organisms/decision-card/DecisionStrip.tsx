/**
 * The strip of the Decision Card (slot 1 of the approved canvas): app, type,
 * door, blocking, then the plan title as a link and the question number on the
 * right. Moved from dfl-os (plan 20261115-dc-p2-one-decision-card T3).
 *
 * Every icon has a tooltip on hover, tap and focus (`data-tip`, styled in
 * `decision-card.css`; `tabIndex=0` makes a tap focus it). A missing type or
 * door renders nothing, no placeholder.
 *
 * The apps show as `AppMark` icons plus their names (`appDisplay="mark"`, default,
 * strip 1 of the canvas) or as their names in text only (`appDisplay="name"`). Both
 * forms carry ONE `data-tip` on `[data-strip="app"]` ("App · os + schema").
 */
import { AppMarkStack } from "../../molecules/AppMark";
import { useAppsRegistry, type AppRegistryRow } from "../../../hooks/use-apps-registry";
import { BlockingMark, DoorMark, TypeGlyph, MAX_DECISION_APPS, type DecisionDoor, type DecisionKind, type TypeForm } from "./marks";

export type DecisionApp = string | AppRegistryRow;

export interface DecisionStripData {
  /** 0 to 3 apps: slugs (`apps.apps.slug`) or registry rows. */
  apps?: readonly DecisionApp[];
  /** Where the apps come from: the card itself, or the plan of the question. Changes the tooltip only. */
  appsFrom?: "card" | "plan" | "none";
  kind?: DecisionKind | null;
  door?: DecisionDoor | null;
  blocking?: boolean;
  /** The plan of the question, as a link. `slug` names it in the tooltip (else the title). */
  plan?: { title: string; href: string; slug?: string | null } | null;
  /** The question number in its round (`Q3`). */
  number?: number | null;
  round?: number | null;
  /** The question has a stored `card` (a data attribute only). */
  hasCard?: boolean;
}

export interface DecisionStripProps {
  strip: DecisionStripData;
  /** The type as a word (default), an icon, or `labeled`: the glyph and the word. */
  typeForm?: TypeForm;
  /** Apps as `AppMark` icons plus names (default) or as their slugs in text. */
  appDisplay?: "mark" | "name";
  /** Open the plan link in a new tab. */
  planLinkNewTab?: boolean;
}

const appSlug = (a: DecisionApp) => (typeof a === "string" ? a : a.slug);

export function DecisionStrip({ strip, typeForm = "word", appDisplay = "mark", planLinkNewTab = false }: DecisionStripProps) {
  const registry = useAppsRegistry();
  const apps = (strip.apps ?? []).slice(0, appDisplay === "mark" ? MAX_DECISION_APPS : undefined);
  const slugs = apps.map(appSlug);
  const appNames = slugs.join(" + ");
  // The visible name: the registry name when a provider has the row, else the slug.
  const shownNames = apps.map((a) => (typeof a === "string" ? registry.find(a)?.name || a : a.name || a.slug)).join(" + ");
  const appsFrom = strip.appsFrom ?? (apps.length ? "card" : "none");
  const blocking = Boolean(strip.blocking);
  const door = strip.door ?? null;
  const rows = apps.every((a) => typeof a !== "string") ? (apps as AppRegistryRow[]) : undefined;
  return (
    <div className="dc-strip" data-slot="strip" data-has-card={strip.hasCard ? "true" : "false"}>
      {apps.length > 0 &&
        (appDisplay === "name" ? (
          <span
            className="dc-app"
            data-strip="app"
            data-apps-from={appsFrom}
            tabIndex={0}
            data-tip={appsFrom === "plan" ? `App of the plan · ${appNames}` : `App · ${appNames}`}
          >
            {appNames}
          </span>
        ) : (
          <span
            className="dc-app dc-app--marks"
            data-strip="app"
            data-apps-from={appsFrom}
            data-apps={slugs.join(" ")}
            tabIndex={0}
            data-tip={appsFrom === "plan" ? `App of the plan · ${appNames}` : `App · ${appNames}`}
          >
            <AppMarkStack apps={rows} slugs={rows ? undefined : slugs} size={20} tooltip={false} />
            <span className="dc-app-name">{shownNames}</span>
          </span>
        ))}
      <TypeGlyph
        kind={strip.kind ?? null}
        form={typeForm}
        className={`dc-type${typeForm === "icon" ? " dc-type--icon" : typeForm === "labeled" ? " dc-type--labeled" : ""}`}
        attrs={{ "data-strip": "type" }}
      />
      <span className="dc-marks">
        <DoorMark door={door} className={`dc-door dc-door--${door}`} attrs={{ "data-strip": "door" }} />
        <BlockingMark on={blocking} className={`dc-block${blocking ? " is-on" : ""}`} attrs={{ "data-strip": "blocking" }} />
      </span>
      {(strip.plan || strip.number != null) && (
        <span className="dc-meta">
          {strip.plan && (
            <a
              className="dc-plan"
              data-strip="plan"
              href={strip.plan.href}
              data-tip={`Open plan · ${strip.plan.slug || strip.plan.title}`}
              {...(planLinkNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {strip.plan.title}
            </a>
          )}
          {strip.number != null && (
            <span
              className="dc-qn"
              data-strip="number"
              tabIndex={0}
              data-tip={strip.round != null ? `Question ${strip.number} of round ${strip.round}` : `Question ${strip.number} of its round`}
            >
              Q{strip.number}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
