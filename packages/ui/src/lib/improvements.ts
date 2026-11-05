/**
 * Improvements ("Melhorias") — pure helpers and the default client.
 *
 * Plan 20261103-in-app-improvements-melhorias (ADR-1, ADR-3, ADR-9).
 * A superadmin types a request in any DFL app, pastes 0–3 screenshots, and
 * submits. The screenshots upload straight from the browser to the
 * `upload-file` edge function on the `members` tier; the request goes to the
 * `dfl-improvements` service (dfl-services) with the caller's JWT.
 *
 * Everything here is framework-free so it runs under node and jsdom tests.
 * The package never hard-depends on supabase-js: the client is structural.
 */

/** Max characters of a request (same cap as a comms thread message). */
export const IMPROVEMENT_MAX_CHARS = 8000;
/** Max screenshots per request. */
export const IMPROVEMENT_MAX_IMAGES = 3;
/** Only this host is accepted for an attached image URL (ADR-3). */
export const IMPROVEMENT_MEDIA_HOST = "media.devfellowship.com";

const TARGET_MAX_BYTES = 300 * 1024;
const SKIP_COMPRESSION_UNDER = 300 * 1024;
const PNG_KEEP_UNDER = 500 * 1024;

// ─── Request payload ────────────────────────────────────────────────────────

/** Where the request came from. The dialog fills it by itself. */
export interface ImprovementContext {
  /** pathname + search of the page the user was on. */
  route: string;
  viewport: { width: number; height: number };
  /** Build SHA of the app, when the app exposes one. */
  build_sha?: string;
  /** ISO time of the submit. */
  submitted_at: string;
}

/** Body of `POST /v1/requests` on the dfl-improvements service. */
export interface ImprovementRequestPayload {
  app_slug: string;
  text: string;
  image_urls: string[];
  context: ImprovementContext;
}

/** What a submit returns. All fields optional: the service owns the shape. */
export interface ImprovementSubmitResult {
  request_id?: string;
  thread_id?: string;
  task_id?: string;
  thread_url?: string;
}

/**
 * One of the caller's own requests, as `GET /v1/requests?mine=1` returns it
 * (dfl-improvements `MyRequest`). Newest first.
 */
export interface ImprovementRequestSummary {
  thread_id: string;
  subject: string;
  /** Status of the comms thread, e.g. "open" or "closed". */
  thread_status: string;
  created_at: string;
  closed_at: string | null;
  /** The work task the request created; null when the service has none. */
  task: { id: string; identifier: string | null; status: string } | null;
  app_slug: string | null;
  /** URL of the delivered result (a PR, a page), when an agent posted one. */
  result_url: string | null;
}

export interface ImprovementDraftError {
  field: "text" | "images";
  message: string;
}

/** Validate a draft before submit. Returns an empty list when it is valid. */
export function validateImprovementDraft(
  text: string,
  imageUrls: string[],
  opts: { maxChars?: number; maxImages?: number } = {},
): ImprovementDraftError[] {
  const maxChars = opts.maxChars ?? IMPROVEMENT_MAX_CHARS;
  const maxImages = opts.maxImages ?? IMPROVEMENT_MAX_IMAGES;
  const errors: ImprovementDraftError[] = [];
  const trimmed = text.trim();
  if (!trimmed) errors.push({ field: "text", message: "Descreva a melhoria." });
  if (trimmed.length > maxChars) {
    errors.push({ field: "text", message: `Máximo de ${maxChars} caracteres.` });
  }
  if (imageUrls.length > maxImages) {
    errors.push({ field: "images", message: `Máximo de ${maxImages} imagens.` });
  }
  if (imageUrls.some((u) => !isAllowedMediaUrl(u))) {
    errors.push({ field: "images", message: "Imagem fora do media da DFL." });
  }
  return errors;
}

/** True only for an https URL on media.devfellowship.com. */
export function isAllowedMediaUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === IMPROVEMENT_MEDIA_HOST;
  } catch {
    return false;
  }
}

/** Build the auto context from a window-like object. */
export function buildImprovementContext(
  win: { location: { pathname: string; search: string }; innerWidth: number; innerHeight: number },
  buildSha?: string,
  now: Date = new Date(),
): ImprovementContext {
  const ctx: ImprovementContext = {
    route: `${win.location.pathname}${win.location.search}`,
    viewport: { width: win.innerWidth, height: win.innerHeight },
    submitted_at: now.toISOString(),
  };
  if (buildSha) ctx.build_sha = buildSha;
  return ctx;
}

/** Build the request payload (trimmed text). */
export function buildImprovementPayload(
  appSlug: string,
  text: string,
  imageUrls: string[],
  context: ImprovementContext,
): ImprovementRequestPayload {
  return { app_slug: appSlug, text: text.trim(), image_urls: imageUrls, context };
}

// ─── Clipboard ──────────────────────────────────────────────────────────────

/** Minimal DataTransfer shape (a real ClipboardEvent.clipboardData fits). */
export interface ClipboardLike {
  items?: ArrayLike<{ kind: string; type: string; getAsFile: () => File | null }> | null;
  files?: ArrayLike<File> | null;
}

/**
 * The image files in a paste, in order. Same rule as paste.devfellowship.com
 * (`handlePaste`): every `image/*` item of kind `file`. Falls back to `files`.
 */
export function extractPastedImages(data: ClipboardLike | null | undefined): File[] {
  if (!data) return [];
  const out: File[] = [];
  const items = data.items ? Array.from(data.items) : [];
  for (const item of items) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const f = item.getAsFile();
      if (f) out.push(f);
    }
  }
  if (out.length === 0 && data.files) {
    for (const f of Array.from(data.files)) {
      if (f.type.startsWith("image/")) out.push(f);
    }
  }
  return out;
}

// ─── Image compression (port of dfl-paste src/lib/imageUpload.ts) ──────────

/**
 * Compress an image toward ~300 KB: a JPEG quality sweep (0.9 → 0.3) at
 * scales 1 → 0.8 → 0.6 → 0.5. A small file (≤ 300 KB) and a PNG ≤ 500 KB pass
 * through untouched. Needs a browser canvas; it is a no-op for small files.
 */
export async function compressImage(file: File): Promise<File> {
  if (file.size <= SKIP_COMPRESSION_UNDER) return file;
  if (file.type === "image/png" && file.size <= PNG_KEEP_UNDER) return file;

  const bitmap = await loadBitmap(file);
  for (const scale of [1, 0.8, 0.6, 0.5]) {
    const canvas = drawScaled(bitmap, scale);
    for (let q = 0.9; q >= 0.3 - 1e-9; q -= 0.1) {
      const blob = await canvasToBlob(canvas, "image/jpeg", Number(q.toFixed(2)));
      if (blob && blob.size <= TARGET_MAX_BYTES) {
        return new File([blob], swapExt(file.name, "jpg"), { type: "image/jpeg" });
      }
    }
  }
  const blob = await canvasToBlob(drawScaled(bitmap, 0.5), "image/jpeg", 0.3);
  if (!blob) throw new Error("Falha ao comprimir imagem");
  return new File([blob], swapExt(file.name, "jpg"), { type: "image/jpeg" });
}

function drawScaled(bitmap: ImageBitmap | HTMLImageElement, scale: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall through to the <img> loader
    }
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Falha ao carregar imagem"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

function swapExt(name: string, ext: string): string {
  const dot = name.lastIndexOf(".");
  return `${dot === -1 ? name : name.slice(0, dot)}.${ext}`;
}

// ─── Default client ─────────────────────────────────────────────────────────

/** Structural subset of a SupabaseClient: only the session read. */
export interface ImprovementsSupabase {
  auth: {
    getSession: () => Promise<{ data: { session: { access_token: string } | null } }>;
  };
}

export interface ImprovementsClientOptions {
  /** The app's Supabase client (anon key + the user's session). */
  supabase: ImprovementsSupabase;
  /** e.g. https://<ref>.supabase.co */
  supabaseUrl: string;
  /** The anon (publishable) key. */
  supabaseAnonKey: string;
  /** Base URL of the dfl-improvements service, without a trailing slash. */
  serviceUrl: string;
  /** Injected for tests. Defaults to the global fetch. */
  fetchImpl?: typeof fetch;
}

export interface ImprovementsClient {
  /** Compress and upload one screenshot (members tier). Returns its media URL. */
  uploadImage: (file: File) => Promise<string>;
  /** Submit the request to the service. */
  submit: (payload: ImprovementRequestPayload) => Promise<ImprovementSubmitResult>;
  /** The caller's own requests, newest first (`GET /v1/requests?mine=1`). */
  listMine: () => Promise<ImprovementRequestSummary[]>;
}

async function accessToken(supabase: ImprovementsSupabase): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");
  return token;
}

async function errorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string; message?: string };
    return body?.error || body?.message || fallback;
  } catch {
    return fallback;
  }
}

/**
 * The default client: screenshots go to `upload-file` with
 * `visibility=members` (a DFL session is needed to read them, ADR-3), and the
 * request goes to `POST <serviceUrl>/v1/requests`. `listMine` reads
 * `GET <serviceUrl>/v1/requests?mine=1`. All carry the caller's JWT.
 */
export function createImprovementsClient(opts: ImprovementsClientOptions): ImprovementsClient {
  const doFetch = opts.fetchImpl ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  const base = opts.serviceUrl.replace(/\/+$/, "");

  return {
    async uploadImage(file: File): Promise<string> {
      const token = await accessToken(opts.supabase);
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", compressed);
      form.append("visibility", "members");
      const res = await doFetch(`${opts.supabaseUrl.replace(/\/+$/, "")}/functions/v1/upload-file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, apikey: opts.supabaseAnonKey },
        body: form,
      });
      if (!res.ok) throw new Error(await errorMessage(res, `Upload falhou (${res.status})`));
      const json = (await res.json()) as { url?: string };
      if (!json.url || !isAllowedMediaUrl(json.url)) {
        throw new Error("Upload sem URL do media da DFL.");
      }
      return json.url;
    },

    async submit(payload: ImprovementRequestPayload): Promise<ImprovementSubmitResult> {
      const token = await accessToken(opts.supabase);
      const res = await doFetch(`${base}/v1/requests`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 403) throw new Error("Apenas superadmins podem enviar melhorias.");
      if (!res.ok) throw new Error(await errorMessage(res, `Envio falhou (${res.status})`));
      try {
        return (await res.json()) as ImprovementSubmitResult;
      } catch {
        return {};
      }
    },

    async listMine(): Promise<ImprovementRequestSummary[]> {
      const token = await accessToken(opts.supabase);
      const res = await doFetch(`${base}/v1/requests?mine=1`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) throw new Error("Apenas superadmins podem ver melhorias.");
      if (!res.ok) throw new Error(await errorMessage(res, `Falha ao carregar melhorias (${res.status})`));
      let body: { requests?: unknown };
      try {
        body = (await res.json()) as { requests?: unknown };
      } catch {
        throw new Error("Resposta inválida do serviço de melhorias.");
      }
      if (!Array.isArray(body?.requests)) {
        throw new Error("Resposta inválida do serviço de melhorias.");
      }
      return body.requests as ImprovementRequestSummary[];
    },
  };
}
