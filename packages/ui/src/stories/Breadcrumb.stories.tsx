import type { Meta, StoryObj } from "@storybook/react";
import { Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/breadcrumb";

/**
 * Breadcrumb — one story per state, DS v0 token-aware.
 *
 * Component parts:
 *   Breadcrumb > BreadcrumbList > BreadcrumbItem
 *     (BreadcrumbLink | BreadcrumbPage)
 *   BreadcrumbSeparator between items
 *   BreadcrumbEllipsis — interactive <button> that collapses a long trail
 *
 * Design tokens consumed: --c-breadcrumb-* (resolves to --s-* semantic tokens).
 * Focus ring: box-shadow double ring — 2px surface-page gap + 1px #E07A4A.
 */
const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Molecules/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

/* ── 1. Default ──────────────────────────────────────────────────────────── */

/**
 * 3-level trail: Início › Componentes › current page.
 * Ancestor links at --c-breadcrumb-link-fg (ink-muted).
 * Current page at --c-breadcrumb-page-fg (ink-primary) weight-500.
 * Separator at --c-breadcrumb-separator-fg (ink-disabled).
 */
export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Componentes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/* ── 2. LinkHover ────────────────────────────────────────────────────────── */

/**
 * Mid-trail link in the pointer-over state.
 * Color transitions to --c-breadcrumb-link-fg-hover (ink-secondary) at 120ms ease-out.
 * Simulated via inline style so the story is self-explanatory as a static snapshot.
 */
export const LinkHover: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* hover state simulated — matches :hover CSS */}
          <BreadcrumbLink
            href="#"
            style={{ color: "var(--c-breadcrumb-link-fg-hover)" }}
          >
            Componentes
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/* ── 3. LinkFocus ────────────────────────────────────────────────────────── */

/**
 * Mid-trail link focused via keyboard navigation.
 * Renders the ONE uniform amber ring:
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 * Consistent with Button, Input, Checkbox and all other interactive DS atoms.
 * Simulated via inline style so the ring is visible without requiring Tab interaction.
 */
export const LinkFocus: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* focus-visible state simulated — matches :focus-visible CSS */}
          <BreadcrumbLink
            href="#"
            style={{
              color: "var(--c-breadcrumb-link-fg-hover)",
              borderRadius: "var(--c-breadcrumb-radius)",
              boxShadow:
                "0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A",
            }}
          >
            Componentes
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/* ── 4. Truncated ────────────────────────────────────────────────────────── */

/**
 * Long trail collapsed with BreadcrumbEllipsis.
 * Ellipsis is rendered as a <button> (28×28px, radius-sm) in the idle state:
 * color at --c-breadcrumb-link-fg (ink-muted), no background.
 */
export const Truncated: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Projetos</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Detalhes</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/* ── 5. EllipsisHover ────────────────────────────────────────────────────── */

/**
 * Ellipsis button in the pointer-over state.
 * Background lifts to --s-surface-elevated; icon color lifts to --c-breadcrumb-link-fg-hover.
 * Simulated via inline style so the story is self-explanatory as a static snapshot.
 */
export const EllipsisHover: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* hover state simulated — matches :hover CSS */}
          <BreadcrumbEllipsis
            style={{
              backgroundColor: "var(--s-surface-elevated)",
              color: "var(--c-breadcrumb-link-fg-hover)",
            }}
          />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Detalhes</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/* ── 6. CustomSeparator ──────────────────────────────────────────────────── */

/**
 * Slash icon variant replacing the default ChevronRight.
 * Confirms the BreadcrumbSeparator children slot works and separator color
 * stays at --c-breadcrumb-separator-fg (ink-disabled) regardless of icon.
 */
export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Documentos</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Atual</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
