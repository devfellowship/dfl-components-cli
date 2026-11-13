#!/usr/bin/env node
/**
 * Assert the published `ux-paths` CLI bundle performs NO network I/O.
 *
 * WHY THIS EXISTS
 * ---------------
 * `ux-paths validate` used to fetch its JSON Schema from
 * `raw.githubusercontent.com/devfellowship/dfl-ux-paths/main/schema/v1.json` at
 * validate-time. `dfl-ux-paths` went PRIVATE on 2026-08-04, so that URL began
 * answering 404 — and `validate` hard-failed for every user of the published
 * package, with a message that read like a broken URL rather than a deliberate
 * visibility change. The schema is vendored now (#105, shipped in 3.0.1).
 *
 * WHY A *BUNDLE* CHECK AND NOT JUST THE UNIT TEST
 * -----------------------------------------------
 * `src/cli/ux-paths/lib/__tests__/load-schema.test.ts` spies on `globalThis.fetch`
 * and asserts it is never called. That is necessary but not sufficient:
 *
 *   • it only covers the one module it imports, not the whole CLI surface;
 *   • it only catches `fetch`. A future `https.get`, `node-fetch`, `undici` or
 *     `axios` would sail straight past it;
 *   • it runs on SOURCE. What users actually execute is `dist/cli.js`, produced
 *     by a separate tsup config. A build that inlined something unexpected would
 *     not show up in a source-level test at all.
 *
 * This asserts on the artifact people run. `dfl-flows-engine` has the same
 * defence — a test that `raw.githubusercontent.com` does not appear in its
 * bundle — and it is the reason that repo never acquired this bug.
 *
 * THE ONE ALLOWED NETWORK MODULE
 * -------------------------------
 * `dfl-components favicon --app <slug>` downloads a mini-app icon set from
 * brand.devfellowship.com (bytes + sha256 verified before anything is written).
 * That code lives ONLY in `dist/favicon-remote.js` (own tsup entry), which
 * `dist/cli.js` loads lazily when `--app` is given. So:
 *   • dist/cli.js            — checked exactly as before: NO network primitive;
 *   • dist/favicon-remote.js — must exist (hard failure, never a skip); may
 *     contain `fetch(`, but none of the other primitives; and must name
 *     brand.devfellowship.com as its default source.
 *
 * FAILURE MODE
 * ------------
 * Hard failure, always. A missing `dist/cli.js` is an ERROR telling you to
 * build, never a skip: a guard that quietly passes when it cannot check
 * anything is the exact silent-degradation shape this whole exercise is about.
 *
 * Usage:  npm run build:cli && node scripts/check-cli-bundle-offline.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(here, '..', 'dist', 'cli.js');
const REMOTE = resolve(here, '..', 'dist', 'favicon-remote.js');

for (const file of [BUNDLE, REMOTE]) {
  if (!existsSync(file)) {
    console.error(
      `ERROR: ${file} does not exist, so the bundle could not be checked.\n` +
        `This is a failure, not a skip — run \`npm run build:cli\` first.`,
    );
    process.exit(2);
  }
}

const src = readFileSync(BUNDLE, 'utf8');

/**
 * Each entry is a network primitive that must not appear in the bundle. These
 * are substring matches on purpose: this is a bundled, minifier-free artifact,
 * and a cheap check that cannot be argued with beats a clever one that can.
 */
const FORBIDDEN = [
  { pattern: 'fetch(', what: 'a fetch() call' },
  { pattern: 'XMLHttpRequest', what: 'XMLHttpRequest' },
  { pattern: 'node:http', what: 'the node http/https client' },
  { pattern: '"https"', what: 'the node https module' },
  { pattern: "'https'", what: 'the node https module' },
  { pattern: 'node-fetch', what: 'node-fetch' },
  { pattern: 'undici', what: 'undici' },
  { pattern: 'axios', what: 'axios' },
];

const violations = [];

for (const { pattern, what } of FORBIDDEN) {
  if (src.includes(pattern)) {
    const line = src.split('\n').findIndex((l) => l.includes(pattern)) + 1;
    violations.push(`${what} — found \`${pattern}\` at dist/cli.js:${line}`);
  }
}

// The lazily loaded network module: `fetch(` is its whole job, nothing else
// network-shaped is allowed (no http/https client, no third-party HTTP lib).
const remoteSrc = readFileSync(REMOTE, 'utf8');
for (const { pattern, what } of FORBIDDEN.filter((f) => f.pattern !== 'fetch(')) {
  if (remoteSrc.includes(pattern)) {
    const line = remoteSrc.split('\n').findIndex((l) => l.includes(pattern)) + 1;
    violations.push(`${what} — found \`${pattern}\` at dist/favicon-remote.js:${line}`);
  }
}
if (!remoteSrc.includes('brand.devfellowship.com')) {
  violations.push(
    'dist/favicon-remote.js does not reference brand.devfellowship.com as the ' +
      'default icon source.',
  );
}

// The schema must actually be inlined. A bundle with no network I/O *and* no
// schema would be a `validate` that silently accepts everything — strictly
// worse than the 404 it replaced, because nothing would complain.
//
// The assertion is unchanged since the schema was vendored; only its source
// moved. It now arrives from `@devfellowship/ux-paths-spec`, which
// tsup.cli.config.ts marks `noExternal` precisely so this check keeps biting.
if (!src.includes('DFL UX Paths v1')) {
  violations.push(
    'the v1 schema is NOT inlined in the bundle — `validate` would have ' +
      'nothing to validate against. Check the `@devfellowship/ux-paths-spec` ' +
      'import in src/cli/ux-paths/lib/load-schema.ts, and that the package is ' +
      'still listed in `noExternal` in tsup.cli.config.ts.',
  );
}

// One occurrence of the raw URL is expected and correct: the schema's `$id`,
// which NAMES the schema. More than one suggests something is dereferencing it.
const rawRefs = src.match(/raw\.githubusercontent\.com/g)?.length ?? 0;
if (rawRefs > 1) {
  violations.push(
    `raw.githubusercontent.com appears ${rawRefs} times; only the schema's ` +
      `\`$id\` (identity, never dereferenced) is expected. dfl-ux-paths is ` +
      `private — anything fetching that URL gets a 404.`,
  );
}

if (violations.length > 0) {
  console.error('FAIL: the ux-paths CLI bundle is not offline-safe.\n');
  for (const v of violations) console.error(`  • ${v}`);
  console.error(
    '\nThe CLI must validate with zero network I/O. dfl-ux-paths is private, ' +
      'so any runtime fetch of its schema 404s for every user of the published ' +
      'package. Vendor what you need into src/cli/ux-paths/lib/ instead.',
  );
  process.exit(1);
}

console.log(
  `OK: dist/cli.js is offline-safe — no network primitives, vendored schema ` +
    `inlined, ${rawRefs} identity-only raw.githubusercontent reference. ` +
    `dist/favicon-remote.js is the only network module (brand.devfellowship.com).`,
);
