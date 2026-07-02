import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import { Skeleton } from "../components/skeleton";

/**
 * Table — one state per story: populated, loading (skeleton rows), empty,
 * a sortable header, and a row with actions. Do NOT gallery these.
 */
const meta: Meta<typeof Table> = {
  title: "Components/Organisms/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

const invoices = [
  { id: "INV001", status: "Pago", method: "Cartão", amount: "R$ 250,00" },
  { id: "INV002", status: "Pendente", method: "Pix", amount: "R$ 150,00" },
  { id: "INV003", status: "Não Pago", method: "Boleto", amount: "R$ 350,00" },
];

/** Populated table with data rows. */
export const WithData: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista de faturas recentes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead style={{ textAlign: "right" }}>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell style={{ fontWeight: 500 }}>{inv.id}</TableCell>
            <TableCell>
              <Badge variant={inv.status === "Pago" ? "default" : inv.status === "Pendente" ? "secondary" : "destructive"}>
                {inv.status}
              </Badge>
            </TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell style={{ textAlign: "right" }}>{inv.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Loading state — skeleton placeholders in each body row. */
export const SkeletonLoadingRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead style={{ textAlign: "right" }}>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 4 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton style={{ height: 14, width: 64, borderRadius: 4 }} /></TableCell>
            <TableCell><Skeleton style={{ height: 20, width: 72, borderRadius: 999 }} /></TableCell>
            <TableCell><Skeleton style={{ height: 14, width: 80, borderRadius: 4 }} /></TableCell>
            <TableCell style={{ textAlign: "right" }}>
              <Skeleton style={{ height: 14, width: 72, borderRadius: 4, marginLeft: "auto" }} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Empty state — no rows, a friendly message spanning the table. */
export const EmptyState: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead style={{ textAlign: "right" }}>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} style={{ textAlign: "center", padding: "32px 0", color: "var(--s-ink-muted)" }}>
            Nenhuma fatura encontrada.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/** A sortable column header (button with a sort affordance). */
export const SortableHeader: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" size="sm" onClick={() => alert("toggle sort")}>
              Valor <ArrowUpDown />
            </Button>
          </TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell>{inv.amount}</TableCell>
            <TableCell>{inv.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** A row with a trailing actions affordance. */
export const RowActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead style={{ width: 48 }} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell style={{ fontWeight: 500 }}>{inv.id}</TableCell>
            <TableCell>{inv.status}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon-sm" aria-label="Ações da linha" onClick={() => alert(`actions for ${inv.id}`)}>
                <MoreHorizontal />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
