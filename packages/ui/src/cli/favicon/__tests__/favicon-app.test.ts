// @vitest-environment node
import { createHash } from 'node:crypto';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Command } from 'commander';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { registerFavicon } from '../index.js';

const REMOTE_NAMES = ['icon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
const TARGET: Record<string, string> = { 'icon.svg': 'favicon.svg' };
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

const served = new Map(REMOTE_NAMES.map((n) => [n, Buffer.from(`served-${n}-${'x'.repeat(40)}`)]));
let corrupt: string | null = null; // remote name served with altered bytes
let server: Server;
let source: string;

function manifest() {
  return {
    source: 'test',
    canvas: 0,
    plan: 'p',
    apps: [
      {
        slug: 'demo',
        name: 'Demo',
        from_apps: [],
        files: [...served].map(([name, b]) => ({ name, bytes: b.length, sha256: sha(b) })),
      },
      { slug: 'beta', name: 'Beta', from_apps: [], files: [] },
    ],
  };
}

beforeAll(async () => {
  server = createServer((req, res) => {
    const parts = (req.url ?? '').split('/').filter(Boolean); // m/manifest.json | m/demo/<file>
    if (parts[1] === 'manifest.json') {
      res.end(JSON.stringify(manifest()));
      return;
    }
    const name = parts[2];
    const body = served.get(name);
    if (parts[1] !== 'demo' || !body) {
      res.statusCode = 404;
      res.end('nf');
      return;
    }
    res.end(corrupt === name ? Buffer.from(body.toString().replace('served', 'SERVED')) : body);
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  source = `http://127.0.0.1:${(server.address() as AddressInfo).port}/m`;
});
afterAll(() => new Promise<void>((r) => server.close(() => r())));

class Exit extends Error {
  constructor(readonly code: number) {
    super(`exit ${code}`);
  }
}

const HTML = '<!doctype html>\n<html>\n  <head>\n    <title>t</title>\n  </head>\n  <body></body>\n</html>\n';
let dir: string;

beforeEach(() => {
  corrupt = null;
  dir = mkdtempSync(join(tmpdir(), 'fav-app-'));
  writeFileSync(join(dir, 'index.html'), HTML);
  vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new Exit(code ?? 0);
  }) as never);
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation((...a) => { if (process.env.DBG) process.stderr.write(a.join(' ') + '\n'); });
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(dir, { recursive: true, force: true });
});

async function run(...args: string[]): Promise<number> {
  const program = new Command();
  program.exitOverride();
  registerFavicon(program);
  try {
    await program.parseAsync(['node', 'cli', 'favicon', dir, '--source', source, ...args]);
  } catch (e) {
    if (e instanceof Exit) return e.code;
    throw e;
  }
  throw new Error('process.exit was not called');
}

describe('favicon --app (real command, local http server)', () => {
  it('(a) installs the 5 files byte-equal to the served bytes and patches index.html', async () => {
    expect(await run('--app', 'demo')).toBe(0);
    for (const n of REMOTE_NAMES) {
      expect(readFileSync(join(dir, 'public', TARGET[n] ?? n)).equals(served.get(n)!)).toBe(true);
    }
    expect(readFileSync(join(dir, 'index.html'), 'utf8')).toContain('dfl-favicon:start');
  });

  it('(b) is idempotent', async () => {
    await run('--app', 'demo');
    const html = readFileSync(join(dir, 'index.html'), 'utf8');
    expect(await run('--app', 'demo')).toBe(0);
    expect(readFileSync(join(dir, 'index.html'), 'utf8')).toBe(html);
    const logs = (console.log as unknown as { mock: { calls: unknown[][] } }).mock.calls.flat().join('\n');
    expect(logs).toContain('already current');
  });

  it.each(['icon.svg', 'icon-512.png'])(
    '(c) REFUSES a sha256 mismatch on %s: exit 1, nothing written',
    async (bad) => {
      corrupt = bad; // icon-512.png is the LAST file fetched; icon.svg the first
      expect(await run('--app', 'demo')).toBe(1);
      expect(existsSync(join(dir, 'public'))).toBe(false);
      expect(readFileSync(join(dir, 'index.html'), 'utf8')).toBe(HTML);
      expect(readdirSync(dir)).toEqual(['index.html']);
    },
  );

  it('(c2) a mismatch leaves an existing public dir untouched', async () => {
    mkdirSync(join(dir, 'public'));
    writeFileSync(join(dir, 'public', 'favicon.svg'), 'old');
    corrupt = 'icon-512.png';
    expect(await run('--app', 'demo')).toBe(1);
    expect(readdirSync(join(dir, 'public'))).toEqual(['favicon.svg']);
    expect(readFileSync(join(dir, 'public', 'favicon.svg'), 'utf8')).toBe('old');
  });

  it('(d) unknown slug exits 2 and writes nothing', async () => {
    expect(await run('--app', 'nope')).toBe(2);
    const err = (console.error as unknown as { mock: { calls: unknown[][] } }).mock.calls.flat().join('\n');
    expect(err).toContain('demo, beta');
    expect(readdirSync(dir)).toEqual(['index.html']);
  });

  it('(e) --check: 1 before install, 0 after, writes nothing', async () => {
    expect(await run('--app', 'demo', '--check')).toBe(1);
    expect(readdirSync(dir)).toEqual(['index.html']);
    expect(await run('--app', 'demo')).toBe(0);
    expect(await run('--app', 'demo', '--check')).toBe(0);
  });
});
