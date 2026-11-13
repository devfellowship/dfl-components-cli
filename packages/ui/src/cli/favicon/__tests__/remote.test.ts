// @vitest-environment node
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import {
  BadSlugError,
  IconVerificationError,
  UnknownAppError,
  fetchMiniAppIcons,
  type FetchLike,
} from '../remote.js';

const REMOTE_NAMES = ['icon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

function fixture() {
  const files = new Map(REMOTE_NAMES.map((n) => [n, Buffer.from(`bytes-of-${n}`)]));
  const manifest = {
    apps: [
      {
        slug: 'demo',
        files: [
          ...[...files].map(([name, b]) => ({ name, bytes: b.length, sha256: sha(b) })),
          { name: 'glyph.svg', bytes: 1, sha256: 'x' },
        ],
      },
      { slug: 'other', files: [] },
    ],
  };
  return { files, manifest };
}

function makeFetch(
  manifest: unknown,
  files: Map<string, Buffer>,
  override: Record<string, { status?: number; body?: Buffer }> = {},
) {
  const requested: string[] = [];
  const impl: FetchLike = async (url) => {
    requested.push(url);
    const name = url.split('/').pop()!;
    const o = override[name];
    const status = o?.status ?? 200;
    const body =
      o?.body ?? (name === 'manifest.json' ? Buffer.from(JSON.stringify(manifest)) : files.get(name) ?? Buffer.alloc(0));
    return {
      status,
      ok: status === 200,
      arrayBuffer: async () => body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer,
    };
  };
  return { impl, requested };
}

describe('fetchMiniAppIcons', () => {
  it('returns the 5 renamed entries and requests only the derived names', async () => {
    const { files, manifest } = fixture();
    const { impl, requested } = makeFetch(manifest, files);
    const out = await fetchMiniAppIcons({ slug: 'demo', source: 'https://x.test/m/', fetchImpl: impl });
    expect([...out.keys()].sort()).toEqual(
      ['apple-touch-icon.png', 'favicon.ico', 'favicon.svg', 'icon-192.png', 'icon-512.png'],
    );
    expect(out.get('favicon.svg')!.equals(files.get('icon.svg')!)).toBe(true);
    expect(requested).not.toContain('https://x.test/m/demo/glyph.svg');
    expect(requested).toHaveLength(6);
    expect(requested).toContain('https://x.test/m/demo/icon.svg');
  });

  it('throws naming the file on a sha256 mismatch of ONE file', async () => {
    const { files, manifest } = fixture();
    const { impl } = makeFetch(manifest, files, {
      'icon-192.png': { body: Buffer.from('bytes-of-icon-192.pnX') },
    });
    const err = await fetchMiniAppIcons({ slug: 'demo', source: 'https://x.test', fetchImpl: impl }).catch((e) => e);
    expect(err).toBeInstanceOf(IconVerificationError);
    expect(err.message).toContain('icon-192.png');
    expect(err.message).toContain('sha256 mismatch');
  });

  it('throws on a bytes mismatch', async () => {
    const { files, manifest } = fixture();
    const { impl } = makeFetch(manifest, files, { 'favicon.ico': { body: Buffer.from('short') } });
    const err = await fetchMiniAppIcons({ slug: 'demo', source: 'https://x.test', fetchImpl: impl }).catch((e) => e);
    expect(err).toBeInstanceOf(IconVerificationError);
    expect(err.message).toMatch(/favicon\.ico.*size mismatch/);
  });

  it('throws UnknownAppError listing the slugs', async () => {
    const { files, manifest } = fixture();
    const { impl } = makeFetch(manifest, files);
    const err = await fetchMiniAppIcons({ slug: 'nope', source: 'https://x.test', fetchImpl: impl }).catch((e) => e);
    expect(err).toBeInstanceOf(UnknownAppError);
    expect(err.available).toEqual(['demo', 'other']);
    expect(err.message).toContain('demo, other');
  });

  it('throws when a needed file is missing from the manifest', async () => {
    const { files, manifest } = fixture();
    manifest.apps[0].files = manifest.apps[0].files.filter((f) => f.name !== 'icon-512.png');
    const { impl } = makeFetch(manifest, files);
    const err = await fetchMiniAppIcons({ slug: 'demo', source: 'https://x.test', fetchImpl: impl }).catch((e) => e);
    expect(err).toBeInstanceOf(IconVerificationError);
    expect(err.message).toMatch(/icon-512\.png.*missing from the manifest/);
  });

  it('throws on a non-200 response', async () => {
    const { files, manifest } = fixture();
    const { impl } = makeFetch(manifest, files, { 'apple-touch-icon.png': { status: 404 } });
    const err = await fetchMiniAppIcons({ slug: 'demo', source: 'https://x.test', fetchImpl: impl }).catch((e) => e);
    expect(err).toBeInstanceOf(IconVerificationError);
    expect(err.message).toMatch(/apple-touch-icon\.png.*HTTP 404/);
  });

  it.each(['../etc', 'a/b', 'Demo', '', 'a b'])('rejects slug %j without any request', async (slug) => {
    const { files, manifest } = fixture();
    const { impl, requested } = makeFetch(manifest, files);
    await expect(fetchMiniAppIcons({ slug, source: 'https://x.test', fetchImpl: impl })).rejects.toBeInstanceOf(
      BadSlugError,
    );
    expect(requested).toHaveLength(0);
  });
});
