import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpDown, MoreHorizontal, Plus, Search, SearchX } from "lucide-react";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { Skeleton } from "../../components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";

/**
 * Templates/ListPage — page-level composition, NOT a new component.
 *
 * The recurring "list page" archetype (learn Projects/Members, payments
 * Invoices, plans PlanList): a PageHeader (title + primary-action Button), a
 * FilterBar (Select filters + search Input), a sortable Table with
 * skeleton-loading + empty-state, and Pagination. COMPOSES existing
 * `@devfellowship/components` primitives only.
 *
 * DS token alignment (DS v0):
 *   Badge status     → semantic variants (success/warning/danger) via --s-*
 *   Cell typography  → JetBrains Mono via --s-font-mono + --c-listpage-cell-*
 *   Pagination active → subtle amber tint via --c-listpage-pagination-active-*
 *                        (NOT solid fill — avoids competing with primary actions)
 *   Focus ring       → DS uniform: box-shadow 0 0 0 2px var(--background), 0 0 0 3px #E07A4A
 *   Empty state      → three-part anatomy (icon + title + sub-line + CTA)
 *   Skeleton shimmer → .dfl-skeleton (--c-skeleton-bg → --c-skeleton-shimmer surface ramp)
 *
 * One story per state: WithData | WithDataFocusStates | Loading | Empty.
 */
const meta: Meta = {
  title: "Templates/ListPage",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

const invoices = [
  { id: "INV-001", fellow: "Ana Costa", status: "Pago", method: "Pix", amount: "R$ 250,00" },
  { id: "INV-002", fellow: "Bruno Lima", status: "Pendente", method: "Cartão", amount: "R$ 150,00" },
  { id: "INV-003", fellow: "Carla Dias", status: "Não Pago", method: "Boleto", amount: "R$ 350,00" },
  { id: "INV-004", fellow: "Diego Reis", status: "Pago", method: "Pix", amount: "R$ 480,00" },
  { id: "INV-005", fellow: "Elena Moura", status: "Pendente", method: "Cartão", amount: "R$ 120,00" },
];

/**
 * Map invoice status → semantic Badge variant.
 * DS rule: use --s-{intent}-* tokens, NOT palette aliases.
 *   "Pago"     → success  (--s-success-subtle / --s-success-fg / --s-success-border)
 *   "Pendente" → warning  (--s-warning-*)
 *   "Não Pago" → danger   (--s-danger-*)
 * Retired: default/secondary/destructive mappings that leaked palette semantics
 * (amber ≠ paid; gray ≠ pending urgency; solid red ≠ subtle danger).
 */
function statusVariant(status: string): "success" | "warning" | "danger" {
  if (status === "Pago") return "success";
  if (status === "Pendente") return "warning";
  return "danger";
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function PageHeader({ disableCta = false }: { disableCta?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 16,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            color: "var(--foreground)",
            letterSpacing: "-0.25px",
          }}
        >
          Faturas
        </h1>
        <p style={{ color: "var(--muted-foreground)", margin: "4px 0 0", fontSize: 13 }}>
          Gerencie as faturas dos fellows.
        </p>
      </div>
      <Button size="sm" disabled={disableCta}>
        <Plus /> Nova Fatura
      </Button>
    </div>
  );
}

function FilterBar({
  disabled = false,
  activeStatus,
  searchValue,
}: {
  disabled?: boolean;
  /** Controlled status filter (e.g. "unpaid" for Empty state context) */
  activeStatus?: string;
  /** Pre-filled search term (e.g. "José" for Empty state context) */
  searchValue?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 12,
        flexWrap: "wrap",
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : undefined,
      }}
    >
      <Select defaultValue={activeStatus ?? "all"} disabled={disabled}>
        <SelectTrigger style={{ width: 160 }}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="paid">Pago</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="unpaid">Não Pago</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all" disabled={disabled}>
        <SelectTrigger style={{ width: 160 }}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os métodos</SelectItem>
          <SelectItem value="pix">Pix</SelectItem>
          <SelectItem value="card">Cartão</SelectItem>
          <SelectItem value="boleto">Boleto</SelectItem>
        </SelectContent>
      </Select>
      <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
        <Search
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 14,
            height: 14,
            color: "var(--muted-foreground)",
            pointerEvents: "none",
          }}
        />
        <Input
          placeholder="Buscar fatura ou fellow…"
          defaultValue={searchValue}
          style={{ paddingLeft: 32 }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function TableHeaderRow() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Fatura</TableHead>
        <TableHead>Fellow</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>
          <Button variant="ghost" size="sm">
            Valor <ArrowUpDown />
          </Button>
        </TableHead>
        <TableHead style={{ width: 48 }} />
      </TableRow>
    </TableHeader>
  );
}

/**
 * Active pagination tile styled with the DS amber-TINTED treatment.
 * --c-listpage-pagination-active-bg  → --s-brand-subtle  (8–10% amber tint)
 * --c-listpage-pagination-active-border → --s-brand-border (22% amber stroke)
 * --c-listpage-pagination-active-fg  → --s-brand-solid   (#E07A4A amber text)
 *
 * Inline styles override the component's default --c-pagination-active-bg
 * (which is --s-brand-solid / solid fill). The subtle tint visually marks
 * "current page" without competing with solid primary action buttons.
 */
const activeTileStyle = {
  background: "var(--c-listpage-pagination-active-bg)",
  border: "1px solid var(--c-listpage-pagination-active-border)",
  color: "var(--c-listpage-pagination-active-fg)",
  fontWeight: 600,
} as const;

function ListPagination() {
  return (
    <div style={{ marginTop: 16 }}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            {/* isActive adds aria-current="page" + pointer-events-none;
                style override replaces solid amber fill with subtle tint. */}
            <PaginationLink href="#" isActive style={activeTileStyle}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// ─── Story 1: WithData ───────────────────────────────────────────────────────
/**
 * WithData — populated invoice list.
 *
 * Fixes applied in this story:
 *   1. Badge semantic colors  — success/warning/danger (retire default/secondary/destructive)
 *   2. JetBrains Mono cells  — invoice IDs via --s-font-mono + --c-listpage-cell-id-fg;
 *                               monetary amounts via --s-font-mono + --c-listpage-cell-amount-fg
 *   3. Pagination active tile — amber-tinted (--c-listpage-pagination-active-*) not solid fill
 */
export const WithData: Story = {
  render: () => (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <PageHeader />
      <FilterBar />
      <Table>
        <TableHeaderRow />
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>
                {/* DS spec: identifiers/codes → JetBrains Mono */}
                <code
                  style={{
                    fontFamily: "var(--s-font-mono)",
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    color: "var(--c-listpage-cell-id-fg)",
                  }}
                >
                  {inv.id}
                </code>
              </TableCell>
              <TableCell>{inv.fellow}</TableCell>
              <TableCell>
                {/* DS spec: status badge → semantic variant (no palette alias) */}
                <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
              </TableCell>
              <TableCell>
                {/* DS spec: numeric amounts → JetBrains Mono */}
                <span
                  style={{
                    fontFamily: "var(--s-font-mono)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--c-listpage-cell-amount-fg)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {inv.amount}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Ações para ${inv.id}`}
                >
                  <MoreHorizontal />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ListPagination />
    </div>
  ),
};

// ─── Story 2: WithDataFocusStates ────────────────────────────────────────────
/**
 * WithData — FocusStates
 *
 * Shows every interactive element in the DS uniform focus ring state.
 * Ring spec (DS v0 §5.2 Focus Ring):
 *   box-shadow: 0 0 0 2px var(--background), 0 0 0 3px #E07A4A
 *   Crisp 2px page-bg gap + 1px solid amber — no blur, no animation.
 *
 * Applied via inline `style` to simulate keyboard-focus visually (Storybook
 * static stories cannot programmatically focus elements without a play function).
 *
 * Elements audited: Select trigger, Input, sort Button, row-action icon Button,
 * pagination link — all should show the amber double-shadow ring on focus.
 */

/** DS uniform focus ring applied inline to force-visible state in the story. */
const dsFocusRing = {
  boxShadow: "0 0 0 2px var(--background), 0 0 0 3px #E07A4A",
  outline: "none",
} as const;

export const WithDataFocusStates: Story = {
  name: "WithData — FocusStates",
  render: () => (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      {/* Focus ring callout — every interactive element type shown focused */}
      <div
        style={{
          background: "var(--s-surface-panel)",
          border: "1px solid var(--s-border-subtle)",
          borderRadius: "var(--p-radius-lg)",
          padding: "14px 16px",
          marginBottom: 32,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.6px",
            textTransform: "uppercase" as const,
            color: "var(--s-ink-muted)",
            marginRight: 4,
          }}
        >
          Focus ring (uniform DS spec)
        </span>
        {/* Primary Button focused */}
        <Button size="sm" style={dsFocusRing}>
          <Plus /> Nova Fatura
        </Button>
        {/* Select trigger focused */}
        <Select defaultValue="all">
          <SelectTrigger style={{ width: 150, ...dsFocusRing }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
          </SelectContent>
        </Select>
        {/* Search Input focused */}
        <div style={{ position: "relative", width: 180 }}>
          <Search
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 14,
              height: 14,
              color: "var(--s-ink-muted)",
              pointerEvents: "none",
            }}
          />
          <Input placeholder="Buscar…" style={{ paddingLeft: 32, ...dsFocusRing }} />
        </div>
        {/* Sort Button focused */}
        <Button variant="ghost" size="sm" style={dsFocusRing}>
          Valor <ArrowUpDown />
        </Button>
        {/* Row action icon Button focused */}
        <Button variant="ghost" size="icon-sm" aria-label="Ações da linha" style={dsFocusRing}>
          <MoreHorizontal />
        </Button>
        {/* Pagination link focused */}
        <a
          href="#"
          aria-label="Page 2"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: 4,
            color: "var(--s-ink-muted)",
            fontSize: 13,
            textDecoration: "none",
            ...dsFocusRing,
          }}
        >
          2
        </a>
        {/* Spec annotation */}
        <code
          style={{
            fontFamily: "var(--s-font-mono)",
            fontSize: 11,
            color: "var(--s-ink-muted)",
            padding: "3px 8px",
            background: "var(--s-surface-raised)",
            borderRadius: "var(--p-radius-sm)",
            whiteSpace: "nowrap" as const,
          }}
        >
          box-shadow: 0 0 0 2px bg, 0 0 0 3px #E07A4A
        </code>
      </div>

      {/* Full page below — row action buttons shown in focused state for context */}
      <PageHeader />
      <FilterBar />
      <Table>
        <TableHeaderRow />
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>
                <code
                  style={{
                    fontFamily: "var(--s-font-mono)",
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    color: "var(--c-listpage-cell-id-fg)",
                  }}
                >
                  {inv.id}
                </code>
              </TableCell>
              <TableCell>{inv.fellow}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
              </TableCell>
              <TableCell>
                <span
                  style={{
                    fontFamily: "var(--s-font-mono)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--c-listpage-cell-amount-fg)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {inv.amount}
                </span>
              </TableCell>
              <TableCell>
                {/* Row action icon shown in focused state to confirm DS ring */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Ações para ${inv.id}`}
                  style={dsFocusRing}
                >
                  <MoreHorizontal />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ListPagination />
    </div>
  ),
};

// ─── Story 3: Loading ────────────────────────────────────────────────────────
/**
 * Loading — skeleton rows while data is fetched.
 *
 * Fixes applied:
 *   - `aria-busy="true"` + `aria-label="Carregando faturas"` on the table
 *     element (ARIA live-region pattern for loading tables).
 *   - Skeleton uses `.dfl-skeleton` class (via the Skeleton component) which
 *     applies the DS surface-ramp shimmer:
 *     `--c-skeleton-bg` (--s-surface-elevated) → `--c-skeleton-shimmer` (--s-border-subtle)
 *     so the animation reads against the dark page background.
 *   - Badge column skeleton uses border-radius pill to match actual badge shape.
 *   - Filter bar + CTA are disabled/dimmed (opacity 0.5) during load.
 */
export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <PageHeader disableCta />
      <FilterBar disabled />
      {/* aria-busy + aria-label give assistive technology the loading signal */}
      <Table aria-busy="true" aria-label="Carregando faturas">
        <TableHeaderRow />
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                {/* ID column — narrow fixed-width skeleton */}
                <Skeleton
                  style={{
                    height: 13,
                    width: 60,
                    borderRadius: "var(--c-skeleton-radius-sm)",
                  }}
                />
              </TableCell>
              <TableCell>
                {/* Name column — varying widths avoid uniform-bar look */}
                <Skeleton
                  style={{
                    height: 13,
                    width: [100, 120, 88, 108, 80][i],
                    borderRadius: "var(--c-skeleton-radius-sm)",
                  }}
                />
              </TableCell>
              <TableCell>
                {/* Status column — pill radius matches badge shape */}
                <Skeleton
                  style={{
                    height: 20,
                    width: [60, 72, 80, 60, 68][i],
                    borderRadius: "var(--p-radius-pill)",
                  }}
                />
              </TableCell>
              <TableCell>
                {/* Amount column */}
                <Skeleton
                  style={{
                    height: 13,
                    width: [72, 64, 72, 80, 68][i],
                    borderRadius: "var(--c-skeleton-radius-sm)",
                  }}
                />
              </TableCell>
              <TableCell>
                {/* Action icon */}
                <Skeleton
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: "var(--c-skeleton-radius-sm)",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

// ─── Story 4: Empty ──────────────────────────────────────────────────────────
/**
 * Empty — no results, with a three-part empty-state anatomy.
 *
 * Upgraded from bare `<p>` to a structured empty state:
 *   1. Icon in a raised container (--c-listpage-empty-icon-{bg,border,fg})
 *   2. Bold title line           (--c-listpage-empty-title-fg, font-weight: 600)
 *   3. Muted sub-line            (--c-listpage-empty-sub-fg)
 *   4. Outline CTA Button        (variant="outline" uses --c-button-* + DS focus ring)
 *
 * FilterBar shows an active status filter + search term to contextualise
 * why there are no results.
 */
export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <PageHeader />
      {/* Active filter context — "Não Pago" + search term "José" → 0 results */}
      <FilterBar activeStatus="unpaid" searchValue="José" />
      <Table>
        <TableHeaderRow />
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} style={{ padding: 0 }}>
              {/* Three-part empty-state layout */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "52px 24px",
                  gap: 12,
                }}
              >
                {/* 1. Icon in a raised container */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "var(--c-listpage-empty-icon-bg)",
                    border: "1px solid var(--c-listpage-empty-icon-border)",
                    borderRadius: "var(--p-radius-lg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--c-listpage-empty-icon-fg)",
                    marginBottom: 4,
                    flexShrink: 0,
                  }}
                >
                  <SearchX size={20} strokeWidth={1.5} aria-hidden="true" />
                </div>
                {/* 2. Bold title line */}
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--c-listpage-empty-title-fg)",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Nenhuma fatura encontrada
                </p>
                {/* 3. Muted sub-line */}
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--c-listpage-empty-sub-fg)",
                    margin: 0,
                    textAlign: "center",
                    maxWidth: 280,
                  }}
                >
                  Tente ajustar os filtros ou limpar a busca para ver mais resultados.
                </p>
                {/* 4. Outline CTA — DS focus ring applied by Button component */}
                <Button variant="outline" size="sm">
                  Limpar filtros
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
