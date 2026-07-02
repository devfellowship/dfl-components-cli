import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { PublishDrawer, type PublishDrawerSupabase } from "../components/organisms/PublishDrawer";
import { Button } from "../components/button";

/**
 * A stubbed Supabase client that fakes the edge-fn round-trip so the story is
 * fully interactive without a real backend.
 */
const mockSupabase: PublishDrawerSupabase = {
  functions: {
    invoke: async (name) => {
      await new Promise((r) => setTimeout(r, 500));
      if (name === "dfl-publisher-list-accounts") {
        return {
          data: {
            ok: true,
            accounts: [
              { id: "1", platform: "youtube", account_id: "yt-main", account_name: "DFL Channel", is_active: true },
              { id: "2", platform: "youtube", account_id: "yt-alt", account_name: "Tainan Pessoal", is_active: true },
              { id: "3", platform: "instagram", account_id: "ig-1", account_name: "IG (hidden in v1)", is_active: true },
            ],
          },
          error: null,
        };
      }
      if (name === "render-design-template") {
        return { data: { output_url: "https://placehold.co/1280x720/png?text=Thumbnail" }, error: null };
      }
      if (name === "dfl-publisher-create-post") {
        return {
          data: { ok: true, zernio_post_id: "zrn_demo_123", post_url: "https://youtube.com/watch?v=demo", status: "published", log_id: "log_1" },
          error: null,
        };
      }
      if (name === "dfl-publisher-register-lesson") {
        return { data: { ok: true, lesson_id: "lesson_demo_1" }, error: null };
      }
      return { data: null, error: { message: "unknown_fn" } };
    },
  },
};

const meta: Meta<typeof PublishDrawer> = {
  title: "Components/Organisms/PublishDrawer",
  component: PublishDrawer,
};

export default meta;
type Story = StoryObj<typeof PublishDrawer>;

function PublishDrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => setOpen(true)}>Publicar vídeo</Button>
      <PublishDrawer
        open={open}
        onOpenChange={setOpen}
        supabase={mockSupabase}
        videoUrl="https://example.com/video.mp4"
        suggestedTitle="Como alavancar produtividade com IA"
        suggestedDescription="Neste vídeo mostro o fluxo completo da máquina de criação de conteúdo."
        thumbnailTemplateId="tmpl_demo_bu"
        buId="bu_demo"
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <PublishDrawerDemo />,
};
