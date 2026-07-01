import type { Meta, StoryObj } from "@storybook/react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/card";
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
 */
const meta: Meta = {
  title: "Templates/Dashboard",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

const stats = [
  { label: "Fellows ativos", value: "1.284", delta: "+12%", up: true },
  { label: "Receita do mês", value: "R$ 48.320", delta: "+8%", up: true },
  { label: "Aulas publicadas", value: "312", delta: "+5%", up: true },
  { label: "Cancelamentos", value: "23", delta: "-3%", up: false },
];

const chartData = [
  { month: "Jan", matriculas: 186, conclusoes: 80 },
  { month: "Fev", matriculas: 305, conclusoes: 200 },
  { month: "Mar", matriculas: 237, conclusoes: 120 },
  { month: "Abr", matriculas: 273, conclusoes: 190 },
  { month: "Mai", matriculas: 309, conclusoes: 230 },
  { month: "Jun", matriculas: 314, conclusoes: 240 },
];

const chartConfig = {
  matriculas: { label: "Matrículas", color: "#2563eb" },
  conclusoes: { label: "Conclusões", color: "#60a5fa" },
} satisfies ChartConfig;

const activity = [
  { name: "Ana Costa", action: "concluiu React Avançado", when: "há 5 min", avatar: "https://github.com/shadcn.png" },
  { name: "Bruno Lima", action: "matriculou-se em Node.js", when: "há 20 min" },
  { name: "Carla Dias", action: "enviou o projeto final", when: "há 1 h" },
  { name: "Diego Reis", action: "pagou a fatura INV-004", when: "há 2 h" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Default dashboard — StatCard grid over a chart card + recent-activity card.
 */
export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* StatCard grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader style={{ paddingBottom: 4 }}>
              <CardDescription>{s.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{s.value}</span>
                <Badge variant={s.up ? "default" : "destructive"} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                  {s.up ? <ArrowUpRight style={{ width: 12, height: 12 }} /> : <ArrowDownRight style={{ width: 12, height: 12 }} />}
                  {s.delta}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, alignItems: "start" }}>
        {/* Chart card */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>Matrículas vs. Conclusões</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="matriculas" fill="var(--color-matriculas)" radius={4} />
                <Bar dataKey="conclusoes" fill="var(--color-conclusoes)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent-activity list card */}
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
                  <p style={{ margin: 0, fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{a.name}</span> {a.action}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--muted-foreground)" }}>{a.when}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
