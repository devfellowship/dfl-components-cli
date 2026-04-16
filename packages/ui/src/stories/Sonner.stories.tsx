import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Toaster } from "../components/sonner";
import { Button } from "../components/button";

const meta: Meta<typeof Toaster> = {
  title: "Primitivos/Sonner",
  component: Toaster,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
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
