/**
 * Entry points must share ONE copy of every module that holds state.
 *
 * `tsup` builds each entry (`index`, `hooks`, `providers`, ...) from its own
 * graph. With `splitting: false` a module that two entries import is inlined
 * into EACH of them, so its module-level state exists twice. `use-toast` kept
 * its listener list and its in-memory state at module level: a `toast()` called
 * from `@devfellowship/components/hooks` wrote to a store that the `<Toaster>`
 * of `@devfellowship/components` never listened to, and nothing showed.
 *
 * The bug lives in the BUILT bundles, so this test imports `dist/`. Run
 * `npm run build` first (CI does).
 */
import { describe, it, expect, beforeAll } from "vitest";
import * as React from "react";
import { act, render } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "dist");
const ENTRIES = ["index", "hooks", "utils", "providers", "testing", "canvas"] as const;

type Mod = Record<string, unknown>;
const mods: Record<string, Mod> = {};

beforeAll(async () => {
  if (!existsSync(join(dist, "index.js"))) {
    throw new Error("dist/ is missing. Run `npm run build` before this test.");
  }
  for (const e of ENTRIES) {
    // A variable specifier keeps tsc from resolving a file that exists only after the build.
    const url = pathToFileURL(join(dist, `${e}.js`)).href;
    mods[e] = (await import(/* @vite-ignore */ url)) as Mod;
  }
});

describe("built entries share one store", () => {
  it("renders a toast fired from /hooks in the Toaster of the root entry", () => {
    const { toast } = mods.hooks as { toast: (p: { title: string }) => unknown };
    const { Toaster } = mods.index as { Toaster: React.ComponentType };
    render(React.createElement(Toaster));
    act(() => {
      toast({ title: "from-hooks-entry" });
    });
    expect(document.body.textContent).toContain("from-hooks-entry");
  });

  it("exposes the SAME function or object for every export name that two entries share", () => {
    const split: string[] = [];
    for (let i = 0; i < ENTRIES.length; i++) {
      for (let j = i + 1; j < ENTRIES.length; j++) {
        const a = mods[ENTRIES[i]];
        const b = mods[ENTRIES[j]];
        for (const name of Object.keys(a)) {
          if (name === "default" || !(name in b)) continue;
          if (a[name] !== b[name]) split.push(`${name} (${ENTRIES[i]} vs ${ENTRIES[j]})`);
        }
      }
    }
    // A name that two entries export as different values is a duplicated module.
    expect(split).toEqual([]);
  });

  it("keeps sonner a PEER dependency, so the app and the package share one sonner store", () => {
    // As a regular dependency (^2) next to an app that pins another sonner major, npm nests a
    // second copy: <SonnerToaster> renders with it, and `toast` from the app's sonner shows
    // nothing. Proven end to end by scripts/check-consumer-single-copy.mjs (real install).
    const pkg = JSON.parse(readFileSync(join(dist, "..", "package.json"), "utf8"));
    expect(pkg.dependencies?.sonner).toBeUndefined();
    expect(pkg.peerDependencies?.sonner).toBeTruthy();
    // and the bundle must import it, not inline it
    expect(readFileSync(join(dist, "index.js"), "utf8")).toMatch(/from ["']sonner["']/);
  });
});
