/**
 * AppNavbar stories — one story per state (DS v0 "1 story = 1 state" rule).
 *
 * Tokens exercised:
 *   --c-navbar-bg        (always --s-surface-page, dark-first)
 *   --c-navbar-border    (--s-border-subtle)
 *   --c-navbar-breadcrumb-fg / -fg-current
 *   --s-danger-fg / --s-danger-subtle  (sign-out item, UserMenuOpen story)
 *   .ds-focus-ring (ThemeToggleFocus, UserMenuTriggerFocus stories)
 *
 * Focus stories use a `play` function to programmatically move focus to
 * the target element, making the amber outline visible without keyboard interaction.
 */
import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { AppNavbar } from "../components/organisms/AppNavbar";
import { Button } from "../components/button";

const meta: Meta<typeof AppNavbar> = {
  title: "Components/Organisms/AppNavbar",
  component: AppNavbar,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppNavbar>;

// ── Shared fixtures ─────────────────────────────────────────────────────────

const threeCrumbs = [
  { label: "Dashboard", href: "/" },
  { label: "Cursos", href: "/courses" },
  { label: "React Avançado" },
];

const twoCrumbs = [
  { label: "Dashboard", href: "/" },
  { label: "React Avançado" },
];

const userInfo = {
  name: "João Silva",
  email: "joao@devfellowship.com",
  avatarUrl: "https://github.com/shadcn.png",
};

// ── Stories ─────────────────────────────────────────────────────────────────

/**
 * Default — dark surface (#0a0908), 3-crumb breadcrumb trail, user avatar + name,
 * Moon icon toggle (theme="light" means app is in light mode, click to go dark).
 * Component tokens --c-navbar-bg / --c-navbar-border / --c-navbar-breadcrumb-fg
 * drive bg, border, and breadcrumb ink.
 *
 * Note: the navbar surface is always --c-navbar-bg (--s-surface-page) dark, regardless
 * of the `theme` prop. The `theme` prop controls only the toggle icon (Moon ↔ Sun).
 * DFL DS v0 is dark-first; "light mode" is editorial-only.
 */
export const Default: Story = {
  args: {
    breadcrumbs: threeCrumbs,
    userInfo,
    theme: "light",
    onThemeToggle: () => {},
    onProfileClick: () => {},
    onSettingsClick: () => {},
    onSignOut: () => {},
  },
};

/**
 * NoBreadcrumbs — right-only controls (theme toggle + user pill) with no
 * breadcrumb zone. Left zone collapses cleanly with flex-1 + min-width:0.
 */
export const NoBreadcrumbs: Story = {
  args: {
    breadcrumbs: [],
    userInfo,
    theme: "dark",
    onThemeToggle: () => {},
    onSignOut: () => {},
  },
};

/**
 * WithActions — breadcrumbs + amber CTA Button (size="sm", variant="primary")
 * injected via the actions slot at 8px gap after the last breadcrumb item.
 */
export const WithActions: Story = {
  args: {
    breadcrumbs: threeCrumbs,
    userInfo,
    theme: "dark",
    onThemeToggle: () => {},
    onSignOut: () => {},
    actions: (
      <Button size="sm" variant="primary">
        <Plus />
        Nova Turma
      </Button>
    ),
  },
};

/**
 * UserMenuOpen — static render with dropdown visible.
 * Verifies: bg --s-surface-raised, border --s-border-strong, shadow,
 * sign-out row text --s-danger-fg + hover bg --s-danger-subtle (not text-destructive).
 *
 * The `play` function clicks the user trigger to open the dropdown on mount.
 */
export const UserMenuOpen: Story = {
  args: {
    breadcrumbs: twoCrumbs,
    userInfo,
    theme: "dark",
    onProfileClick: () => {},
    onSettingsClick: () => {},
    onSignOut: () => {},
  },
  parameters: {
    // Give extra vertical space so the dropdown doesn't clip
    layout: "fullscreen",
  },
  play: async ({ canvasElement }) => {
    // Find the user menu trigger (aria-haspopup="menu") and click to open
    const userTrigger = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-haspopup="menu"]',
    );
    userTrigger?.click();
  },
};

/**
 * ThemeToggleFocus — theme-toggle button rendered with :focus-visible state
 * showing the uniform amber focus ring:
 *   outline: 1px solid var(--s-border-focus, #E07A4A); outline-offset: 3px;
 * via the `.ds-focus-ring` class (tokens.css).
 *
 * The `play` function moves keyboard focus to the button so the outline renders.
 */
export const ThemeToggleFocus: Story = {
  args: {
    breadcrumbs: twoCrumbs,
    userInfo,
    theme: "dark",
    onThemeToggle: () => {},
    onSignOut: () => {},
  },
  play: async ({ canvasElement }) => {
    const themeToggle = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-label="Toggle theme"]',
    );
    themeToggle?.focus();
  },
};

/**
 * UserMenuTriggerFocus — user-menu DropdownMenuTrigger rendered with :focus-visible
 * showing the same uniform amber ring. Breadcrumb links also carry `.ds-focus-ring`
 * on :focus-visible (tab through them to confirm).
 *
 * The `play` function moves focus to the user trigger button.
 */
export const UserMenuTriggerFocus: Story = {
  args: {
    breadcrumbs: twoCrumbs,
    userInfo,
    theme: "dark",
    onThemeToggle: () => {},
    onSignOut: () => {},
  },
  play: async ({ canvasElement }) => {
    const userTrigger = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-haspopup="menu"]',
    );
    userTrigger?.focus();
  },
};
