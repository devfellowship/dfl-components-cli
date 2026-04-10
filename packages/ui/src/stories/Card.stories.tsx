import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { Button } from "../components/button";

const meta: Meta<typeof Card> = {
  title: "Primitivos/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ width: "360px" }}>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
        <CardDescription>Descrição ou subtítulo do card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Conteúdo do card com informações relevantes.</p>
      </CardContent>
      <CardFooter style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button variant="outline">Cancelar</Button>
        <Button>Confirmar</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card style={{ width: "360px" }}>
      <CardHeader>
        <CardTitle>Card Simples</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Conteúdo sem rodapé.</p>
      </CardContent>
    </Card>
  ),
};
