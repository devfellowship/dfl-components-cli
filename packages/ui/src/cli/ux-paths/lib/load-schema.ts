// The DFL UX Paths JSON Schema is the source of truth in devfellowship/dfl-ux-paths.
// When the CLI was folded into dfl-components-cli we kept the SCHEMA in its home repo
// and fetch it from the canonical raw URL at validate-time (no schema file is vendored
// here). The result is cached in-process so a single `validate` run fetches once.

/** Canonical schema URL — the source of truth lives in devfellowship/dfl-ux-paths. */
export const SCHEMA_URL =
  'https://raw.githubusercontent.com/devfellowship/dfl-ux-paths/main/schema/v1.json';

let cached: unknown | null = null;

/**
 * Fetch + cache the v1 schema from the canonical raw URL. Uses the global
 * `fetch` (Node >= 18). Throws a descriptive error if the network call fails
 * so `validate` can surface a clear message instead of a generic AJV error.
 */
export async function loadSchemaV1(): Promise<unknown> {
  if (cached) return cached;
  let res: Response;
  try {
    res = await fetch(SCHEMA_URL);
  } catch (err) {
    throw new Error(
      `Unable to fetch the UX Paths schema from ${SCHEMA_URL}: ${(err as Error).message}`,
    );
  }
  if (!res.ok) {
    throw new Error(
      `Unable to fetch the UX Paths schema from ${SCHEMA_URL}: HTTP ${res.status} ${res.statusText}`,
    );
  }
  cached = (await res.json()) as unknown;
  return cached;
}
