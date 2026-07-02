import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "../components/toaster";
import { Button } from "../components/button";
import { useToast } from "../hooks/use-toast";

/**
 * Toaster — the Radix toast viewport that mounts once near the app root and
 * renders any toasts enqueued via `useToast()`. This atom story is a minimal
 * mount: the viewport is present but empty until a toast is fired.
 *
 * (For the full title+description toast flow see the Toast organism story.)
 */
const meta: Meta<typeof Toaster> = {
  title: "Components/Atoms/Toaster",
  component: Toaster,
};

export default meta;
type Story = StoryObj<typeof Toaster>;

/** Empty viewport — mounted, ready to receive toasts. */
export const Empty: Story = {
  render: () => <Toaster />,
};

/** Fire a single toast into the mounted viewport. */
export const WithToast: Story = {
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
    return <Demo />;
  },
};
