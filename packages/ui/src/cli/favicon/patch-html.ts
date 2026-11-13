/**
 * Pure HTML rewriting for `dfl-components favicon`.
 *
 * Kept free of `fs` so the whole "what does the app's <head> end up looking
 * like" contract is unit-testable on plain strings.
 */

export const BLOCK_START = '<!-- dfl-favicon:start — managed by @devfellowship/components -->';
export const BLOCK_END = '<!-- dfl-favicon:end -->';

/** Files copied into the app's public directory, in link order. */
export const FAVICON_ASSETS = [
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
] as const;

/**
 * Where each installed asset comes from in a brand-site mini-app icon set
 * (`<source>/<slug>/<name>`). Only names that differ are listed; every other
 * asset keeps its name. Derived from FAVICON_ASSETS so there is ONE list.
 */
const MINI_APP_RENAMES: Record<string, string> = { 'favicon.svg': 'icon.svg' };

/** Remote file name (in the mini-app set) for each installed asset. */
export const MINI_APP_SOURCES: ReadonlyArray<{ target: string; remote: string }> =
  FAVICON_ASSETS.map((target) => ({ target, remote: MINI_APP_RENAMES[target] ?? target }));

const INDENT = '    ';

/**
 * The canonical DFL icon block.
 *
 * `.ico` first and `.svg` second is deliberate: a browser that understands SVG
 * icons takes the LAST supported `rel="icon"`, and the ones that do not fall
 * back to the `.ico`. `icon-192/512.png` ship for web manifests but get no
 * `<link>` — a manifest names them, and an app without one does not need them
 * in `<head>`.
 */
export function renderBlock(base = '/'): string {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return [
    BLOCK_START,
    `<link rel="icon" href="${prefix}favicon.ico" sizes="32x32" />`,
    `<link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />`,
    `<link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png" />`,
    BLOCK_END,
  ].join(`\n${INDENT}`);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** A tag body that respects quoted attribute values ("..." / '...' may hold `>`). */
const TAG_BODY = `(?:[^>"']|"[^"]*"|'[^']*')*`;

/** Every `<link>` tag, with its surrounding blanks and one trailing newline. */
const LINK_TAG = new RegExp(`[^\\S\\n]*<link\\b${TAG_BODY}>[^\\S\\n]*\\n?`, 'gi');

/** `<meta>` tags, quote-aware. */
const META_TAG = new RegExp(`<meta\\b${TAG_BODY}>`, 'gi');

const ATTR = /([^\s=/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

/** Attributes of a tag, parsed quote-aware (names lower-cased). */
function attrsOf(tag: string): Map<string, string> {
  const body = tag.replace(/^<\w+/, '');
  const out = new Map<string, string>();
  for (const m of body.matchAll(ATTR)) {
    const name = m[1].toLowerCase();
    if (!out.has(name)) out.set(name, m[2] ?? m[3] ?? m[4] ?? '');
  }
  return out;
}

/** True when the tag's own `rel` attribute claims an icon slot. */
function isIconLink(tag: string): boolean {
  const rel = attrsOf(tag).get('rel');
  return rel !== undefined && /\bicon\b/i.test(rel);
}

/** Index just past the last charset/viewport `<meta>` inside `<head>`, or -1. */
function endOfHeadMeta(html: string, from: number): number {
  const close = /<\/head\s*>/i.exec(html.slice(from));
  const limit = close ? from + close.index : html.length;
  let end = -1;
  META_TAG.lastIndex = from;
  for (let m = META_TAG.exec(html); m && m.index < limit; m = META_TAG.exec(html)) {
    const attrs = attrsOf(m[0]);
    if (attrs.has('charset') || attrs.get('name')?.toLowerCase() === 'viewport') {
      end = m.index + m[0].length;
    }
  }
  return end;
}

/** A previously written managed block, newline included, so rewriting is exact. */
const MANAGED_BLOCK = new RegExp(
  `\\n?[^\\S\\n]*${escapeRe(BLOCK_START)}[\\s\\S]*?${escapeRe(BLOCK_END)}`,
  'g',
);

export interface PatchResult {
  html: string;
  /** False when the file already carried exactly this block. */
  changed: boolean;
  /** Icon `<link>`s dropped in favour of the managed block. */
  removed: string[];
}

/**
 * Replace every icon `<link>` in `<head>` with the managed block.
 *
 * Idempotent: running it on its own output returns `changed: false`. An app
 * whose `<head>` is missing entirely is left untouched (`changed: false`) —
 * guessing where to inject into a file with no head is worse than reporting it.
 */
export function patchHtml(html: string, base = '/'): PatchResult {
  const removed: string[] = [];

  let next = html.replace(MANAGED_BLOCK, '');
  next = next.replace(LINK_TAG, (match) => {
    if (!isIconLink(match)) return match;
    removed.push(match.trim());
    return '';
  });

  const headOpen = /<head\b[^>]*>/i.exec(next);
  if (!headOpen) return { html, changed: false, removed: [] };

  const headEnd = headOpen.index + headOpen[0].length;
  // After <meta charset>/viewport (charset must stay in the first 1024 bytes);
  // with neither, straight after <head>.
  const at = Math.max(headEnd, endOfHeadMeta(next, headEnd));
  next = `${next.slice(0, at)}\n${INDENT}${renderBlock(base)}${next.slice(at)}`;

  return { html: next, changed: next !== html, removed };
}
