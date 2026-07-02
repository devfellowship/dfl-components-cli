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

/**
 * Dialog — DFL DS v0 one-state-per-story.
 *
 * Stories rendered with the dialog open so the full visual is immediately
 * observable in the Storybook canvas without a click to open.
 *
 * Token consumption (all fixed from vanilla shadcn):
 *   --c-dialog-scrim  → overlay background (warm, not cold black)
 *   --c-dialog-bg     → panel background
 *   --c-dialog-border → panel border
 *   --c-dialog-radius → 14px corners (was 8px sm:rounded-lg)
 *   --c-dialog-shadow → elevation shadow
 *   Uniform focus ring: box-shadow 0 0 0 2px --c-dialog-bg, 0 0 0 3px #E07A4A
 */
const meta: Meta<typeof Dialog> = {
  title: "Components/Organisms/Dialog",
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/**
 * Default open state: form with two inputs and Save/Cancel footer.
 * Canonical story — exercises the overlay, panel bg, border, radius, and shadow tokens.
 */
export const FormInDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div style={{ display: "grid", gap: "14px", padding: "8px 0 20px" }}>
          <div style={{ display: "grid", gap: "6px" }}>
            <Label htmlFor="dlg-name">Nome</Label>
            <Input id="dlg-name" defaultValue="Pedro Duarte" />
          </div>
          <div style={{ display: "grid", gap: "6px" }}>
            <Label htmlFor="dlg-username">Username</Label>
            <Input id="dlg-username" defaultValue="@peduarte" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Same form dialog with the first input in :focus-visible state.
 * Demonstrates the uniform amber focus ring on inputs (2px gap + 1px #E07A4A).
 */
export const FormInDialogInputFocused: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div style={{ display: "grid", gap: "14px", padding: "8px 0 20px" }}>
          <div style={{ display: "grid", gap: "6px" }}>
            <Label htmlFor="dlg-name-f">Nome</Label>
            {/* autoFocus makes the amber focus ring immediately visible in the canvas */}
            <Input id="dlg-name-f" defaultValue="Pedro Duarte" autoFocus />
          </div>
          <div style={{ display: "grid", gap: "6px" }}>
            <Label htmlFor="dlg-username-f">Username</Label>
            <Input id="dlg-username-f" defaultValue="@peduarte" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Confirm pattern: title + description + Cancel/Publish footer, no form body.
 */
export const HeaderDescFooter: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publicar aula?</DialogTitle>
          <DialogDescription>
            A aula ficará visível para todos os fellows imediatamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button variant="outline">Cancelar</Button>
          <Button>Publicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Action in-progress: Cancel disabled, primary button in loading spinner state.
 * No close button rendered; escape key and outside-click are disabled.
 */
export const LoadingFooter: Story = {
  render: () => (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showClose={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Salvando alterações</DialogTitle>
          <DialogDescription>Aguarde enquanto persistimos os dados.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button variant="outline" disabled>
            Cancelar
          </Button>
          <Button loading>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Danger variant: title styled in --s-danger-fg (red-400), Excluir uses
 * btn-destructive, footer separated from body by a --s-border-subtle rule.
 */
export const DestructiveConfirm: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[var(--s-danger-fg)]">Excluir aula?</DialogTitle>
          <DialogDescription>
            Esta ação é irreversível. O conteúdo da aula será permanentemente removido.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-1 border-t border-[var(--s-border-subtle)] pt-4">
          <Button variant="ghost">Cancelar</Button>
          <Button variant="destructive">Excluir aula</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Close button in :focus-visible state — demonstrates the uniform DFL focus ring
 * (box-shadow: 0 0 0 2px --c-dialog-bg, 0 0 0 3px #E07A4A) applied to the X button.
 * The autoFocusClose prop makes the ring immediately visible on canvas load.
 */
export const CloseButtonFocused: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent autoFocusClose>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Close button receives the uniform DFL focus ring — 2px gap (dialog-bg) + 1px amber #E07A4A.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button variant="outline">Cancelar</Button>
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
