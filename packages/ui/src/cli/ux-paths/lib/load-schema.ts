// The DFL UX Paths JSON Schema is authored in devfellowship/dfl-ux-paths. When
// the CLI was folded into dfl-components-cli we kept the schema in its home repo
// and fetched it, at validate-time, from `raw.githubusercontent.com`.
//
// That stopped being viable on 2026-08-04, when dfl-ux-paths was made PRIVATE
// and permanently so (Tainan: "bora deixar privado em definitivo entao"). A
// private repo serves nothing anonymously, so the fetch would return HTTP 404
// and every `ux-paths validate` run would die with a message that reads like a
// broken URL rather than like a deliberate visibility change.
//
// The first fix VENDORED the schema here as `v1.schema.json`, kept in step with
// the canonical file by a comment that asked a human to "mirror it in the same
// round". That removed the network dependency but replaced it with a worse one:
// a promise. A promise fails quietly. The copy goes stale, `validate` keeps
// exiting 0, and a document nobody should have accepted sails through — or the
// reverse, a document the real schema admits gets refused here.
//
// The schema now arrives as a PACKAGE: `@devfellowship/ux-paths-spec`, published
// from dfl-ux-paths and generated there from `schema/v1.json` by a script whose
// `--check` mode is a CI gate. There is exactly one source of truth, and the
// only way this file can fall behind it is a version number in package.json —
// which is visible, diffable and bumped by Renovate, unlike a silent copy.
//
// OFFLINE IS UNCHANGED. `@devfellowship/ux-paths-spec` has ZERO runtime
// dependencies and performs no I/O, and `tsup.cli.config.ts` marks it
// `noExternal`, so the schema is still inlined into `dist/cli.js` at build time.
// `scripts/check-cli-bundle-offline.mjs` asserts exactly that on the artifact
// users execute.
//
// WHAT MAY LIVE IN THIS FILE: the schema is DFL INFRASTRUCTURE. It describes the
// SHAPE of a flows document (screens, flows, steps) and carries no content of
// any kind. It is not, and must never become, a place where a client's spec — or
// a link to one — is vendored. dfl-ux-paths went private to protect CONTENT;
// this package is public, and copying content here would undo exactly that.
import { SCHEMA_ID, SCHEMA_V1 } from '@devfellowship/ux-paths-spec';

/**
 * Canonical identity of the schema — the `$id` the document declares. It NAMES
 * the schema; it is not fetched. dfl-ux-paths is private as of 2026-08-04, so
 * this URL is not anonymously resolvable, and nothing here depends on it being
 * so.
 *
 * Re-exported from the spec package rather than restated, so the one string that
 * identifies the schema cannot disagree with the schema it identifies.
 */
export const SCHEMA_URL = SCHEMA_ID;

/**
 * Return the v1 schema, exactly as `@devfellowship/ux-paths-spec` publishes it.
 *
 * Async only to preserve the signature callers already `await`. It performs no
 * I/O and cannot fail, which is the entire point of taking the schema from a
 * bundled package instead of the network.
 */
export async function loadSchemaV1(): Promise<unknown> {
  return SCHEMA_V1;
}
