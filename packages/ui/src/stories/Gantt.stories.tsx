import type { Meta, StoryObj } from "@storybook/react";
import { Gantt, type GanttStage, type GanttDependency } from "../components/organisms/Gantt";

const meta: Meta<typeof Gantt> = {
  title: "Components/Organisms/Gantt",
  component: Gantt,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Gantt>;

// ─── Shared data ─────────────────────────────────────────────────────────────

/** Stage color palette — mapped to DS avatar tokens (--p-amber/blue/lilac/mint/mustard). */
const COLOR_AMBER   = "var(--p-amber,   #E07A4A)";
const COLOR_BLUE    = "var(--p-blue,    #7AA2E0)";
const COLOR_LILAC   = "var(--p-lilac,   #B58FE0)";
const COLOR_MINT    = "var(--p-mint,    #7AE0A2)";
const COLOR_MUSTARD = "var(--p-mustard, #E0B57A)";

// Ported from João's Winter-2025 cohort: 3 stages, sequence-dependency model.
const stages: GanttStage[] = [
  {
    id: "s1",
    title: "Versionamento & Colaboração com Git",
    subtitle: "Onboarding & fundamentos",
    color: COLOR_AMBER,
    weekStart: 1,
    weekSpan: 3,
    milestones: [
      { id: "m1", title: "Fundamentos de Git e GitHub",                  points: 10, done: true, weekStart: 1, weekSpan: 1 },
      { id: "m2", title: "Branching & estratégias de fluxo",             points: 10, done: true, weekStart: 1, weekSpan: 1 },
      { id: "m3", title: "Comandos essenciais & merge",                  points: 10,             weekStart: 2, weekSpan: 1 },
      { id: "m4", title: "Colaboração no GitHub (PRs & boas práticas)",  points: 10,             weekStart: 2, weekSpan: 2 },
    ],
  },
  {
    id: "s2",
    title: "Fundamentos de React",
    subtitle: "Componentes, estado & props",
    color: COLOR_BLUE,
    weekStart: 3,
    weekSpan: 4,
    milestones: [
      { id: "m5", title: "Setup & como o React renderiza",                             points: 10, weekStart: 3, weekSpan: 1 },
      { id: "m6", title: "Estado, props & listas",                                    points: 15, weekStart: 4, weekSpan: 1 },
      { id: "m7", title: "Estilo & componentização",                                  points: 15, weekStart: 5, weekSpan: 1 },
      { id: "m8", title: "App profissional: CRUD, rotas, react-query & auth",         points: 20, weekStart: 6, weekSpan: 1 },
    ],
  },
  {
    id: "s3",
    title: "React Aplicado + Dev Assistido por IA",
    subtitle: "Projeto e-commerce com IA",
    color: COLOR_LILAC,
    weekStart: 6,
    weekSpan: 5,
    milestones: [
      { id: "m9",  title: "Vibe coding com IA (Cursor/ShadCN)",          points: 20, weekStart: 6,  weekSpan: 2 },
      { id: "m10", title: "Padrões avançados de Hooks & Context",        points: 15, weekStart: 8,  weekSpan: 1 },
      { id: "m11", title: "Qualidade & TypeScript na prática",           points: 15, weekStart: 9,  weekSpan: 1 },
      { id: "m12", title: "Arquitetura final & assets do e-commerce",    points: 20, weekStart: 10, weekSpan: 1 },
    ],
  },
];

const dependencies: GanttDependency[] = [
  { from: "s1", to: "s2" },
  { from: "s1", to: "s3" },
  { from: "s2", to: "s3" },
];

// ─── Stories (one story = one state) ─────────────────────────────────────────

/**
 * Default — 3 stages fully expanded, dependency connector arrows, 12-week axis.
 * Baseline render of the Gantt organism.
 */
export const Default: Story = {
  args: { stages, dependencies, weeks: 12 },
};

/**
 * WithMemberHeader — fellow avatar + name + per-stage progress pills
 * rendered in the optional header strip above the grid.
 */
export const WithMemberHeader: Story = {
  args: {
    stages,
    dependencies,
    weeks: 12,
    header: (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold"
            style={{
              background: "var(--p-amber, #E07A4A)",
              color: "var(--s-ink-inverse, #0A0908)",
            }}
          >
            JP
          </span>
          <div>
            <div className="text-[14px] font-semibold text-[var(--s-ink-primary,#F6F1E7)]">
              João Pedro Danhoni
            </div>
            <div className="text-[11px] text-[var(--s-ink-muted,#7D7568)]">
              Full Stack Developer Fellow
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 font-[var(--s-font-mono,monospace)] text-[11px] tabular-nums text-[var(--s-ink-muted,#7D7568)]">
          <span>
            Stage 1{" "}
            <b className="font-semibold text-[var(--s-brand-fg,#F0A872)]">40%</b>
          </span>
          <span>
            Stage 2{" "}
            <b className="font-semibold text-[var(--s-ink-secondary,#C9C0B4)]">0%</b>
          </span>
          <span>
            Stage 3{" "}
            <b className="font-semibold text-[var(--s-ink-secondary,#C9C0B4)]">0%</b>
          </span>
        </div>
      </div>
    ),
  },
};

/**
 * StagesOnly — stagesOnly=true hides all milestone rows.
 * Summary / overview view showing only stage bars and progress.
 */
export const StagesOnly: Story = {
  args: { stages, weeks: 12, stagesOnly: true },
};

/**
 * CollapsedStage — stage 1 starts collapsed (chevron closed, milestones hidden),
 * stage 2 starts expanded. Shows both collapse states side-by-side in the grid.
 */
export const CollapsedStage: Story = {
  args: {
    stages: [
      { ...stages[0], collapsed: true },
      { ...stages[1], collapsed: false },
      { ...stages[2], collapsed: true },
    ],
    weeks: 12,
  },
};

/**
 * Empty — stages=[] renders the 'No stages yet.' empty state message.
 */
export const Empty: Story = {
  args: { stages: [], weeks: 6 },
};

/**
 * MilestoneClickable — onMilestoneClick wired; each milestone title becomes a
 * keyboard-accessible button. This story validates:
 *   • :focus-visible box-shadow ring (2px #0a0908 gap + 1px #E07A4A outer)
 *   • :hover underline on milestone title text
 *
 * Tab to a milestone title to see the canonical brand focus ring.
 */
export const MilestoneClickable: Story = {
  args: {
    stages,
    weeks: 12,
    // eslint-disable-next-line no-console
    onMilestoneClick: (milestone, stage) =>
      console.log("milestone clicked", { milestone, stage }),
  },
};

// ─── Bonus stories (scroll + wide-name; beyond the 6 core work items) ────────

/** Long program — 5 stages across ~19 weeks; exercises horizontal scroll + sticky column. */
const longStages: GanttStage[] = [
  ...stages,
  {
    id: "s4",
    title: "Vibecode com padrões avançados e qualidade de código",
    subtitle: "TypeScript, testes e arquitetura na prática",
    color: COLOR_MINT,
    weekStart: 11,
    weekSpan: 4,
    milestones: [
      { id: "m13", title: "Padrões avançados aplicados a um projeto real", points: 20, weekStart: 11, weekSpan: 2 },
      { id: "m14", title: "Cobertura de testes e CI",                       points: 15, weekStart: 13, weekSpan: 2 },
    ],
  },
  {
    id: "s5",
    title: "Liderança na prática para devs",
    subtitle: "Comunicação, mentoria e tech-lead",
    color: COLOR_MUSTARD,
    weekStart: 15,
    weekSpan: 5,
    milestones: [
      { id: "m15", title: "Mentoria e code review como liderança", points: 20, weekStart: 15, weekSpan: 2 },
      { id: "m16", title: "Conduzindo um projeto end-to-end",       points: 25, weekStart: 17, weekSpan: 3 },
    ],
  },
];

export const LongProgramHorizontalScroll: Story = {
  args: {
    stages: longStages,
    dependencies: [
      ...dependencies,
      { from: "s3", to: "s4" },
      { from: "s4", to: "s5" },
    ],
    nameColWidth: 360,
  },
};

export const WideNameColumn: Story = {
  args: { stages, dependencies, weeks: 12, nameColWidth: 420 },
};
