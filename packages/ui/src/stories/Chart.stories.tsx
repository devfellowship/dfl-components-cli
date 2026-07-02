import type { Meta, StoryObj } from "@storybook/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/chart";

// ── Data ─────────────────────────────────────────────────────────────────────

const barData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Fev", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Abr", desktop: 73, mobile: 190 },
  { month: "Mai", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const lineData = [
  { month: "Jan", completed: 42 },
  { month: "Fev", completed: 67 },
  { month: "Mar", completed: 78 },
  { month: "Abr", completed: 25 },
  { month: "Mai", completed: 60 },
  { month: "Jun", completed: 71 },
];

const areaData = [
  { month: "Jan", active: 45 },
  { month: "Fev", active: 62 },
  { month: "Mar", active: 55 },
  { month: "Abr", active: 78 },
  { month: "Mai", active: 90 },
  { month: "Jun", active: 71 },
];

// ── Chart configs (DS tokens only — no raw hex values) ───────────────────────

/** Two-series bar chart: amber (--chart-1) + info blue (--chart-2). */
const barConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

/** Single-series line chart: success green (--chart-3). */
const lineConfig = {
  completed: { label: "Concluídas", color: "var(--chart-3)" },
} satisfies ChartConfig;

/** Single-series area chart: teal (--teal primitive, within DS palette). */
const areaConfig = {
  active: { label: "Ativos", color: "var(--teal)" },
} satisfies ChartConfig;

// ── Shared empty-state UI ─────────────────────────────────────────────────────

/**
 * Muted no-data placeholder rendered by ChartContainer when isEmpty=true.
 * Uses semantic tokens: --s-surface-elevated, --s-border-subtle, --s-ink-muted.
 */
function ChartEmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 168,
        gap: 12,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 6,
          background: "var(--s-surface-elevated)",
          border: "1px solid var(--s-border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Muted bar-chart skeleton icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="3" y="13" width="4" height="7" rx="1" fill="var(--s-border-strong)" />
          <rect x="9" y="9" width="4" height="11" rx="1" fill="var(--s-border-strong)" />
          <rect x="15" y="11" width="4" height="9" rx="1" fill="var(--s-border-strong)" />
          <line
            x1="2"
            y1="21"
            x2="22"
            y2="21"
            stroke="var(--s-border-strong)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p
        style={{
          color: "var(--s-ink-muted)",
          fontSize: 13,
          textAlign: "center",
        }}
      >
        Nenhum dado disponível
      </p>
    </div>
  );
}

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ChartContainer> = {
  title: "Components/Organisms/Chart",
  component: ChartContainer,
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

// ── Story: BarChart / Default ─────────────────────────────────────────────────
// Fix: ChartConfig now references DS tokens (--chart-1 amber, --chart-2 info
// blue) instead of the former raw Tailwind hex values #2563eb / #60a5fa.

export const BarChartDefault: Story = {
  name: "BarChart / Default",
  render: () => (
    <ChartContainer config={barConfig} className="min-h-[300px] w-[600px]">
      <BarChart accessibilityLayer data={barData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

// ── Story: LineChart / Default ─────────────────────────────────────────────────
// Single series using --chart-3 (success green) — proves the token palette
// extends beyond two colors without any raw hex fallback.

export const LineChartDefault: Story = {
  name: "LineChart / Default",
  render: () => (
    <ChartContainer config={lineConfig} className="min-h-[300px] w-[600px]">
      <LineChart accessibilityLayer data={lineData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="var(--color-completed)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  ),
};

// ── Story: AreaChart / Default ─────────────────────────────────────────────────
// Area chart with teal gradient fill (--teal / --chart-2 range). Demonstrates
// the linearGradient pattern that ChartContainer supports via Recharts SVG defs.

export const AreaChartDefault: Story = {
  name: "AreaChart / Default",
  render: () => (
    <ChartContainer config={areaConfig} className="min-h-[300px] w-[600px]">
      <AreaChart accessibilityLayer data={areaData}>
        <defs>
          <linearGradient id="areaGradientTeal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.28} />
            <stop offset="95%" stopColor="var(--teal)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="active"
          stroke="var(--color-active)"
          strokeWidth={2.5}
          fill="url(#areaGradientTeal)"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ── Story: BarChart / TooltipDot ───────────────────────────────────────────────
// Isolates ChartTooltipContent with indicator="dot" as a standalone focusable
// story state. Hover any bar to see the dot swatch in the tooltip popup.
// Tooltip surface resolves via --c-chart-tooltip-bg (--s-surface-elevated).

export const BarChartTooltipDot: Story = {
  name: "BarChart / TooltipDot",
  render: () => (
    <ChartContainer config={barConfig} className="min-h-[300px] w-[600px]">
      <BarChart accessibilityLayer data={barData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

// ── Story: BarChart / TooltipLine ─────────────────────────────────────────────
// Same data as TooltipDot; isolates the indicator="line" variant of
// ChartTooltipContent as its own story state. Hover any bar to see the
// vertical-line swatch in the tooltip.

export const BarChartTooltipLine: Story = {
  name: "BarChart / TooltipLine",
  render: () => (
    <ChartContainer config={barConfig} className="min-h-[300px] w-[600px]">
      <BarChart accessibilityLayer data={barData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

// ── Story: BarChart / Empty ────────────────────────────────────────────────────
// ChartContainer with isEmpty=true renders the muted no-data empty state
// (icon + copy) instead of the chart. Specs the zero-state as a visible,
// reviewable story in Storybook.
// Pattern: pass isEmpty + emptyState; children are still required by the type
// but are not rendered when the container is in empty state.

export const BarChartEmpty: Story = {
  name: "BarChart / Empty",
  render: () => (
    <ChartContainer
      config={barConfig}
      className="min-h-[200px] w-[600px]"
      isEmpty
      emptyState={<ChartEmptyState />}
    >
      {/* children required by type — ignored when isEmpty=true */}
      <BarChart data={[]} accessibilityLayer>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
