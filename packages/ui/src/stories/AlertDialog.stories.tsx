import type { Meta, StoryObj } from "@storybook/react";
import { TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/alert-dialog";
import { Button } from "../components/button";

/**
 * AlertDialog — DFL DS v0
 *
 * Organism-level confirmation modal. Two semantic action variants:
 *   Default     — neutral amber primary action
 *   Destructive — danger ghost-outline action (--s-danger-* tokens)
 *
 * All focusable elements (Cancel, Action, Trigger) carry the uniform amber
 * focus ring: box-shadow 0 0 0 2px var(--background), 0 0 0 3px #E07A4A.
 *
 * Component tokens: --c-alert-dialog-{bg,border,radius,shadow,scrim,title-fg,desc-fg}
 * One story per state — no gallery stories.
 */
const meta: Meta<typeof AlertDialog> = {
  title: "Components/Organisms/AlertDialog",
  component: AlertDialog,
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

/** ── 1. Default — open dialog with neutral (amber primary) action button ── */
export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Excluir conta</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Sua conta será permanentemente
            removida dos nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * ── 2. Destructive — open dialog with danger icon badge and red action
 *       button (--s-danger-subtle bg, --s-danger-fg text, --s-danger-border).
 */
export const Destructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Excluir conta</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Danger icon badge — bg: --s-danger-subtle, border: --s-danger-border */}
          <div
            className="flex items-center justify-center w-9 h-9 rounded-[8px] mb-1"
            style={{
              background: "var(--s-danger-subtle)",
              border: "1px solid var(--s-danger-border)",
            }}
          >
            <TriangleAlert
              className="size-[18px]"
              style={{ color: "var(--s-danger-fg)" }}
            />
          </div>
          <AlertDialogTitle>Excluir conta permanentemente?</AlertDialogTitle>
          <AlertDialogDescription>
            Todos os seus dados, histórico de aprendizagem e progresso serão
            apagados. Esta ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Sim, excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * ── 3. CancelFocused — Default dialog with Cancel button in focus-visible
 *       state. Demonstrates the uniform amber ring on the outline/cancel button.
 *       Dialog pre-opened; autoFocus on Cancel triggers :focus-visible path.
 */
export const CancelFocused: Story = {
  render: () => (
    <AlertDialog open onOpenChange={() => undefined}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/*
           * The className below forces the focus-ring visual state for story
           * documentation purposes — ring-0 overrides the button's ring-3,
           * shadow applies the uniform 2px-gap + 1px-amber two-layer ring.
           */}
          <AlertDialogCancel
            className="ring-0 shadow-[0_0_0_2px_var(--background),0_0_0_3px_#E07A4A]"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * ── 4. ActionFocused — Default dialog with the amber Action button in
 *       focus-visible state. Uniform ring: same box-shadow regardless of
 *       button color (amber on amber still visible via the 2px page-bg gap).
 */
export const ActionFocused: Story = {
  render: () => (
    <AlertDialog open onOpenChange={() => undefined}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="ring-0 shadow-[0_0_0_2px_var(--background),0_0_0_3px_#E07A4A]"
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * ── 5. DestructiveActionFocused — Destructive dialog with the red danger
 *       action button in focus-visible state. Confirms the ring stays amber
 *       (#E07A4A) regardless of button color — it's a universal DS ring.
 */
export const DestructiveActionFocused: Story = {
  render: () => (
    <AlertDialog open onOpenChange={() => undefined}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div
            className="flex items-center justify-center w-9 h-9 rounded-[8px] mb-1"
            style={{
              background: "var(--s-danger-subtle)",
              border: "1px solid var(--s-danger-border)",
            }}
          >
            <TriangleAlert
              className="size-[18px]"
              style={{ color: "var(--s-danger-fg)" }}
            />
          </div>
          <AlertDialogTitle>Excluir conta permanentemente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="ring-0 shadow-[0_0_0_2px_var(--background),0_0_0_3px_#E07A4A]"
          >
            Sim, excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * ── 6. Trigger — Closed state. Shows the asChild trigger button in three
 *       sub-states: resting, hover (bg-surface-raised + border-strong),
 *       and focus-visible (uniform amber ring). Dialog stays closed.
 *
 *       Three snapshots in one story is acceptable here since the dialog
 *       itself is not open — we're documenting trigger button appearance only.
 */
export const Trigger: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-8 p-6">
      {/* Resting */}
      <div className="flex flex-col gap-2">
        <span
          className="text-[10px] font-semibold tracking-[0.8px] uppercase"
          style={{ color: "var(--s-ink-muted)", fontFamily: "var(--p-font-display)" }}
        >
          Trigger · resting
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Excluir conta</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Continuar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Hover state — forced via className override */}
      <div className="flex flex-col gap-2">
        <span
          className="text-[10px] font-semibold tracking-[0.8px] uppercase"
          style={{ color: "var(--s-ink-muted)", fontFamily: "var(--p-font-display)" }}
        >
          Trigger · hover
        </span>
        <Button
          variant="outline"
          className="bg-[var(--s-surface-raised)] border-[var(--s-border-strong)] text-[var(--s-ink-primary)] pointer-events-none"
        >
          Excluir conta
        </Button>
      </div>

      {/* Focus-visible state — forced via className override */}
      <div className="flex flex-col gap-2">
        <span
          className="text-[10px] font-semibold tracking-[0.8px] uppercase"
          style={{ color: "var(--s-ink-muted)", fontFamily: "var(--p-font-display)" }}
        >
          Trigger · focus-visible
        </span>
        <Button
          variant="outline"
          className="ring-0 shadow-[0_0_0_2px_var(--background),0_0_0_3px_#E07A4A] pointer-events-none"
        >
          Excluir conta
        </Button>
      </div>
    </div>
  ),
};
