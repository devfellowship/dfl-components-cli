import type { Meta, StoryObj } from "@storybook/react";
import { Gantt, type GanttStage, type GanttDependency } from "../components/organisms/Gantt";

const meta: Meta<typeof Gantt> = {
  title: "Components/Organisms/Gantt",
  component: Gantt,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Gantt>;

// Ported from João's Winter-2025 cohort: 3 stages, sequence-dependency model.
const stages: GanttStage[] = [
  {
    id: "s1",
    title: "Versionamento & Colaboração com Git",
    subtitle: "Onboarding & fundamentos",
    color: "#E07A4A",
    weekStart: 1,
    weekSpan: 3,
    milestones: [
      { id: "m1", title: "Fundamentos de Git e GitHub", points: 10, done: true, weekStart: 1, weekSpan: 1 },
      { id: "m2", title: "Branching & estratégias de fluxo", points: 10, done: true, weekStart: 1, weekSpan: 1 },
      { id: "m3", title: "Comandos essenciais & merge", points: 10, weekStart: 2, weekSpan: 1 },
      { id: "m4", title: "Colaboração no GitHub (PRs & boas práticas)", points: 10, weekStart: 2, weekSpan: 2 },
    ],
  },
  {
    id: "s2",
    title: "Fundamentos de React",
    subtitle: "Componentes, estado & props",
    color: "#7AA2E0",
    weekStart: 3,
    weekSpan: 4,
    milestones: [
      { id: "m5", title: "Setup & como o React renderiza", points: 10, weekStart: 3, weekSpan: 1 },
      { id: "m6", title: "Estado, props & listas", points: 15, weekStart: 4, weekSpan: 1 },
      { id: "m7", title: "Estilo & componentização", points: 15, weekStart: 5, weekSpan: 1 },
      { id: "m8", title: "App profissional: CRUD, rotas, react-query & auth", points: 20, weekStart: 6, weekSpan: 1 },
    ],
  },
  {
    id: "s3",
    title: "React Aplicado + Dev Assistido por IA",
    subtitle: "Projeto e-commerce com IA",
    color: "#B58FE0",
    weekStart: 6,
    weekSpan: 5,
    milestones: [
      { id: "m9", title: "Vibe coding com IA (Cursor/ShadCN)", points: 20, weekStart: 6, weekSpan: 2 },
      { id: "m10", title: "Padrões avançados de Hooks & Context", points: 15, weekStart: 8, weekSpan: 1 },
      { id: "m11", title: "Qualidade & TypeScript na prática", points: 15, weekStart: 9, weekSpan: 1 },
      { id: "m12", title: "Arquitetura final & assets do e-commerce", points: 20, weekStart: 10, weekSpan: 1 },
    ],
  },
];

const dependencies: GanttDependency[] = [
  { from: "s1", to: "s2" },
  { from: "s1", to: "s3" },
  { from: "s2", to: "s3" },
];

export const Default: Story = {
  args: { stages, dependencies, weeks: 12 },
};

export const WithMemberHeader: Story = {
  args: {
    stages,
    dependencies,
    weeks: 12,
    header: (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--s-brand-solid,#E07A4A)] text-[13px] font-semibold text-[var(--s-ink-inverse,#0A0908)]">
            JP
          </span>
          <div>
            <div className="text-[14px] font-semibold">João Pedro Danhoni</div>
            <div className="text-[11px] text-[var(--s-ink-muted,#7D7568)]">Full Stack Developer Fellow</div>
          </div>
        </div>
        <div className="flex items-center gap-5 font-[var(--s-font-mono,monospace)] text-[11px] tabular-nums text-[var(--s-ink-muted,#7D7568)]">
          <span>Stage 1 <b className="text-[var(--s-brand-fg,#F0A872)]">40%</b></span>
          <span>Stage 2 <b className="text-[var(--s-ink-secondary,#C9C0B4)]">0%</b></span>
          <span>Stage 3 <b className="text-[var(--s-ink-secondary,#C9C0B4)]">0%</b></span>
        </div>
      </div>
    ),
  },
};

export const StagesOnly: Story = {
  args: { stages, dependencies, weeks: 12, stagesOnly: true },
};

export const Empty: Story = {
  args: { stages: [] },
};

// A long (15-month) program with many week columns and deliberately long
// titles — exercises horizontal scroll (sticky name column) + name-col width.
const longStages: GanttStage[] = [
  ...stages,
  {
    id: "s4",
    title: "Vibecode com padrões avançados e qualidade de código",
    subtitle: "TypeScript, testes e arquitetura na prática",
    color: "#7AE0A2",
    weekStart: 11,
    weekSpan: 4,
    milestones: [
      { id: "m13", title: "Padrões avançados aplicados a um projeto real", points: 20, weekStart: 11, weekSpan: 2 },
      { id: "m14", title: "Cobertura de testes e CI", points: 15, weekStart: 13, weekSpan: 2 },
    ],
  },
  {
    id: "s5",
    title: "Liderança na prática para devs",
    subtitle: "Comunicação, mentoria e tech-lead",
    color: "#E0B57A",
    weekStart: 15,
    weekSpan: 5,
    milestones: [
      { id: "m15", title: "Mentoria e code review como liderança", points: 20, weekStart: 15, weekSpan: 2 },
      { id: "m16", title: "Conduzindo um projeto end-to-end", points: 25, weekStart: 17, weekSpan: 3 },
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
    // No explicit `weeks` — derived to ~19 from the furthest stage end, so the
    // grid overflows its container and scrolls horizontally; the STAGE/TASK
    // column stays sticky on the left.
    nameColWidth: 360,
  },
};

export const WideNameColumn: Story = {
  args: { stages, dependencies, weeks: 12, nameColWidth: 420 },
};
