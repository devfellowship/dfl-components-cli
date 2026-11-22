/**
 * Types for `layer-base-rules.mjs`.
 *
 * The implementation is plain ESM on purpose: `tsup.config.ts` imports it while
 * tsup is starting up, so it cannot be a module that tsup has to build first.
 */

/** Opening and closing text that `layerBaseRules` adds around each wrapped rule. */
export const LAYER_OPEN: string;
export const LAYER_CLOSE: string;

/** Replace every comment by spaces of the same length (newlines are kept). */
export function maskComments(css: string): string;

/** Index of the `}` that closes the block opened at `open` (a `{`). */
export function closeOf(css: string, open: number): number;

/** Split a selector list on top-level commas. */
export function splitSelectorList(list: string): string[];

/** Selectors of top-level rules (nested @media included) that sit outside every `@layer`. */
export function unlayeredElementSelectors(source: string): string[];

/** Wrap each top-level element-level rule in `@layer base { ... }`, in place. */
export function layerBaseRules(source: string): string;
