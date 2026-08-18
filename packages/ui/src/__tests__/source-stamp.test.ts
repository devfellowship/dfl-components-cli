/**
 * The UX Paths `data-source` stamp — the two properties that cannot be checked
 * by eye, and one that a CI job alone would check too late.
 *
 * The ARTIFACT-level proof lives in `.github/workflows/guard-ux-paths-stamp.yml`
 * and runs both directions over two real builds. That is the proof that matters,
 * because it reads the bytes that ship. This suite covers the two things that
 * job cannot see:
 *
 *  1. **The default is off**, as a property of the gate rather than of a
 *     workflow's environment.
 *  2. **The root is the REPOSITORY**, so a stamp reads
 *     `packages/ui/src/components/button.tsx:42`. Root it at the package and
 *     every path the design system emits lands in a consuming application's own
 *     `src/…` namespace — wrong, and still plausible, which is worse.
 */
import { describe, expect, it } from "vitest";
import path from "node:path";
import { existsSync } from "node:fs";
import {
  DEFAULT_SOURCE_STAMP_ENV,
  isSourceStampEnabled,
  stampSource,
} from "@devfellowship/ux-paths-capture";
import { repoRoot, sourceStampEsbuildPlugin } from "../../scripts/source-stamp.mjs";

describe("the gate", () => {
  it("is absent by default, so an ordinary build is a release build", () => {
    expect(isSourceStampEnabled({}, DEFAULT_SOURCE_STAMP_ENV)).toBe(false);
    expect(sourceStampEsbuildPlugin({ env: {} })).toBeUndefined();
  });

  it("stays off for every value that is not an explicit yes", () => {
    for (const value of ["", "0", "false", "off", "no", "maybe"]) {
      expect(sourceStampEsbuildPlugin({ env: { [DEFAULT_SOURCE_STAMP_ENV]: value } })).toBeUndefined();
    }
  });

  it("turns on only when the SHARED name is set — the name is not ours to rename", () => {
    // A capture job in another repository already exports this exact name. A
    // local spelling here would disable that job silently, and green.
    expect(DEFAULT_SOURCE_STAMP_ENV).toBe("UX_PATHS_SOURCE_STAMP");
    expect(sourceStampEsbuildPlugin({ env: { UX_PATHS_SOURCE_STAMP: "1" } })).toBeDefined();
  });
});

describe("the root", () => {
  it("is the repository, not the package", () => {
    const root = repoRoot();
    // The repository is the directory that CONTAINS packages/ui.
    expect(existsSync(path.join(root, "packages", "ui", "package.json"))).toBe(true);
    expect(path.basename(root)).not.toBe("ui");
  });

  it("makes a design-system stamp legible inside a CONSUMER's region map", () => {
    const button = path.join(repoRoot(), "packages", "ui", "src", "components", "button.tsx");
    const rel = path.relative(repoRoot(), button).split(path.sep).join("/");
    expect(rel).toBe("packages/ui/src/components/button.tsx");

    const { code, stamped } = stampSource(`export const A = () => <div className="x" />;\n`, rel);
    expect(stamped).toBe(1);
    // The `packages/ui/src/` prefix is the whole point: a consuming app has no
    // `packages/` directory, so this path reads as a design-system file.
    expect(code).toContain('data-source="packages/ui/src/components/button.tsx:1"');
  });
});
