/**
 * Fixture loader for the roadmap tests and stories.
 *
 * The fixtures are read from disk with `readFileSync` rather than imported as
 * modules on purpose: `resolveJsonModule` makes `tsc` build a full literal type
 * for every key of a 219-node document, which costs real time on `npm run
 * typecheck` and buys nothing — the documents are validated by the zod schema at
 * run time, which is the check that matters.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const FIXTURE_DIR = __dirname;

export function loadFixture(...segments: string[]): unknown {
  return JSON.parse(readFileSync(resolve(__dirname, ...segments), "utf8"));
}

export function fixturePath(...segments: string[]): string {
  return resolve(__dirname, ...segments);
}

/** The five malformed documents of verification row 5, plus the group case. */
export const MALFORMED_FIXTURES = [
  "wrong-version.json",
  "duplicate-node-id.json",
  "duplicate-cell.json",
  "dangling-edge-target.json",
  "hex-tone.json",
  "group-from-after-to.json",
] as const;
