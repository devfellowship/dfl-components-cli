import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpDown, MoreHorizontal, Plus, Search } from "lucide-react";
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
 */
const meta: Meta = {
  title: "Templates/ListPage",
  tags: ["autodocs"],
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

function statusVariant(status: string) {
  if (status === "Pago") return "default" as const;
  if (status === "Pendente") return "secondary" as const;
  return "destructive" as const;
}

/** PageHeader: title + subtitle on the left, primary action on the right. */
function PageHeader() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--foreground)" }}>Faturas</h1>
        <p style={{ color: "var(--muted-foreground)", margin: "4px 0 0" }}>
          Gerencie as faturas dos fellows.
        </p>
      </div>
      <Button size="sm">
        <Plus /> Nova Fatura
      </Button>
    </div>
  );
}

/** FilterBar: status/method Selects + a search Input. */
function FilterBar() {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
      <Select defaultValue="all">
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
      <Select defaultValue="all">
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
            width: 16,
            height: 16,
            color: "var(--muted-foreground)",
          }}
        />
        <Input placeholder="Buscar fatura ou fellow…" style={{ paddingLeft: 32 }} />
      </div>
    </div>
  );
}

function ListPagination() {
  return (
    <div style={{ marginTop: 16 }}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
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

function TableHeaderRow() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Fatura</TableHead>
        <TableHead>Fellow</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>
          <Button variant="ghost" size="sm" onClick={() => alert("toggle sort")}>
            Valor <ArrowUpDown />
          </Button>
        </TableHead>
        <TableHead style={{ width: 48 }} />
      </TableRow>
    </TableHeader>
  );
}

/** WithData — the populated list: header + filters + table + pagination. */
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
              <TableCell style={{ fontWeight: 500 }}>{inv.id}</TableCell>
              <TableCell>{inv.fellow}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
              </TableCell>
              <TableCell>{inv.amount}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Ações da linha"
                  onClick={() => alert(`actions for ${inv.id}`)}
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

/** Loading — skeleton rows while data is fetched. */
export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <PageHeader />
      <FilterBar />
      <Table>
        <TableHeaderRow />
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton style={{ height: 14, width: 72, borderRadius: 4 }} />
              </TableCell>
              <TableCell>
                <Skeleton style={{ height: 14, width: 120, borderRadius: 4 }} />
              </TableCell>
              <TableCell>
                <Skeleton style={{ height: 20, width: 72, borderRadius: 999 }} />
              </TableCell>
              <TableCell>
                <Skeleton style={{ height: 14, width: 80, borderRadius: 4 }} />
              </TableCell>
              <TableCell>
                <Skeleton style={{ height: 20, width: 20, borderRadius: 4 }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

/** Empty — no results, a friendly empty-state message + reset action. */
export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <PageHeader />
      <FilterBar />
      <Table>
        <TableHeaderRow />
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ color: "var(--muted-foreground)", margin: "0 0 12px" }}>
                Nenhuma fatura encontrada com esses filtros.
              </p>
              <Button variant="outline" size="sm" onClick={() => alert("limpar filtros")}>
                Limpar filtros
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
