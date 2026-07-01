import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";

const meta: Meta<typeof Dialog> = {
  title: "Components/Organisms/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/** A form rendered inside the dialog body (edit-profile pattern). */
export const FormInDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div style={{ display: "grid", gap: "16px", padding: "16px 0" }}>
          <div style={{ display: "grid", gap: "8px" }}>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" defaultValue="Pedro Duarte" />
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@peduarte" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Header (title + description) + a confirm/cancel footer — no form body. */
export const HeaderDescFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publicar aula?</DialogTitle>
          <DialogDescription>
            A aula ficará visível para todos os fellows imediatamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Publicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Footer confirm action in its loading state. */
export const LoadingFooter: Story = {
  render: () => (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvando alterações</DialogTitle>
          <DialogDescription>Aguarde enquanto persistimos os dados.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled>
            Cancelar
          </Button>
          <Button loading>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
