/**
 * Improvements ("Melhorias") organism — one dialog, two entry points.
 *
 * Plan 20261103-in-app-improvements-melhorias:
 *   ADR-1  one shared UI in @devfellowship/components
 *   ADR-9  (Q3 = C, Tainan TG 26523) a floating button AND an avatar-menu item,
 *          from one component; each app can move or switch off the button
 *   ADR-11 superadmin only — the app passes `enabled` from its own role check.
 *          The hiding here is cosmetic; the dfl-improvements service enforces
 *          the gate.
 *
 * Behaviour-agnostic like UserMenu: the app injects `uploadImage` and
 * `onSubmit` (use `createImprovementsClient` for the default DFL wiring).
 * Pass `listMine` (client.listMine) to show the "Minhas melhorias" tab (T11):
 * the caller's requests with thread status, task status and result URL.
 *
 *   const [open, setOpen] = useState(false);
 *   <UserMenu items={[createImprovementsMenuItem(() => setOpen(true)), ...]} />
 *   <ImprovementsLauncher appSlug="bmcanvas" enabled={isSuperadmin}
 *     open={open} onOpenChange={setOpen}
 *     uploadImage={client.uploadImage} onSubmit={client.submit}
 *     listMine={client.listMine} />
 */
import * as React from "react";
import { ExternalLink, ImagePlus, Lightbulb, Loader2, X } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  IMPROVEMENT_MAX_CHARS,
  IMPROVEMENT_MAX_IMAGES,
  buildImprovementContext,
  buildImprovementPayload,
  validateImprovementDraft,
  type ImprovementRequestPayload,
  type ImprovementRequestSummary,
  type ImprovementSubmitResult,
} from "../../lib/improvements";
import { usePasteImageUpload } from "../../hooks/use-paste-image-upload";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Textarea } from "../textarea";
import type { UserMenuItem } from "./UserMenu";

export interface ImprovementsLabels {
  trigger: string;
  title: string;
  description: string;
  placeholder: string;
  pasteHint: string;
  submit: string;
  cancel: string;
  sent: string;
  removeImage: string;
  tabNew: string;
  tabMine: string;
  mineLoading: string;
  mineEmpty: string;
  mineError: string;
  mineRetry: string;
  mineThread: string;
  mineTask: string;
  mineNoTask: string;
  mineResult: string;
}

export const DEFAULT_IMPROVEMENTS_LABELS: ImprovementsLabels = {
  trigger: "Melhorias",
  title: "Pedir uma melhoria",
  description: "Descreva o que você quer mudar nesta tela.",
  placeholder: "Ex.: o botão Salvar devia ficar no topo da página…",
  pasteHint: "Cole um print com Ctrl+V (até 3 imagens).",
  submit: "Enviar",
  cancel: "Cancelar",
  sent: "Melhoria enviada. Um agente vai responder no thread.",
  removeImage: "Remover imagem",
  tabNew: "Nova melhoria",
  tabMine: "Minhas melhorias",
  mineLoading: "Carregando suas melhorias…",
  mineEmpty: "Você ainda não pediu nenhuma melhoria.",
  mineError: "Não foi possível carregar suas melhorias.",
  mineRetry: "Tentar de novo",
  mineThread: "Thread",
  mineTask: "Tarefa",
  mineNoTask: "sem tarefa",
  mineResult: "Ver resultado",
};

/** Portuguese names of the thread and task statuses. Unknown values show as-is. */
const STATUS_LABELS: Record<string, string> = {
  open: "aberto",
  closed: "fechado",
  backlog: "backlog",
  todo: "a fazer",
  in_progress: "em andamento",
  in_review: "em revisão",
  blocked: "bloqueada",
  done: "concluída",
  cancelled: "cancelada",
  canceled: "cancelada",
};

export function improvementStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

/** Only an http(s) URL becomes a link (no `javascript:` from a stored value). */
function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

function formatCreated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export type ImprovementsView = "new" | "mine";

export type ImprovementsFabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface ImprovementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** App slug sent with the request, e.g. "bmcanvas". */
  appSlug: string;
  /** Upload one screenshot; resolve with its media.devfellowship.com URL. */
  uploadImage: (file: File) => Promise<string>;
  /** Send the request. Reject with an Error to show its message. */
  onSubmit: (payload: ImprovementRequestPayload) => Promise<ImprovementSubmitResult | void>;
  /** Called after a successful submit. */
  onSubmitted?: (result: ImprovementSubmitResult | void) => void;
  /** Build SHA of the app, added to the request context. */
  buildSha?: string;
  maxImages?: number;
  labels?: Partial<ImprovementsLabels>;
  /**
   * The caller's own requests, newest first (use `client.listMine`). When
   * given, the dialog shows a "Minhas melhorias" tab. Without it the tab is
   * hidden and the dialog is the plain request form.
   */
  listMine?: () => Promise<ImprovementRequestSummary[]>;
  /** The tab shown when the dialog opens (default "new"). */
  initialView?: ImprovementsView;
}

type MineState =
  | { status: "idle" | "loading"; items: ImprovementRequestSummary[] | null; error: null }
  | { status: "ready"; items: ImprovementRequestSummary[]; error: null }
  | { status: "error"; items: ImprovementRequestSummary[] | null; error: string };

export function ImprovementsDialog({
  open,
  onOpenChange,
  appSlug,
  uploadImage,
  onSubmit,
  onSubmitted,
  buildSha,
  maxImages = IMPROVEMENT_MAX_IMAGES,
  labels: labelsProp,
  listMine,
  initialView = "new",
}: ImprovementsDialogProps) {
  const labels = { ...DEFAULT_IMPROVEMENTS_LABELS, ...labelsProp };
  const hasMine = typeof listMine === "function";
  const [viewState, setView] = React.useState<ImprovementsView>(initialView);
  const view: ImprovementsView = hasMine ? viewState : "new";
  const [mine, setMine] = React.useState<MineState>({ status: "idle", items: null, error: null });
  // Keep the latest listMine in a ref: an inline function changes on every
  // render and must not re-trigger the fetch effect.
  const listMineRef = React.useRef(listMine);
  listMineRef.current = listMine;
  const fetchSeq = React.useRef(0);

  const refreshMine = React.useCallback(async () => {
    const fn = listMineRef.current;
    if (!fn) return;
    const seq = ++fetchSeq.current;
    setMine((prev) => ({ status: "loading", items: prev.items, error: null }));
    try {
      const items = await fn();
      if (seq !== fetchSeq.current) return;
      setMine({ status: "ready", items: Array.isArray(items) ? items : [], error: null });
    } catch (err) {
      if (seq !== fetchSeq.current) return;
      setMine((prev) => ({
        status: "error",
        items: prev.items,
        error: err instanceof Error && err.message ? err.message : String(err),
      }));
    }
  }, []);

  // Refresh every time the "Minhas melhorias" tab becomes visible.
  React.useEffect(() => {
    if (open && view === "mine") void refreshMine();
  }, [open, view, refreshMine]);

  // Drop answers that arrive after unmount.
  React.useEffect(
    () => () => {
      fetchSeq.current += 1;
    },
    [],
  );
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState<ImprovementSubmitResult | null>(null);
  const paste = usePasteImageUpload({ enabled: open, upload: uploadImage, maxImages });
  const { clear } = paste;

  const reset = React.useCallback(() => {
    setText("");
    setError(null);
    setSent(null);
    clear();
  }, [clear]);

  const handleOpenChange = (next: boolean) => {
    if (!next && sent) reset();
    onOpenChange(next);
  };

  const failedUpload = paste.images.find((i) => i.status === "error");
  const canSubmit = text.trim().length > 0 && !paste.uploading && !submitting && !sent;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const errors = validateImprovementDraft(text, paste.urls, { maxImages });
    if (errors.length > 0) {
      setError(errors[0].message);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const ctx = buildImprovementContext(window, buildSha);
      const result = await onSubmit(buildImprovementPayload(appSlug, text, paste.urls, ctx));
      setSent(result ?? {});
      onSubmitted?.(result);
      // Refetch at once, so the new request is in the list when the tab opens.
      if (hasMine) void refreshMine();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid="improvements-dialog" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        {hasMine && (
          <div role="tablist" aria-label={labels.trigger} className="flex border-b text-sm">
            {(["new", "mine"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                data-testid={v === "new" ? "improvements-tab-new" : "improvements-tab-mine"}
                onClick={() => setView(v)}
                className={cn(
                  "-mb-px border-b-2 px-3 py-1.5 font-medium",
                  view === v ? "border-current" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                {v === "new" ? labels.tabNew : labels.tabMine}
              </button>
            ))}
          </div>
        )}

        {view === "mine" ? (
          <MineList state={mine} labels={labels} onRetry={() => void refreshMine()} />
        ) : sent ? (
          <div data-testid="improvements-sent" className="text-sm">
            <p>{labels.sent}</p>
            {sent.thread_url && (
              <a className="underline" href={sent.thread_url} target="_blank" rel="noreferrer">
                {sent.thread_url}
              </a>
            )}
            {hasMine && (
              <p className="mt-2">
                <button type="button" className="underline" onClick={() => setView("mine")}>
                  {labels.tabMine}
                </button>
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Textarea
              data-testid="improvements-text"
              aria-label={labels.title}
              value={text}
              maxLength={IMPROVEMENT_MAX_CHARS}
              placeholder={labels.placeholder}
              rows={5}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSubmit) {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
            />
            <p className="flex items-center gap-1 text-xs opacity-70">
              <ImagePlus className="h-3.5 w-3.5" aria-hidden />
              {labels.pasteHint}
            </p>
            {paste.images.length > 0 && (
              <ul className="flex flex-wrap gap-2" data-testid="improvements-images">
                {paste.images.map((img) => (
                  <li
                    key={img.id}
                    data-testid="improvements-image"
                    data-status={img.status}
                    className="relative h-16 w-16 overflow-hidden rounded border"
                    title={img.error ?? img.name}
                  >
                    {img.previewUrl ? (
                      <img src={img.previewUrl} alt={img.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="block p-1 text-[10px]">{img.name}</span>
                    )}
                    {img.status === "uploading" && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={labels.removeImage}
                      onClick={() => paste.remove(img.id)}
                      className="absolute right-0 top-0 rounded-bl bg-black/60 p-0.5 text-white"
                    >
                      <X className="h-3 w-3" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {(error || failedUpload) && (
              <p role="alert" className="text-sm text-[var(--s-danger-fg,#e5484d)]">
                {error ?? failedUpload?.error}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                {labels.cancel}
              </Button>
              <Button type="submit" variant="primary" disabled={!canSubmit} data-testid="improvements-submit">
                {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden />}
                {labels.submit}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MineList({
  state,
  labels,
  onRetry,
}: {
  state: MineState;
  labels: ImprovementsLabels;
  onRetry: () => void;
}) {
  const items = state.items;
  return (
    <div role="tabpanel" data-testid="improvements-mine" data-status={state.status} className="text-sm">
      {state.status === "error" && (
        <div role="alert" data-testid="improvements-mine-error" className="mb-2 text-[var(--s-danger-fg,#e5484d)]">
          <p>
            {labels.mineError} {state.error}
          </p>
          <button type="button" className="underline" onClick={onRetry}>
            {labels.mineRetry}
          </button>
        </div>
      )}
      {items === null ? (
        state.status !== "error" && (
          <p data-testid="improvements-mine-loading" className="flex items-center gap-2 opacity-70">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {labels.mineLoading}
          </p>
        )
      ) : items.length === 0 ? (
        <p data-testid="improvements-mine-empty" className="opacity-70">
          {labels.mineEmpty}
        </p>
      ) : (
        <ul data-testid="improvements-mine-list" className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {items.map((r) => {
            const result = safeHttpUrl(r.result_url);
            return (
              <li
                key={r.thread_id}
                data-testid="improvements-mine-item"
                data-thread-status={r.thread_status}
                data-task-status={r.task?.status ?? ""}
                className="rounded border p-2"
              >
                <p className="font-medium">{r.subject}</p>
                <p className="text-xs opacity-70">
                  <time dateTime={r.created_at}>{formatCreated(r.created_at)}</time>
                  {" · "}
                  {labels.mineThread}: {improvementStatusLabel(r.thread_status)}
                  {" · "}
                  {labels.mineTask}:{" "}
                  {r.task
                    ? `${r.task.identifier ? `${r.task.identifier} ` : ""}${improvementStatusLabel(r.task.status)}`
                    : labels.mineNoTask}
                </p>
                {result && (
                  <a
                    data-testid="improvements-mine-result"
                    href={result}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs underline"
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden />
                    {labels.mineResult}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {items !== null && state.status === "loading" && (
        <p className="mt-2 flex items-center gap-1 text-xs opacity-60" aria-live="polite">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          {labels.mineLoading}
        </p>
      )}
    </div>
  );
}

/** Inline position (no Tailwind arbitrary values, so it works in every app). */
export function fabStyle(
  position: ImprovementsFabPosition,
  offset: { x?: number; y?: number } = {},
): React.CSSProperties {
  const x = offset.x ?? 24;
  const y = offset.y ?? 24;
  const style: React.CSSProperties = { position: "fixed", zIndex: 50 };
  if (position.startsWith("top")) style.top = y;
  else style.bottom = y;
  if (position.endsWith("left")) style.left = x;
  else style.right = x;
  return style;
}

export interface ImprovementsLauncherProps
  extends Omit<ImprovementsDialogProps, "open" | "onOpenChange"> {
  /** Render anything at all. Pass the app's superadmin check. */
  enabled: boolean;
  /** Show the floating button (default true). `false` = menu item only. */
  fab?: boolean;
  fabPosition?: ImprovementsFabPosition;
  /** Distance from the corner in px (default { x: 24, y: 24 }). */
  fabOffset?: { x?: number; y?: number };
  /** Controlled open state (needed when the avatar-menu item opens it). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * The floating button plus the dialog. Renders `null` unless `enabled`.
 * With `fab={false}` it renders only the dialog, opened by the menu item.
 */
export function ImprovementsLauncher({
  enabled,
  fab = true,
  fabPosition = "bottom-right",
  fabOffset,
  open: openProp,
  onOpenChange,
  className,
  labels,
  ...dialogProps
}: ImprovementsLauncherProps) {
  const [openState, setOpenState] = React.useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;
  const setOpen = (next: boolean) => {
    if (!controlled) setOpenState(next);
    onOpenChange?.(next);
  };

  if (!enabled) return null;
  const merged = { ...DEFAULT_IMPROVEMENTS_LABELS, ...labels };

  return (
    <>
      {fab && (
        <Button
          type="button"
          variant="primary"
          size="icon"
          data-testid="improvements-launcher"
          aria-label={merged.trigger}
          title={merged.trigger}
          onClick={() => setOpen(true)}
          style={fabStyle(fabPosition, fabOffset)}
          className={cn("rounded-full shadow-lg", className)}
        >
          <Lightbulb className="h-5 w-5" aria-hidden />
        </Button>
      )}
      <ImprovementsDialog {...dialogProps} labels={labels} open={open} onOpenChange={setOpen} />
    </>
  );
}

/** The avatar-menu entry ("Melhorias") for `UserMenu items`. */
export function createImprovementsMenuItem(
  onSelect: () => void,
  opts: { label?: string; separatorBefore?: boolean } = {},
): UserMenuItem {
  return {
    label: opts.label ?? DEFAULT_IMPROVEMENTS_LABELS.trigger,
    icon: <Lightbulb className="h-4 w-4" aria-hidden />,
    onSelect,
    separatorBefore: opts.separatorBefore,
  };
}
