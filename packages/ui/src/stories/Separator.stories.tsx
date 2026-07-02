import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Separator, SeparatorWithLabel } from "../components/separator";

/**
 * Separator — one state per story.
 *
 * DS component tokens: --c-separator-color, --c-separator-thickness,
 *   --c-separator-label-fg, --c-separator-label-size (see tokens.css Layer 3).
 *
 * Non-interactive → focus ring N/A.
 */
const meta: Meta<typeof Separator> = {
  title: "Components/Atoms/Separator",
  component: Separator,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

/**
 * Default inline divider. Consumes --c-separator-color (→ --s-border-subtle)
 * and --c-separator-thickness (→ 1px) from the DS component token layer.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Deep Fellowship</p>
      <Separator className="my-3" orientation="horizontal" />
      <p className="text-sm text-muted-foreground">Comunidade de devs</p>
    </div>
  ),
};

/**
 * Vertical rule for nav/breadcrumb items. Same tokens as Horizontal;
 * orientation="vertical" switches to h-full / w-[--c-separator-thickness].
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Sobre</span>
    </div>
  ),
};

/**
 * Strong weight — overrides --c-separator-color to --s-border-strong (#3a3530)
 * via inline style. Use for major section boundaries (heavier break than inline
 * dividers).
 */
export const HorizontalStrong: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-[15px] font-medium">Seção Principal</p>
      <Separator
        orientation="horizontal"
        className="my-3"
        style={
          { "--c-separator-color": "var(--s-border-strong)" } as React.CSSProperties
        }
      />
      <p className="text-sm text-muted-foreground">Conteúdo da seção abaixo</p>
    </div>
  ),
};

/**
 * Labeled composite — SeparatorWithLabel places two separator lines flanking a
 * centered uppercase label. Consumes --c-separator-label-fg and
 * --c-separator-label-size from the token layer.
 *
 * Covers: auth-form "ou continue com", module headers, timeline section breaks.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="w-72 flex flex-col gap-4">
      <SeparatorWithLabel label="ou continue com" />
      <SeparatorWithLabel label="Módulo 3" />
      <SeparatorWithLabel label="Esta semana" />
    </div>
  ),
};

/**
 * Brand accent gradient — amber linear-gradient at 55% opacity for featured /
 * premium section headers. Inline style overrides background (gradient beats the
 * bg-[--c-separator-color] class since inline styles win specificity).
 *
 * Token: --c-separator-color-brand = var(--s-brand-border) [solid fallback].
 */
export const Brand: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <p
        className="text-[17px] font-semibold mb-3 uppercase tracking-wide"
        style={{ fontFamily: "var(--p-font-display)" }}
      >
        Recursos Premium
      </p>
      <Separator
        orientation="horizontal"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--p-amber-500), transparent)",
          opacity: 0.55,
        }}
      />
      <p className="text-sm text-muted-foreground mt-3">
        Desbloqueie aulas exclusivas, mentoria ao vivo e muito mais.
      </p>
    </div>
  ),
};
