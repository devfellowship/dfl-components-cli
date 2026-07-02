/**
 * Organisms/Command — one story per state (DS v0 refactor).
 *
 * States covered:
 *   Default        — idle, two groups, JetBrains Mono shortcuts, no selection
 *   InputFocused   — active search query with amber bottom-border + focus ring
 *   ItemSelected   — keyboard-selected item showing elevated bg + amber left-bar
 *   EmptyState     — search term present, CommandEmpty renders
 *   WithDisabledItem — one item at 0.38 opacity + pointer-events-none
 *   WithIcons      — items prefixed with 15×15 Lucide icons, icon colour chain
 */

import type { Meta, StoryObj } from "@storybook/react";
import {
  CalendarIcon,
  SmileIcon,
  CalculatorIcon,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
  FileTextIcon,
  LockIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../components/command";

const meta: Meta<typeof Command> = {
  title: "Components/Organisms/Command",
  component: Command,
};

export default meta;
type Story = StoryObj<typeof Command>;

/* ── Story 1: Default — idle palette, two groups, shortcuts ─────────────── */
export const Default: Story = {
  render: () => (
    <Command className="min-w-[440px]">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem>Calendário</CommandItem>
          <CommandItem>Buscar emoji</CommandItem>
          <CommandItem>Calculadora</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Configurações">
          <CommandItem>
            Perfil
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Configurações
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/* ── Story 2: InputFocused — amber bottom-border + DFL focus ring on input ─ */
export const InputFocused: Story = {
  render: () => (
    // autoFocus triggers the focus-visible ring defined in CommandInput
    <Command className="min-w-[440px]">
      <CommandInput
        placeholder="Digite um comando ou pesquise..."
        defaultValue="perfil"
        autoFocus
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Configurações">
          <CommandItem>
            Perfil
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/* ── Story 3: ItemSelected — elevated bg + 2px amber left-bar ───────────── */
export const ItemSelected: Story = {
  render: () => (
    // cmdk sets data-selected on the active item during keyboard navigation.
    // We force-select the second item via the cmdk `value` prop + defaultValue.
    <Command className="min-w-[440px]" defaultValue="buscar emoji">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem value="calendário">Calendário</CommandItem>
          <CommandItem value="buscar emoji">Buscar emoji</CommandItem>
          <CommandItem value="calculadora">Calculadora</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/* ── Story 4: EmptyState — search term present, no results ──────────────── */
export const EmptyState: Story = {
  render: () => (
    <Command className="min-w-[440px]">
      <CommandInput
        placeholder="Digite um comando ou pesquise..."
        defaultValue="xyzabc"
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem>Calendário</CommandItem>
          <CommandItem>Buscar emoji</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/* ── Story 5: WithDisabledItem — 0.38 opacity + pointer-events-none ────── */
export const WithDisabledItem: Story = {
  render: () => (
    <Command className="min-w-[440px]">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Configurações">
          <CommandItem>
            Perfil
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          {/* disabled prop maps to data-disabled=true on the cmdk Item */}
          <CommandItem disabled>
            Billing (sem acesso)
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Configurações
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/* ── Story 6: WithIcons — 15×15 Lucide icons, muted → secondary on select ─ */
export const WithIcons: Story = {
  render: () => (
    <Command className="min-w-[440px]" defaultValue="perfil">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem value="calendário">
            <CalendarIcon />
            Calendário
          </CommandItem>
          <CommandItem value="emoji">
            <SmileIcon />
            Buscar emoji
          </CommandItem>
          <CommandItem value="calculadora">
            <CalculatorIcon />
            Calculadora
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Configurações">
          <CommandItem value="perfil">
            <UserIcon />
            Perfil
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="billing">
            <CreditCardIcon />
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem value="configurações">
            <SettingsIcon />
            Configurações
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem disabled value="docs">
            <FileTextIcon />
            Documentação (em breve)
          </CommandItem>
          <CommandItem disabled value="security">
            <LockIcon />
            Segurança (bloqueado)
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
