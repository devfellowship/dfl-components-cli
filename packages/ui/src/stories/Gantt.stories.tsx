import type { Meta, StoryObj } from "@storybook/react";
import { Gantt, type GanttStage, type GanttDependency } from "../components/organisms/Gantt";

const meta: Meta<typeof Gantt> = {
  title: "Organisms/Gantt",
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
