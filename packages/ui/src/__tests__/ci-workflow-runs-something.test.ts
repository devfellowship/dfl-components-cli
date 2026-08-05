import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Guard the guard: assert the CI workflow cannot report success while running
 * nothing.
 *
 * WHY THIS EXISTS
 * ---------------
 * `.github/workflows/ci.yml` opened each generic step with a probe for a
 * package.json at the REPO ROOT. This repo has none — everything is in
 * packages/ui — so install, build, test, typecheck and lint every one printed
 * "⚠️ No … found, skipping", and the job still finished with "✅ CI passed".
 * Verified no-op on run 30941973561.
 *
 * The consequence was the sharp part: the vitest suite added in #105 to prevent
 * a silent-degradation bug had never executed a single time. The guard had the
 * same shape as the bug it was guarding against.
 *
 * So this test asserts on the workflow text itself. It is deliberately a set of
 * cheap string checks rather than a YAML parse — js-yaml is only a transitive
 * dependency here, and per this repo's own convention (see
 * scripts/check-cli-bundle-offline.mjs) "a cheap check that cannot be argued
 * with beats a clever one that can".
 *
 * NOTE the pleasing recursion: this test only protects anything if the test
 * step actually runs. It runs. That is the fix it is guarding.
 */

const CI_YML = resolve(__dirname, "..", "..", "..", "..", ".github", "workflows", "ci.yml");
const raw = readFileSync(CI_YML, "utf8");

/**
 * Assertions run against EXECUTABLE lines only — comment lines are stripped.
 *
 * ci.yml documents the historical no-op verbatim so the next reader understands
 * why the fallbacks are gone. Scanning the raw text would therefore flag the
 * warning label as the bug it warns about. (This test caught exactly that on
 * first run, which is a decent sign it is looking at the right thing.)
 */
const workflow = raw
  .split("\n")
  .filter((line) => !/^\s*#/.test(line))
  .join("\n");

describe("ci.yml cannot pass while executing nothing", () => {
  it("has no 'not found, skipping' fallback on any step", () => {
    // The exact phrasing that made the job a no-op, plus the general shape.
    const skipPhrases = workflow
      .split("\n")
      .filter((line) => /No .*(found|package\.json).*skipping/i.test(line));
    expect(skipPhrases).toEqual([]);
  });

  it("does not gate real work behind a repo-root package.json probe", () => {
    // `if [ -f package.json ]` / `jq -e '.scripts.x' package.json` evaluated
    // from the repo root is the precise bug: the file is never there.
    expect(workflow).not.toMatch(/if\s+\[\s+-f\s+package\.json\s+\]/);
    expect(workflow).not.toMatch(/jq\s+-e\s+'\.scripts\.[a-z]+'\s+package\.json/);
  });

  it("runs install, build, test and typecheck in the packages/ui workspace", () => {
    for (const script of ["npm ci", "npm run build", "npm test", "npm run typecheck"]) {
      expect(workflow).toContain(script);
    }
    // Each npm step must be pinned to the workspace, since there is no root
    // package.json for them to fall back to.
    const workspaceSteps = workflow.match(/working-directory:\s*packages\/ui/g) ?? [];
    expect(workspaceSteps.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps a preflight that fails loudly if the workspace ever moves", () => {
    expect(workflow).toMatch(/Preflight/i);
    expect(workflow).toMatch(/WORKSPACE/);
    // Must exit non-zero, not warn-and-continue.
    expect(workflow).toMatch(/The CI workspace moved/);
  });

  it("treats a skipped step as a failure in the final gate", () => {
    // The hole that let the job go green: only `failure` was checked, so a step
    // that never ran counted as fine. The gate must require exactly `success`.
    expect(workflow).toMatch(/!=\s*"success"/);
    for (const id of ["build", "tests", "typecheck"]) {
      expect(workflow).toContain(`steps.${id}.outcome`);
    }
  });

  it("declares no eslint step while the package has no eslint config", () => {
    // The old lint step wrote `[]` to eslint-report.json and reported success,
    // claiming a lint had run when none existed. Either lint for real or do not
    // claim it — never emit a fake empty report.
    expect(workflow).not.toMatch(/echo\s+'\[\]'\s*>\s*eslint-report\.json/);
  });
});
