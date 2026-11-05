/**
 * Improvements ("Melhorias") stories — one state per story.
 *
 * The upload and submit are fakes: no network. Paste a screenshot with Ctrl+V
 * while the dialog is open to see a thumbnail.
 */
import type { Meta, StoryObj } from "@storybook/react";
import { ImprovementsDialog, ImprovementsLauncher } from "../components/organisms/Improvements";
import type { ImprovementRequestSummary } from "../lib/improvements";

const fakeUpload = (file: File) =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(`https://media.devfellowship.com/story-${encodeURIComponent(file.name)}`), 600),
  );
const fakeSubmit = () =>
  new Promise<{ thread_id: string }>((resolve) => setTimeout(() => resolve({ thread_id: "story" }), 600));

const fakeMine: ImprovementRequestSummary[] = [
  {
    thread_id: "story-open",
    subject: "Mover o botão Salvar para o topo",
    thread_status: "open",
    created_at: "2026-11-05T10:00:00Z",
    closed_at: null,
    task: { id: "story-t1", identifier: "DFL-101", status: "in_progress" },
    app_slug: "storybook",
    result_url: null,
  },
  {
    thread_id: "story-done",
    subject: "Trocar a cor do header",
    thread_status: "closed",
    created_at: "2026-11-04T10:00:00Z",
    closed_at: "2026-11-04T12:00:00Z",
    task: { id: "story-t2", identifier: "DFL-100", status: "done" },
    app_slug: "storybook",
    result_url: "https://github.com/devfellowship/dfl-components-cli",
  },
];
const fakeListMine = () =>
  new Promise<ImprovementRequestSummary[]>((resolve) => setTimeout(() => resolve(fakeMine), 400));

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

/** "Minhas melhorias": one open request and one done request with its result URL. */
export const MyRequests: Story = {
  render: () => (
    <ImprovementsDialog
      open
      onOpenChange={() => {}}
      appSlug="storybook"
      uploadImage={fakeUpload}
      onSubmit={fakeSubmit}
      listMine={fakeListMine}
      initialView="mine"
    />
  ),
};
