/**
 * DecisionCard stories — one story per state (DS rule: ONE STORY = ONE STATE).
 *
 * The display part of the fleet Decision Card (moved from dfl-os). Apps that
 * save answers fill the `optionsSlot` and `answer` slots with their own controls.
 */
import type { Meta, StoryObj } from "@storybook/react";
import { DecisionCard } from "../components/organisms/decision-card";
import "../styles/decision-card.css";

const OPTIONS = [
  {
    letter: "A",
    label: "Add a nullable JSON column",
    description: "One column on the existing table.",
    details: [
      { label: "What you get", value: "No new table" },
      { label: "Merge gate", value: "Agent (1–3 new columns)" },
      { label: "Door", value: "Two-way" },
    ],
  },
  {
    letter: "B",
    label: "Create a new table",
    description: "A table for the new entity.",
    details: [
      { label: "What you get", value: "A clean shape" },
      { label: "Merge gate", value: "Tainan (new table)" },
      { label: "Door", value: "One-way" },
    ],
  },
  { letter: "C", label: "Do nothing now" },
];

const CHART = {
  kind: "stacked_bar",
  title: "Agent PRs red before merge, by size",
  unit: "% of PRs",
  categories: ["<=50", "51-200", "201-500", "501-1500"],
  series: [
    { name: "red", status: "red", values: [8.6, 13.3, 19.6, 20.8] },
    { name: "green", status: "green", values: [91.4, 86.7, 80.4, 79.2] },
  ],
  marks: [
    { option: "A", category: "201-500" },
    { option: "B", category: "51-200" },
  ],
  source: "example data, 3,700 PRs, 30 days",
};

const meta: Meta<typeof DecisionCard> = {
  title: "Components/Organisms/DecisionCard",
  component: DecisionCard,
  argTypes: {
    typeForm: { control: "select", options: ["word", "icon"] },
    appDisplay: { control: "select", options: ["mark", "name"] },
  },
  args: {
    headline: "Where does the new field live?",
    options: OPTIONS,
    recommended: "A",
    recommendation: "A keeps the table count low and an agent can merge it.",
    strip: {
      plan: { title: "DFL Schema P4", href: "#", slug: "20261115-schema-p4-app-map-domain-table" },
      number: 1,
      round: 1,
    },
    contextFacets: { kind: "schema_data", door: "two_way", app_slugs: ["schema", "os"] },
    answerHref: "#",
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof DecisionCard>;

/** The read-only card: strip, headline, options with consequence rows, recommendation, Answer link. */
export const Default: Story = {};

/** The micro-chart in the visual slot, with the option letters on their categories. */
export const WithChart: Story = { args: { contextFacets: { kind: "process", door: "one_way", app_slugs: ["os"], chart: CHART } } };

/** The type as an icon (strip 2). */
export const TypeAsIcon: Story = { args: { typeForm: "icon" } };

/** Blocking: agents wait on this answer. */
export const Blocking: Story = { args: { strip: { blocking: true, number: 2, round: 1 } } };

/** No facets yet: no type, no door, no apps, only the blocking mark. */
export const NoFacets: Story = { args: { contextFacets: null, strip: {} } };

/** No options: the recommendation and the Answer link only. */
export const NoOptions: Story = { args: { options: [], recommended: null } };
