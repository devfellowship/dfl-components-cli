import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "../components/toaster";
import { Button } from "../components/button";
import { useToast } from "../hooks/use-toast";

function ToastDemo() {
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Evento criado",
            description: "Domingo, 16 de Abril, 2026 às 9h00",
          })
        }
      >
        Mostrar toast
      </Button>
    </>
  );
}

const meta: Meta<typeof ToastDemo> = {
  title: "Primitivos/Toast",
  component: ToastDemo,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToastDemo>;

export const Default: Story = {
  render: () => <ToastDemo />,
};

export const Destructive: Story = {
  render: () => {
    function Demo() {
      const { toast } = useToast();
      return (
        <>
          <Toaster />
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: "destructive",
                title: "Algo deu errado",
                description: "Não foi possível salvar suas alterações.",
              })
            }
          >
            Mostrar toast destrutivo
          </Button>
        </>
      );
    }
    return <Demo />;
  },
};
