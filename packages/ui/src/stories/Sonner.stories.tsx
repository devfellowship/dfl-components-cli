import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { SonnerToaster } from "../components/sonner";
import { Button } from "../components/button";

const meta: Meta<typeof SonnerToaster> = {
  title: "Primitivos/Sonner",
  component: SonnerToaster,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SonnerToaster>;

export const Default: Story = {
  render: () => (
    <>
      <SonnerToaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("Evento criado", {
            description: "Domingo, 16 de Abril, 2026 às 9h00",
            action: { label: "Desfazer", onClick: () => undefined },
          })
        }
      >
        Mostrar toast
      </Button>
    </>
  ),
};
