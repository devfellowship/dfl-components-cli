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
 *
 *   const [open, setOpen] = useState(false);
 *   <UserMenu items={[createImprovementsMenuItem(() => setOpen(true)), ...]} />
 *   <ImprovementsLauncher appSlug="bmcanvas" enabled={isSuperadmin}
 *     open={open} onOpenChange={setOpen}
 *     uploadImage={client.uploadImage} onSubmit={client.submit} />
 */
import * as React from "react";
import { ImagePlus, Lightbulb, Loader2, X } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  IMPROVEMENT_MAX_CHARS,
  IMPROVEMENT_MAX_IMAGES,
  buildImprovementContext,
  buildImprovementPayload,
  validateImprovementDraft,
  type ImprovementRequestPayload,
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
};

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
}

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
}: ImprovementsDialogProps) {
  const labels = { ...DEFAULT_IMPROVEMENTS_LABELS, ...labelsProp };
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

        {sent ? (
          <div data-testid="improvements-sent" className="text-sm">
            <p>{labels.sent}</p>
            {sent.thread_url && (
              <a className="underline" href={sent.thread_url} target="_blank" rel="noreferrer">
                {sent.thread_url}
              </a>
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
