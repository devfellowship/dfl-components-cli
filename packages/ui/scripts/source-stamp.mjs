/**
 * The `data-source` BUILD STAMP, for a PRE-COMPILED design system.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS AT ALL
 * ═══════════════════════════════════════════════════════════════════════════
 * UX Paths resolves a click on a screenshot to the source file that drew that
 * pixel. It does that with `data-source="<file>:<line>"` attributes written by
 * a build transform, and every consuming application already runs one over its
 * OWN `.tsx`.
 *
 * `@devfellowship/components` was invisible to all of them. It ships COMPILED:
 * tsup turns its JSX into `jsx()` calls here, long before a consuming app's
 * bundler ever sees it. So a click on a DS button resolved to whatever
 * application file MOUNTED the button, not to the button.
 *
 * Measured on `dfl-learn` (46 screens, 5565 regions, superadmin role) before
 * this file existed: a click answered with a box of 10% of the screen or less
 * on a median of **41.5%** of screen area, worst screen 6.1%. Reaching the DS
 * means changing the DS build, which is what this is.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚨 IT MUST NEVER REACH A RELEASE BUILD
 * ═══════════════════════════════════════════════════════════════════════════
 * Two independent reasons, and they are the DS's to carry now that it emits
 * stamps of its own:
 *
 *  1. **Weight.** One attribute per host element, on every element of every
 *     screen of every application that installs this package. It is dead
 *     payload for an end user, multiplied by the whole fleet.
 *  2. **Disclosure.** The stamp publishes an internal file layout into the DOM,
 *     where anyone who opens dev tools reads it. For a closed-source consumer
 *     that is a disclosure control, not a size concern.
 *
 * ⚠️ **The gate is `UX_PATHS_SOURCE_STAMP`, and it is ABSENT by default.**
 * It is deliberately NOT the bundler mode: a capture build IS a production
 * build, because the artifact under capture has to be the artifact that ships
 * minus this stamp. A test on the mode is true exactly when the stamp is wanted
 * AND true for the real release, so it cannot separate them.
 *
 * The name is shared with every other producer in the fleet ON PURPOSE. Do not
 * rename it: renaming a switch that a working capture job already sets disables
 * that job silently, and green.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY AN ESBUILD PLUGIN AND NOT THE PUBLISHED VITE ONE
 * ═══════════════════════════════════════════════════════════════════════════
 * `@devfellowship/ux-paths-capture/vite` is a Vite plugin. This package does
 * not build with Vite — it builds with tsup, which drives esbuild. So the
 * PLUGIN wrapper is different and the TRANSFORM is the same: `stampSource()`
 * and `isSourceStampEnabled()` are imported from the package root, which is
 * bundler-free by design. There is one implementation of the stamp in the
 * fleet, and this file is 40 lines of wiring around it, not a second copy.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THE ROOT IS THE REPOSITORY, NOT THE PACKAGE
 * ═══════════════════════════════════════════════════════════════════════════
 * A `data-source` value is REPOSITORY-relative everywhere else in the fleet, so
 * it is repository-relative here: `packages/ui/src/components/button.tsx:42`,
 * never `src/components/button.tsx:42`.
 *
 * That prefix is also what makes a DS stamp legible inside a CONSUMER's region
 * map. `dfl-learn` has no `packages/` directory; a path that starts with
 * `packages/ui/src/` in its map is a design-system file and reads as one. Root
 * this at the package instead and every path the DS emits collides with the
 * consumer's own `src/…` namespace — wrong in a way that still looks plausible.
 * `__tests__/source-stamp.test.ts` pins that prefix.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_SOURCE_STAMP_ENV,
  isSourceStampEnabled,
  stampSource,
} from "@devfellowship/ux-paths-capture";

/**
 * The repository root, derived from this file's own location.
 *
 * `<repo>/packages/ui/scripts/source-stamp.mjs` → three levels up. Derived
 * rather than taken from `process.cwd()` on purpose: the build is invoked from
 * `packages/ui` by `npm run build` and from the repository root by some CI
 * shapes, and a cwd-dependent root would silently write two different path
 * namespaces into the same attribute.
 */
export function repoRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
}

/**
 * The stamp as an esbuild plugin — or `undefined` when the switch is off.
 *
 * ⚠️ Unlike Vite, esbuild does NOT accept `undefined` inside its plugin array,
 * so the caller filters. The gate still lives in exactly one place: here.
 */
export function sourceStampEsbuildPlugin(options = {}) {
  const env = options.env ?? process.env;
  const envVar = options.envVar ?? DEFAULT_SOURCE_STAMP_ENV;
  if (!isSourceStampEnabled(env, envVar)) return undefined;

  const root = options.root ?? repoRoot();
  let stampedElements = 0;
  let stampedFiles = 0;

  return {
    name: "ux-paths:source-stamp",
    setup(build) {
      build.onStart(() => {
        console.warn(
          `\n[source-stamp] ENABLED by ${envVar}. Every host element of the design ` +
            `system gets data-source="<file>:<line>".\n` +
            `[source-stamp] This build exposes the repository layout. It is a CAPTURE ` +
            `build. DO NOT PUBLISH IT TO npm.\n`,
        );
      });

      // `.tsx` only: no JSX tag, no stamp. `.ts` files cannot carry one.
      build.onLoad({ filter: /\.tsx$/ }, async (args) => {
        const file = args.path;
        if (file.includes(`${path.sep}node_modules${path.sep}`)) return null;

        const rel = path.relative(root, file);
        // Outside the repository — nothing that can honestly be named a path.
        if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return null;

        const relPosix = rel.split(path.sep).join("/");
        const code = await fs.readFile(file, "utf8");
        const result = stampSource(code, relPosix);
        // `null` = "not handled", so esbuild's own tsx loader runs unchanged.
        if (result.stamped === 0) return null;

        stampedElements += result.stamped;
        stampedFiles += 1;
        return { contents: result.code, loader: "tsx" };
      });

      build.onEnd(() => {
        console.warn(
          `[source-stamp] stamped ${stampedElements} elements across ${stampedFiles} files`,
        );
      });
    },
  };
}
