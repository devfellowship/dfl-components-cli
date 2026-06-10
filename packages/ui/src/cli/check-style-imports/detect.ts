import { readdirSync, readFileSync, type Dirent } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Detector for the `@devfellowship/components/styles` ⊕ `/shadcn` co-import
 * collision (DS v0).
 *
 * WHY THIS EXISTS
 * ---------------
 * `@devfellowship/components/styles` (theme.css) ships the semantic CSS vars
 * (`--background`, `--primary`, …) as **hex** values. `@devfellowship/components/shadcn`
 * (shadcn.css) re-declares the SAME var names as bare **HSL channels**
 * (`30 11% 4%`, no `hsl()` wrapper) for shadcn-slate apps.
 *
 * The two exports are mutually exclusive by design. If an app imports BOTH,
 * whichever lands later in the cascade clobbers `--background` (and friends):
 *   - shadcn after styles → a hex consumer reads `30 11% 4%` as a color → garbage.
 *   - styles after shadcn → an `hsl(var(--background))` consumer evaluates
 *     `hsl(#0A0908)` → INVALID CSS → the declaration is dropped → the surface
 *     renders TRANSPARENT (this is the real-world failure: the transparent quiz
 *     dialog). Either ordering breaks the render.
 *
 * This detector scans an app's source for both imports and flags the collision
 * deterministically at lint/CI time. See the README "Consuming the DS styles"
 * section for the canonical one-import-per-app-type rule.
 */

export type StyleExport = 'styles' | 'shadcn';

export interface ImportHit {
  /** Repo-relative file path where the import was found. */
  file: string;
  /** 1-based line number. */
  line: number;
  /** Which DS style export was imported. */
  export: StyleExport;
  /** The raw matched source line (trimmed). */
  text: string;
}

export interface DetectResult {
  /** Every `/styles` or `/shadcn` import found across the scanned files. */
  hits: ImportHit[];
  /** Hits whose export === 'styles'. */
  styles: ImportHit[];
  /** Hits whose export === 'shadcn'. */
  shadcn: ImportHit[];
  /** True when BOTH exports are imported anywhere in the scanned set. */
  conflict: boolean;
}

const SCAN_EXTENSIONS = ['.css', '.scss', '.sass', '.less', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.next',
  '.expo',
  'storybook-static',
  'coverage',
  '.turbo',
  '.cache',
]);

/**
 * Matches an import of a specific `@devfellowship/components/<export>` subpath,
 * in either CSS form or JS/TS form:
 *
 *   CSS:  @import '@devfellowship/components/styles';
 *         @import "@devfellowship/components/shadcn";
 *         @import url('@devfellowship/components/styles');
 *   JS :  import '@devfellowship/components/styles';
 *         import "@devfellowship/components/shadcn";
 *         require('@devfellowship/components/styles')
 *
 * Trailing path segments (e.g. `/styles.css`) are tolerated so a future
 * file-extension-qualified export still matches.
 */
function importRegex(exportName: StyleExport): RegExp {
  // (@import url(...) | @import | import | require(... )  then the quoted specifier.
  return new RegExp(
    String.raw`(?:@import\s+url\(\s*|@import\s+|import\s+|require\(\s*)` +
      String.raw`['"]@devfellowship/components/${exportName}(?:\.css)?['"]`,
  );
}

const STYLES_RE = importRegex('styles');
const SHADCN_RE = importRegex('shadcn');

/** Scan a single file's text for `/styles` and `/shadcn` imports. */
export function detectInText(text: string, file = '<text>'): ImportHit[] {
  const hits: ImportHit[] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (STYLES_RE.test(raw)) {
      hits.push({ file, line: i + 1, export: 'styles', text: raw.trim() });
    }
    if (SHADCN_RE.test(raw)) {
      hits.push({ file, line: i + 1, export: 'shadcn', text: raw.trim() });
    }
  }
  return hits;
}

function* walk(dir: string): Generator<string> {
  let entries: Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true, encoding: 'utf8' }) as Dirent[];
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (entry.isFile()) {
      const dot = entry.name.lastIndexOf('.');
      if (dot < 0) continue;
      const ext = entry.name.slice(dot);
      if (SCAN_EXTENSIONS.includes(ext)) yield full;
    }
  }
}

/**
 * Recursively scan a directory tree for the co-import collision.
 *
 * Pure-ish: only reads the filesystem; never throws on unreadable files
 * (they're skipped). Returns a structured {@link DetectResult}.
 */
export function detectInDir(root: string): DetectResult {
  const hits: ImportHit[] = [];
  for (const full of walk(root)) {
    let text: string;
    try {
      text = readFileSync(full, 'utf8');
    } catch {
      continue;
    }
    const rel = relative(root, full).split(sep).join('/');
    hits.push(...detectInText(text, rel));
  }
  return summarize(hits);
}

/** Group raw hits into a {@link DetectResult}. */
export function summarize(hits: ImportHit[]): DetectResult {
  const styles = hits.filter((h) => h.export === 'styles');
  const shadcn = hits.filter((h) => h.export === 'shadcn');
  return {
    hits,
    styles,
    shadcn,
    conflict: styles.length > 0 && shadcn.length > 0,
  };
}
