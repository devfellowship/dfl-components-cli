// The TypeScript view of a UX Paths document.
//
// This file used to RESTATE the schema by hand — "ported verbatim from
// devfellowship/dfl-ux-paths:cli/lib/types.ts". It was the same drift hazard as
// the vendored `v1.schema.json`, one layer up, and it had already drifted: the
// hand-written `SchemaVersion` read `'1.0.0' | '1.1.0' | '1.2.0'` while the
// schema had admitted `'1.3.0'` for some time. Runtime `validate` accepted such
// a document and the types said it could not exist.
//
// The types now come from `@devfellowship/ux-paths-spec`, where they are
// GENERATED from `schema/v1.json` and a CI gate (`generate --check`) fails the
// build the moment they stop matching. This module stays as the CLI's import
// point so the existing `../lib/types.js` imports keep working.
//
// This file is types only. It emits nothing, and changing it cannot change what
// the CLI does at runtime — `validate` has always evaluated the JSON Schema
// itself, never these declarations.
export type {
  Action,
  DeadCodeEntry,
  Flow,
  FlowStep,
  FlowStepObject,
  NavigationStep,
  Phase,
  Prerequisites,
  SchemaVersion,
  Screen,
  Screenshot,
  SourceRef,
  TestMetadata,
  UxPathsDoc,
} from '@devfellowship/ux-paths-spec';
