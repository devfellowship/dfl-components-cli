import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/accordion";

/**
 * Accordion — one story per state. Uses DS v0 component tokens:
 *   --c-accordion-border, --c-accordion-trigger-*, --c-accordion-content-*,
 *   --c-accordion-indicator-color / -color-open, --c-accordion-padding-*.
 *
 * Key DS fixes vs. vanilla shadcn:
 *   • hover:underline → bg-lift to --s-surface-raised (#1a1714)
 *   • ONE uniform focus ring: box-shadow 2px page-bg + 1px amber #E07A4A
 *   • Chevron muted (#7d7568) at rest → amber (#E07A4A) + 180° rotation when open
 *   • Content text in ink-secondary (#c9c0b4)
 *   • Disabled: ink-disabled (#5a5249), cursor not-allowed
 */
const meta: Meta<typeof Accordion> = {
  title: "Components/Molecules/Accordion",
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

/** All items collapsed. Chevron muted (#7d7568). type=single. */
export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: "400px" }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>O que é o DFL?</AccordionTrigger>
        <AccordionContent>
          DevFellowship é uma comunidade de desenvolvedores focada em aprendizado contínuo e colaboração.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Como me inscrevo?</AccordionTrigger>
        <AccordionContent>
          Acesse nossa página de cadastro e crie sua conta gratuitamente.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Quais são os benefícios?</AccordionTrigger>
        <AccordionContent>
          Acesso a cursos, projetos práticos, mentoria e uma rede de profissionais.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * One item open. Chevron rotated 180° + amber (#E07A4A).
 * Content text renders in ink-secondary (#c9c0b4).
 */
export const Expanded: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" style={{ width: "400px" }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>O que é o DFL?</AccordionTrigger>
        <AccordionContent>
          DevFellowship é uma comunidade de desenvolvedores focada em aprendizado contínuo e colaboração em projetos reais.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Como me inscrevo?</AccordionTrigger>
        <AccordionContent>
          Acesse nossa página de cadastro e crie sua conta gratuitamente.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Quais são os benefícios?</AccordionTrigger>
        <AccordionContent>
          Acesso a cursos, projetos práticos, mentoria e uma rede de profissionais.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Hovered trigger: bg lifts to --s-surface-raised (#1a1714).
 * No underline (replaces vanilla shadcn hover:underline).
 * Chevron lifts to ink-secondary.
 * Second item shows the forced hover appearance via className override.
 */
export const TriggerHover: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: "400px" }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>O que é o DFL?</AccordionTrigger>
        <AccordionContent>
          DevFellowship é uma comunidade de desenvolvedores.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        {/* Force-paint hover appearance for the static Storybook snapshot */}
        <AccordionTrigger className="bg-[var(--c-accordion-trigger-bg-hover)] [&>svg]:text-[var(--s-ink-secondary)]">
          Como me inscrevo?
        </AccordionTrigger>
        <AccordionContent>
          Acesse nossa página de cadastro.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Quais são os benefícios?</AccordionTrigger>
        <AccordionContent>
          Acesso a cursos e projetos práticos.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Keyboard-focused trigger: THE ONE uniform DS focus ring
 * (box-shadow: 0 0 0 2px page-bg, 0 0 0 3px amber #E07A4A).
 * Only shown on :focus-visible — keyboard nav only, not click.
 * Second item shows the forced focus-ring appearance.
 */
export const TriggerFocus: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: "400px" }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>O que é o DFL?</AccordionTrigger>
        <AccordionContent>
          DevFellowship é uma comunidade de desenvolvedores.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        {/* Force-paint the focus ring for the static Storybook snapshot */}
        <AccordionTrigger
          autoFocus
          className="shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--s-border-focus)]"
        >
          Como me inscrevo?
        </AccordionTrigger>
        <AccordionContent>
          Acesse nossa página de cadastro.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Quais são os benefícios?</AccordionTrigger>
        <AccordionContent>
          Acesso a cursos e projetos práticos.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * One item disabled: ink-disabled color (#5a5249), cursor not-allowed,
 * pointer-events-none. No hover or focus states activate on the disabled trigger.
 * Radix propagates data-disabled to the trigger; the component reads that attribute.
 */
export const DisabledItem: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: "400px" }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>O que é o DFL?</AccordionTrigger>
        <AccordionContent>
          DevFellowship é uma comunidade de desenvolvedores.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Como me inscrevo? (indisponível)</AccordionTrigger>
        <AccordionContent>
          Esta seção está temporariamente indisponível.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Quais são os benefícios?</AccordionTrigger>
        <AccordionContent>
          Acesso a cursos e projetos práticos.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * type=multiple — two items open simultaneously.
 * Each open chevron is rotated 180° and amber (#E07A4A).
 */
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["item-1", "item-3"]} style={{ width: "400px" }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>O que é o DFL?</AccordionTrigger>
        <AccordionContent>
          DevFellowship é uma comunidade de desenvolvedores focada em aprendizado contínuo e colaboração em projetos reais.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Como me inscrevo?</AccordionTrigger>
        <AccordionContent>
          Acesse nossa página de cadastro e crie sua conta gratuitamente.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Quais são os benefícios?</AccordionTrigger>
        <AccordionContent>
          Acesso a cursos, projetos práticos, mentoria e uma rede de profissionais experientes.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
