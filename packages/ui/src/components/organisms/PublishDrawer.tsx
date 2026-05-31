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
}: PublishDrawerProps) {
  const [title, setTitle] = React.useState(suggestedTitle);
  const [description, setDescription] = React.useState(suggestedDescription);
  const [tagsRaw, setTagsRaw] = React.useState("");
  const [thumbnailUrl, setThumbnailUrl] = React.useState(suggestedThumbnailUrl);
  const [accounts, setAccounts] = React.useState<PublisherAccount[]>([]);
  const [accountId, setAccountId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<PublishStatus>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PublishResult | null>(null);

  // Re-sync props → state when the drawer opens with fresh content.
  React.useEffect(() => {
    if (open) {
      setTitle(suggestedTitle);
      setDescription(suggestedDescription);
      setThumbnailUrl(suggestedThumbnailUrl);
      setStatus("idle");
      setErrorMsg(null);
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Load connected accounts when the drawer opens.
  React.useEffect(() => {
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
  }, [open, supabase]);

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
    const post = (postData ?? {}) as { ok?: boolean; zernio_post_id?: string; post_url?: string; status?: string; log_id?: string; error?: string };
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
      <SheetContent side="right" className={cn("flex w-full flex-col gap-4 overflow-y-auto sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            Publicar no YouTube
          </SheetTitle>
          <SheetDescription>
            Publique o vídeo gravado cross-platform via Zernio. Preencha título, descrição e
            palavras-chave manualmente.
          </SheetDescription>
        </SheetHeader>

        {status === "done" && result ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <p className="font-medium">Vídeo publicado!</p>
            {result.post_url && (
              <a
                href={result.post_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline"
              >
                Abrir no YouTube
              </a>
            )}
            <p className="text-xs text-muted-foreground">Zernio post id: {result.zernio_post_id}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        ) : (
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
              <p className="text-xs text-muted-foreground">Separadas por vírgula. A primeira vira a keyword.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pd-thumb">Thumbnail</Label>
              <Input
                id="pd-thumb"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="URL da thumbnail"
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="mr-2 h-4 w-4" />
                  )}
                  Gerar via Thumbify
                </Button>
              )}
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Preview da thumbnail"
                  className="mt-1 max-h-32 rounded border object-contain"
                />
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pd-account">Canal do YouTube</Label>
              <Select value={accountId ?? undefined} onValueChange={setAccountId} disabled={busy || accounts.length === 0}>
                <SelectTrigger id="pd-account">
                  <SelectValue
                    placeholder={
                      status === "loading-accounts"
                        ? "Carregando canais…"
                        : accounts.length === 0
                          ? "Nenhum canal conectado"
                          : "Selecione um canal"
                    }
                  />
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

            {errorMsg && (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errorMsg}
              </p>
            )}

            <SheetFooter className="mt-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancelar
              </Button>
              <Button onClick={handlePublish} disabled={busy}>
                {status === "publishing" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publicar
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
