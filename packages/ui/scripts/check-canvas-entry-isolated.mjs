#!/usr/bin/env node
/**
 * Guard: the canvas entry stays isolated, and its peers stay optional.
 *
 * `@xyflow/react` and `@dagrejs/dagre` are declared as OPTIONAL peer
 * dependencies. That promise holds only while the canvas lives behind its own
 * entry point. The moment anything re-exports `FlowCanvas` from `src/index.ts`,
 * every consumer of `@devfellowship/components` — including the many that draw
 * no graph at all — starts resolving two packages they never installed. That
 * failure does not surface here; it surfaces in a consumer's build, as a module
 * that cannot be found.
 *
 * So this asserts on the ARTIFACT, not on the source: the bundles users
 * actually execute.
 *
 *   1. dist/index.{js,cjs} must not reference @xyflow/react or @dagrejs/dagre.
 *   2. dist/canvas.{js,cjs} must IMPORT both rather than inline them — an
 *      inlined copy would ship a second React Flow into every consumer bundle
 *      and break React Flow's internal context against the consumer's own copy.
 *   3. package.json must keep both in peerDependenciesMeta as optional.
 *   4. The ./canvas and ./canvas.css export entries must exist and be built.
 *
 * Run AFTER `npm run build`.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(pkgDir, "dist");
const PEERS = ["@xyflow/react", "@dagrejs/dagre"];

let failed = false;
const fail = (msg) => {
  console.error(`❌ ${msg}`);
  failed = true;
};
const ok = (msg) => console.log(`✅ ${msg}`);

function read(rel) {
  const p = join(dist, rel);
  if (!existsSync(p)) {
    fail(`${rel} is missing — run \`npm run build\` before this guard.`);
    return null;
  }
  return readFileSync(p, "utf8");
}

// ── 1. The main bundle must be free of the canvas peers ──────────────────────
for (const entry of ["index.js", "index.cjs"]) {
  const src = read(entry);
  if (src === null) continue;
  const hit = PEERS.find((p) => src.includes(p));
  if (hit) {
    fail(
      `dist/${entry} references ${hit}. Something re-exported the canvas from the main entry. ` +
        `Import it from "@devfellowship/components/canvas" instead — the peers are OPTIONAL and ` +
        `most consumers never install them.`,
    );
  } else {
    ok(`dist/${entry} is free of ${PEERS.join(" and ")}`);
  }
}

// ── 2. The canvas bundle must import its peers, never inline them ────────────
for (const entry of ["canvas.js", "canvas.cjs"]) {
  const src = read(entry);
  if (src === null) continue;
  for (const peer of PEERS) {
    // ESM: `from "pkg"`. CJS: `require("pkg")`.
    const imported = new RegExp(`(from\\s*["']${peer}["']|require\\(["']${peer}["']\\))`).test(src);
    if (!imported) fail(`dist/${entry} does not import ${peer} — it may have been bundled in. Keep it in tsup \`external\`.`);
  }
  // A bundled React Flow would be far larger than a thin wrapper.
  const bytes = Buffer.byteLength(src);
  if (bytes > 200_000) {
    fail(`dist/${entry} is ${bytes} bytes — far too large for a wrapper. A peer was probably inlined.`);
  } else {
    ok(`dist/${entry} imports its peers and stays thin (${bytes} bytes)`);
  }
}

// ── 3. package.json keeps the peers optional and the exports wired ───────────
const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
for (const peer of PEERS) {
  if (!pkg.peerDependencies?.[peer]) fail(`package.json peerDependencies is missing ${peer}`);
  if (pkg.peerDependenciesMeta?.[peer]?.optional !== true) {
    fail(`package.json must mark ${peer} optional in peerDependenciesMeta — otherwise every consumer must install it`);
  }
  if (pkg.dependencies?.[peer]) {
    fail(`${peer} is a hard dependency. It must be an optional peer, or every consumer installs React Flow.`);
  }
}
if (!failed) ok(`${PEERS.join(" and ")} are optional peers, not dependencies`);

// ── 4. The export map points at files that exist ─────────────────────────────
for (const [name, target] of [
  ["./canvas", pkg.exports?.["./canvas"]?.import],
  ["./canvas.css", pkg.exports?.["./canvas.css"]],
]) {
  if (!target) {
    fail(`package.json exports is missing "${name}"`);
    continue;
  }
  const p = join(pkgDir, target);
  if (!existsSync(p)) fail(`exports "${name}" points at ${target}, which was not built`);
  else ok(`exports "${name}" → ${target}`);
}

if (failed) {
  console.error("\n❌ canvas entry isolation guard FAILED");
  process.exit(1);
}
console.log("\n✅ canvas entry is isolated and its peers stay optional");
