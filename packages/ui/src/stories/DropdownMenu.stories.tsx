/**
 * DropdownMenu stories — one state per export (DS v0 one-state-per-story rule).
 *
 * Story map (per work-items audit):
 *   TriggerIcon                       — default icon trigger (⋯), interactive
 *   TriggerIconKeyboardFocus          — trigger button showing keyboard focus ring
 *   MenuItemHover                     — isolated item in hover state (bg shift, no ring)
 *   MenuItemKeyboardFocus             — isolated item in keyboard-focus state (bg + amber ring)
 *   WithDestructiveItem               — open menu with destructive delete (default states)
 *   WithDestructiveItemDestructiveHover — destructive item in pointer-hover state
 *   WithGroupsAndSeparatorsDefault    — open menu: visible separator + muted uppercase labels
 *   WithCheckboxItemsChecked          — open menu: item in checked state (amber checkmark)
 *   WithCheckboxItemsUnchecked        — open menu: item in unchecked state (empty indent slot)
 */

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  MoreHorizontal,
  PencilIcon,
  CopyIcon,
  Trash2Icon,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../components/dropdown-menu";
import { Button } from "../components/button";
import { cn } from "../lib/utils";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/Organisms/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    defaultOpen: { control: "boolean", description: "Open on mount (uncontrolled)." },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

// ─── §1 Trigger states ────────────────────────────────────────────────────────

/**
 * Default usage: ghost icon-button (⋯) trigger opening row-actions.
 * The dominant fleet pattern for table/card row actions.
 */
export const TriggerIcon: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Ações">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PencilIcon />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Duplicar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Trigger icon — keyboard focus state.
 *
 * Shows the uniform DS focus ring on the trigger button:
 * 2px gap (bg-page) + 1px amber (#E07A4A) via box-shadow.
 * No bg-fill on the trigger itself — ring floats around the button.
 *
 * Verify: tab into the trigger → amber ring appears; no amber bg-flood.
 */
export const TriggerIconKeyboardFocus: Story = {
  render: () => (
    // autoFocus demonstrates the focus-visible ring in browsers that apply
    // focus-visible on programmatic initial focus (Firefox, Safari).
    // Tab into the button in Chrome to see the ring reliably.
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Ações" autoFocus>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PencilIcon />
          Editar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// ─── §2 Isolated item states (visual-spec stories) ───────────────────────────
// These render a static panel shell + a single item frozen in the target state.
// Using the same token classes as the real DropdownMenuItem so the token chain
// is verified visually without needing runtime pointer/keyboard interaction.

/**
 * MenuItem — hover state.
 *
 * Item bg shifts to --c-dropdownmenu-item-bg-hover (#1f1c18, surface-elevated).
 * Text shifts to --c-dropdownmenu-item-fg-hover (#f6f1e7, ink-primary).
 * No amber ring — ring is keyboard-only (focus-visible).
 *
 * In the real component this state is driven by data-[highlighted] when the
 * pointer enters the item (Radix sets data-highlighted on pointer move).
 */
export const MenuItemHover: Story = {
  render: () => (
    <div
      className={cn(
        "p-1 w-44",
        "rounded-[var(--c-dropdownmenu-radius)] border border-[var(--c-dropdownmenu-border)]",
        "bg-[var(--c-dropdownmenu-bg)] shadow-[var(--c-dropdownmenu-shadow)]",
      )}
      aria-label="Menu panel — hover state demo"
    >
      {/* Item frozen in hover state */}
      <div
        className={cn(
          "relative flex cursor-default select-none items-center gap-2",
          "rounded-[var(--c-dropdownmenu-item-radius)] px-2 py-1.5 text-sm",
          // Hover state: bg shift + text shift, NO ring
          "bg-[var(--c-dropdownmenu-item-bg-hover)] text-[var(--c-dropdownmenu-item-fg-hover)]",
        )}
      >
        <PencilIcon className="h-4 w-4 shrink-0" />
        Editar
      </div>
      {/* Non-hovered item for contrast */}
      <div
        className={cn(
          "relative flex cursor-default select-none items-center gap-2",
          "rounded-[var(--c-dropdownmenu-item-radius)] px-2 py-1.5 text-sm",
          "text-[var(--c-dropdownmenu-item-fg)]",
        )}
      >
        <CopyIcon className="h-4 w-4 shrink-0" />
        Duplicar
      </div>
    </div>
  ),
};

/**
 * MenuItem — keyboard focus state.
 *
 * Item bg shifts to --c-dropdownmenu-item-bg-hover (same as hover).
 * ADDITIONALLY shows the amber ring: 2px bg-gap + 1px amber via box-shadow.
 * This distinguishes keyboard from pointer interaction visually.
 *
 * Fix verified: OLD behaviour was focus:bg-accent (#E07A4A amber flood, near-black
 * text). NEW behaviour is subtle bg shift + floating amber ring.
 */
export const MenuItemKeyboardFocus: Story = {
  render: () => (
    <div
      className={cn(
        "p-1 w-44",
        "rounded-[var(--c-dropdownmenu-radius)] border border-[var(--c-dropdownmenu-border)]",
        "bg-[var(--c-dropdownmenu-bg)] shadow-[var(--c-dropdownmenu-shadow)]",
      )}
      aria-label="Menu panel — keyboard focus state demo"
    >
      {/* Item frozen in keyboard-focus state */}
      <div
        className={cn(
          "relative flex cursor-default select-none items-center gap-2",
          "rounded-[var(--c-dropdownmenu-item-radius)] px-2 py-1.5 text-sm",
          // Keyboard focus = bg shift + amber ring (box-shadow)
          "bg-[var(--c-dropdownmenu-item-bg-hover)] text-[var(--c-dropdownmenu-item-fg-hover)]",
          "shadow-[var(--c-dropdownmenu-focus-ring)]",
        )}
      >
        <PencilIcon className="h-4 w-4 shrink-0" />
        Editar
      </div>
      {/* Non-focused item for comparison */}
      <div
        className={cn(
          "relative flex cursor-default select-none items-center gap-2",
          "rounded-[var(--c-dropdownmenu-item-radius)] px-2 py-1.5 text-sm",
          "text-[var(--c-dropdownmenu-item-fg)]",
        )}
      >
        <CopyIcon className="h-4 w-4 shrink-0" />
        Duplicar
      </div>
    </div>
  ),
};

// ─── §3 Destructive item states ───────────────────────────────────────────────

/**
 * WithDestructiveItem — default states.
 *
 * Row-actions menu including a destructive delete item.
 * Destructive items use danger-fg (#e89898) text as default, danger-subtle bg on hover.
 * Separator between safe and destructive actions must be visible (hairline #2a2622).
 */
export const WithDestructiveItem: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Ações">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PencilIcon />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={cn(
            // Destructive item: danger-fg text as default
            "text-[var(--c-dropdownmenu-destructive-fg)]",
            // Hover: danger-subtle bg; text stays danger-fg (NOT amber on hover)
            "data-[highlighted]:bg-[var(--c-dropdownmenu-destructive-bghov)]",
            "data-[highlighted]:text-[var(--c-dropdownmenu-destructive-fg)]",
          )}
        >
          <Trash2Icon />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * WithDestructiveItem — destructive item in pointer-hover state.
 *
 * Hover bg must be danger-subtle (rgba(224,122,122,0.10)), NOT amber.
 * Text stays danger-fg (#e89898) on hover.
 *
 * Verifies --c-dropdownmenu-destructive-bghov token and that hover does NOT
 * turn amber (which was the broken behaviour when focus:bg-accent was used).
 */
export const WithDestructiveItemDestructiveHover: Story = {
  render: () => (
    <div
      className={cn(
        "p-1 w-44",
        "rounded-[var(--c-dropdownmenu-radius)] border border-[var(--c-dropdownmenu-border)]",
        "bg-[var(--c-dropdownmenu-bg)] shadow-[var(--c-dropdownmenu-shadow)]",
      )}
      aria-label="Menu panel — destructive item hover state demo"
    >
      {/* Non-destructive item for context */}
      <div
        className={cn(
          "relative flex cursor-default select-none items-center gap-2",
          "rounded-[var(--c-dropdownmenu-item-radius)] px-2 py-1.5 text-sm",
          "text-[var(--c-dropdownmenu-item-fg)]",
        )}
      >
        <PencilIcon className="h-4 w-4 shrink-0" />
        Editar
      </div>
      {/* Separator */}
      <div className="-mx-1 my-1 h-px bg-[var(--c-dropdownmenu-separator)]" />
      {/* Destructive item frozen in hover state */}
      <div
        className={cn(
          "relative flex cursor-default select-none items-center gap-2",
          "rounded-[var(--c-dropdownmenu-item-radius)] px-2 py-1.5 text-sm",
          // Danger-subtle bg + danger-fg text — NOT amber
          "bg-[var(--c-dropdownmenu-destructive-bghov)]",
          "text-[var(--c-dropdownmenu-destructive-fg)]",
        )}
      >
        <Trash2Icon className="h-4 w-4 shrink-0" />
        Excluir
      </div>
    </div>
  ),
};

// ─── §4 Groups + separators ───────────────────────────────────────────────────

/**
 * WithGroupsAndSeparators — default open state.
 *
 * Verifies two DS visual-hierarchy fixes:
 *   1. Separator is now visible: --c-dropdownmenu-separator (#2a2622) > popover bg (#1a1714)
 *   2. Labels are muted + uppercase + tight tracking (--c-dropdownmenu-label-fg, #7d7568)
 *      vs items which use full ink-secondary (#e8e0d0) — creates clear section hierarchy.
 */
export const WithGroupsAndSeparatorsDefault: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Minha conta</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Conta</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Pagamentos
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sistema</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SettingsIcon />
            Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// ─── §5 Checkbox items ────────────────────────────────────────────────────────

/**
 * WithCheckboxItems — checked state.
 *
 * Shows the amber checkmark indicator via --c-dropdownmenu-check-color → --s-brand-solid (#E07A4A).
 * The checked item preserves correct indent (pl-8) for the check slot.
 */
export const WithCheckboxItemsChecked: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Colunas</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Exibir colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Checked: amber checkmark visible */}
        <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
        {/* Unchecked: for comparison — empty indent slot */}
        <DropdownMenuCheckboxItem checked={false}>Email</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * WithCheckboxItems — unchecked state.
 *
 * Shows the empty check-slot indent (pl-8) with no indicator rendered.
 * The unchecked item still indents correctly so text aligns with checked items.
 */
export const WithCheckboxItemsUnchecked: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Colunas</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Exibir colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Checked item for comparison — shows amber mark */}
        <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
        {/* Unchecked: empty slot, correct indent */}
        <DropdownMenuCheckboxItem checked={false}>Email</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
