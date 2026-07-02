import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpDown, Inbox, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { IconButton } from "../components/icon-button";
import { Skeleton } from "../components/skeleton";

/**
 * Table — one state per story.
 *
 * DS token contract (all resolved via component tokens → semantic tokens):
 *   --c-table-header-fg           header cell text (muted)
 *   --c-table-divider             row separator
 *   --c-table-row-hover-bg        hover background lift
 *   --c-table-row-selected-bg     selected row amber wash
 *   --c-table-row-selected-border selected row 2 px left border
 *   --c-table-caption-fg          caption / empty-state text
 *
 * ID cells:     add `font-mono text-[var(--s-ink-primary)]` via className.
 * Amount cells: add `font-mono text-[var(--s-ink-primary)] text-right`.
 * Focus ring:   built into <Button variant="ghost"> and <IconButton>.
 */
const meta: Meta<typeof Table> = {
  title: "Components/Organisms/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const invoices = [
  { id: "INV-001", status: "Pago",     method: "Cartão de Crédito", amount: "R$ 250,00" },
  { id: "INV-002", status: "Pendente", method: "Pix",               amount: "R$ 150,00" },
  { id: "INV-003", status: "Não Pago", method: "Boleto",            amount: "R$ 350,00" },
];

/** Map invoice status to the DS Badge semantic variant. */
function statusVariant(status: string): "success" | "warning" | "danger" {
  if (status === "Pago")     return "success";
  if (status === "Pendente") return "warning";
  return "danger";
}

// ---------------------------------------------------------------------------
// Story: WithData
// Populated table; validates --c-table-header-fg / --c-table-divider on render.
// ID cells:     font-mono (JetBrains Mono), ink-primary.
// Amount cells: font-mono, ink-primary, right-aligned.
// Badge:        success / warning / danger semantic tokens (not raw `default`).
// ---------------------------------------------------------------------------

/** Populated table: DS-token header, dividers, mono ID/amount cells, semantic badge variants. */
export const WithData: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista de faturas recentes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            {/* ID cell: JetBrains Mono via font-mono, ink-primary prominence */}
            <TableCell className="font-mono text-[12px] font-medium text-[var(--s-ink-primary)] tracking-[0.2px]">
              {inv.id}
            </TableCell>
            {/* Badge: semantic --s-{intent}-* tokens */}
            <TableCell>
              <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
            </TableCell>
            <TableCell>{inv.method}</TableCell>
            {/* Amount cell: JetBrains Mono, right-align, ink-primary */}
            <TableCell className="font-mono text-[13px] font-medium text-[var(--s-ink-primary)] tracking-[-0.2px] text-right">
              {inv.amount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// ---------------------------------------------------------------------------
// Story: RowHover
// Demonstrates --c-table-row-hover-bg (not raw bg-muted/50).
// One row is frozen in hover via inline style to make the token visible in a
// static story; ink lifts to --s-ink-primary on the hovered row.
// ---------------------------------------------------------------------------

/** Hover state: middle row shows --c-table-row-hover-bg and lifted --s-ink-primary ink. */
export const RowHover: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Default row */}
        <TableRow>
          <TableCell className="font-mono text-[12px] font-medium text-[var(--s-ink-primary)] tracking-[0.2px]">
            {invoices[0].id}
          </TableCell>
          <TableCell><Badge variant="success">{invoices[0].status}</Badge></TableCell>
          <TableCell>{invoices[0].method}</TableCell>
          <TableCell className="font-mono text-[13px] font-medium text-[var(--s-ink-primary)] tracking-[-0.2px] text-right">
            {invoices[0].amount}
          </TableCell>
        </TableRow>

        {/* Hover-state row: bg via --c-table-row-hover-bg; ink lifts to --s-ink-primary */}
        <TableRow style={{ backgroundColor: "var(--c-table-row-hover-bg)" }} aria-current="true">
          <TableCell
            className="font-mono text-[12px] font-medium tracking-[0.2px]"
            style={{ color: "var(--s-ink-primary)" }}
          >
            {invoices[1].id}
          </TableCell>
          <TableCell><Badge variant="warning">{invoices[1].status}</Badge></TableCell>
          <TableCell style={{ color: "var(--s-ink-primary)" }}>{invoices[1].method}</TableCell>
          <TableCell
            className="font-mono text-[13px] font-medium tracking-[-0.2px] text-right"
            style={{ color: "var(--s-ink-primary)" }}
          >
            {invoices[1].amount}
          </TableCell>
        </TableRow>

        {/* Default row */}
        <TableRow>
          <TableCell className="font-mono text-[12px] font-medium text-[var(--s-ink-primary)] tracking-[0.2px]">
            {invoices[2].id}
          </TableCell>
          <TableCell><Badge variant="danger">{invoices[2].status}</Badge></TableCell>
          <TableCell>{invoices[2].method}</TableCell>
          <TableCell className="font-mono text-[13px] font-medium text-[var(--s-ink-primary)] tracking-[-0.2px] text-right">
            {invoices[2].amount}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// ---------------------------------------------------------------------------
// Story: RowSelected
// data-state="selected" triggers:
//   bg   → --c-table-row-selected-bg  (brand-subtle amber wash)
//   left → 2 px --c-table-row-selected-border  (brand-border)
// ---------------------------------------------------------------------------

/** Selected row: brand-subtle amber wash + 2 px left-border signal via DS component tokens. */
export const RowSelected: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Default row */}
        <TableRow>
          <TableCell className="font-mono text-[12px] font-medium text-[var(--s-ink-primary)] tracking-[0.2px]">
            {invoices[0].id}
          </TableCell>
          <TableCell><Badge variant="success">{invoices[0].status}</Badge></TableCell>
          <TableCell>{invoices[0].method}</TableCell>
          <TableCell className="font-mono text-[13px] font-medium text-[var(--s-ink-primary)] tracking-[-0.2px] text-right">
            {invoices[0].amount}
          </TableCell>
        </TableRow>

        {/* Selected row: data-state triggers --c-table-row-selected-bg + 2 px left border */}
        <TableRow data-state="selected">
          <TableCell className="font-mono text-[12px] font-medium text-[var(--s-ink-primary)] tracking-[0.2px]">
            {invoices[1].id}
          </TableCell>
          <TableCell><Badge variant="warning">{invoices[1].status}</Badge></TableCell>
          <TableCell>{invoices[1].method}</TableCell>
          <TableCell className="font-mono text-[13px] font-medium text-[var(--s-ink-primary)] tracking-[-0.2px] text-right">
            {invoices[1].amount}
          </TableCell>
        </TableRow>

        {/* Default row */}
        <TableRow>
          <TableCell className="font-mono text-[12px] font-medium text-[var(--s-ink-primary)] tracking-[0.2px]">
            {invoices[2].id}
          </TableCell>
          <TableCell><Badge variant="danger">{invoices[2].status}</Badge></TableCell>
          <TableCell>{invoices[2].method}</TableCell>
          <TableCell className="font-mono text-[13px] font-medium text-[var(--s-ink-primary)] tracking-[-0.2px] text-right">
            {invoices[2].amount}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// ---------------------------------------------------------------------------
// Story: SortableHeader
// <Button variant="ghost" size="sm"> carries the DS FOCUS_BRAND ring automatically.
// Active-sort column header text: color → var(--s-brand-solid) (amber).
// ---------------------------------------------------------------------------

/** Sort buttons with amber active-column highlight and DS focus ring on :focus-visible. */
export const SortableHeader: Story = {
  render: () => {
    const [sortField, setSortField] = React.useState<"amount" | "status" | null>("amount");
    const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

    const toggle = (field: "amount" | "status") => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("desc");
      }
    };

    const sorted = [...invoices].sort((a, b) => {
      if (sortField === "amount") {
        const parse = (s: string) =>
          parseFloat(s.replace(/[^0-9,]/g, "").replace(",", "."));
        return sortDir === "desc"
          ? parse(b.amount) - parse(a.amount)
          : parse(a.amount) - parse(b.amount);
      }
      if (sortField === "status") {
        return sortDir === "desc"
          ? b.status.localeCompare(a.status)
          : a.status.localeCompare(b.status);
      }
      return 0;
    });

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {/* ghost Button: FOCUS_BRAND ring built in; active-sort gets amber color */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggle("amount")}
                style={sortField === "amount" ? { color: "var(--s-brand-solid)" } : undefined}
              >
                Valor <ArrowUpDown />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggle("status")}
                style={sortField === "status" ? { color: "var(--s-brand-solid)" } : undefined}
              >
                Status <ArrowUpDown />
              </Button>
            </TableHead>
            <TableHead>Método</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-mono text-[13px] font-medium text-[var(--s-ink-primary)] tracking-[-0.2px]">
                {inv.amount}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
              </TableCell>
              <TableCell>{inv.method}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// ---------------------------------------------------------------------------
// Story: RowActions
// <IconButton variant="ghost" size="sm"> carries the DS amber focus ring on
// :focus-visible. Hover on the row resolves via --c-table-row-hover-bg.
// ---------------------------------------------------------------------------

/** Row trailing ghost icon-button; DS amber focus ring via IconButton on :focus-visible. */
export const RowActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[52px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-mono text-[12px] font-medium text-[var(--s-ink-primary)] tracking-[0.2px]">
              {inv.id}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
            </TableCell>
            <TableCell>
              {/* IconButton ghost: uniform DS focus ring (0 0 0 2px page, 0 0 0 3px #E07A4A) on :focus-visible */}
              <IconButton
                variant="ghost"
                size="sm"
                aria-label={`Ações da linha ${inv.id}`}
                onClick={() => undefined}
              >
                <MoreHorizontal />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// ---------------------------------------------------------------------------
// Story: EmptyState
// Full-width colSpan cell; color via --c-table-caption-fg (→ --s-ink-muted).
// Icon at 0.35 opacity for delicacy; header stays visible for structural context.
// ---------------------------------------------------------------------------

/** Empty state: colSpan cell uses --c-table-caption-fg; no raw color value leaks. */
export const EmptyState: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {/*
           * Empty cell color via --c-table-caption-fg (→ --s-ink-muted = #7d7568).
           * No raw color literal — the component token is the single source of truth.
           */}
          <TableCell
            colSpan={4}
            className="text-center py-10 text-[var(--c-table-caption-fg)]"
          >
            <Inbox
              className="mx-auto mb-2.5"
              style={{ width: 36, height: 36, opacity: 0.35 }}
              strokeWidth={1.4}
            />
            <p className="text-[13px]">Nenhuma fatura encontrada</p>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// ---------------------------------------------------------------------------
// Story: SkeletonLoadingRows
// Pulsing Skeleton per cell; pill-radius for status slot; staggered delays.
// Header stays visible for structural clarity during load.
// ---------------------------------------------------------------------------

/** Loading state: skeleton rows with staggered animation; header visible for context. */
export const SkeletonLoadingRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 4 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton style={{ height: 13, width: 52 + (i % 3) * 6, borderRadius: 4 }} />
            </TableCell>
            <TableCell>
              <Skeleton
                style={{
                  height: 20,
                  width: 64 + (i % 3) * 8,
                  borderRadius: 999,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                style={{
                  height: 13,
                  width: 60 + (i % 2) * 30,
                  borderRadius: 4,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton
                style={{
                  height: 13,
                  width: 60 + (i % 2) * 12,
                  borderRadius: 4,
                  marginLeft: "auto",
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
