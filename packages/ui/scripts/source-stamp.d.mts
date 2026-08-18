/**
 * Types for `source-stamp.mjs`.
 *
 * The implementation is plain ESM on purpose: `tsup.config.ts` imports it while
 * tsup is starting up, so it cannot be a module that tsup has to build first.
 * This file is what keeps `tsc --noEmit` honest about it anyway.
 */
import type { Plugin } from "esbuild";

export interface SourceStampOptions {
  /** Repository root. Attribute paths are written relative to it. */
  root?: string;
  /** The switch. Defaults to `UX_PATHS_SOURCE_STAMP` — do not rename it. */
  envVar?: string;
  /** Injected for testing. Defaults to the real process environment. */
  env?: Record<string, string | undefined>;
}

/** The repository root, derived from this file's own location. */
export function repoRoot(): string;

/** The plugin — or `undefined` when the switch is off, which is the default. */
export function sourceStampEsbuildPlugin(options?: SourceStampOptions): Plugin | undefined;
