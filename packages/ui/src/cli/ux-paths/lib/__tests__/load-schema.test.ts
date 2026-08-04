import { describe, it, expect, vi, afterEach } from 'vitest';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { loadSchemaV1, SCHEMA_URL } from '../load-schema.js';

/**
 * The schema used to be fetched from raw.githubusercontent.com at validate-time.
 * dfl-ux-paths went PRIVATE permanently on 2026-08-04, which turned that fetch
 * into a 404 for every caller. It is vendored now.
 *
 * These tests pin the two things that can silently rot:
 *   1. loadSchemaV1 does no network I/O — the regression would be invisible in a
 *      dev environment that still has a cached/authenticated path to GitHub, and
 *      would only surface on a clean machine or in an offline CI job.
 *   2. The vendored file really is the DFL UX Paths v1 schema and really does
 *      compile — a wrong or truncated copy would otherwise degrade `validate`
 *      into a gate that accepts everything.
 */
describe('loadSchemaV1 (vendored)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves without touching the network', async () => {
    // If anything here reaches for fetch, this spy fails the test rather than
    // quietly succeeding on a machine that happens to have connectivity.
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('network access is not allowed from loadSchemaV1'));

    const schema = await loadSchemaV1();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(schema).toBeTypeOf('object');
  });

  it('is the DFL UX Paths v1 schema, self-identified by $id', async () => {
    const schema = (await loadSchemaV1()) as Record<string, unknown>;

    // $id is the schema's identity, and SCHEMA_URL is our record of it. If a
    // future sync copies the wrong file, these stop agreeing.
    expect(schema.$id).toBe(SCHEMA_URL);
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(schema.title).toBe('DFL UX Paths v1');
  });

  it('still declares every schema_version the CLI claims to validate', async () => {
    const schema = (await loadSchemaV1()) as {
      properties: { schema_version: { enum: string[] } };
    };

    // A vendored copy that silently lost a version would reject documents the
    // CLI is supposed to accept, so the accepted set is asserted explicitly.
    expect(schema.properties.schema_version.enum).toEqual(
      expect.arrayContaining(['1.0.0', '1.1.0', '1.2.0', '1.3.0']),
    );
  });

  it('compiles under Ajv and accepts a minimal conforming document', async () => {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile((await loadSchemaV1()) as object);

    const ok = validate({
      schema_version: '1.0.0',
      app_id: 'demo',
      app_version: '2026-08-04-0000000',
      screens: [],
      flows: [],
    });

    expect(validate.errors ?? []).toEqual([]);
    expect(ok).toBe(true);
  });

  it('rejects a document with a wrong-typed screen id — the admission gate still bites', async () => {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile((await loadSchemaV1()) as object);

    const ok = validate({
      schema_version: '1.0.0',
      app_id: 'demo',
      app_version: '2026-08-04-0000000',
      screens: [{ id: 42, name: 'Home', route: '/' }],
      flows: [],
    });

    expect(ok).toBe(false);
  });
});
