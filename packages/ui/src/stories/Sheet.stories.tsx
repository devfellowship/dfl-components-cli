import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/sheet";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";

const meta: Meta<typeof Sheet> = {
  title: "Components/Organisms/Sheet",
  component: Sheet,
  argTypes: {
    // Sheet is the Radix Root; the visible side is controlled on SheetContent.
    defaultOpen: { control: "boolean", description: "Open on mount (uncontrolled)." },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

/** Right-side sheet — the default. The dominant fleet pattern (detail / edit panel). */
export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Abrir painel</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Detalhes do fellow</SheetTitle>
          <SheetDescription>Painel lateral que desliza a partir da direita.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

/** Left-side sheet — the mobile-sidebar / off-canvas navigation pattern. */
export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir menu</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navegação</SheetTitle>
          <SheetDescription>Menu mobile que desliza a partir da esquerda.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

/** Top-side sheet — banner / global-notice pattern. */
export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Abrir aviso</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Aviso importante</SheetTitle>
          <SheetDescription>Sheet que desce a partir do topo.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

/** Bottom-side sheet — the mobile action-sheet pattern. */
export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Abrir ações</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Ações rápidas</SheetTitle>
          <SheetDescription>Action sheet que sobe a partir da base.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

/** A form inside a right sheet with a footer save/cancel — edit-in-panel pattern. */
export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Editar perfil</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Editar perfil</SheetTitle>
          <SheetDescription>Faça alterações e salve quando terminar.</SheetDescription>
        </SheetHeader>
        <div style={{ display: "grid", gap: "16px", padding: "16px 0" }}>
          <div style={{ display: "grid", gap: "8px" }}>
            <Label htmlFor="sheet-name">Nome</Label>
            <Input id="sheet-name" defaultValue="Pedro Duarte" />
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            <Label htmlFor="sheet-username">Username</Label>
            <Input id="sheet-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button type="submit">Salvar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
