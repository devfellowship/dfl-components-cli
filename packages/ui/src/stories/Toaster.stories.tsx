import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Toaster } from "../components/toaster";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../components/toast";

/**
 * Atoms / Toaster — one story per state (DS "1 story = 1 state" rule).
 *
 * Stories:
 *   Empty              — viewport mounted, no toasts enqueued
 *   WithDefaultToast   — single default toast; amber accent + always-visible close
 *   WithDestructiveToast — danger variant; semantic tokens, no raw red-* classes
 *   WithActionToast    — default toast with ToastAction; DFL focus ring on action
 *   CloseButtonFocused — static close button in focus-visible state; DFL ring visible
 *   WithSuccessToast   — success CVA variant; green accent stripe + semantic colours
 *
 * Static-state stories (2–6) render sub-components directly inside a
 * ToastProvider so the `open` prop keeps the toast visible without needing
 * the useToast hook store.
 */
const meta: Meta<typeof Toaster> = {
  title: "Components/Atoms/Toaster",
  component: Toaster,
};

export default meta;
type Story = StoryObj<typeof Toaster>;

/* ─── 1. Empty ──────────────────────────────────────────────────────────── */

/**
 * Viewport mounted at app root with no toasts enqueued.
 * Verifies: fixed positioning, z-index var(--p-z-toast) = 60, max-width 420px.
 * The viewport is invisible by default (Radix hides it when empty) — the
 * Storybook canvas confirms the mount completes without error.
 */
export const Empty: Story = {
  render: () => <Toaster />,
};

/* ─── 2. WithDefaultToast ───────────────────────────────────────────────── */

/**
 * Single default toast visible in the viewport.
 * Verifies: --c-toast-bg (#1f1c18), amber left-accent stripe (--s-brand-solid),
 * --c-toast-fg title, --c-toast-fg-desc description, and always-visible
 * close button at opacity ≥ 0.6.
 */
export const WithDefaultToast: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="default">
        <div className="grid gap-1">
          <ToastTitle>Evento criado</ToastTitle>
          <ToastDescription>Domingo, 16 de Abril, 2026 às 9h00</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── 3. WithDestructiveToast ───────────────────────────────────────────── */

/**
 * Danger-variant toast (via `variant="destructive"` backward-compat alias).
 * Verifies: --s-danger-subtle bg tint, --s-danger-border border,
 * --s-danger-fg close button colour, no raw red-* Tailwind palette classes.
 */
export const WithDestructiveToast: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="destructive">
        <div className="grid gap-1">
          <ToastTitle>Algo deu errado</ToastTitle>
          <ToastDescription>Não foi possível salvar suas alterações.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── 4. WithActionToast ────────────────────────────────────────────────── */

/**
 * Default toast with a ToastAction button.
 * Verifies: action button uses the DFL uniform focus ring on focus-visible
 * (box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A) and
 * --s-border-subtle border instead of raw bg-secondary Tailwind classes.
 */
export const WithActionToast: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="default">
        <div className="grid gap-1">
          <ToastTitle>Rascunho salvo</ToastTitle>
          <ToastDescription>Suas alterações foram salvas automaticamente.</ToastDescription>
        </div>
        <ToastAction altText="Ver rascunho">Ver</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── 5. CloseButtonFocused ─────────────────────────────────────────────── */

/**
 * Static render with the close button in a forced focus-visible state.
 * Verifies: the uniform DFL ring —
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 * — replaces the previous ring-offset-background / ring-red-400 pattern.
 *
 * The inline style forces the ring appearance without a real keyboard focus,
 * so the ring is always visible in this story canvas.
 */
export const CloseButtonFocused: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="default">
        <div className="grid gap-1">
          <ToastTitle>Toast com foco no close</ToastTitle>
          <ToastDescription>
            Anel: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
          </ToastDescription>
        </div>
        <ToastClose
          className="opacity-100"
          style={{
            boxShadow:
              "0 0 0 2px var(--s-surface-page), 0 0 0 3px var(--p-amber-500)",
          }}
        />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── 6. WithSuccessToast ───────────────────────────────────────────────── */

/**
 * New `success` CVA variant (not present in vanilla shadcn Toaster).
 * Verifies: --s-success-subtle bg tint, --s-success-border border,
 * --s-success-fg icon/title accent, and --c-toast-accent-w left stripe
 * coloured via --s-success-solid.
 */
export const WithSuccessToast: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="success">
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-success-fg)]"
          aria-hidden
        />
        <div className="grid gap-1">
          <ToastTitle>Publicado com sucesso</ToastTitle>
          <ToastDescription>Sua aula está disponível para os alunos.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── Bonus: WithWarningToast + WithInfoToast (round out the variant set) ── */

/**
 * Warning variant — yellow subtle bg, warning border, yellow left stripe.
 */
export const WithWarningToast: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="warning">
        <AlertTriangle
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-warning-fg)]"
          aria-hidden
        />
        <div className="grid gap-1">
          <ToastTitle>Atenção</ToastTitle>
          <ToastDescription>Sua sessão expira em 5 minutos.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/**
 * Info variant — blue subtle bg, info border, blue left stripe.
 */
export const WithInfoToast: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="info">
        <AlertCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-info-fg)]"
          aria-hidden
        />
        <div className="grid gap-1">
          <ToastTitle>Nova atualização disponível</ToastTitle>
          <ToastDescription>Versão 2.4.0 — melhoria de performance.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
