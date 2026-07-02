import type { Meta, StoryObj } from "@storybook/react";
import { Terminal, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../components/alert";

/**
 * Alert — one state per story. argTypes mirror the real cva:
 *   variant: default | destructive
 * Composes with AlertTitle + AlertDescription; a leading <svg> is positioned
 * absolutely by the cva.
 */
const meta: Meta<typeof Alert> = {
  title: "Components/Atoms/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert variant="default" className="max-w-md">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Você pode adicionar componentes ao app usando a CLI.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>
        Sua sessão expirou. Faça login novamente para continuar.
      </AlertDescription>
    </Alert>
  ),
};

/** Title-only, no icon. */
export const TitleOnly: Story = {
  render: () => (
    <Alert variant="default" className="max-w-md">
      <AlertTitle>Alterações salvas</AlertTitle>
    </Alert>
  ),
};
