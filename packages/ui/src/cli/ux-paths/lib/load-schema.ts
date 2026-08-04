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
// The fix is to stop reaching over the network at all: the schema is VENDORED
// here as JSON and inlined into `dist/cli.js` by esbuild (tsup) at build time.
// That makes `validate` fully offline and removes a runtime dependency on
// another repository's visibility — the failure mode this file just had.
//
// WHAT MAY LIVE IN THIS FILE: the schema is DFL INFRASTRUCTURE. It describes the
// SHAPE of a flows document (screens, flows, steps) and carries no content of
// any kind. It is not, and must never become, a place where a client's spec — or
// a link to one — is vendored. dfl-ux-paths went private to protect CONTENT;
// this package is public, and copying content here would undo exactly that.
//
// KEEPING IT IN SYNC: dfl-ux-paths `schema/v1.json` remains the source of truth.
// A schema change there is a deliberate, human-gated PR and must be mirrored
// into `v1.schema.json` here in the same round. The vendored copy's `$id` and
// declared version are asserted in `__tests__/load-schema.test.ts`, so a copy of
// the wrong file fails loudly instead of silently validating against nothing.
import vendoredSchemaV1 from './v1.schema.json';

/**
 * Canonical identity of the schema — the `$id` the document declares. It NAMES
 * the schema; it is not fetched. dfl-ux-paths is private as of 2026-08-04, so
 * this URL is not anonymously resolvable, and nothing here depends on it being
 * so.
 */
export const SCHEMA_URL =
  'https://raw.githubusercontent.com/devfellowship/dfl-ux-paths/main/schema/v1.json';

/**
 * Return the vendored v1 schema.
 *
 * Async only to preserve the signature callers already `await`. It performs no
 * I/O and cannot fail, which is the entire point of vendoring it.
 */
export async function loadSchemaV1(): Promise<unknown> {
  return vendoredSchemaV1;
}
