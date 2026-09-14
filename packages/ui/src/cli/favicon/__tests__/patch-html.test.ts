import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { brandAssetPaths, resolveBrandDir } from '../assets.js';
import { BLOCK_END, BLOCK_START, FAVICON_ASSETS, patchHtml, renderBlock } from '../patch-html.js';

const page = (head: string) =>
  `<!doctype html>\n<html lang="pt-BR">\n  <head>\n${head}    <title>DFL</title>\n  </head>\n  <body><div id="root"></div></body>\n</html>\n`;

describe('patchHtml — the app <head> contract', () => {
  it('adds the managed block to a head with no icon at all', () => {
    const r = patchHtml(page(''));
    expect(r.changed).toBe(true);
    expect(r.removed).toEqual([]);
    expect(r.html).toContain('<link rel="icon" href="/favicon.ico" sizes="32x32" />');
    expect(r.html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />');
    expect(r.html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />');
  });

  it('replaces the S3-hosted favicon the fleet had hard-coded', () => {
    const s3 =
      '    <link rel="icon" type="image/png" href="https://devfellowship.s3.amazonaws.com/media/1754422713612-favicon-devfellowship.png" />\n';
    const r = patchHtml(page(s3));
    expect(r.changed).toBe(true);
    expect(r.removed).toHaveLength(1);
    expect(r.html).not.toContain('s3.amazonaws.com');
  });

  it('replaces every icon rel — shortcut icon, mask-icon, apple-touch-icon', () => {
    const head =
      '    <link rel="shortcut icon" href="/old.ico" />\n' +
      '    <link rel="mask-icon" href="/old.svg" color="#000" />\n' +
      "    <link rel='apple-touch-icon' href='/old.png'>\n" +
      '    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n';
    const r = patchHtml(page(head));
    expect(r.removed).toHaveLength(4);
    expect(r.html).not.toContain('/old.');
    expect(r.html).not.toContain('/vite.svg');
  });

  it('leaves non-icon links alone', () => {
    const head =
      '    <link rel="stylesheet" href="/app.css" />\n' +
      '    <link rel="preconnect" href="https://fonts.gstatic.com" />\n';
    const r = patchHtml(page(head));
    expect(r.removed).toEqual([]);
    expect(r.html).toContain('rel="stylesheet"');
    expect(r.html).toContain('rel="preconnect"');
  });

  it('is idempotent — a second run reports no change and does not duplicate', () => {
    const once = patchHtml(page('')).html;
    const twice = patchHtml(once);
    expect(twice.changed).toBe(false);
    expect(twice.html).toBe(once);
    expect(once.match(/dfl-favicon:start/g)).toHaveLength(1);
    expect(once.match(/rel="icon"/g)).toHaveLength(2);
  });

  it('rewrites a stale managed block in place instead of stacking a new one', () => {
    const stale = patchHtml(page(''), '/assets/').html;
    expect(stale).toContain('/assets/favicon.ico');
    const fresh = patchHtml(stale, '/');
    expect(fresh.changed).toBe(true);
    expect(fresh.html.match(/dfl-favicon:start/g)).toHaveLength(1);
    expect(fresh.html).not.toContain('/assets/favicon.ico');
  });

  it('normalises a --base without a trailing slash', () => {
    expect(renderBlock('/static')).toContain('href="/static/favicon.ico"');
  });

  it('refuses to guess when the file has no <head>', () => {
    const html = '<div id="root"></div>\n';
    const r = patchHtml(html);
    expect(r.changed).toBe(false);
    expect(r.html).toBe(html);
  });

  it('keeps the block markers paired', () => {
    const r = patchHtml(page(''));
    expect(r.html.indexOf(BLOCK_START)).toBeLessThan(r.html.indexOf(BLOCK_END));
  });
});

describe('brand assets shipped with the package', () => {
  it('resolves every declared asset from src/brand', () => {
    const paths = brandAssetPaths(resolveBrandDir());
    expect(paths).toHaveLength(FAVICON_ASSETS.length);
    for (const path of paths) expect(existsSync(path)).toBe(true);
  });

  it('draws the favicon with DS tokens — sand-900 plate, sand-50 wordmark, amber slash', () => {
    const svg = readFileSync(resolve(resolveBrandDir(), 'favicon.svg'), 'utf8');
    expect(svg).toContain('#141210'); // --p-sand-900
    expect(svg).toContain('#F6F1E7'); // --p-sand-50
    expect(svg).toContain('#E07A4A'); // --p-amber-500, the brand accent
    expect(svg).toMatch(/rx="10"/); // --p-radius-lg, the DS rounded corner
  });
});
