import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { Button } from "../components/button";

/**
 * Card — DFL Design System v0 · Molecules / Card
 *
 * One story = one state. Covers:
 *   HeaderContent      — static card, token-native surfaces + typography
 *   MetricCard         — KPI number in JetBrains Mono, delta variants
 *   ClickableGridCard  — resting interactive tile
 *   ClickableGridCardHover   — simulated hover (border lift + deeper shadow)
 *   ClickableGridCardFocus   — simulated keyboard focus (DS uniform focus ring)
 *   WithFooter         — header + content + right-aligned footer buttons
 */
const meta: Meta<typeof Card> = {
  title: "Components/Molecules/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

/* ─── HeaderContent ─────────────────────────────────────────────────────────
 * Static card showing token-native bg (--c-card-bg), border (--c-card-border),
 * radius (--c-card-radius = 10px), shadow (--c-card-shadow).
 * CardTitle: 16px / 600 / −0.2px / --s-ink-primary.
 * CardDescription: 13px / --s-ink-muted.
 * ─────────────────────────────────────────────────────────────────────────── */
export const HeaderContent: Story = {
  render: () => (
    <Card style={{ width: "360px" }}>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
        <CardDescription>Descrição ou subtítulo do card — contexto secundário.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: "var(--s-ink-secondary)", lineHeight: 1.6 }}>
          Conteúdo do card com informações relevantes para o usuário. Pode incluir qualquer marcação filho.
        </p>
      </CardContent>
    </Card>
  ),
};

/* ─── MetricCard ─────────────────────────────────────────────────────────────
 * KPI card. Metric value: JetBrains Mono 32px / 700 / −0.5px tracking.
 * Positive delta: --s-success-fg. Negative delta: --s-danger-fg.
 * Neutral delta: --s-ink-muted.
 * ─────────────────────────────────────────────────────────────────────────── */
export const MetricCard: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
      {/* Positive delta */}
      <Card style={{ width: "220px" }}>
        <CardHeader style={{ paddingBottom: 4 }}>
          <CardDescription>Fellows ativos</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            style={{
              fontFamily: "var(--p-font-mono)",
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.5px",
              color: "var(--s-ink-primary)",
            }}
          >
            1.284
          </div>
          <div
            style={{
              fontFamily: "var(--p-font-mono)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--s-success-fg)",
              marginTop: 4,
            }}
          >
            ↑ +12% vs. mês passado
          </div>
        </CardContent>
      </Card>

      {/* Negative delta */}
      <Card style={{ width: "220px" }}>
        <CardHeader style={{ paddingBottom: 4 }}>
          <CardDescription>Taxa de conclusão</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            style={{
              fontFamily: "var(--p-font-mono)",
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.5px",
              color: "var(--s-ink-primary)",
            }}
          >
            67,4%
          </div>
          <div
            style={{
              fontFamily: "var(--p-font-mono)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--s-danger-fg)",
              marginTop: 4,
            }}
          >
            ↓ −3,2% vs. mês passado
          </div>
        </CardContent>
      </Card>

      {/* Neutral / no delta */}
      <Card style={{ width: "220px" }}>
        <CardHeader style={{ paddingBottom: 4 }}>
          <CardDescription>Lições publicadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            style={{
              fontFamily: "var(--p-font-mono)",
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.5px",
              color: "var(--s-ink-primary)",
            }}
          >
            432
          </div>
          <div
            style={{
              fontFamily: "var(--p-font-mono)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--s-ink-muted)",
              marginTop: 4,
            }}
          >
            — sem comparativo
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

/* ─── ClickableGridCard ──────────────────────────────────────────────────────
 * Default / resting state.
 * role="button" + tabIndex=0. Cursor pointer.
 * Border = --c-card-border. Shadow = --c-card-shadow.
 * No additional visual indicator beyond pointer cursor at rest.
 * ─────────────────────────────────────────────────────────────────────────── */
export const ClickableGridCard: Story = {
  render: () => (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => {
        // intentionally empty for story
      }}
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

/* ─── ClickableGridCardHover ─────────────────────────────────────────────────
 * Simulated hover state.
 * Border lifts to --c-card-border-hover (#3a3530).
 * Shadow deepens to --p-shadow (0 4px 12px rgba(0,0,0,0.45)).
 * Transition: 120ms ease (already on base Card).
 * ─────────────────────────────────────────────────────────────────────────── */
export const ClickableGridCardHover: Story = {
  render: () => (
    <Card
      role="button"
      tabIndex={0}
      style={{
        width: "260px",
        cursor: "pointer",
        // simulated hover state
        borderColor: "var(--c-card-border-hover)",
        boxShadow: "var(--p-shadow)",
      }}
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

/* ─── ClickableGridCardFocus ─────────────────────────────────────────────────
 * Simulated keyboard-focus state.
 * DS uniform focus ring: box-shadow 0 0 0 2px --s-surface-page (gap),
 *                                   0 0 0 3px #E07A4A (ring).
 * Border: --c-card-border-hover.
 * outline: none (ring replaces native outline).
 * ─────────────────────────────────────────────────────────────────────────── */
export const ClickableGridCardFocus: Story = {
  render: () => (
    <Card
      role="button"
      tabIndex={0}
      style={{
        width: "260px",
        cursor: "pointer",
        // simulated focus state — DS uniform focus ring
        borderColor: "var(--c-card-border-hover)",
        boxShadow: "0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A",
        outline: "none",
      }}
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

/* ─── WithFooter ─────────────────────────────────────────────────────────────
 * Header + content + right-aligned footer with Cancel (secondary) and
 * Confirm (primary) buttons. Footer uses --c-card-padding with padding-top: 0.
 * ─────────────────────────────────────────────────────────────────────────── */
export const WithFooter: Story = {
  render: () => (
    <Card style={{ width: "360px" }}>
      <CardHeader>
        <CardTitle>Confirmar publicação</CardTitle>
        <CardDescription>A lição ficará visível para todos os fellows.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: "var(--s-ink-secondary)", lineHeight: 1.6 }}>
          Revise o conteúdo antes de continuar. Essa ação pode ser desfeita na aba de rascunhos.
        </p>
      </CardContent>
      <CardFooter style={{ justifyContent: "flex-end", gap: "8px" }}>
        <Button variant="outline">Cancelar</Button>
        <Button variant="primary">Confirmar</Button>
      </CardFooter>
    </Card>
  ),
};
