import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { Button } from "../components/button";

/**
 * Card — one composition per story, mirroring the real fleet layouts:
 * header+content, metric, clickable grid tile, and header+content+footer.
 */
const meta: Meta<typeof Card> = {
  title: "Components/Molecules/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

/** Header (title + description) over body content — the most common shape. */
export const HeaderContent: Story = {
  render: () => (
    <Card style={{ width: "360px" }}>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
        <CardDescription>Descrição ou subtítulo do card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Conteúdo do card com informações relevantes.</p>
      </CardContent>
    </Card>
  ),
};

/** Compact metric/KPI card (label + big number + delta). */
export const MetricCard: Story = {
  render: () => (
    <Card style={{ width: "220px" }}>
      <CardHeader style={{ paddingBottom: 4 }}>
        <CardDescription>Fellows ativos</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>1.284</div>
        <div style={{ fontSize: 12, color: "var(--s-ink-muted)", marginTop: 4 }}>+12% vs. mês passado</div>
      </CardContent>
    </Card>
  ),
};

/** Interactive grid tile — the whole card is a click target. */
export const ClickableGridCard: Story = {
  render: () => (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => alert("card clicked")}
      style={{ width: "260px", cursor: "pointer" }}
    >
      <CardHeader>
        <CardTitle>Fundamentos de React</CardTitle>
        <CardDescription>8 aulas · 3h20</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 13, color: "var(--s-ink-muted)" }}>Clique para abrir a trilha.</p>
      </CardContent>
    </Card>
  ),
};

/** Header + content + a footer action row. */
export const WithFooter: Story = {
  render: () => (
    <Card style={{ width: "360px" }}>
      <CardHeader>
        <CardTitle>Confirmar publicação</CardTitle>
        <CardDescription>A lição ficará visível para todos os fellows.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Revise o conteúdo antes de continuar.</p>
      </CardContent>
      <CardFooter style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button variant="outline">Cancelar</Button>
        <Button>Confirmar</Button>
      </CardFooter>
    </Card>
  ),
};
