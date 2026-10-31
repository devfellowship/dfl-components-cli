#!/usr/bin/env node
/**
 * Guard: a REAL consumer install gets ONE copy of sonner, and a toast fired from
 * either import path shows up.
 *
 * A unit test inside this package cannot prove this. In the package's own
 * workspace `sonner` resolves to a single copy by construction. The bug lives
 * in the CONSUMER's node_modules: when `sonner` is a regular dependency of this
 * package and the app pins another major (1.7.4 vs ^2.0.7), npm nests a second
 * copy under `@devfellowship/components/node_modules/sonner`. `<SonnerToaster>`
 * then renders with the nested copy, `toast` imported from the app's own
 * `sonner` writes to the other copy's store, and nothing shows.
 *
 * What this script does (needs registry access; CI has it, ALIEN01 deck has it):
 *   1. build a throw-away consumer in a temp dir: react 18, `sonner@1.7.4` as the
 *      APP's dependency, and this package from a tarball (or a registry spec);
 *   2. assert there is NO nested sonner under the package;
 *   3. run a vitest/jsdom test IN the consumer, against the installed files:
 *        a. `toast` from the app's `sonner` shows in `<SonnerToaster>`;
 *        b. `toast` from `@devfellowship/components/hooks` shows in `<Toaster>`.
 *
 * Usage:  node scripts/check-consumer-single-copy.mjs [--spec <tarball|name@ver>] [--sonner <ver>]
 * Default spec: `npm pack` of this package (run `npm run build` first).
 * Exit 0 = both cases pass and one copy; 1 = a case failed; 2 = could not run.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i > -1 ? process.argv[i + 1] : d;
};
const sonnerVer = arg("--sonner", "1.7.4");
let spec = arg("--spec", "");
const keep = process.argv.includes("--keep");

const run = (cmd, args, cwd, opts = {}) =>
  execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });

const work = mkdtempSync(join(tmpdir(), "dfl-consumer-"));
let failed = false;
try {
  if (!spec) {
    if (!existsSync(join(pkgDir, "dist", "index.js"))) {
      console.error("dist/ is missing. Run `npm run build` first.");
      process.exit(2);
    }
    const packDir = join(work, "pack");
    mkdirSync(packDir);
    run("npm", ["pack", "--pack-destination", packDir, "--ignore-scripts"], pkgDir);
    spec = join(packDir, readdirSync(packDir).find((f) => f.endsWith(".tgz")));
  }
  // A tarball path becomes file:<path>; `name@1.2.3` becomes the version range `1.2.3`.
  const depValue = spec.endsWith(".tgz") ? `file:${spec}` : spec.replace(/^@devfellowship\/components@/, "");
  const app = join(work, "app");
  mkdirSync(app);
  writeFileSync(
    join(app, "package.json"),
    JSON.stringify(
      {
        name: "consumer-smoke",
        private: true,
        type: "module",
        dependencies: {
          react: "18.3.1",
          "react-dom": "18.3.1",
          sonner: sonnerVer,
          "@devfellowship/components": depValue,
        },
        devDependencies: {
          vitest: "3.2.4",
          jsdom: "26.1.0",
          "@testing-library/react": "16.3.0",
          "@testing-library/dom": "10.4.0",
        },
      },
      null,
      2,
    ),
  );
  console.log(`consumer: sonner@${sonnerVer}, package from ${spec}`);
  run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"], app);

  const nested = join(app, "node_modules/@devfellowship/components/node_modules/sonner");
  if (existsSync(nested)) {
    console.error(`❌ nested sonner at ${nested}: two copies, two toast stores.`);
    failed = true;
  } else {
    console.log("✅ no nested sonner under @devfellowship/components");
  }

  writeFileSync(
    join(app, "consumer.test.jsx"),
    `
import { describe, it, expect } from "vitest";
import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import { toast as appSonnerToast } from "sonner";
import { SonnerToaster, Toaster } from "@devfellowship/components";
import { toast as hooksToast } from "@devfellowship/components/hooks";

// jsdom has no matchMedia; sonner reads it for the theme.
window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });

describe("consumer app", () => {
  it("app's own sonner toast() shows in <SonnerToaster>", async () => {
    render(React.createElement(SonnerToaster));
    await act(async () => { appSonnerToast("from-app-sonner"); });
    expect(await screen.findByText("from-app-sonner")).toBeTruthy();
  });
  it("toast() from /hooks shows in the root <Toaster>", async () => {
    render(React.createElement(Toaster));
    await act(async () => { hooksToast({ title: "from-hooks-entry" }); });
    expect(await screen.findByText("from-hooks-entry")).toBeTruthy();
  });
});
`,
  );
  writeFileSync(
    join(app, "vitest.config.js"),
    `export default { test: { environment: "jsdom", include: ["consumer.test.jsx"] } };`,
  );
  try {
    const out = run("npx", ["vitest", "run", "--reporter=basic"], app);
    console.log(out.split("\n").filter((l) => /✓|×|Tests|passed|failed/.test(l)).join("\n"));
    console.log("✅ consumer cases pass");
  } catch (e) {
    failed = true;
    const text = `${e.stdout || ""}${e.stderr || ""}`;
    console.error(text.split("\n").filter((l) => /✓|×|FAIL|Error|expected|Unable|Tests/.test(l)).slice(0, 25).join("\n"));
    console.error("❌ consumer cases failed");
  }
} catch (e) {
  console.error(`could not run: ${e.message}`);
  process.exit(2);
} finally {
  if (!keep) rmSync(work, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
