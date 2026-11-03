/**
 * usePasteImageUpload — Ctrl+V a screenshot, upload it, keep a thumbnail.
 *
 * Port of the paste.devfellowship.com handler (`handlePaste`): a `paste`
 * listener on `document`, every `image/*` item. The listener is attached ONLY
 * while `enabled` is true (the dialog is open), so the host app's own paste
 * handlers (a canvas, an editor) never see a change. A paste with no image is
 * left alone, so text pastes into the textarea as usual.
 *
 * Plan 20261103-in-app-improvements-melhorias, task T4.
 */
import * as React from "react";

import { extractPastedImages } from "../lib/improvements";

export type PastedImageStatus = "uploading" | "done" | "error";

export interface PastedImage {
  id: string;
  /** Object URL for the thumbnail ("" when the runtime has none). */
  previewUrl: string;
  name: string;
  status: PastedImageStatus;
  /** The uploaded media URL, when status is "done". */
  url?: string;
  error?: string;
}

export interface UsePasteImageUploadOptions {
  /** Attach the document listener only while true. */
  enabled: boolean;
  /** Upload one file; resolve with its URL. */
  upload: (file: File) => Promise<string>;
  /** Max images kept (default 3). Extra pastes are ignored. */
  maxImages?: number;
  /** Event target. Defaults to `document`. */
  target?: Pick<Document, "addEventListener" | "removeEventListener"> | null;
}

export interface UsePasteImageUploadResult {
  images: PastedImage[];
  /** Add files by hand (for example from a file input). */
  addFiles: (files: File[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** True while at least one image is still uploading. */
  uploading: boolean;
  /** URLs of the images that finished uploading, in order. */
  urls: string[];
}

let seq = 0;
const nextId = () => `img-${Date.now().toString(36)}-${(seq++).toString(36)}`;

function objectUrl(file: File): string {
  try {
    return typeof URL !== "undefined" && typeof URL.createObjectURL === "function"
      ? URL.createObjectURL(file)
      : "";
  } catch {
    return "";
  }
}

function revoke(url: string) {
  if (url && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }
}

export function usePasteImageUpload({
  enabled,
  upload,
  maxImages = 3,
  target,
}: UsePasteImageUploadOptions): UsePasteImageUploadResult {
  const [images, setImages] = React.useState<PastedImage[]>([]);
  const imagesRef = React.useRef(images);
  imagesRef.current = images;
  const uploadRef = React.useRef(upload);
  uploadRef.current = upload;

  const addFiles = React.useCallback(
    (files: File[]) => {
      const room = Math.max(0, maxImages - imagesRef.current.length);
      const accepted = files.slice(0, room);
      if (accepted.length === 0) return;
      const fresh = accepted.map<PastedImage & { file: File }>((file) => ({
        id: nextId(),
        previewUrl: objectUrl(file),
        name: file.name || "screenshot.png",
        status: "uploading",
        file,
      }));
      imagesRef.current = [...imagesRef.current, ...fresh];
      setImages((prev) => [...prev, ...fresh.map(({ file: _f, ...img }) => img)]);
      for (const img of fresh) {
        uploadRef.current(img.file).then(
          (url) =>
            setImages((prev) =>
              prev.map((p) => (p.id === img.id ? { ...p, status: "done", url } : p)),
            ),
          (err: unknown) =>
            setImages((prev) =>
              prev.map((p) =>
                p.id === img.id
                  ? { ...p, status: "error", error: err instanceof Error ? err.message : String(err) }
                  : p,
              ),
            ),
        );
      }
    },
    [maxImages],
  );

  React.useEffect(() => {
    if (!enabled) return;
    const el = target === undefined ? (typeof document !== "undefined" ? document : null) : target;
    if (!el) return;
    const onPaste = (event: Event) => {
      const data = (event as ClipboardEvent).clipboardData;
      const files = extractPastedImages(data);
      if (files.length === 0) return;
      event.preventDefault();
      addFiles(files);
    };
    el.addEventListener("paste", onPaste);
    return () => el.removeEventListener("paste", onPaste);
  }, [enabled, target, addFiles]);

  const remove = React.useCallback((id: string) => {
    setImages((prev) => {
      const hit = prev.find((p) => p.id === id);
      if (hit) revoke(hit.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const clear = React.useCallback(() => {
    setImages((prev) => {
      prev.forEach((p) => revoke(p.previewUrl));
      return [];
    });
  }, []);

  const uploading = images.some((i) => i.status === "uploading");
  const urls = images.filter((i) => i.status === "done" && i.url).map((i) => i.url as string);

  return { images, addFiles, remove, clear, uploading, urls };
}
