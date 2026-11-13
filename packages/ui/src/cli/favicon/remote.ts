/**
 * Remote mini-app icon fetch for `dfl-components favicon --app <slug>`.
 *
 * THE ONLY NETWORK MODULE OF THE CLI. It is built as its own entry
 * (`dist/favicon-remote.js`) and loaded lazily by `index.ts` only when `--app`
 * is given, so `dist/cli.js` stays free of network primitives
 * (scripts/check-cli-bundle-offline.mjs).
 *
 * Contract: verify EVERYTHING in memory, return the bytes. The caller writes
 * only after this resolves, so a bad file never leaves a partial install.
 */
import { createHash } from 'node:crypto';

import { MINI_APP_SOURCES } from './patch-html.js';

export const DEFAULT_SOURCE = 'https://brand.devfellowship.com/mini-apps';
export const FETCH_TIMEOUT_MS = 15_000;
const SLUG_RE = /^[a-z0-9-]+$/;

export class BadSlugError extends Error {
  constructor(slug: string) {
    super(`Invalid app slug "${slug}" (allowed: lowercase letters, digits, "-").`);
    this.name = 'BadSlugError';
  }
}

export class UnknownAppError extends Error {
  constructor(
    readonly slug: string,
    readonly available: string[],
  ) {
    super(`Unknown app "${slug}". Available: ${available.join(', ')}`);
    this.name = 'UnknownAppError';
  }
}

export class IconVerificationError extends Error {
  constructor(
    readonly file: string,
    message: string,
  ) {
    super(`${file}: ${message}`);
    this.name = 'IconVerificationError';
  }
}

export type FetchLike = (
  url: string,
  init?: { redirect?: 'error'; signal?: AbortSignal },
) => Promise<{ status: number; ok: boolean; arrayBuffer(): Promise<ArrayBuffer>; json?(): Promise<unknown> }>;

interface ManifestFile {
  name: string;
  bytes: number;
  sha256: string;
}
interface Manifest {
  apps: Array<{ slug: string; files: ManifestFile[] }>;
}

export interface FetchOptions {
  slug: string;
  source?: string;
  fetchImpl?: FetchLike;
}

const short = (hex: string): string => hex.slice(0, 12);

async function get(fetchImpl: FetchLike, url: string, label: string): Promise<Buffer> {
  let res;
  try {
    res = await fetchImpl(url, { redirect: 'error', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  } catch (error) {
    throw new IconVerificationError(label, `request failed: ${(error as Error).message}`);
  }
  if (res.status !== 200) {
    throw new IconVerificationError(label, `HTTP ${res.status} from ${url}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Download + verify the five installable icons of one mini-app.
 * Returns a map keyed by TARGET name (`favicon.svg`, `favicon.ico`, …).
 */
export async function fetchMiniAppIcons(opts: FetchOptions): Promise<Map<string, Buffer>> {
  const { slug } = opts;
  if (!SLUG_RE.test(slug)) throw new BadSlugError(slug);
  const source = (opts.source ?? DEFAULT_SOURCE).replace(/\/+$/, '');
  const fetchImpl = opts.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);

  const manifestBytes = await get(fetchImpl, `${source}/manifest.json`, 'manifest.json');
  let manifest: Manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8')) as Manifest;
    if (!Array.isArray(manifest.apps)) throw new Error('no "apps" array');
  } catch (error) {
    throw new IconVerificationError('manifest.json', `not a valid manifest: ${(error as Error).message}`);
  }

  const app = manifest.apps.find((a) => a?.slug === slug);
  if (!app) {
    throw new UnknownAppError(
      slug,
      manifest.apps.map((a) => a?.slug).filter((s): s is string => typeof s === 'string'),
    );
  }

  // Only the names derived from FAVICON_ASSETS are ever requested.
  const out = new Map<string, Buffer>();
  for (const { target, remote } of MINI_APP_SOURCES) {
    const entry = (app.files ?? []).find((f) => f?.name === remote);
    if (!entry) throw new IconVerificationError(remote, `missing from the manifest of "${slug}"`);

    const data = await get(fetchImpl, `${source}/${slug}/${remote}`, remote);
    if (data.length !== entry.bytes) {
      throw new IconVerificationError(
        remote,
        `size mismatch: expected ${entry.bytes} bytes, got ${data.length}`,
      );
    }
    const actual = createHash('sha256').update(data).digest('hex');
    if (actual.toLowerCase() !== String(entry.sha256).toLowerCase()) {
      throw new IconVerificationError(
        remote,
        `sha256 mismatch: expected ${short(String(entry.sha256))}…, got ${short(actual)}…`,
      );
    }
    out.set(target, data);
  }
  return out;
}
