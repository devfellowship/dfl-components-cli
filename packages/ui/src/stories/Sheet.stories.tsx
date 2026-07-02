import type { Meta, StoryObj } from "@storybook/react";
import { X } from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
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

const meta: Meta<typeof Sheet> = {
  title: "Components/Organisms/Sheet",
  component: Sheet,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "Slide-out panel — 4 positions · close-button states · form-in-panel pattern.",
          "",
          "**Token fixes vs plain shadcn:**",
          "- `SheetOverlay`: `bg-black/80` → `var(--c-sheet-scrim)` (warm rgba, token-native)",
          "- `SheetContent` bg/shadow/border: resolve via `--c-sheet-{bg,shadow,border}` → `--c-dialog-*` → `--s-*`",
          "- Close button focus ring: shadcn `ring-offset` approach → DS double box-shadow `(0 0 0 2px panel-bg, 0 0 0 3px #E07A4A)`",
          "- Bottom variant: adds top-corner pill radius via `--c-sheet-radius-bottom`",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

/**
 * Sheet/Right — default open state.
 * Panel bg via --c-sheet-bg, border via --c-sheet-border, shadow via
 * --c-sheet-shadow, scrim via --c-sheet-scrim. The dominant fleet pattern
 * for detail / edit panels.
 */
export const Right: Story = {
  name: "Sheet/Right",
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button className="m-8">Abrir painel</Button>
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

/**
 * Sheet/Left — off-canvas navigation variant.
 * Same token fixes as Right; border resolved via --c-sheet-border (border-right).
 */
export const Left: Story = {
  name: "Sheet/Left",
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline" className="m-8">
          Abrir menu
        </Button>
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

/**
 * Sheet/Top — banner/notice variant sliding from top.
 * Border-bottom via --c-sheet-border.
 */
export const Top: Story = {
  name: "Sheet/Top",
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="secondary" className="m-8">
          Abrir aviso
        </Button>
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

/**
 * Sheet/Bottom — mobile action-sheet.
 * Border-top via --c-sheet-border; top-corner pill radius
 * via --c-sheet-radius-bottom (--p-radius-xl = 14px).
 */
export const Bottom: Story = {
  name: "Sheet/Bottom",
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="secondary" className="m-8">
          Abrir ações
        </Button>
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

/**
 * Sheet/WithForm — right panel with form fields and footer.
 * Input fields receive DS focus ring (--c-input-border-focus + --c-input-ring-focus).
 * Footer buttons consume --c-button-* tokens via the Button component.
 */
export const WithForm: Story = {
  name: "Sheet/WithForm",
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button className="m-8">Editar perfil</Button>
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

/**
 * Sheet/CloseFocused — close button in default / hover / focus states.
 *
 * Focus ring spec (DS ch.5.2, uniform contract):
 *   box-shadow: 0 0 0 2px var(--c-sheet-bg), 0 0 0 3px #E07A4A
 *
 * The 2px gap colour = panel bg (#1a1714), NOT page bg (#0a0908).
 * This ensures the amber ring is visible against the sheet surface.
 * Replaces the shadcn `focus:ring-2 focus:ring-ring focus:ring-offset-2` approach.
 */
export const CloseFocused: Story = {
  name: "Sheet/CloseFocused",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const panelStyle: React.CSSProperties = {
      width: "80px",
      height: "80px",
      background: "var(--c-sheet-bg)",
      border: "1px solid var(--c-sheet-border)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const baseBtnStyle: React.CSSProperties = {
      width: "32px",
      height: "32px",
      background: "transparent",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    };

    const labelStyle: React.CSSProperties = {
      fontSize: "10px",
      fontFamily: "var(--s-font-mono, monospace)",
      color: "var(--s-ink-muted)",
      textAlign: "center",
    };

    const strongStyle: React.CSSProperties = {
      color: "var(--s-ink-secondary)",
      display: "block",
      fontSize: "11px",
    };

    return (
      <div style={{ display: "flex", gap: "32px", alignItems: "flex-end", padding: "24px" }}>
        {/* Default */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={panelStyle}>
            <button
              aria-label="Close (default)"
              style={{ ...baseBtnStyle, color: "var(--s-ink-muted)", opacity: 0.55 }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={labelStyle}>
            <strong style={strongStyle}>Default</strong>
            opacity 0.55 · muted ink
          </div>
        </div>

        {/* Hover */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={panelStyle}>
            <button
              aria-label="Close (hover)"
              style={{
                ...baseBtnStyle,
                background: "var(--s-surface-elevated)",
                color: "var(--s-ink-primary)",
              }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={labelStyle}>
            <strong style={strongStyle}>Hover</strong>
            bg elevated · primary ink
          </div>
        </div>

        {/* Focus */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={panelStyle}>
            <button
              aria-label="Close (focus)"
              style={{
                ...baseBtnStyle,
                color: "var(--s-ink-primary)",
                // DS uniform ring: 2px panel-bg gap + 1px amber (#E07A4A)
                boxShadow: "0 0 0 2px var(--c-sheet-bg), 0 0 0 3px #E07A4A",
              }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={labelStyle}>
            <strong style={strongStyle}>Focus</strong>
            2px gap + 1px amber ring
          </div>
        </div>

        {/* Spec callout */}
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            background: "var(--s-surface-panel)",
            border: "1px solid var(--s-border-subtle)",
            borderRadius: "8px",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontFamily: "var(--s-font-mono, monospace)",
              color: "var(--s-ink-muted)",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            --c-sheet-close-ring
          </div>
          <code
            style={{
              fontFamily: "var(--s-font-mono, monospace)",
              fontSize: "11px",
              color: "var(--s-brand-fg)",
              display: "block",
              lineHeight: 1.8,
            }}
          >
            {`0 0 0 2px var(--c-sheet-bg),`}
            <br />
            {`0 0 0 3px #E07A4A`}
          </code>
          <div
            style={{
              fontSize: "11px",
              color: "var(--s-ink-muted)",
              marginTop: "8px",
              lineHeight: 1.6,
            }}
          >
            Gap matches the <strong style={{ color: "var(--s-ink-secondary)" }}>panel surface</strong> — not page bg — so the ring is visible against the sheet.
          </div>
        </div>
      </div>
    );
  },
};
