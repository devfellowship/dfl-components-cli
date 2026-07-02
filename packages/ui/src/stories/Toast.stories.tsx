import type { Meta, StoryObj } from "@storybook/react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info as InfoIcon,
  TrendingUp,
} from "lucide-react";
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
 * Organisms · Toast — one story per state (DS "1 story = 1 state" rule).
 *
 * Stories:
 *   Default     — default notification, amber left accent stripe, title + description
 *   Success     — variant="success", green accent bar + tinted surface, title in --s-success-fg
 *   Destructive — variant="destructive", semantic --s-danger-* tokens, no raw red-*
 *   Warning     — variant="warning", yellow tinted bg, --s-warning-solid accent
 *   Info        — variant="info", blue tinted bg, --s-info-solid accent
 *   WithAction  — default + ToastAction CTA + uniform DS focus ring on ToastAction and ToastClose
 *   TitleOnly   — success variant, title only, no description (short confirmations)
 *
 * Static-state stories render sub-components directly inside a ToastProvider
 * so the `open` prop keeps the toast visible without needing the useToast hook store.
 *
 * Note: `InfoIcon` alias on the lucide import avoids a TS merged-declaration
 * error between `import { Info }` and `export const Info: Story = …`.
 */
const meta: Meta<typeof Toast> = {
  title: "Components/Organisms/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

/* ─── 1. Default ────────────────────────────────────────────────────────── */

/**
 * Default notification with amber left-accent stripe, title, and description.
 * Verifies: --c-toast-bg (#1f1c18), --s-brand-solid 3px left stripe,
 * --c-toast-fg title, --c-toast-fg-desc description, close button at opacity ≥ 0.6.
 */
export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="default">
        <Bell
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-brand-solid)]"
          aria-hidden
        />
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

/* ─── 2. Success ────────────────────────────────────────────────────────── */

/**
 * Success variant with green subtle bg tint and --s-success-solid left stripe.
 * Verifies: --c-toast-success-bg, --c-toast-success-border,
 * --s-success-fg icon + title colour, --s-success-solid accent stripe.
 */
export const Success: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="success">
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-success-fg)]"
          aria-hidden
        />
        <div className="grid gap-1">
          <ToastTitle>Alterações salvas</ToastTitle>
          <ToastDescription>Seu projeto foi atualizado com sucesso.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── 3. Destructive ────────────────────────────────────────────────────── */

/**
 * Danger/destructive variant — semantic --s-danger-* tokens replace raw red-*.
 * Verifies: --c-toast-danger-bg tint, --c-toast-danger-border,
 * --s-danger-fg icon + title, --s-danger-solid 3px left stripe.
 * No `group-[.destructive]:text-red-300` or `focus:ring-red-400` classes.
 */
export const Destructive: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="destructive">
        <AlertTriangle
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-danger-fg)]"
          aria-hidden
        />
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

/* ─── 4. Warning ────────────────────────────────────────────────────────── */

/**
 * Warning variant with yellow tinted bg and --s-warning-solid left stripe.
 * Verifies: --c-toast-warning-bg, --c-toast-warning-border,
 * --s-warning-fg icon + title, --s-warning-solid accent stripe.
 */
export const Warning: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="warning">
        <AlertCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-warning-fg)]"
          aria-hidden
        />
        <div className="grid gap-1">
          <ToastTitle>Sessão expirando</ToastTitle>
          <ToastDescription>
            Sua sessão expira em 5 minutos. Salve seu trabalho.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── 5. Info ───────────────────────────────────────────────────────────── */

/**
 * Info variant with blue tinted bg and --s-info-solid left stripe.
 * Verifies: --c-toast-info-bg, --c-toast-info-border,
 * --s-info-fg icon + title, --s-info-solid accent stripe.
 *
 * `InfoIcon` alias avoids TS merged-declaration collision with the `Info`
 * story export name.
 */
export const Info: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="info">
        <InfoIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-info-fg)]"
          aria-hidden
        />
        <div className="grid gap-1">
          <ToastTitle>Nova versão disponível</ToastTitle>
          <ToastDescription>
            Componentes DS v0.4.1 prontos para atualização.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── 6. WithAction ─────────────────────────────────────────────────────── */

/**
 * Default toast with a ToastAction CTA button and a ToastClose dismiss button.
 * Verifies: ToastAction uses the DFL uniform focus ring on focus-visible —
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 * — same ring on ToastClose. No raw ring-2/ring-offset/ring-ring classes.
 */
export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="default">
        <TrendingUp
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-brand-solid)]"
          aria-hidden
        />
        <div className="grid gap-1">
          <ToastTitle>Exportar concluído</ToastTitle>
          <ToastDescription>Relatório_Q2.pdf gerado com sucesso.</ToastDescription>
        </div>
        <ToastAction altText="Abrir arquivo">Abrir arquivo</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

/* ─── 7. TitleOnly ──────────────────────────────────────────────────────── */

/**
 * Success variant with title only — no description child.
 * Verifies: short confirmation pattern (e.g. "Copiado") works without a
 * description node; title row aligns correctly in the compact layout;
 * --s-success-fg title colour inherited via group-[.toast-success].
 */
export const TitleOnly: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="success">
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-success-fg)]"
          aria-hidden
        />
        <div className="grid gap-1">
          <ToastTitle>Copiado para a área de transferência</ToastTitle>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
