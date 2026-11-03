/**
 * Improvements ("Melhorias") stories — one state per story.
 *
 * The upload and submit are fakes: no network. Paste a screenshot with Ctrl+V
 * while the dialog is open to see a thumbnail.
 */
import type { Meta, StoryObj } from "@storybook/react";
import { ImprovementsDialog, ImprovementsLauncher } from "../components/organisms/Improvements";

const fakeUpload = (file: File) =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(`https://media.devfellowship.com/story-${encodeURIComponent(file.name)}`), 600),
  );
const fakeSubmit = () =>
  new Promise<{ thread_id: string }>((resolve) => setTimeout(() => resolve({ thread_id: "story" }), 600));

const meta: Meta<typeof ImprovementsLauncher> = {
  title: "Components/Organisms/Improvements",
  component: ImprovementsLauncher,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ImprovementsLauncher>;

/** Superadmin: the floating button, bottom right. Click it to open the dialog. */
export const FloatingButton: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <ImprovementsLauncher enabled appSlug="storybook" uploadImage={fakeUpload} onSubmit={fakeSubmit} />
    </div>
  ),
};

/** The floating button moved to the bottom left, 96px up (off the app controls). */
export const FloatingButtonMoved: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <ImprovementsLauncher
        enabled
        appSlug="storybook"
        fabPosition="bottom-left"
        fabOffset={{ x: 24, y: 96 }}
        uploadImage={fakeUpload}
        onSubmit={fakeSubmit}
      />
    </div>
  ),
};

/** Not a superadmin: nothing renders. */
export const Hidden: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <ImprovementsLauncher enabled={false} appSlug="storybook" uploadImage={fakeUpload} onSubmit={fakeSubmit} />
    </div>
  ),
};

/** The dialog, open and empty. */
export const DialogOpen: Story = {
  render: () => (
    <ImprovementsDialog open onOpenChange={() => {}} appSlug="storybook" uploadImage={fakeUpload} onSubmit={fakeSubmit} />
  ),
};
