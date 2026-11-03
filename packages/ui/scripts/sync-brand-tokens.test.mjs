import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkLocal, checkOnline, writeMirror, MIRROR_REL, LOCK_REL, sha256 } from './sync-brand-tokens.mjs';

const CSS = ':root {\n  --s-surface-page: #fff;\n  --c-brand: #123456;\n}\n';
const resp = (body, { status = 200, type = 'text/css; charset=utf-8' } = {}) =>
  async () => new Response(body, { status, headers: { 'content-type': type } });

let dir;
beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'brand-mirror-'));
  mkdirSync(join(dir, 'src/styles'), { recursive: true });
  await writeMirror({ dir, version: 2, fetchFn: resp(CSS) });
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('brand token mirror', () => {
  it('passes --check on freshly written files', () => {
    expect(checkLocal(dir)).toEqual([]);
  });

  it('passes --check on the committed repo files', () => {
    expect(checkLocal(join(__dirname, '..'))).toEqual([]);
  });

  it('fails when one byte of the body is flipped', () => {
    const p = join(dir, MIRROR_REL);
    writeFileSync(p, readFileSync(p, 'utf8').replace('#123456', '#123457'));
    const errs = checkLocal(dir);
    expect(errs.join('\n')).toMatch(/sha256 of src\/styles\/tokens\.v2\.css differs/);
  });

  it('fails when the header is removed', () => {
    const p = join(dir, MIRROR_REL);
    writeFileSync(p, CSS);
    expect(checkLocal(dir).join('\n')).toMatch(/not the MIRROR header/);
  });

  it('fails when the lock holds another upstream sha', () => {
    const p = join(dir, LOCK_REL);
    const lock = JSON.parse(readFileSync(p, 'utf8'));
    lock.upstream.sha256 = sha256('other');
    writeFileSync(p, JSON.stringify(lock));
    expect(checkLocal(dir).join('\n')).toMatch(/body differs from upstream\.sha256/);
  });

  it('fails when the file is missing', () => {
    rmSync(join(dir, MIRROR_REL));
    expect(checkLocal(dir).join('\n')).toMatch(/missing/);
  });

  it('refuses an HTML 200 and leaves the files as they were', async () => {
    const before = readFileSync(join(dir, MIRROR_REL));
    await expect(writeMirror({ dir, fetchFn: resp('<html>--s-surface-page</html>', { type: 'text/html' }) })).rejects.toThrow(/not text\/css/);
    expect(readFileSync(join(dir, MIRROR_REL)).equals(before)).toBe(true);
  });

  it('refuses non-200, empty and marker-less CSS', async () => {
    await expect(writeMirror({ dir, fetchFn: resp(CSS, { status: 404 }) })).rejects.toThrow(/HTTP 404/);
    await expect(writeMirror({ dir, fetchFn: resp('') })).rejects.toThrow(/empty/);
    await expect(writeMirror({ dir, fetchFn: resp(':root{--x:1}') })).rejects.toThrow(/lacks/);
  });

  it('online: ok, drift and unverified', async () => {
    expect((await checkOnline({ dir, fetchFn: resp(CSS), pauseMs: 0 })).status).toBe('ok');
    expect((await checkOnline({ dir, fetchFn: resp(CSS + '/* x */'), pauseMs: 0 })).status).toBe('drift');
    expect((await checkOnline({ dir, fetchFn: resp('', { status: 503 }), pauseMs: 0 })).status).toBe('unverified');
  });
});
