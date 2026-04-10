import type { Meta, StoryObj } from "@storybook/react";
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

const meta: Meta<typeof Table> = {
  title: "Primitivos/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const invoices = [
  { id: "INV001", status: "Pago", method: "Cartão", amount: "R$ 250,00" },
  { id: "INV002", status: "Pendente", method: "Pix", amount: "R$ 150,00" },
  { id: "INV003", status: "Não Pago", method: "Boleto", amount: "R$ 350,00" },
];

export const Default: Story = {
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
