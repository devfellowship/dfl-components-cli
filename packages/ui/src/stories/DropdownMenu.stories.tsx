import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { MoreHorizontal, Pencil, Copy, Trash2, User, CreditCard, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../components/dropdown-menu";
import { Button } from "../components/button";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/Organisms/DropdownMenu",
  component: DropdownMenu,
  argTypes: {
    defaultOpen: { control: "boolean", description: "Open on mount (uncontrolled)." },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

/** The dominant fleet pattern: a ⋯ icon button opening row-actions. */
export const TriggerIcon: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Ações">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          Duplicar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Row-actions menu with a destructive delete item (red). */
export const WithDestructiveItem: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Ações">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Labelled groups split by separators — a user/account menu. */
export const WithGroupsAndSeparators: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Minha conta</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Conta</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Pagamentos
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sistema</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings />
            Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

function CheckboxItemsDemo() {
  const [showStatus, setShowStatus] = React.useState(true);
  const [showEmail, setShowEmail] = React.useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Colunas</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Exibir colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showEmail} onCheckedChange={setShowEmail}>
          Email
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Toggleable checkbox items — a column-visibility / view-options menu. */
export const WithCheckboxItems: Story = {
  render: () => <CheckboxItemsDemo />,
};
