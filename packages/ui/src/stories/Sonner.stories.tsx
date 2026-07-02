/**
 * Atoms/Sonner — one story per state (DS "1 story = 1 state" rule).
 *
 * Stories 1–6 auto-fire their respective toast on mount via useEffect so
 * the toast is immediately visible in the Storybook canvas. duration={Infinity}
 * keeps it on screen indefinitely (no auto-dismiss during review).
 *
 * Story 7 (ActionFocused) is a static replica styled with --c-toast-* tokens
 * showing the amber focus ring on the action button (focus-visible state).
 * Sonner portal toasts live outside the canvas, making programmatic focus
 * unreliable in Storybook; the static replica is the clearest spec artefact.
 */
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { SonnerToaster } from "../components/sonner";

const meta: Meta<typeof SonnerToaster> = {
  title: "Components/Atoms/Sonner",
  component: SonnerToaster,
};

export default meta;
type Story = StoryObj<typeof SonnerToaster>;

/* ── Shared auto-fire helper ── */
function AutoFireToast({
  fire,
}: {
  fire: () => void;
}) {
  React.useEffect(() => {
    fire();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ minHeight: 120 }}>
      <SonnerToaster position="top-center" duration={Infinity} />
    </div>
  );
}

/* ─── 1. Default ─────────────────────────────────────────────────────────── */
/** Default toast — title + description + Desfazer action button at rest. */
export const Default: Story = {
  render: () => (
    <AutoFireToast
      fire={() =>
        toast("Evento criado", {
          description: "Domingo, 16 de Abril às 9h00",
          action: { label: "Desfazer", onClick: () => undefined },
        })
      }
    />
  ),
};

/* ─── 2. Success ─────────────────────────────────────────────────────────── */
/** Success toast — DFL #5ec27e icon, tinted green bg, green accent stripe. */
export const Success: Story = {
  render: () => (
    <AutoFireToast
      fire={() =>
        toast.success("Publicado com sucesso", {
          description: "Sua aula está disponível para os alunos.",
          action: { label: "Ver aula", onClick: () => undefined },
        })
      }
    />
  ),
};

/* ─── 3. Error ───────────────────────────────────────────────────────────── */
/**
 * Error / danger toast — DFL #e07a7a icon, tinted red bg, danger accent
 * stripe, and a secondary cancel action.
 */
export const ErrorVariant: Story = {
  name: "Error",
  render: () => (
    <AutoFireToast
      fire={() =>
        toast.error("Falha no envio", {
          description:
            "Não foi possível salvar as alterações. Tente novamente.",
          action: { label: "Tentar novamente", onClick: () => undefined },
          cancel: { label: "Cancelar", onClick: () => undefined },
        })
      }
    />
  ),
};

/* ─── 4. Info ────────────────────────────────────────────────────────────── */
/** Info toast — DFL #7aa2e0 icon and tinted blue bg, blue accent stripe. */
export const Info: Story = {
  render: () => (
    <AutoFireToast
      fire={() =>
        toast.info("Nova versão disponível", {
          description:
            "Componentes v2.4.0 — veja o changelog antes de atualizar.",
          action: { label: "Ver changelog", onClick: () => undefined },
        })
      }
    />
  ),
};

/* ─── 5. Warning ─────────────────────────────────────────────────────────── */
/** Warning toast — DFL #e0b04a triangle icon, tinted yellow bg, yellow stripe. */
export const Warning: Story = {
  render: () => (
    <AutoFireToast
      fire={() =>
        toast.warning("Sem conexão", {
          description:
            "Você está offline. Algumas funções podem estar limitadas.",
          action: { label: "Tentar reconectar", onClick: () => undefined },
        })
      }
    />
  ),
};

/* ─── 6. Loading ─────────────────────────────────────────────────────────── */
/**
 * Loading toast — amber spinner (Sonner built-in), no close button.
 * The spinner border-top-color is --s-brand-solid (#E07A4A) via Sonner defaults.
 */
export const Loading: Story = {
  render: () => (
    <AutoFireToast
      fire={() =>
        toast.loading("Enviando arquivo…", {
          description: "Aguarde enquanto o upload é concluído.",
        })
      }
    />
  ),
};

/* ─── 7. ActionFocused ───────────────────────────────────────────────────── */
/**
 * Static replica showing the uniform amber focus ring (box-shadow:
 * 0 0 0 2px var(--c-toast-bg), 0 0 0 3px #E07A4A) on the action button
 * in :focus-visible state. The SonnerToaster is mounted for context but the
 * visible toast card is a static styled div so the focused state is stable.
 */
export const ActionFocused: Story = {
  render: () => (
    <>
      <SonnerToaster />
      {/* Static mock — shows :focus-visible state on the action button */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "flex-start",
          gap: 10,
          background: "var(--c-toast-bg)",
          border: "1px solid var(--c-toast-border)",
          borderRadius: "var(--c-toast-radius)",
          boxShadow: "var(--c-toast-shadow)",
          padding: "14px 14px 14px 16px",
          position: "relative",
          overflow: "hidden",
          minWidth: 320,
          maxWidth: 440,
        }}
      >
        {/* left accent stripe (default / neutral) */}
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: 3,
            background: "var(--s-border-subtle)",
            borderRadius: "var(--c-toast-radius) 0 0 var(--c-toast-radius)",
          }}
        />
        {/* neutral info icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <circle
            cx="9"
            cy="9"
            r="7.5"
            stroke="var(--s-border-strong)"
            strokeWidth="1.4"
          />
          <circle cx="9" cy="6" r="0.8" fill="var(--s-ink-muted)" />
          <line
            x1="9" y1="8" x2="9" y2="13"
            stroke="var(--s-ink-muted)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--c-toast-title-fg)",
              lineHeight: 1.3,
              marginBottom: 2,
            }}
          >
            Mensagem arquivada
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--c-toast-desc-fg)",
              lineHeight: 1.4,
              marginBottom: 10,
            }}
          >
            A mensagem foi movida para arquivados.
          </div>
          {/* Action button in :focus-visible state — amber focus ring applied */}
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 26,
              padding: "0 10px",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--c-toast-action-fg)",
              background: "var(--c-toast-action-bg-hover)",
              border: "1px solid var(--c-toast-action-border)",
              borderRadius: "var(--p-radius-md)",
              cursor: "pointer",
              outline: "none",
              /* Uniform amber focus ring: 2px bg gap + 1px amber */
              boxShadow: "var(--c-toast-focus-ring)",
            }}
          >
            Desfazer
          </button>
        </div>

        {/* Close button (rest state) */}
        <button
          aria-label="Fechar"
          style={{
            flexShrink: 0,
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--c-toast-close-fg)",
            background: "transparent",
            border: "none",
            borderRadius: "var(--p-radius-sm)",
            cursor: "pointer",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </>
  ),
};
