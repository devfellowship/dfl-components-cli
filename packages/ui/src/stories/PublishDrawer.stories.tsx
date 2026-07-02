/**
 * PublishDrawer stories — one story per state (DS v0 one-state-per-story rule).
 *
 * States covered:
 *   1. Default          — idle form, all fields filled, DS tokens applied
 *   2. LoadingAccounts  — list-accounts in-flight; Select shows spinner
 *   3. RenderingThumbnail — Thumbify render in-flight; progress bar + status note
 *   4. Publishing       — create-post in-flight; brand status note; footer spinner
 *   5. Done             — success pane; CheckCircle via --c-publish-drawer-success-fg;
 *                         Zernio post ID in JetBrains Mono chip
 *   6. Error            — styled error box via --s-danger-* tokens
 *
 * Stories 1 and 3–6 use `_storyStatus` / `_storyAccounts` to bypass async
 * effects and pin the component in a specific visual state from mount.
 * Story 2 (LoadingAccounts) uses a mock supabase whose invoke never resolves,
 * exercising the real loading path.
 */
import type { Meta, StoryObj } from "@storybook/react";

import {
  PublishDrawer,
  type PublishDrawerSupabase,
  type PublisherAccount,
  type PublishResult,
} from "../components/organisms/PublishDrawer";

// ─── Shared fixtures ────────────────────────────────────────────────────────

const DFL_CHANNEL: PublisherAccount = {
  id: "1",
  platform: "youtube",
  account_id: "yt-dfl",
  account_name: "DFL Channel",
  is_active: true,
};

const STORY_RESULT: PublishResult = {
  zernio_post_id: "zrn_demo_123",
  post_url: "https://youtube.com/watch?v=demo",
  status: "published",
  log_id: "log_1",
};

/** A supabase stub that resolves quickly with a single DFL Channel account. */
const resolvedMock: PublishDrawerSupabase = {
  functions: {
    invoke: async (name) => {
      await new Promise((r) => setTimeout(r, 80));
      if (name === "dfl-publisher-list-accounts") {
        return { data: { ok: true, accounts: [DFL_CHANNEL] }, error: null };
      }
      if (name === "render-design-template") {
        return { data: { output_url: "https://placehold.co/1280x720/png?text=Thumbnail" }, error: null };
      }
      if (name === "dfl-publisher-create-post") {
        return { data: { ok: true, ...STORY_RESULT }, error: null };
      }
      if (name === "dfl-publisher-register-lesson") {
        return { data: { ok: true, lesson_id: "lesson_demo_1" }, error: null };
      }
      return { data: null, error: { message: "unknown_fn" } };
    },
  },
};

/** A supabase stub where list-accounts hangs forever — keeps component in loading-accounts state. */
const hangingMock: PublishDrawerSupabase = {
  functions: {
    invoke: async (_name) => {
      // Never resolves — component stays in loading-accounts state indefinitely.
      await new Promise(() => {});
      return { data: null, error: null };
    },
  },
};

// ─── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta<typeof PublishDrawer> = {
  title: "Components/Organisms/PublishDrawer",
  component: PublishDrawer,
};

export default meta;
type Story = StoryObj<typeof PublishDrawer>;

// ─── Common props shared across most states ──────────────────────────────────

const baseProps = {
  open: true,
  onOpenChange: () => {},
  supabase: resolvedMock,
  videoUrl: "https://example.com/video.mp4",
  suggestedTitle: "Como alavancar produtividade com IA",
  suggestedDescription:
    "Neste vídeo mostro o fluxo completo da máquina de criação de conteúdo da DFL.",
  suggestedThumbnailUrl: "https://cdn.devfellowship.com/renders/thumb_abc.png",
  thumbnailTemplateId: "tmpl_demo_bu",
  buId: "bu_demo",
};

// ─── Story 1: Default ────────────────────────────────────────────────────────
// Idle form with all fields pre-filled. Demonstrates:
//   - YouTube icon color via --c-publish-drawer-platform-fg (→ --s-danger-solid)
//   - Component token layer --c-publish-drawer-* now in tokens.css
//   - DS focus ring on all interactive elements (Tab through to observe)

export const Default: Story = {
  render: () => (
    <PublishDrawer
      {...baseProps}
      _storyStatus="idle"
      _storyAccounts={[DFL_CHANNEL]}
    />
  ),
};

// ─── Story 2: LoadingAccounts ─────────────────────────────────────────────────
// The drawer is open while dfl-publisher-list-accounts is in-flight.
// The mock supabase never resolves, so the component stays in loading-accounts.
// Demonstrates:
//   - Select trigger shows Loader2 spinner + "Carregando canais…"
//   - All inputs disabled at opacity: 0.45 (via disabled prop)

export const LoadingAccounts: Story = {
  render: () => (
    <PublishDrawer
      open={true}
      onOpenChange={() => {}}
      supabase={hangingMock}
      videoUrl="https://example.com/video.mp4"
      suggestedTitle="Como alavancar produtividade com IA"
    />
  ),
};

// ─── Story 3: RenderingThumbnail ──────────────────────────────────────────────
// "Gerar via Thumbify" button in spinner variant.
// Demonstrates:
//   - Thumbify button shows Loader2 + "Gerando…" label
//   - Indeterminate progress bar under the thumbnail field
//   - Brand status note (Loader2 + "Renderizando via Thumbify…")
//   - Footer Publicar button disabled

export const RenderingThumbnail: Story = {
  render: () => (
    <PublishDrawer
      {...baseProps}
      _storyStatus="rendering-thumb"
      _storyAccounts={[DFL_CHANNEL]}
    />
  ),
};

// ─── Story 4: Publishing ──────────────────────────────────────────────────────
// All inputs disabled while dfl-publisher-create-post is in-flight.
// Demonstrates:
//   - Footer "Publicar" button shows Loader2 + "Publicar" (button disabled)
//   - Inline brand status note: "Publicando via Zernio → YouTube…"
//   - --s-brand-fg text + --s-brand-subtle bg

export const Publishing: Story = {
  render: () => (
    <PublishDrawer
      {...baseProps}
      _storyStatus="publishing"
      _storyAccounts={[DFL_CHANNEL]}
    />
  ),
};

// ─── Story 5: Done ────────────────────────────────────────────────────────────
// Success pane after a completed publish round-trip.
// Demonstrates:
//   - CheckCircle2 icon color via --c-publish-drawer-success-fg (→ --s-success-solid)
//   - Post URL link in --s-brand-fg
//   - Zernio post ID in JetBrains Mono chip (--s-surface-elevated bg, --s-border-subtle border)

export const Done: Story = {
  render: () => (
    <PublishDrawer
      {...baseProps}
      _storyStatus="done"
      _storyResult={STORY_RESULT}
    />
  ),
};

// ─── Story 6: Error ───────────────────────────────────────────────────────────
// Form with a validation error visible.
// Demonstrates:
//   - Styled error box: --s-danger-fg text + --s-danger-subtle bg + --s-danger-border
//     (replaces the old bare `<p className="text-destructive">` with no bg)
//   - Uniform amber DS focus ring visible on Tab — applies to Input, Textarea,
//     SelectTrigger (now using --c-input-ring-focus), and Button

export const Error: Story = {
  render: () => (
    <PublishDrawer
      {...baseProps}
      _storyStatus="idle"
      _storyAccounts={[DFL_CHANNEL]}
      _storyErrorMsg="Selecione um canal do YouTube."
    />
  ),
};
