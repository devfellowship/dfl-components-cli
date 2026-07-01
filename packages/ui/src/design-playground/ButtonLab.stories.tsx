import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";

/**
 * DesignPlayground / ButtonLab — EXPERIMENTATION SANDBOX. NOT exported.
 *
 * This is a scratch surface for exploring NEW button treatments before they
 * graduate into the real `Components/Atoms/Button` (and the shared cva).
 * Nothing here is distributed via the registry / npm package — the
 * `check-no-playground-export` CI guard fails the build if anything under
 * `src/design-playground/**` leaks into the public export surface.
 *
 * Fleet drift note: some apps ship bespoke button flavours (`rounded`,
 * `toolbar`, `kanban`, `recording`) that are NOT in the shared cva. Prototype
 * them HERE first; promote the winners into `button.tsx`.
 */
const meta: Meta<typeof Button> = {
  title: "DesignPlayground/ButtonLab",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/** Experiment: a pill/rounded treatment not yet in the shared cva. */
export const RoundedExperiment: Story = {
  render: () => (
    <Button className="rounded-full px-5">Pill button (experiment)</Button>
  ),
};

/** Experiment: a subtle "recording" pulsing accent. */
export const RecordingExperiment: Story = {
  render: () => (
    <Button
      variant="destructive"
      className="relative before:absolute before:-left-1 before:top-1/2 before:size-2 before:-translate-y-1/2 before:animate-pulse before:rounded-full before:bg-current before:content-[''] pl-6"
    >
      Gravando…
    </Button>
  ),
};
