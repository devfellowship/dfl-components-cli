import type { Meta, StoryObj } from "@storybook/react";
import {
  Pencil,
  Copy,
  Download,
  Trash2,
  EllipsisVertical,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/popover";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";

/**
 * Popover — DFL DS Molecules — one state per story.
 *
 * Built on @radix-ui/react-popover.
 * - PopoverContent consumes --c-popover-* Layer-3 tokens (radius=10px,
 *   shadow=--p-shadow, bg=--s-surface-elevated, border=--s-border-subtle).
 * - sideOffset default = 6 (was 4) for overlay breathing room.
 * - Trigger focus ring: box-shadow 0 0 0 2px var(--s-surface-page),
 *   0 0 0 3px #E07A4A — applied via Tailwind arbitrary class on the Button.
 */
const meta: Meta<typeof Popover> = {
  title: "Components/Molecules/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

/* ──────────────────────────────────────────────────────────────────────────
 * Shared DS focus-ring class for the trigger button.
 * Overrides Button's default ring with the double-layer amber box-shadow:
 *   layer 1 — 2px gap in page-bg colour
 *   layer 2 — 1px solid amber (#E07A4A)
 * ────────────────────────────────────────────────────────────────────────── */
const TRIGGER_FOCUS_RING =
  "focus-visible:ring-0 focus-visible:[box-shadow:0_0_0_2px_var(--s-surface-page),_0_0_0_3px_#E07A4A]";

/* ──────────────────────────────────────────────────────────────────────────
 * Shared DS focus-ring for interactive rows inside a popover
 * (menu items, form rows). Same double-layer rule, applied inline.
 * ────────────────────────────────────────────────────────────────────────── */
const MENU_ITEM_BASE =
  "flex w-full cursor-pointer items-center gap-2 rounded-[var(--p-radius-md)] px-2.5 py-[7px] text-[13px] text-[var(--s-ink-secondary)] transition-colors outline-none hover:bg-[var(--s-surface-raised)] hover:text-[var(--s-ink-primary)] focus-visible:[box-shadow:0_0_0_2px_var(--s-surface-page),_0_0_0_3px_#E07A4A]";

/* ──────────────────────────────────────────────────────────────────────────
 * Story: Default
 * Trigger at rest (closed), popover open showing title + description.
 * Demonstrates --c-popover-bg, --c-popover-radius (10px),
 * --c-popover-shadow (DS token), and --c-popover-border.
 * ────────────────────────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline" className={TRIGGER_FOCUS_RING}>
          Abrir popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-1">
          <h4 className="text-[13px] font-semibold leading-none text-[var(--c-popover-fg)]">
            Dimensões
          </h4>
          <p className="text-[12px] text-[var(--c-popover-fg-muted)]">
            Defina as dimensões da camada.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: TriggerFocused
 * Trigger button in focus-visible state (keyboard tab or programmatic focus)
 * showing the DS uniform focus ring: 2px page-bg gap + 1px #E07A4A amber.
 * Popover is closed — this story isolates the trigger focus appearance.
 * ────────────────────────────────────────────────────────────────────────── */
export const TriggerFocused: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        {/* autoFocus triggers :focus-visible so Storybook renders the ring */}
        <Button
          variant="outline"
          autoFocus
          className={TRIGGER_FOCUS_RING}
        >
          Abrir popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-[12px] text-[var(--c-popover-fg-muted)]">
          Popover fechado — story foca no anel amber do trigger.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: WithForm
 * Popover open containing Label + Input rows.
 * Inputs inherit --c-input-* tokens (bg, border, radius) and show their own
 * DS amber ring when focused.
 * ────────────────────────────────────────────────────────────────────────── */
export const WithForm: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline" className={TRIGGER_FOCUS_RING}>
          Editar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="text-[13px] font-semibold leading-none text-[var(--c-popover-fg)]">
              Dimensões
            </h4>
            <p className="text-[12px] text-[var(--c-popover-fg-muted)]">
              Ajuste a largura e a altura.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="pop-width">Largura</Label>
              <Input
                id="pop-width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="pop-height">Altura</Label>
              <Input
                id="pop-height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="pop-maxw">Max-width</Label>
              <Input
                id="pop-maxw"
                defaultValue="480px"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: AlignStart
 * Popover open with align="start" — content and caret arrow anchored to the
 * left edge of the trigger.
 * ────────────────────────────────────────────────────────────────────────── */
export const AlignStart: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline" className={TRIGGER_FOCUS_RING}>
          Alinhar ao início
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <p className="text-[12px] text-[var(--c-popover-fg-muted)]">
          Conteúdo alinhado à borda inicial do gatilho.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: AlignEnd
 * Popover open with align="end" — content and caret arrow anchored to the
 * right edge of the trigger.
 * ────────────────────────────────────────────────────────────────────────── */
export const AlignEnd: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline" className={TRIGGER_FOCUS_RING}>
          Alinhar ao fim
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-[12px] text-[var(--c-popover-fg-muted)]">
          Conteúdo alinhado à borda final do gatilho.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

/* ──────────────────────────────────────────────────────────────────────────
 * Story: WithMenu
 * Popover open with a compact action-list (rename / duplicate / export /
 * delete). Danger item (delete) uses --s-danger-fg. The focused row (Duplicate)
 * shows the DS double-layer amber focus ring via box-shadow — matching the
 * same ring spec as the trigger button.
 * ────────────────────────────────────────────────────────────────────────── */
export const WithMenu: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Mais opções"
          className={TRIGGER_FOCUS_RING}
        >
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1.5">
        <button className={MENU_ITEM_BASE} type="button">
          <Pencil size={13} aria-hidden="true" className="opacity-60" />
          Renomear
        </button>
        {/* autoFocus on this row demonstrates the DS focus ring on a menu item */}
        <button
          className={MENU_ITEM_BASE}
          type="button"
          autoFocus
        >
          <Copy size={13} aria-hidden="true" className="opacity-60" />
          Duplicar
        </button>
        <button className={MENU_ITEM_BASE} type="button">
          <Download size={13} aria-hidden="true" className="opacity-60" />
          Exportar
        </button>
        <div
          className="my-1 h-px bg-[var(--s-border-subtle)]"
          role="separator"
        />
        <button
          className={[
            MENU_ITEM_BASE,
            "text-[var(--s-danger-fg)] hover:text-[var(--s-danger-fg)]",
          ].join(" ")}
          type="button"
        >
          <Trash2 size={13} aria-hidden="true" className="opacity-80" />
          Excluir
        </button>
      </PopoverContent>
    </Popover>
  ),
};
