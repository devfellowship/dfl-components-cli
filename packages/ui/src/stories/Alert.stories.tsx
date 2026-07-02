import type { Meta, StoryObj } from "@storybook/react";
import {
  Terminal,
  Info as InfoIcon,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../components/alert";

/**
 * Alert — one state per story (per the DS "1 story = 1 state" rule).
 * argTypes mirror the real cva:
 *   variant: default | info | success | warning | danger
 * Composes with AlertTitle + AlertDescription; a leading <svg> lands in the
 * icon column and is coloured per variant via --c-alert-{variant}-icon.
 */
const meta: Meta<typeof Alert> = {
  title: "Components/Atoms/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "danger"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

/** Neutral alert on a visible elevated panel — legible on the dark page. */
export const Default: Story = {
  render: () => (
    <Alert variant="default" className="max-w-md">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Você pode adicionar componentes ao app usando a CLI com{" "}
        <code>dfl-components add alert</code>.
      </AlertDescription>
    </Alert>
  ),
};

/** Informational — blue subtle fill + accent. */
export const Info: Story = {
  render: () => (
    <Alert variant="info" className="max-w-md">
      <InfoIcon />
      <AlertTitle>Nova versão disponível</AlertTitle>
      <AlertDescription>
        A versão 2.4 do componente está disponível. Atualize via CLI para obter
        melhorias de acessibilidade.
      </AlertDescription>
    </Alert>
  ),
};

/** Success — green subtle fill + accent. */
export const Success: Story = {
  render: () => (
    <Alert variant="success" className="max-w-md">
      <CheckCircle2 />
      <AlertTitle>Alterações salvas</AlertTitle>
      <AlertDescription>
        As configurações foram salvas com sucesso. As mudanças entrarão em vigor
        imediatamente.
      </AlertDescription>
    </Alert>
  ),
};

/** Warning — amber/yellow subtle fill + accent. */
export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="max-w-md">
      <AlertTriangle />
      <AlertTitle>Atenção</AlertTitle>
      <AlertDescription>
        Sua cota de uso está em 85%. Considere fazer upgrade do plano para evitar
        interrupções.
      </AlertDescription>
    </Alert>
  ),
};

/** Danger — red subtle fill + accent. (`destructive` is a back-compat alias.) */
export const Danger: Story = {
  render: () => (
    <Alert variant="danger" className="max-w-md">
      <AlertCircle />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>
        Sua sessão expirou. Faça login novamente para continuar.
      </AlertDescription>
    </Alert>
  ),
};

/** Title-only — compact layout, no description child. */
export const TitleOnly: Story = {
  render: () => (
    <Alert variant="success" className="max-w-sm">
      <CheckCircle2 />
      <AlertTitle>Alterações salvas com sucesso.</AlertTitle>
    </Alert>
  ),
};
