/**
 * PublishDrawer organism — the central node of the DFL content-creation machine.
 *
 * A shared, app-agnostic publish widget (ADR-6 of plan
 * `20260501-content-creation-machine`). Any DFL creator app (Lesson Studio,
 * Course Shaper, …) imports it, hands it a recorded `videoUrl` plus a Supabase
 * client, and it orchestrates the existing `dfl-publisher-*` edge functions to
 * publish the piece cross-platform via Zernio + register the lesson.
 *
 * v1 scope (Q3=B, locked TG 2026-05-31): **YouTube only**. IG / TikTok are v2.
 * v1 SEO (Q4=B): the creator types title / keyword manually — no dfl-seo call.
 *
 * Self-contained: composes @dfl/components primitives. The `SupabaseClient` is
 * injected (never hardcoded) — same convention as AuthProvider/LoginPage. The
 * caller's session JWT rides along automatically via `supabase.functions.invoke`,
 * which the edge fns require for `auth.getUser()`.
 *
 * Edge-fn contracts (dfl-schema/supabase/functions):
 *   - dfl-publisher-list-accounts   GET  → { ok, accounts: PublisherAccount[] }
 *   - render-design-template        POST → { output_url }            (Thumbify)
 *   - dfl-publisher-create-post     POST → { ok, zernio_post_id, post_url, status, log_id }
 *   - dfl-publisher-register-lesson POST → { ok, lesson_id, ... }
 *
 * DS token corrections (v1.1.0):
 *   - Youtube icon:  text-red-600   → color: var(--c-publish-drawer-platform-fg)
 *   - CheckCircle2:  text-green-600 → color: var(--c-publish-drawer-success-fg)
 *   - Error message: bare text-destructive <p> → styled box via --s-danger-* tokens
 *   - Zernio post ID: bare text → JetBrains Mono chip via --c-publish-drawer-postid-font
 *   - SelectTrigger: shadcn legacy focus:ring-2 → DS focus ring via --c-input-ring-focus
 *   - RenderingThumb: added indeterminate progress bar + brand status note
 *   - Publishing:    added inline brand status note
 */
import * as React from "react";
import { Loader2, Youtube, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../sheet";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Textarea } from "../textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { cn } from "../../lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

/** Minimal subset of `@supabase/supabase-js` SupabaseClient we rely on.
 * Kept structural so the package never hard-depends on supabase-js. */
export interface PublishDrawerSupabase {
  functions: {
    invoke: (
      name: string,
      options?: { body?: unknown; method?: string },
    ) => Promise<{ data: unknown; error: { message: string } | null }>;
  };
}

/** A connected platform account, as returned by dfl-publisher-list-accounts. */
export interface PublisherAccount {
  id: string;
  platform: string;
  account_id: string;
  account_name: string | null;
  is_active?: boolean;
}

export type PublishStatus = "idle" | "loading-accounts" | "rendering-thumb" | "publishing" | "done" | "error";

export interface PublishResult {
  zernio_post_id: string;
  post_url?: string;
  status: string;
  log_id?: string;
  lesson_id?: string;
}

export interface PublishDrawerProps {
  /** Controls drawer visibility. */
  open: boolean;
  /** Called when the drawer requests to open/close. */
  onOpenChange: (open: boolean) => void;
  /** Injected Supabase client (carries the user session JWT). */
  supabase: PublishDrawerSupabase;
  /** URL of the rendered video to publish. Required. */
  videoUrl: string;
  /** Optional transcript (passed through to register-lesson / create-post). */
  transcript?: string;
  /** Optional pre-filled title (creator can edit). */
  suggestedTitle?: string;
  /** Optional pre-filled description (creator can edit). */
  suggestedDescription?: string;
  /** Optional pre-filled thumbnail URL (e.g. already rendered). */
  suggestedThumbnailUrl?: string;
  /** Optional Thumbify template id — when set, a "Generate thumbnail" button
   * calls render-design-template with this id. */
  thumbnailTemplateId?: string;
  /** Optional BU id, passed through to the edge fns. */
  buId?: string;
  /** Whether to also register the lesson in Course Shaper after publishing.
   * Defaults to true. */
  registerLesson?: boolean;
  /** Called on a successful publish round-trip. */
  onPublished?: (result: PublishResult) => void;
  /** Called on error. */
  onError?: (error: Error) => void;
  className?: string;
  /**
   * @internal Storybook-only props — bypass async effects to pin a specific
   * visual state without needing mock supabase timing tricks.
   * Never pass these in production code.
   */
  _storyStatus?: PublishStatus;
  _storyResult?: PublishResult | null;
  _storyAccounts?: PublisherAccount[];
  _storyErrorMsg?: string | null;
}

// ─── Pure helpers (unit-tested in isolation) ─────────────────────────────────

/** Parse a comma/space-separated tag/keyword string into a clean array. */
export function parseTags(raw: string): string[] {
  return raw
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/** v1: only YouTube accounts are publishable. */
export function filterPublishableAccounts(accounts: PublisherAccount[]): PublisherAccount[] {
  return accounts.filter((a) => a.platform === "youtube" && a.is_active !== false);
}

/** Validate the form is ready to publish. Returns an error code or null. */
export function validatePublishForm(input: {
  videoUrl: string;
  title: string;
  description: string;
  accountId: string | null;
}): string | null {
  if (!input.videoUrl.trim()) return "video_url_required";
  if (!input.title.trim()) return "title_required";
  if (!input.description.trim()) return "description_required";
  if (!input.accountId) return "account_required";
  return null;
}

const ERROR_LABELS: Record<string, string> = {
  video_url_required: "Vídeo ausente.",
  title_required: "Informe um título.",
  description_required: "Informe uma descrição.",
  account_required: "Selecione um canal do YouTube.",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PublishDrawer({
  open,
  onOpenChange,
  supabase,
  videoUrl,
  transcript = "",
  suggestedTitle = "",
  suggestedDescription = "",
  suggestedThumbnailUrl = "",
  thumbnailTemplateId,
  buId,
  registerLesson = true,
  onPublished,
  onError,
  className,
  _storyStatus,
  _storyResult = null,
  _storyAccounts,
  _storyErrorMsg = null,
}: PublishDrawerProps) {
  // When a story injects a status, skip all async effects so the component
  // starts (and stays) in the requested visual state.
  const isStoryOverride = _storyStatus !== undefined;

  const [title, setTitle] = React.useState(suggestedTitle);
  const [description, setDescription] = React.useState(suggestedDescription);
  const [tagsRaw, setTagsRaw] = React.useState("");
  const [thumbnailUrl, setThumbnailUrl] = React.useState(suggestedThumbnailUrl);
  const [accounts, setAccounts] = React.useState<PublisherAccount[]>(_storyAccounts ?? []);
  // Auto-select the first account when story injects a single account (mirrors
  // the single-account auto-selection that happens after a real list-accounts call).
  const [accountId, setAccountId] = React.useState<string | null>(
    _storyAccounts?.length === 1 ? _storyAccounts[0].account_id : null,
  );
  const [status, setStatus] = React.useState<PublishStatus>(_storyStatus ?? "idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(_storyErrorMsg ?? null);
  const [result, setResult] = React.useState<PublishResult | null>(_storyResult);

  // Re-sync props → state when the drawer opens with fresh content.
  // Skipped when a story overrides state directly.
  React.useEffect(() => {
    if (isStoryOverride) return;
    if (open) {
      setTitle(suggestedTitle);
      setDescription(suggestedDescription);
      setThumbnailUrl(suggestedThumbnailUrl);
      setStatus("idle");
      setErrorMsg(null);
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isStoryOverride]);

  // Load connected accounts when the drawer opens.
  // Skipped when a story overrides state directly.
  React.useEffect(() => {
    if (isStoryOverride) return;
    if (!open) return;
    let cancelled = false;
    (async () => {
      setStatus("loading-accounts");
      const { data, error } = await supabase.functions.invoke("dfl-publisher-list-accounts", {
        method: "GET",
      });
      if (cancelled) return;
      if (error) {
        setStatus("error");
        setErrorMsg("Não foi possível carregar os canais conectados.");
        return;
      }
      const payload = (data ?? {}) as { ok?: boolean; accounts?: PublisherAccount[] };
      const publishable = filterPublishableAccounts(payload.accounts ?? []);
      setAccounts(publishable);
      setAccountId(publishable.length === 1 ? publishable[0].account_id : null);
      setStatus("idle");
    })();
    return () => {
      cancelled = true;
    };
  }, [open, supabase, isStoryOverride]);

  const fail = React.useCallback(
    (msg: string) => {
      setStatus("error");
      setErrorMsg(msg);
      onError?.(new Error(msg));
    },
    [onError],
  );

  async function handleGenerateThumbnail() {
    if (!thumbnailTemplateId) return;
    setStatus("rendering-thumb");
    setErrorMsg(null);
    const { data, error } = await supabase.functions.invoke("render-design-template", {
      body: { template_id: thumbnailTemplateId, render_params: { title } },
    });
    if (error) {
      fail("Falha ao gerar a thumbnail via Thumbify.");
      return;
    }
    const url = (data as { output_url?: string })?.output_url;
    if (!url) {
      fail("Thumbify não retornou uma URL de imagem.");
      return;
    }
    setThumbnailUrl(url);
    setStatus("idle");
  }

  async function handlePublish() {
    const validationError = validatePublishForm({ videoUrl, title, description, accountId });
    if (validationError) {
      setErrorMsg(ERROR_LABELS[validationError] ?? validationError);
      return;
    }
    const account = accounts.find((a) => a.account_id === accountId);
    if (!account) {
      fail("Canal selecionado é inválido.");
      return;
    }

    const tags = parseTags(tagsRaw);
    setStatus("publishing");
    setErrorMsg(null);

    // Step 1 — create the post (push to Zernio → YouTube).
    const { data: postData, error: postErr } = await supabase.functions.invoke(
      "dfl-publisher-create-post",
      {
        body: {
          video_url: videoUrl,
          title: title.trim(),
          description: description.trim(),
          tags,
          thumbnail_url: thumbnailUrl,
          account_id: account.account_id,
          platform: "youtube",
          transcript,
          keyword: tags[0],
          bu_id: buId,
          privacy: "unlisted",
        },
      },
    );

    if (postErr) {
      fail(`Publicação falhou: ${postErr.message}`);
      return;
    }
    const post = (postData ?? {}) as {
      ok?: boolean;
      zernio_post_id?: string;
      post_url?: string;
      status?: string;
      log_id?: string;
      error?: string;
    };
    if (!post.ok || !post.zernio_post_id) {
      fail(`Publicação falhou: ${post.error ?? "resposta inesperada"}`);
      return;
    }

    const publishResult: PublishResult = {
      zernio_post_id: post.zernio_post_id,
      post_url: post.post_url,
      status: post.status ?? "published",
      log_id: post.log_id,
    };

    // Step 2 — register the lesson in Course Shaper (best-effort, optional).
    if (registerLesson) {
      const { data: regData, error: regErr } = await supabase.functions.invoke(
        "dfl-publisher-register-lesson",
        {
          body: {
            zernio_post_id: post.zernio_post_id,
            video_url: videoUrl,
            thumbnail_url: thumbnailUrl,
            title: title.trim(),
            description: description.trim(),
            transcript,
            tags,
            keyword: tags[0],
            bu_id: buId,
            platform: "youtube",
          },
        },
      );
      if (!regErr) {
        const reg = (regData ?? {}) as { lesson_id?: string };
        publishResult.lesson_id = reg.lesson_id;
      }
      // A failed register-lesson does not fail the publish — the video is live.
    }

    setResult(publishResult);
    setStatus("done");
    onPublished?.(publishResult);
  }

  const busy = status === "publishing" || status === "rendering-thumb" || status === "loading-accounts";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn("flex w-full flex-col gap-4 overflow-y-auto sm:max-w-md", className)}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {/*
             * Platform icon: DS danger token via --c-publish-drawer-platform-fg
             * Replaces raw Tailwind palette leak `text-red-600`.
             */}
            <Youtube
              className="h-5 w-5 shrink-0"
              style={{ color: "var(--c-publish-drawer-platform-fg)" }}
            />
            Publicar no YouTube
          </SheetTitle>
          <SheetDescription>
            Publique o vídeo gravado cross-platform via Zernio. Preencha título, descrição e
            palavras-chave manualmente.
          </SheetDescription>
        </SheetHeader>

        {/* ─── Done pane ─────────────────────────────────────────────────────── */}
        {status === "done" && result ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            {/* Success icon wrapped in success-subtle circle */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full border"
              style={{
                background: "var(--s-success-subtle)",
                borderColor: "var(--s-success-border)",
              }}
            >
              {/*
               * CheckCircle2: DS success token via --c-publish-drawer-success-fg
               * Replaces raw Tailwind palette leak `text-green-600`.
               */}
              <CheckCircle2
                className="h-6 w-6"
                style={{ color: "var(--c-publish-drawer-success-fg)" }}
              />
            </div>

            <p
              className="text-[15px] font-semibold"
              style={{ color: "var(--s-ink-primary)" }}
            >
              Vídeo publicado!
            </p>

            {result.post_url && (
              <a
                href={result.post_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline underline-offset-2 ds-focus-ring rounded-sm"
                style={{ color: "var(--s-brand-fg)" }}
              >
                Abrir no YouTube ↗
              </a>
            )}

            {/*
             * Zernio post ID: JetBrains Mono chip via --c-publish-drawer-postid-font.
             * Replaces bare inline text in body font.
             */}
            <code
              className="rounded border px-2 py-0.5 text-[11px] tracking-[0.3px]"
              style={{
                fontFamily: "var(--c-publish-drawer-postid-font)",
                color: "var(--s-ink-muted)",
                background: "var(--s-surface-elevated)",
                borderColor: "var(--s-border-subtle)",
              }}
            >
              {result.zernio_post_id}
            </code>

            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        ) : (
          /* ─── Form pane ──────────────────────────────────────────────────── */
          <div className="flex flex-1 flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pd-title">Título</Label>
              <Input
                id="pd-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do vídeo"
                disabled={busy}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pd-desc">Descrição</Label>
              <Textarea
                id="pd-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do vídeo"
                rows={4}
                disabled={busy}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pd-tags">Palavras-chave / tags</Label>
              <Input
                id="pd-tags"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                placeholder="ex: alavancagem, produtividade, IA"
                disabled={busy}
              />
              <p className="text-xs" style={{ color: "var(--s-ink-muted)" }}>
                Separadas por vírgula. A primeira vira a keyword.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pd-thumb">Thumbnail</Label>
              <Input
                id="pd-thumb"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder={
                  status === "rendering-thumb" ? "Gerando via Thumbify…" : "URL da thumbnail"
                }
                disabled={busy}
              />
              {thumbnailTemplateId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateThumbnail}
                  disabled={busy}
                  className="w-fit"
                >
                  {status === "rendering-thumb" ? (
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin"
                      style={{ color: "var(--s-ink-muted)" }}
                    />
                  ) : (
                    <ImageIcon className="h-3.5 w-3.5" />
                  )}
                  {status === "rendering-thumb" ? "Gerando…" : "Gerar via Thumbify"}
                </Button>
              )}
              {/* Indeterminate progress bar — visible only during thumbnail rendering */}
              {status === "rendering-thumb" && (
                <div
                  className="h-0.5 w-full overflow-hidden rounded-full"
                  style={{ background: "var(--s-border-subtle)" }}
                  role="progressbar"
                  aria-label="Renderizando thumbnail…"
                >
                  <div
                    className="h-full w-2/5 animate-pulse rounded-full"
                    style={{ background: "var(--s-brand-solid)" }}
                  />
                </div>
              )}
              {thumbnailUrl && status !== "rendering-thumb" && (
                <img
                  src={thumbnailUrl}
                  alt="Preview da thumbnail"
                  className="mt-1 max-h-32 rounded object-contain"
                  style={{ border: "1px solid var(--s-border-subtle)" }}
                />
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pd-account">Canal do YouTube</Label>
              <Select
                value={accountId ?? undefined}
                onValueChange={setAccountId}
                disabled={busy || accounts.length === 0}
              >
                {/*
                 * SelectTrigger: override the shadcn default `focus:ring-2 focus:ring-ring`
                 * (which uses a different ring spec) with the DS uniform amber focus ring
                 * via --c-input-ring-focus (brand-ring at 45% opacity).
                 */}
                <SelectTrigger
                  id="pd-account"
                  className="h-9 text-[13px] focus:ring-0 focus-visible:border-[var(--c-input-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--c-input-ring-focus)]"
                >
                  {status === "loading-accounts" ? (
                    /* Loading spinner + label replaces the SelectValue placeholder */
                    <span
                      className="flex items-center gap-2"
                      style={{ color: "var(--s-ink-muted)" }}
                    >
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Carregando canais…
                    </span>
                  ) : (
                    <SelectValue
                      placeholder={
                        accounts.length === 0
                          ? "Nenhum canal conectado"
                          : "Selecione um canal"
                      }
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.account_id}>
                      {a.account_name ?? a.account_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/*
             * Brand status note — inline contextual feedback during async ops.
             * Uses --s-brand-fg text + --s-brand-subtle bg + --s-brand-border border.
             */}
            {(status === "rendering-thumb" || status === "publishing") && (
              <div
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs"
                style={{
                  color: "var(--s-brand-fg)",
                  background: "var(--s-brand-subtle)",
                  borderColor: "var(--s-brand-border)",
                }}
                role="status"
              >
                <Loader2 className="h-3 w-3 animate-spin" />
                {status === "rendering-thumb"
                  ? "Renderizando via Thumbify…"
                  : "Publicando via Zernio → YouTube…"}
              </div>
            )}

            {/*
             * Error box: styled panel with --s-danger-* tokens.
             * Replaces the previous bare `<p className="text-destructive">` which
             * had no background and was invisible against the panel surface.
             */}
            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border px-3 py-2 text-xs"
                style={{
                  color: "var(--s-danger-fg)",
                  background: "var(--s-danger-subtle)",
                  borderColor: "var(--s-danger-border)",
                }}
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {errorMsg}
              </div>
            )}

            <SheetFooter className="mt-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancelar
              </Button>
              <Button onClick={handlePublish} disabled={busy}>
                {status === "publishing" && <Loader2 className="h-4 w-4 animate-spin" />}
                Publicar
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
