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

/** Any `<link>` that claims an icon slot — what the managed block replaces. */
const ICON_LINK =
  /[^\S\n]*<link\b[^>]*\brel=["']?[^"'>]*\b(?:icon|apple-touch-icon|mask-icon|shortcut icon)\b[^"'>]*["']?[^>]*>[^\S\n]*\n?/gi;

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
  next = next.replace(ICON_LINK, (match) => {
    removed.push(match.trim());
    return '';
  });

  const headOpen = /<head\b[^>]*>/i.exec(next);
  if (!headOpen) return { html, changed: false, removed: [] };

  const at = headOpen.index + headOpen[0].length;
  next = `${next.slice(0, at)}\n${INDENT}${renderBlock(base)}${next.slice(at)}`;

  return { html: next, changed: next !== html, removed };
}
