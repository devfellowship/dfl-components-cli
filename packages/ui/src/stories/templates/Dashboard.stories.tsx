import type { Meta, StoryObj } from "@storybook/react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2 as BarChartIcon,
  Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Badge } from "../../components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card";
import { Skeleton } from "../../components/skeleton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../components/chart";

/**
 * Templates/Dashboard — page-level composition, NOT a new component.
 *
 * The dashboard archetype (reviews dashboard, learn MyDashboard, quiz
 * analytics): a grid of StatCards (Card + big number + delta Badge), a Chart
 * (recharts via `ChartContainer`), and a recent-activity list. COMPOSES
 * existing `@devfellowship/components` primitives only.
 *
 * DS fixes applied (vs. original story):
 *   1. Stat values → JetBrains Mono (--c-dashboard-stat-font → --s-font-mono).
 *      Numeric / monetary metrics always render in mono per DS typography rule.
 *   2. Positive-delta badge → variant="success" (green --s-success-* tokens).
 *      `variant="default"` was brand-amber — amber is a CTA colour, not "good".
 *   3. Negative-delta badge → variant="danger" (red --s-danger-* tokens).
 *   4. Chart bars → var(--chart-1) #E07A4A amber + var(--chart-2) #7aa2e0 blue.
 *      Previous raw hex (#2563eb / #60a5fa) bypassed the DS chart token palette.
 *   5. Invoice code INV-004 in activity list rendered in JetBrains Mono.
 *
 * Stories (one per state):
 *   Default   — data-filled dashboard with all four fixes applied
 *   Loading   — full skeleton (preserves layout; shimmer via dfl-skeleton class)
 *   Empty     — zero-data state (em-dash values, dashed chart placeholder,
 *               "Nenhuma atividade" callout)
 *   DownTrend — all four stats show negative deltas (danger path end-to-end)
 */
const meta: Meta = {
  title: "Components/Templates/Dashboard",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

// ─── Shared data ────────────────────────────────────────────────────────────

const stats = [
  { label: "Fellows ativos",    value: "1.284",      delta: "+12%", up: true  },
  { label: "Receita do mês",   value: "R$ 48.320",  delta: "+8%",  up: true  },
  { label: "Aulas publicadas", value: "312",         delta: "+5%",  up: true  },
  { label: "Cancelamentos",    value: "23",          delta: "−3%",  up: false },
];

const downTrendStats = [
  { label: "Fellows ativos",    value: "1.101",      delta: "−14%",  up: false },
  { label: "Receita do mês",   value: "R$ 39.840",  delta: "−17%",  up: false },
  { label: "Aulas publicadas", value: "287",         delta: "−8%",   up: false },
  { label: "Cancelamentos",    value: "61",          delta: "+165%", up: false },
];

const chartData = [
  { month: "Jan", matriculas: 186, conclusoes: 80  },
  { month: "Fev", matriculas: 305, conclusoes: 200 },
  { month: "Mar", matriculas: 237, conclusoes: 120 },
  { month: "Abr", matriculas: 273, conclusoes: 190 },
  { month: "Mai", matriculas: 309, conclusoes: 230 },
  { month: "Jun", matriculas: 314, conclusoes: 240 },
];

const downTrendChartData = [
  { month: "Jan", matriculas: 314, conclusoes: 240 },
  { month: "Fev", matriculas: 280, conclusoes: 210 },
  { month: "Mar", matriculas: 255, conclusoes: 185 },
  { month: "Abr", matriculas: 228, conclusoes: 160 },
  { month: "Mai", matriculas: 190, conclusoes: 130 },
  { month: "Jun", matriculas: 152, conclusoes: 100 },
];

// FIX 4: DS chart tokens — var(--chart-1) amber, var(--chart-2) blue.
// ChartContainer injects --color-matriculas / --color-conclusoes from these.
const chartConfig = {
  matriculas: { label: "Matrículas", color: "var(--chart-1)" },
  conclusoes: { label: "Conclusões", color: "var(--chart-2)" },
} satisfies ChartConfig;

const activity = [
  { name: "Ana Costa",   action: "concluiu React Avançado",   when: "há 5 min",  avatar: "https://github.com/shadcn.png" },
  { name: "Bruno Lima",  action: "matriculou-se em Node.js",  when: "há 20 min" },
  { name: "Carla Dias",  action: "enviou o projeto final",    when: "há 1 h"    },
  { name: "Diego Reis",  action: "pagou a fatura",            when: "há 2 h",    code: "INV-004" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Shared sub-layouts ──────────────────────────────────────────────────────

/** Stat card with value + delta badge. `sm` reduces the font for long strings. */
function StatCard({
  label,
  value,
  delta,
  up,
  sm = false,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  sm?: boolean;
}) {
  return (
    <Card>
      <CardHeader style={{ paddingBottom: 4 }}>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 8,
            minHeight: 34,
          }}
        >
          {/* FIX 1: JetBrains Mono for numeric / monetary stat values */}
          <span
            style={{
              fontFamily: "var(--c-dashboard-stat-font)",
              fontSize: sm ? 21 : 28,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: sm ? "-0.3px" : "-0.5px",
            }}
          >
            {value}
          </span>
          {/* FIX 2+3: success for up, danger for down — NOT 'default' (brand amber) */}
          <Badge
            variant={up ? "success" : "danger"}
            shape="square"
            style={{ display: "inline-flex", alignItems: "center", gap: 3 }}
          >
            {up
              ? <ArrowUpRight style={{ width: 11, height: 11 }} />
              : <ArrowDownRight style={{ width: 11, height: 11 }} />
            }
            {delta}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

/** Stat card in "empty" state: em-dash in ink-disabled, no badge. */
function EmptyStatCard({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader style={{ paddingBottom: 4 }}>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ minHeight: 34, display: "flex", alignItems: "center" }}>
          {/* No badge — a missing delta is not a zero delta */}
          <span
            style={{
              fontFamily: "var(--c-dashboard-stat-font)",
              fontSize: 26,
              fontWeight: 600,
              lineHeight: 1,
              color: "var(--s-ink-disabled)",
            }}
          >
            —
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/** Activity list used in Default and DownTrend stories. */
function ActivityList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: 16 }}>Atividade recente</CardTitle>
      </CardHeader>
      <CardContent style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {activity.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar className="h-8 w-8 shrink-0">
              {a.avatar && <AvatarImage src={a.avatar} alt={a.name} />}
              <AvatarFallback className="text-xs">{getInitials(a.name)}</AvatarFallback>
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, color: "var(--s-ink-secondary)" }}>
                <strong style={{ color: "var(--s-ink-primary)", fontWeight: 600 }}>
                  {a.name}
                </strong>{" "}
                {a.action}
                {/* FIX 1b: invoice / reference codes in JetBrains Mono */}
                {a.code && (
                  <code
                    style={{
                      fontFamily: "var(--c-dashboard-stat-font)",
                      fontSize: 11.5,
                      color: "var(--s-ink-muted)",
                      marginLeft: 4,
                    }}
                  >
                    {a.code}
                  </code>
                )}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--s-ink-muted)" }}>
                {a.when}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/** Dimmed chart legend — used in Empty state to preserve layout without live data. */
function DimmedLegend() {
  return (
    <div style={{ display: "flex", gap: 16, paddingTop: 4, opacity: 0.4 }}>
      {(["Matrículas", "Conclusões"] as const).map((label, i) => (
        <span
          key={label}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--s-ink-secondary)" }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: i === 0 ? "var(--chart-1)" : "var(--chart-2)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

/**
 * Default — data-filled dashboard with all four DS fixes applied:
 *   1. Stat values in JetBrains Mono
 *   2. Positive deltas → success-subtle/fg badge (green)
 *   3. Negative deltas → danger-subtle/fg badge (red)
 *   4. Chart bars → --chart-1 amber + --chart-2 blue (DS palette tokens)
 *   5. Invoice code INV-004 in Mono
 */
export const Default: Story = {
  render: () => (
    <div
      style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}
    >
      {/* StatCard grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} sm={s.label === "Receita do mês"} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, alignItems: "start" }}>
        {/* Chart card */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>Matrículas vs. Conclusões</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {/* FIX 4: fill resolves via ChartContainer → var(--chart-1) / var(--chart-2) */}
                <Bar dataKey="matriculas" fill="var(--color-matriculas)" radius={4} />
                <Bar dataKey="conclusoes" fill="var(--color-conclusoes)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <ActivityList />
      </div>
    </div>
  ),
};

/**
 * Loading — full skeleton state.
 *
 * All four stat cards show shimmer skeletons preserving layout dimensions.
 * Chart area is a single skeleton block (height matches the live chart).
 * Activity list shows four skeleton rows with circular avatar placeholders.
 * Shimmer uses the `dfl-skeleton` class which sweeps surface-raised →
 * surface-elevated per the --c-skeleton-bg / --c-skeleton-shimmer tokens.
 * Card outlines and radii are preserved so layout does not shift on data arrival.
 */
export const Loading: Story = {
  render: () => (
    <div
      style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}
    >
      {/* Skeleton stat grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}
      >
        {([66, 72, 60, 55] as const).map((w, i) => (
          <Card key={i}>
            <CardHeader style={{ paddingBottom: 4 }}>
              <Skeleton style={{ height: 12, width: `${w}%` }} />
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 8,
                  minHeight: 34,
                }}
              >
                <Skeleton style={{ height: 28, width: "48%" }} />
                <Skeleton
                  style={{
                    height: 20,
                    width: "28%",
                    borderRadius: "var(--p-radius-sm)",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, alignItems: "start" }}>
        {/* Skeleton chart */}
        <Card>
          <CardHeader>
            <Skeleton style={{ height: 14, width: "46%", marginBottom: 8 }} />
            <Skeleton style={{ height: 11, width: "28%" }} />
          </CardHeader>
          <CardContent>
            <Skeleton
              style={{
                height: 220,
                width: "100%",
                borderRadius: "var(--p-radius-md)",
              }}
            />
            <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
              <Skeleton style={{ height: 11, width: 80 }} />
              <Skeleton style={{ height: 11, width: 70 }} />
            </div>
          </CardContent>
        </Card>

        {/* Skeleton activity */}
        <Card>
          <CardHeader>
            <Skeleton style={{ height: 14, width: "55%" }} />
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {([88, 80, 92, 75] as const).map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Skeleton
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--c-skeleton-radius-circle)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <Skeleton style={{ height: 12, width: `${w}%`, marginBottom: 6 }} />
                  <Skeleton style={{ height: 10, width: "38%" }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

/**
 * Empty — zero-data state.
 *
 * Stat values show em-dash (—) in ink-disabled colour — no badge, because a
 * missing delta is not a zero delta and should carry no semantic signal.
 * Chart area renders a dashed border-subtle placeholder with a bar-chart icon
 * and "Nenhum dado disponível ainda" label.
 * Activity list shows "Nenhuma atividade ainda" callout with a Clock icon.
 */
export const Empty: Story = {
  render: () => (
    <div
      style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}
    >
      {/* Empty stat grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}
      >
        {stats.map((s) => (
          <EmptyStatCard key={s.label} label={s.label} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, alignItems: "start" }}>
        {/* Empty chart card — dashed border placeholder */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>Matrículas vs. Conclusões</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={{
                height: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "1px dashed var(--s-border-subtle)",
                borderRadius: "var(--p-radius-md)",
                margin: "4px 0 8px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "var(--s-surface-raised)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BarChartIcon
                  style={{ width: 20, height: 20, color: "var(--s-ink-muted)" }}
                />
              </div>
              <p style={{ fontSize: 12, color: "var(--s-ink-muted)", margin: 0 }}>
                Nenhum dado disponível ainda
              </p>
            </div>
            {/* Dimmed legend preserves layout; opacity signals "no data". */}
            <DimmedLegend />
          </CardContent>
        </Card>

        {/* Empty activity card */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>Atividade recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "24px 0 16px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "var(--s-surface-raised)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock style={{ width: 18, height: 18, color: "var(--s-ink-muted)" }} />
              </div>
              <p style={{ fontSize: 12, color: "var(--s-ink-muted)", margin: 0 }}>
                Nenhuma atividade ainda
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

/**
 * DownTrend — all four stats show negative deltas.
 *
 * Exercises the danger badge path end-to-end and confirms the red delta
 * colour reads clearly against the dark card surface. Chart data also reflects
 * a declining 6-month trend for visual consistency.
 */
export const DownTrend: Story = {
  render: () => (
    <div
      style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}
    >
      {/* All danger badges */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}
      >
        {downTrendStats.map((s) => (
          <StatCard key={s.label} {...s} sm={s.label === "Receita do mês"} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, alignItems: "start" }}>
        {/* Declining chart */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>Matrículas vs. Conclusões</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
              <BarChart accessibilityLayer data={downTrendChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="matriculas" fill="var(--color-matriculas)" radius={4} />
                <Bar dataKey="conclusoes" fill="var(--color-conclusoes)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <ActivityList />
      </div>
    </div>
  ),
};
