#!/usr/bin/env node
/**
 * Pack the CAPTURE build of `@devfellowship/components` — the stamped artifact
 * that UX Paths needs, and that npm must never see.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚨 THE DISTRIBUTION DECISION, AND WHY IT IS THIS ONE
 * ═══════════════════════════════════════════════════════════════════════════
 * A design system that ships COMPILED carries its stamp inside its own
 * published artifact. So "publish a capture build" is a real packaging problem,
 * not a build flag: whatever channel carries the stamped tarball must be
 * unreachable by an ordinary `npm install`, forever, by construction.
 *
 * **This tarball goes to a GitHub Release ASSET. It is never published to any
 * registry, under any version, under any dist-tag.**
 *
 * That is the only option where "cannot happen by accident" is a property of
 * the system rather than of everybody's discipline:
 *
 *  - `npm install @devfellowship/components` reads the registry, and the
 *    registry only ever holds the clean build. No semver range, no dist-tag, no
 *    `npm update`, no lockfile refresh and no Renovate PR can resolve to
 *    something that is not there.
 *  - Getting the stamped build takes downloading one named file and installing
 *    it by path. No dependency resolver does that. A human or a capture job
 *    does it on purpose, and it shows up in the diff of whatever did it.
 *
 * Two alternatives were considered and rejected:
 *
 *  - **A `capture` export condition inside the published tarball.** This puts
 *    the stamped code INSIDE the release artifact — the exact thing that must
 *    never happen. Every consumer downloads the file layout whether or not any
 *    condition selects it.
 *  - **A `capture` dist-tag or a `-capture` prerelease on npm.** Reachable by
 *    one explicit install — and then it PERSISTS in a lockfile, where the next
 *    person to run `npm ci` gets a stamped design system in a production
 *    deploy and nothing says so. It also puts a stamped artifact permanently on
 *    a public registry, and npm publishes are irreversible.
 *
 * The consumer proves it got what it asked for over the ARTIFACT, never over
 * the filename:
 *
 *     npx ux-paths-assert-no-stamp node_modules/@devfellowship/components/dist \
 *       --expect-present
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THIS SCRIPT REFUSES TO DO
 * ═══════════════════════════════════════════════════════════════════════════
 * It refuses to pack a `dist/` that is not stamped. A capture tarball that is
 * silently a release tarball is worse than a missing one: the consumer's build
 * succeeds, the capture succeeds, and the region maps come back exactly as
 * coarse as they were, with nothing red anywhere.
 *
 * Usage:
 *   UX_PATHS_SOURCE_STAMP=1 npm run build
 *   node scripts/pack-capture-build.mjs [--out-dir DIR]
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, copyFileSync, rmSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runAssertNoStamp } from "@devfellowship/ux-paths-capture";

const PKG_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const outDirArg = argv.indexOf("--out-dir");
const OUT_DIR = path.resolve(outDirArg >= 0 && argv[outDirArg + 1] ? argv[outDirArg + 1] : PKG_DIR);

const die = (message) => {
  process.stderr.write(`::error::${message}\n`);
  process.exit(1);
};

const distDir = path.join(PKG_DIR, "dist");
if (!existsSync(distDir)) {
  die("no dist/ — run `UX_PATHS_SOURCE_STAMP=1 npm run build` before packing a capture build.");
}

// The gate that makes this tarball what it claims to be, asserted over the
// BYTES rather than over the environment that produced them.
if (runAssertNoStamp([distDir, "--expect-present"]) !== 0) {
  die(
    "dist/ carries no data-source stamps, so this is a RELEASE build. " +
      "Refusing to pack it under a capture name — a capture tarball that is " +
      "silently a release tarball fails green, three steps downstream.",
  );
}

const pkgPath = path.join(PKG_DIR, "package.json");
const original = readFileSync(pkgPath, "utf8");
const pkg = JSON.parse(original);
const { name, version } = pkg;

// A marker inside the tarball, so `cat node_modules/@devfellowship/components/
// package.json` answers "which build is this?" without unpacking dist/. The
// NAME and the VERSION are deliberately left alone: a consumer installs this
// over the top of the real dependency, and every import must still resolve.
pkg.uxPathsCapture = {
  stamped: true,
  builtAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA ?? null,
  warning:
    "CAPTURE BUILD. Every host element carries data-source=\"<file>:<line>\". " +
    "Never deploy this to end users and never publish it to a registry.",
};

let tarball;
try {
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  // `--json` so the produced filename is read, not guessed. `npm pack` honours
  // `files: ["dist"]`, so the tarball is the published shape plus the marker.
  const out = execFileSync("npm", ["pack", "--json", "--pack-destination", PKG_DIR], {
    cwd: PKG_DIR,
    encoding: "utf8",
  });
  tarball = path.join(PKG_DIR, JSON.parse(out)[0].filename);
} finally {
  writeFileSync(pkgPath, original);
}

mkdirSync(OUT_DIR, { recursive: true });
const slug = name.replace(/^@/, "").replace(/\//g, "-");
const finalName = `${slug}-${version}-capture.tgz`;
const finalPath = path.join(OUT_DIR, finalName);
// copy+unlink rather than rename: --out-dir routinely lands on a different
// filesystem than the checkout, and rename() answers EXDEV across devices.
copyFileSync(tarball, finalPath);
rmSync(tarball);

process.stdout.write(
  `capture build packed: ${finalPath}\n` +
    `  package : ${name}@${version}\n` +
    `  channel : GitHub Release asset only. NEVER npm.\n` +
    `  verify  : npx ux-paths-assert-no-stamp <installed>/dist --expect-present\n`,
);

if (process.env.GITHUB_OUTPUT) {
  writeFileSync(
    process.env.GITHUB_OUTPUT,
    `tarball=${finalPath}\ntarball_name=${finalName}\n`,
    { flag: "a" },
  );
}
