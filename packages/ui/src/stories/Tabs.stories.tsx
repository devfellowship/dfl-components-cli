import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";

/**
 * Tabs — one state per story (per DS "1 story = 1 state" rule).
 *
 * Uses the underline-indicator pattern driven by --c-tabs-* tokens:
 *   - List: 1 px --c-tabs-divider bottom border, no pill/card-bg container.
 *   - Trigger: 2 px transparent bottom border → --c-tabs-indicator (#E07A4A) when active.
 *   - Hover: secondary ink + faint rgba bg wash.
 *   - Focus: uniform DFL ring (1 px amber, 3 px offset) via .ds-focus-ring.
 *   - Disabled: ink-disabled, pointer-events-none, opacity-50.
 */
const meta: Meta<typeof Tabs> = {
  title: "Components/Molecules/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

/**
 * Two triggers, first tab active.
 * List uses --c-tabs-divider bottom border; active trigger shows 2 px --c-tabs-indicator (#E07A4A).
 * No pill container background.
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{ width: "400px" }}>
      <TabsList>
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
          Gerencie as configurações da sua conta aqui.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
          Altere sua senha aqui.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Same two triggers, second tab active.
 * Validates the amber indicator moves to the correct trigger position.
 */
export const SecondTabActive: Story = {
  render: () => (
    <Tabs defaultValue="password" style={{ width: "400px" }}>
      <TabsList>
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
          Gerencie as configurações da sua conta aqui.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
          Altere sua senha aqui.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Inactive trigger in hover state: secondary ink + faint rgba bg wash.
 * Active trigger indicator is visible simultaneously (amber bottom border on "Conta").
 * CSS injection forces the hover-state appearance on the "Senha" trigger for static snapshot fidelity.
 */
export const Hover: Story = {
  render: () => (
    <>
      <style>{`
        #sb-tabs-hover-trigger {
          color: var(--s-ink-secondary) !important;
          background: rgba(255, 255, 255, 0.035) !important;
        }
      `}</style>
      <Tabs defaultValue="account" style={{ width: "400px" }}>
        <TabsList>
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger id="sb-tabs-hover-trigger" value="password">Senha</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
            Gerencie as configurações da sua conta aqui.
          </p>
        </TabsContent>
        <TabsContent value="password">
          <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
            Altere sua senha aqui.
          </p>
        </TabsContent>
      </Tabs>
    </>
  ),
};

/**
 * Keyboard focus on an inactive trigger.
 * Shows the uniform DFL ring: 2 px page-bg gap + 1 px #E07A4A amber ring.
 * Replaces the Tailwind `ring-2 ring-ring ring-offset-2` shadcn pattern.
 * CSS injection forces the focus-ring appearance on the "Senha" trigger for static snapshot fidelity.
 */
export const Focus: Story = {
  render: () => (
    <>
      <style>{`
        #sb-tabs-focus-trigger {
          outline: none !important;
          box-shadow: 0 0 0 2px var(--background), 0 0 0 3px #E07A4A !important;
        }
      `}</style>
      <Tabs defaultValue="account" style={{ width: "400px" }}>
        <TabsList>
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger id="sb-tabs-focus-trigger" value="password">Senha</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
            Gerencie as configurações da sua conta aqui.
          </p>
        </TabsContent>
        <TabsContent value="password">
          <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
            Altere sua senha aqui.
          </p>
        </TabsContent>
      </Tabs>
    </>
  ),
};

/**
 * Three-trigger set with the second trigger in the disabled attribute state.
 * Disabled trigger: ink-disabled color, opacity-50, pointer-events-none (no hover, no click).
 */
export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{ width: "500px" }}>
      <TabsList>
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="notifications" disabled>Notificações</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
          Gerencie as configurações da sua conta aqui.
        </p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
          Preferências de notificação.
        </p>
      </TabsContent>
      <TabsContent value="security">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">
          Configurações de segurança.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Four triggers — validates density, divider spanning full list width, no overflow or truncation issues.
 */
export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" style={{ width: "600px" }}>
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="members">Membros</TabsTrigger>
        <TabsTrigger value="settings">Configurações</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">Visão geral do projeto.</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">Métricas e estatísticas.</p>
      </TabsContent>
      <TabsContent value="members">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">Gerenciar membros da equipe.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="py-2 text-sm text-[var(--s-ink-secondary)]">Configurações do projeto.</p>
      </TabsContent>
    </Tabs>
  ),
};
