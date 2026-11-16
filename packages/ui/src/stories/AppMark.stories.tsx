/**
 * AppMark stories — one story per state (DS rule: ONE STORY = ONE STATE).
 *
 * Icons load from brand.devfellowship.com/mini-apps/<icon_slug>/icon.svg.
 * The rows below mirror `apps.apps` (slug, name, icon_slug, kind).
 */
import type { Meta, StoryObj } from "@storybook/react";
import { AppMark, AppMarkStack } from "../components/molecules/AppMark";
import { AppsRegistryProvider, type AppRegistryRow } from "../hooks/use-apps-registry";

const ROWS: AppRegistryRow[] = [
  { slug: "os", name: "DFL OS", icon_slug: "os", kind: "app" },
  { slug: "campaigns", name: "DFL Campaigns", icon_slug: "campanhas", kind: "app" },
  { slug: "board", name: "DFL Board", icon_slug: "board", kind: "app" },
  { slug: "wiki", name: "DFL Wiki", icon_slug: "wiki", kind: "app" },
  { slug: "iam", name: "DFL IAM", icon_slug: null, kind: "app" },
];

const meta: Meta<typeof AppMark> = {
  title: "Components/Molecules/AppMark",
  component: AppMark,
  argTypes: {
    size: { control: "select", options: [16, 20, 32] },
    showName: { control: "boolean" },
  },
  args: { size: 20, showName: true },
};

export default meta;
type Story = StoryObj<typeof AppMark>;

/** A registry row: icon from `icon_slug`, name from `name`. Hover, focus or tap shows the name. */
export const Default: Story = { args: { app: ROWS[0] } };

/** 16px, for dense lists. */
export const Size16: Story = { args: { app: ROWS[0], size: 16 } };

/** 32px, for headers. */
export const Size32: Story = { args: { app: ROWS[0], size: 32 } };

/** Icon only. The name stays in the tooltip and in the accessible name. */
export const IconOnly: Story = { args: { app: ROWS[0], showName: false } };

/** The slug differs from the icon slug (`campaigns` uses `campanhas`). */
export const SlugDiffersFromIcon: Story = { args: { app: ROWS[1] } };

/** `icon_slug` is null: the neutral fleet mark shows, with the row name. */
export const NullIcon: Story = { args: { app: ROWS[4] } };

/** The icon URL answers an error: the neutral fleet mark replaces it. */
export const BrokenIconUrl: Story = {
  args: { app: { slug: "ghost", name: "Ghost app", icon_slug: "no-such-icon-slug", kind: "app" } },
};

/** The slug is not in the registry: the neutral fleet mark shows, with the slug as name. */
export const UnknownSlug: Story = {
  render: (args) => (
    <AppsRegistryProvider rows={ROWS}>
      <AppMark {...args} slug="not-an-app" />
    </AppsRegistryProvider>
  ),
};

/** A slug resolved through `AppsRegistryProvider` (one read of `apps.apps`, cached). */
export const FromRegistry: Story = {
  render: (args) => (
    <AppsRegistryProvider rows={ROWS}>
      <AppMark {...args} slug="campaigns" />
    </AppsRegistryProvider>
  ),
};

/** Four apps: three icons and a `+1` count. The count tooltip lists the hidden names. */
export const StackOfFour: StoryObj<typeof AppMarkStack> = {
  render: (args) => <AppMarkStack {...args} apps={ROWS.slice(0, 4)} />,
};

/** Three apps: three icons, no count. */
export const StackOfThree: StoryObj<typeof AppMarkStack> = {
  render: (args) => <AppMarkStack {...args} apps={ROWS.slice(0, 3)} />,
};
