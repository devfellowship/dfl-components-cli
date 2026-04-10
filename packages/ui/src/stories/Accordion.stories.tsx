import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/accordion";

const meta: Meta<typeof Accordion> = {
  title: "Primitivos/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

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
