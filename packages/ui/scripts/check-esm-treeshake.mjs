#!/usr/bin/env node
/**
 * Guard: a consumer that imports ONE component from the root entry does not
 * get the whole design system.
 *
 * Until 3.17.0, `dist/index.js` was a single file with every component in it.
 * Each component is a top-level `React.forwardRef(...)` call plus a
 * `X.displayName = "X"` assignment, and a bundler cannot prove those statements
 * free of side effects. So an app that imported `Button` shipped all of them,
 * and with them vaul, react-day-picker, cmdk, embla-carousel,
 * react-resizable-panels and date-fns: 99 KB gzip of dead code on the /login
 * page of itera-player (plan 20261003-itera-player-mobile, W4-CUT-A).
 * `tsup.config.ts` now emits one chunk per source module (see TREE-SHAKING
 * there). This guard asserts the RESULT on the built artifact, the way a
 * consumer bundler sees it:
 *
 *   1. bundle `import { Button, cn } from "./dist/index.js"` with esbuild
 *      (minify, react external, the package's own `sideEffects` applies);
 *   2. none of the heavy dependencies of OTHER components is in that bundle;
 *   3. the bundle stays under MAX_GZIP bytes gzip;
 *   4. the build device `dist/_m/` is gone and no dist file imports it.
 *
 * Run AFTER `npm run build`. Exit 0 = pass, 1 = fail, 2 = could not run.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(pkgDir, "dist");
// Packages that only OTHER components import. `Button` needs none of them.
const HEAVY = [
  "vaul",
  "react-day-picker",
  "date-fns",
  "cmdk",
  "embla-carousel",
  "recharts",
  "react-resizable-panels",
  "input-otp",
  "react-hook-form",
  "zod",
  "@radix-ui/react-dialog",
  "@radix-ui/react-select",
  "@radix-ui/react-dropdown-menu",
];
// Measured 2026-11-21 for Button + cn: see the PR. The single-file build gave
// about 100 KB gzip for the same import. The cap leaves room for Button itself
// to grow, not for a second component to sneak in.
const MAX_GZIP = 20 * 1024;

let failed = false;
const fail = (m) => {
  console.error(`❌ ${m}`);
  failed = true;
};
const ok = (m) => console.log(`✅ ${m}`);

if (!existsSync(join(dist, "index.js"))) {
  console.error("dist/index.js is missing — run `npm run build` before this guard.");
  process.exit(2);
}

let esbuild;
try {
  esbuild = await import("esbuild");
} catch (e) {
  console.error(`esbuild is not resolvable from packages/ui (${e.message}).`);
  process.exit(2);
}

// ── 4. the build device is gone ─────────────────────────────────────────────
if (existsSync(join(dist, "_m"))) fail("dist/_m/ still exists; the tsup onSuccess step did not run.");
const importers = readdirSync(dist).filter(
  (f) => /\.c?js$/.test(f) && readFileSync(join(dist, f), "utf8").includes("/_m/"),
);
if (importers.length) fail(`dist files import _m/ entries: ${importers.join(", ")}`);
else ok("no dist file imports the _m/ build entries");

// ── 1. bundle one component the way a consumer does ─────────────────────────
const result = await esbuild.build({
  stdin: {
    contents: 'import { Button, cn } from "./dist/index.js";\nexport const used = [Button, cn];\n',
    resolveDir: pkgDir,
    loader: "js",
  },
  bundle: true,
  format: "esm",
  minify: true,
  write: false,
  metafile: true,
  platform: "browser",
  logLevel: "silent",
  external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"],
});
const code = result.outputFiles[0].contents;
const gz = gzipSync(code).length;
// Only the inputs that put bytes in the output. `metafile.inputs` also lists every
// file esbuild PARSED, including the ones tree-shaking then dropped.
const [output] = Object.values(result.metafile.outputs);
const inputs = Object.entries(output.inputs)
  .filter(([, v]) => v.bytesInOutput > 0)
  .map(([k]) => k);

// ── 2. no heavy dependency of another component ─────────────────────────────
const hits = HEAVY.filter((p) => inputs.some((i) => i.includes(`node_modules/${p}/`)));
if (hits.length) {
  fail(
    `a bundle of { Button, cn } contains ${hits.join(", ")}. The root entry is not tree-shakeable ` +
      `again: check that tsup still emits one chunk per module (TREE-SHAKING in tsup.config.ts) and ` +
      `that package.json "sideEffects" still lists only CSS.`,
  );
} else ok(`a bundle of { Button, cn } has none of: ${HEAVY.join(", ")}`);

// ── 3. size cap ─────────────────────────────────────────────────────────────
const dsInputs = inputs.filter((i) => i.startsWith("dist/")).length;
console.log(`   bundle: ${code.length} B raw, ${gz} B gzip, ${inputs.length} input files (${dsInputs} from dist/)`);
if (gz > MAX_GZIP) fail(`the { Button, cn } bundle is ${gz} B gzip, above the cap of ${MAX_GZIP} B.`);
else ok(`the { Button, cn } bundle is ${gz} B gzip (cap ${MAX_GZIP} B)`);

process.exit(failed ? 1 : 0);
