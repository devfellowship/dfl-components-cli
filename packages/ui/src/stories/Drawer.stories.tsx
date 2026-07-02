/**
 * Drawer stories — Organisms/Drawer (DFL DS v0)
 *
 * One story per state (DS rule: 1 story = 1 state).
 * Six states:
 *   Default/Closed          — trigger button only, no overlay
 *   Default/Open            — bottom direction, scrim + confirmation pattern
 *   Right/Idle              — right panel, form body, close btn, Cancelar/Publicar
 *   Right/LoadingAccounts   — right panel, loading banner, disabled fields/footer
 *   Right/Error             — error banner + danger-border input, retry enabled
 *   Right/Done              — success centred: icon, title, YT link, mono id, close
 *
 * Tokens verified:
 *   --c-dialog-bg     (elevated panel, NOT page bg)
 *   --c-dialog-border, --c-dialog-radius, --c-dialog-shadow, --c-dialog-scrim
 *   --s-brand-subtle / --s-danger-subtle / --s-success-subtle for status banners
 *   Focus ring: box-shadow 0 0 0 2px var(--c-dialog-bg), 0 0 0 3px #E07A4A
 */

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Youtube,
  X,
} from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/drawer";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

const meta: Meta<typeof Drawer> = {
  title: "Components/Organisms/Drawer",
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// ─── Story helpers ────────────────────────────────────────────────────────────

/** Thin wrapper that keeps a controlled `open` state, starting closed. */
function ClosedWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {children}
    </Drawer>
  );
}

/** Thin wrapper that starts open (for static state stories). */
function OpenWrapper({
  direction = "bottom" as "bottom" | "top" | "left" | "right",
  children,
}: {
  direction?: "bottom" | "top" | "left" | "right";
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);
  return (
    <Drawer open={open} onOpenChange={setOpen} direction={direction}>
      {children}
    </Drawer>
  );
}

/** Shared form field row. */
function Field({
  label,
  id,
  placeholder,
  value,
  disabled,
  error,
}: {
  label: string;
  id: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  error?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-[var(--s-ink-secondary)] text-xs font-medium">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        disabled={disabled}
        className={
          error
            ? "border-[var(--s-danger-solid)] focus-visible:border-[var(--s-danger-solid)]"
            : undefined
        }
        readOnly={!disabled && value !== undefined}
      />
    </div>
  );
}

/** Status banner — loading variant. */
function LoadingBanner({ text }: { text: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm"
      style={{
        background: "var(--s-brand-subtle)",
        border: "1px solid var(--s-brand-border)",
        color: "var(--s-brand-fg)",
      }}
    >
      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
      {text}
    </div>
  );
}

/** Status banner — error variant. */
function ErrorBanner({ text }: { text: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm"
      style={{
        background: "var(--s-danger-subtle)",
        border: "1px solid var(--s-danger-border)",
        color: "var(--s-danger-fg)",
      }}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {text}
    </div>
  );
}

/** Close "X" button rendered as a DrawerClose trigger (no asChild). */
function CloseIconButton() {
  return (
    <DrawerClose
      className={[
        "ml-auto flex h-7 w-7 items-center justify-center rounded-md",
        "text-[var(--s-ink-muted)] hover:bg-[var(--s-surface-elevated)] hover:text-[var(--s-ink-primary)]",
        "border border-transparent hover:border-[var(--s-border-subtle)]",
        "transition-colors",
        // DS focus ring already applied by DrawerClose base class
      ].join(" ")}
      aria-label="Fechar"
    >
      <X className="h-3.5 w-3.5" />
    </DrawerClose>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Default/Closed — trigger button only, drawer closed, no overlay.
 * Click "Abrir Drawer" to interact; the story begins in the closed state.
 */
export const DefaultClosed: Story = {
  name: "Default/Closed",
  render: () => (
    <div style={{ padding: 32, display: "flex", justifyContent: "center" }}>
      <ClosedWrapper>
        <DrawerTrigger asChild>
          <Button variant="outline">Abrir Drawer</Button>
        </DrawerTrigger>
        {/* Drawer content is wired but not visible until triggered */}
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Tem certeza?</DrawerTitle>
              <DrawerDescription>Esta ação não pode ser desfeita.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex-row justify-end gap-2">
              <DrawerClose asChild>
                <Button variant="outline" size="sm">Cancelar</Button>
              </DrawerClose>
              <Button size="sm">Confirmar</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </ClosedWrapper>
    </div>
  ),
};

/**
 * Default/Open — bottom direction, scrim visible (--c-dialog-scrim), confirmation
 * header + footer. Panel background is --c-dialog-bg (#1a1714), elevated above
 * the page (#0a0908). Top corners rounded via --c-dialog-radius (14px).
 */
export const DefaultOpen: Story = {
  name: "Default/Open",
  render: () => (
    <div style={{ minHeight: 320, position: "relative" }}>
      <OpenWrapper direction="bottom">
        {/* No trigger — drawer renders already open */}
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Tem certeza?</DrawerTitle>
              <DrawerDescription>
                Esta ação não pode ser desfeita. Deseja continuar?
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex-row justify-end gap-2">
              <DrawerClose asChild>
                <Button variant="outline" size="sm">Cancelar</Button>
              </DrawerClose>
              <Button size="sm">Confirmar</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </OpenWrapper>
    </div>
  ),
};

/**
 * Right/Idle — right-side panel open with form body (title input, keyword input,
 * channel select). Close button (X) with DS focus ring. Footer Cancelar/Publicar
 * buttons. Panel uses --c-dialog-bg, left corners rounded.
 */
export const RightIdle: Story = {
  name: "Right/Idle",
  render: () => (
    <div style={{ minHeight: 480, position: "relative" }}>
      <OpenWrapper direction="right">
        <DrawerContent className="sm:max-w-sm">
          <DrawerHeader>
            <div className="flex items-center gap-2">
              <Youtube
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--s-danger-fg)" }}
              />
              <DrawerTitle>Publicar no YouTube</DrawerTitle>
              <CloseIconButton />
            </div>
            <DrawerDescription>
              Preencha os campos abaixo para publicar via Zernio.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <Field
              id="ri-title"
              label="Título"
              value="Como dobrar produtividade com IA"
            />
            <Field
              id="ri-keywords"
              label="Palavras-chave"
              placeholder="ex: alavancagem, produtividade, IA"
            />
            <div className="grid gap-1.5">
              <Label
                htmlFor="ri-channel"
                className="text-[var(--s-ink-secondary)] text-xs font-medium"
              >
                Canal do YouTube
              </Label>
              <Select defaultValue="dfl">
                <SelectTrigger id="ri-channel">
                  <SelectValue placeholder="Selecione um canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dfl">DevFellowship</SelectItem>
                  <SelectItem value="personal">Tainan Pessoal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DrawerFooter className="flex-row justify-end gap-2">
            <DrawerClose asChild>
              <Button variant="outline" size="sm">Cancelar</Button>
            </DrawerClose>
            <Button size="sm">Publicar</Button>
          </DrawerFooter>
        </DrawerContent>
      </OpenWrapper>
    </div>
  ),
};

/**
 * Right/LoadingAccounts — right panel open, brand-subtle loading banner with
 * spinner, form fields disabled, footer buttons disabled/muted.
 */
export const RightLoadingAccounts: Story = {
  name: "Right/LoadingAccounts",
  render: () => (
    <div style={{ minHeight: 480, position: "relative" }}>
      <OpenWrapper direction="right">
        <DrawerContent className="sm:max-w-sm">
          <DrawerHeader>
            <div className="flex items-center gap-2">
              <Youtube
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--s-danger-fg)" }}
              />
              <DrawerTitle>Publicar no YouTube</DrawerTitle>
            </div>
            <DrawerDescription>Carregando canais conectados…</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <LoadingBanner text="Buscando canais conectados…" />
            <Field
              id="rla-title"
              label="Título"
              placeholder="Título do vídeo"
              disabled
            />
            <div className="grid gap-1.5">
              <Label
                htmlFor="rla-channel"
                className="text-[var(--s-ink-disabled)] text-xs font-medium"
              >
                Canal do YouTube
              </Label>
              <Select disabled>
                <SelectTrigger id="rla-channel">
                  <SelectValue placeholder="Carregando canais…" />
                </SelectTrigger>
                <SelectContent />
              </Select>
            </div>
          </div>

          <DrawerFooter className="flex-row justify-end gap-2">
            <Button variant="outline" size="sm" disabled>
              Cancelar
            </Button>
            <Button size="sm" disabled>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Publicar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </OpenWrapper>
    </div>
  ),
};

/**
 * Right/Error — right panel open, danger-subtle error banner, channel input with
 * danger border + hint, retry button enabled, cancel enabled.
 */
export const RightError: Story = {
  name: "Right/Error",
  render: () => (
    <div style={{ minHeight: 480, position: "relative" }}>
      <OpenWrapper direction="right">
        <DrawerContent className="sm:max-w-sm">
          <DrawerHeader>
            <div className="flex items-center gap-2">
              <Youtube
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--s-danger-fg)" }}
              />
              <DrawerTitle>Publicar no YouTube</DrawerTitle>
              <CloseIconButton />
            </div>
            <DrawerDescription>Corrija os erros antes de continuar.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <ErrorBanner text="Publicação falhou: canal inválido ou não conectado." />

            <Field
              id="re-title"
              label="Título"
              value="Como dobrar produtividade com IA"
            />

            <div className="grid gap-1.5">
              <Label
                htmlFor="re-channel"
                className="text-[var(--s-ink-secondary)] text-xs font-medium"
              >
                Canal do YouTube
              </Label>
              <Input
                id="re-channel"
                defaultValue="Nenhum canal conectado"
                readOnly
                className="border-[var(--s-danger-solid)] text-[var(--s-ink-muted)]"
              />
              <p
                className="text-xs"
                style={{ color: "var(--s-danger-fg)" }}
              >
                Conecte um canal no painel de contas antes de publicar.
              </p>
            </div>
          </div>

          <DrawerFooter className="flex-row justify-end gap-2">
            <DrawerClose asChild>
              <Button variant="outline" size="sm">Cancelar</Button>
            </DrawerClose>
            <Button size="sm">Tentar novamente</Button>
          </DrawerFooter>
        </DrawerContent>
      </OpenWrapper>
    </div>
  ),
};

/**
 * Right/Done — success state full-panel centred: success-icon circle
 * (--s-success-subtle ring), "Vídeo publicado!" title, YouTube link in
 * brand color with underline, zernio_post_id in JetBrains Mono, Fechar button.
 */
export const RightDone: Story = {
  name: "Right/Done",
  render: () => (
    <div style={{ minHeight: 480, position: "relative" }}>
      <OpenWrapper direction="right">
        <DrawerContent className="sm:max-w-sm">
          <DrawerHeader>
            <div className="flex items-center gap-2">
              <Youtube
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--s-danger-fg)" }}
              />
              <DrawerTitle>Publicar no YouTube</DrawerTitle>
            </div>
          </DrawerHeader>

          {/* Centred success state filling the body */}
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            {/* Success icon circle */}
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                background: "var(--s-success-subtle)",
                border: "1px solid var(--s-success-border)",
              }}
            >
              <CheckCircle2
                className="h-5 w-5"
                style={{ color: "var(--s-success-fg)" }}
              />
            </div>

            {/* Title */}
            <p
              className="text-[15px] font-semibold"
              style={{ color: "var(--s-ink-primary)" }}
            >
              Vídeo publicado!
            </p>

            {/* YouTube link — brand color + underline */}
            <a
              href="https://youtube.com/watch?v=demo"
              target="_blank"
              rel="noreferrer"
              className="text-sm underline"
              style={{ color: "var(--s-brand-solid)" }}
            >
              Abrir no YouTube ↗
            </a>

            {/* Zernio post id — JetBrains Mono */}
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--s-font-mono)",
                color: "var(--s-ink-muted)",
              }}
            >
              zernio_post_id: zrn_8f3a9c12
            </p>

            <DrawerClose asChild>
              <Button variant="outline" size="sm" className="mt-1">
                Fechar
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </OpenWrapper>
    </div>
  ),
};
