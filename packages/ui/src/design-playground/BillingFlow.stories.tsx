import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Paperclip, Receipt, Upload } from "lucide-react";

import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "../components/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/dialog";
import { Input } from "../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Separator } from "../components/separator";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import { Textarea } from "../components/textarea";

/**
 * DesignPlayground / BillingFlow — EXPERIMENTATION SANDBOX. NOT exported.
 *
 * Experimento: otimizar o fluxo interno de cobrança e pagamentos SEM criar uma
 * tela nova — tudo acontece no Create Task modal de hoje (one screen,
 * everything integrated). Quatro propostas em teste:
 *
 *   01 · PROFILES & MODES  — toggle Fellow / Contractor no topo do form
 *   02 · STANDARD EXPERIENCE — mode = Contractor expõe VALOR direto (invoice path)
 *   03 · REAL-TIME VALUE   — priority vira VALOR/PONTO: toda task carrega R$
 *   04 · INVOICE IN THE TASK — ação contextual "Gerar invoice dessa task"
 *
 * NOT distributed via the registry / npm package.
 * One story per state — FellowMode, ContractorMode, InvoiceFromTask.
 */
const meta: Meta = {
  title: "DesignPlayground/BillingFlow",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

// ── Brand helpers (Brand Manual: mono-uppercase meta, tabular money) ──────────

const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** mono-uppercase field label — 10.5/15 · 500 · 0.6px tracking (Brand Manual). */
function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontFamily: "var(--s-font-mono)",
        fontSize: 10.5,
        lineHeight: "15px",
        fontWeight: 500,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color: "var(--s-ink-muted)",
        marginBottom: 4,
      }}
    >
      {children}
    </label>
  );
}

/** money in JetBrains Mono with tabular numerals (dataviz/meta rule). */
function Money({ value, strong = false }: { value: number; strong?: boolean }) {
  return (
    <span
      style={{
        fontFamily: "var(--s-font-mono)",
        fontVariantNumeric: "tabular-nums",
        fontSize: strong ? 14 : 12,
        fontWeight: strong ? 600 : 400,
        color: strong ? "var(--s-brand-fg)" : "var(--s-ink-secondary)",
      }}
    >
      {money(value)}
    </span>
  );
}

// ── The experiment: Create Task modal with billing integrated ─────────────────

type Mode = "fellow" | "contractor";

function CreateTaskBilling({ initialMode }: { initialMode: Mode }) {
  const [open, setOpen] = useState(true);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [points, setPoints] = useState(12);
  const [valorPonto, setValorPonto] = useState(25);
  const [valorDireto, setValorDireto] = useState(1250);

  const totalFellow = useMemo(() => points * valorPonto, [points, valorPonto]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--s-surface-page)",
        display: "grid",
        placeItems: "center",
      }}
    >
      {!open && (
        <Button variant="primary" onClick={() => setOpen(true)}>
          Reabrir Create Task
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[880px]"
          style={{ padding: 24 }}
        >
          <DialogHeader>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <DialogTitle>Create Task</DialogTitle>

              {/* 01 · PROFILES & MODES — o toggle troca o form inteiro de perfil */}
              <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <TabsList>
                  <TabsTrigger value="fellow">Fellow</TabsTrigger>
                  <TabsTrigger value="contractor">Contractor</TabsTrigger>
                </TabsList>
              </Tabs>

              <Badge variant={mode === "fellow" ? "default" : "info"}>
                {mode === "fellow" ? "pontos → R$" : "invoice direto"}
              </Badge>
            </div>
          </DialogHeader>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)",
              gap: 24,
              marginTop: 8,
            }}
          >
            {/* ── Coluna esquerda: o form de hoje, com billing embutido ───────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <FieldLabel htmlFor="bf-task-name">Task name *</FieldLabel>
                <Input id="bf-task-name" placeholder="Enter task name" />
              </div>

              {/* 03 · REAL-TIME VALUE — priority sai; entra valor por ponto */}
              {mode === "fellow" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <FieldLabel htmlFor="bf-points">Points</FieldLabel>
                    <Input
                      id="bf-points"
                      type="number"
                      min={0}
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bf-valor-ponto">Valor / ponto</FieldLabel>
                    <Input
                      id="bf-valor-ponto"
                      type="number"
                      min={0}
                      value={valorPonto}
                      onChange={(e) => setValorPonto(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <FieldLabel htmlFor="bf-points-c">Points</FieldLabel>
                    <Input
                      id="bf-points-c"
                      type="number"
                      min={0}
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Valor</FieldLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: 36,
                        padding: "0 12px",
                        borderRadius: 8,
                        background: "var(--s-surface-raised)",
                        border: "1px solid var(--s-border-subtle)",
                      }}
                    >
                      <Money value={valorDireto} strong />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <Select defaultValue="todo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="doing">Doing</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FieldLabel>Owner</FieldLabel>
                  <Select defaultValue="jp">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jp">João Pedro Danhoni</SelectItem>
                      <SelectItem value="tainan">Tainan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <FieldLabel>Stage *</FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="build">Build</SelectItem>
                    <SelectItem value="ship">Ship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <FieldLabel>Epic</FieldLabel>
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No epic</SelectItem>
                      <SelectItem value="billing">Billing v2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FieldLabel>Delivery</FieldLabel>
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No delivery</SelectItem>
                      <SelectItem value="jul">Julho / 26</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <FieldLabel>Attachments</FieldLabel>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "20px 16px",
                    borderRadius: 8,
                    border: "1px dashed var(--s-border-strong)",
                    background: "var(--s-surface-raised)",
                    color: "var(--s-ink-muted)",
                  }}
                >
                  <Upload size={18} strokeWidth={1.5} aria-hidden />
                  <span style={{ fontSize: 13, color: "var(--s-ink-secondary)" }}>
                    Drag & drop files here, or click to select
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--s-font-mono)",
                      fontSize: 10.5,
                      letterSpacing: "0.6px",
                      textTransform: "uppercase",
                    }}
                  >
                    max 500kb
                  </span>
                </div>
              </div>
            </div>

            {/* ── Coluna direita: description + billing path ──────────────────── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 16,
                borderRadius: 10,
                background: "var(--s-surface-panel)",
                border: "1px solid var(--s-border-subtle)",
              }}
            >
              <FieldLabel htmlFor="bf-description">Description</FieldLabel>

              {/* 02 · STANDARD EXPERIENCE — contractor vê o VALOR no caminho da invoice */}
              {mode === "contractor" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "var(--s-brand-subtle)",
                    border: "1px solid var(--s-brand-border)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span
                      style={{
                        fontFamily: "var(--s-font-mono)",
                        fontSize: 10.5,
                        letterSpacing: "0.6px",
                        textTransform: "uppercase",
                        color: "var(--s-ink-muted)",
                      }}
                    >
                      Valor
                    </span>
                    <Money value={valorDireto} strong />
                  </div>
                  <Input
                    aria-label="Valor da task em reais"
                    type="number"
                    min={0}
                    value={valorDireto}
                    onChange={(e) => setValorDireto(Number(e.target.value) || 0)}
                    style={{ maxWidth: 140 }}
                  />
                </div>
              )}

              {/* 03 · REAL-TIME VALUE — fellow vê o R$ da task nascendo dos pontos */}
              {mode === "fellow" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "var(--s-surface-raised)",
                    border: "1px solid var(--s-border-subtle)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--s-font-mono)",
                      fontSize: 12,
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--s-ink-secondary)",
                    }}
                  >
                    {points} pts × {money(valorPonto)}
                  </span>
                  <Money value={totalFellow} strong />
                </div>
              )}

              <Textarea
                id="bf-description"
                placeholder="Enter task description (supports markdown)"
                style={{ minHeight: 220, resize: "vertical" }}
              />

              <Separator />

              {/* 04 · INVOICE IN THE TASK — ação contextual, sem tela nova */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <Button variant="ghost" size="sm" disabled={mode === "fellow"}>
                  <Receipt size={14} strokeWidth={1.5} aria-hidden />
                  Gerar invoice dessa task
                </Button>
                {mode === "fellow" && (
                  <span style={{ fontSize: 12, color: "var(--s-ink-muted)" }}>
                    invoice só no modo contractor
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter style={{ marginTop: 16 }}>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary">Criar task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Story 1 — FellowMode ──────────────────────────────────────────────────────

/**
 * FellowMode — pontos viram R$ em tempo real.
 * Priority sai do form; entra VALOR/PONTO. Toda task carrega um valor claro
 * (points × valor/ponto), mostrado em mono tabular no painel de descrição.
 */
export const FellowMode: Story = {
  render: () => <CreateTaskBilling initialMode="fellow" />,
};

// ── Story 2 — ContractorMode ──────────────────────────────────────────────────

/**
 * ContractorMode — o caminho padrão da invoice.
 * O toggle troca o perfil do form: o painel de descrição expõe VALOR direto
 * (brand-subtle, borda âmbar) e a ação contextual "Gerar invoice dessa task"
 * fica habilitada.
 */
export const ContractorMode: Story = {
  render: () => <CreateTaskBilling initialMode="contractor" />,
};

// ── Story 3 — InvoiceFromTask ─────────────────────────────────────────────────

/**
 * InvoiceFromTask — o resultado da ação contextual.
 * A task concluída vira invoice sem sair do fluxo: draft com número, valor em
 * mono tabular e status pill. Zero telas novas — cobrança nasce da task.
 */
export const InvoiceFromTask: Story = {
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--s-surface-page)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <Card style={{ width: 420 }}>
        <CardHeader>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--s-font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                color: "var(--s-ink-muted)",
              }}
            >
              Invoice · DFL-2026-0142
            </span>
            <Badge variant="warning">Draft</Badge>
          </div>
        </CardHeader>
        <CardContent style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--s-ink-primary)" }}>
              Validação de novos fluxos de pagamento
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--s-ink-muted)" }}>
              Gerada da task · modo contractor · João Pedro Danhoni
            </p>
          </div>

          <Separator />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--s-font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                color: "var(--s-ink-muted)",
              }}
            >
              Valor
            </span>
            <span
              style={{
                fontFamily: "var(--s-font-mono)",
                fontVariantNumeric: "tabular-nums",
                fontSize: 18,
                fontWeight: 600,
                color: "var(--s-brand-fg)",
              }}
            >
              {money(1250)}
            </span>
          </div>

          <Separator />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="outline" size="sm">
              <Paperclip size={14} strokeWidth={1.5} aria-hidden />
              Baixar PDF
            </Button>
            <Button variant="primary" size="sm">
              Enviar pra aprovação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
