#!/usr/bin/env node
/**
 * design-token-lint — a linter for CSS custom-property / design-token files.
 *
 * Catches the exact bug class that silently broke ~10 components in a
 * storybook audit session (2026-07). None of these throw a CSS parse error in
 * the browser — they fail SILENTLY (invalid declarations are dropped, a
 * self-referential var resolves to nothing), so a linter is the only guard.
 *
 * Detects (EXIT NONZERO on any error):
 *   1. Orphaned custom properties  — `--x: …;` sitting OUTSIDE any `{ … }`
 *      selector block (a stray `}` closed :root early). Invalid → dropped.
 *   2. Unbalanced braces           — net depth != 0 at EOF, or depth < 0.
 *   3. Self-referential vars        — `--x: var(--x)` (direct) or an indirect
 *      cycle `--a → --b → --a`. Resolves to nothing → e.g. rounded-* = 0px.
 *   4. Duplicate keys               — the same `--x` declared twice in the
 *      same selector block (last-write-wins → wrong value).
 *   5. (warning) Undefined var      — `var(--y)` where `--y` is never defined
 *      in ANY passed file and has no fallback. Best-effort (WARN, not error,
 *      to tolerate runtime/JS-injected vars). `--strict` promotes to error.
 *
 * The scanner is comment- and string-aware (handles /* *​/, "…", '…').
 *
 * Usage:  node lint-tokens.mjs <file.css> [file2.css …] [--strict] [--json]
 * Exit:   0 = clean, 1 = errors found, 2 = usage / IO error.
 *
 * This file is self-contained (no deps) so it can be vendored verbatim into a
 * repo's scripts/ for CI. Keep it dependency-free.
 */
import { readFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const STRICT = argv.includes('--strict');
const JSON_OUT = argv.includes('--json');
const files = argv.filter((a) => !a.startsWith('--'));

if (files.length === 0) {
  process.stderr.write('usage: lint-tokens.mjs <file.css> [file2.css …] [--strict] [--json]\n');
  process.exit(2);
}

/** A single declaration record. */
// { file, line, name, value, blockId, depth, selector }

/**
 * Scan one CSS file into a stream of custom-property declarations, plus brace
 * accounting. Comment- and string-aware.
 */
function scanFile(file, src) {
  const decls = [];
  const braceErrors = []; // { file, line, msg }
  let line = 1;
  let depth = 0;
  let blockCounter = 0;
  const blockStack = []; // { id, selector }
  // Track selector text: the run of non-{}; chars immediately before a `{`.
  let pendingSelector = '';
  let i = 0;
  const n = src.length;

  let inComment = false;
  let inString = false;
  let stringQuote = '';

  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];

    if (c === '\n') line++;

    if (inComment) {
      if (c === '*' && c2 === '/') { inComment = false; i += 2; continue; }
      i++;
      continue;
    }
    if (inString) {
      if (c === '\\') { i += 2; continue; } // escaped char
      if (c === stringQuote) { inString = false; }
      pendingSelector += c;
      i++;
      continue;
    }
    // not in comment / string
    if (c === '/' && c2 === '*') { inComment = true; i += 2; continue; }
    if (c === '"' || c === "'") { inString = true; stringQuote = c; pendingSelector += c; i++; continue; }

    if (c === '{') {
      const selector = pendingSelector.trim().replace(/\s+/g, ' ');
      blockCounter++;
      blockStack.push({ id: blockCounter, selector: selector || `(block#${blockCounter})` });
      depth++;
      pendingSelector = '';
      i++;
      continue;
    }
    if (c === '}') {
      depth--;
      if (depth < 0) {
        braceErrors.push({ file, line, msg: 'unbalanced braces: extra `}` (depth went negative)' });
        depth = 0;
      } else {
        blockStack.pop();
      }
      pendingSelector = '';
      i++;
      continue;
    }
    if (c === ';') {
      pendingSelector = '';
      i++;
      continue;
    }

    // Detect a custom-property declaration start: `--name` followed by `:`
    // Only recognise at a declaration boundary (pendingSelector so far is
    // whitespace/empty or ended by a prior ; } {, which we already reset).
    if (c === '-' && c2 === '-' && /[a-zA-Z0-9]/.test(src[i + 2] || '')) {
      // read the property name
      let j = i + 2;
      let name = '--';
      while (j < n && /[a-zA-Z0-9_-]/.test(src[j])) { name += src[j]; j++; }
      // skip whitespace
      let k = j;
      while (k < n && /\s/.test(src[k])) { if (src[k] === '\n') line++; k++; }
      if (src[k] === ':') {
        // It's a declaration. Read the value up to the terminating `;` or `}`
        // at THIS nesting level (respecting parens/strings/comments).
        let v = '';
        let p = k + 1;
        let parenDepth = 0;
        let vInString = false, vQuote = '';
        let vInComment = false;
        while (p < n) {
          const vc = src[p];
          const vc2 = src[p + 1];
          if (vc === '\n') line++;
          if (vInComment) { if (vc === '*' && vc2 === '/') { vInComment = false; p += 2; continue; } p++; continue; }
          if (vInString) { if (vc === '\\') { v += vc + (src[p+1]||''); p += 2; continue; } if (vc === vQuote) vInString = false; v += vc; p++; continue; }
          if (vc === '/' && vc2 === '*') { vInComment = true; p += 2; continue; }
          if (vc === '"' || vc === "'") { vInString = true; vQuote = vc; v += vc; p++; continue; }
          if (vc === '(') parenDepth++;
          if (vc === ')') parenDepth--;
          if (vc === ';' && parenDepth === 0) { break; }
          if (vc === '}' && parenDepth === 0) { break; } // last decl w/o semicolon
          v += vc;
          p++;
        }
        const block = blockStack[blockStack.length - 1];
        decls.push({
          file,
          line,
          name,
          value: v.trim(),
          depth,
          blockId: block ? block.id : 0,
          selector: block ? block.selector : '(top-level)',
        });
        i = p; // continue from terminator
        continue;
      }
      // not a declaration (e.g. `--foo` used elsewhere) — fall through
      pendingSelector += src.slice(i, j);
      i = j;
      continue;
    }

    pendingSelector += c;
    i++;
  }

  if (depth !== 0) {
    braceErrors.push({ file, line, msg: `unbalanced braces: ${depth} block(s) left open at EOF` });
  }
  return { decls, braceErrors };
}

// ── Scan all files ───────────────────────────────────────────────────────────
const allDecls = [];
const errors = []; // { file, line, rule, msg }
const warnings = []; // same shape

for (const f of files) {
  let src;
  try {
    src = readFileSync(f, 'utf8');
  } catch (e) {
    process.stderr.write(`cannot read ${f}: ${e.message}\n`);
    process.exit(2);
  }
  const { decls, braceErrors } = scanFile(f, src);
  for (const be of braceErrors) errors.push({ file: be.file, line: be.line, rule: 'unbalanced-braces', msg: be.msg });
  allDecls.push(...decls);
}

// ── Rule 1: orphaned (depth 0) declarations ─────────────────────────────────
for (const d of allDecls) {
  if (d.depth === 0) {
    errors.push({ file: d.file, line: d.line, rule: 'orphaned', msg: `custom property \`${d.name}\` declared OUTSIDE any selector block (orphaned — invalid CSS, silently dropped)` });
  }
}

// ── Rule 4: duplicate keys within the same block ─────────────────────────────
const seenPerBlock = new Map(); // key `${file}#${blockId}#${name}` -> firstLine
for (const d of allDecls) {
  if (d.depth === 0) continue; // orphaned already reported
  const key = `${d.file}#${d.blockId}#${d.name}`;
  if (seenPerBlock.has(key)) {
    const first = seenPerBlock.get(key);
    errors.push({ file: d.file, line: d.line, rule: 'duplicate-key', msg: `duplicate custom property \`${d.name}\` in selector \`${d.selector}\` (first defined line ${first}; last-write-wins hides the earlier value)` });
  } else {
    seenPerBlock.set(key, d.line);
  }
}

// ── Build dependency graph for self-ref / cycle / undefined detection ────────
// A property maps to the set of var(--…) names referenced in its value.
const VAR_RE = /var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,([^)]*))?\)/g;
const definedNames = new Set(allDecls.map((d) => d.name));
// deps: name -> Set(referenced names) ; also remember one decl per name for reporting
const deps = new Map();
const declByName = new Map();
for (const d of allDecls) {
  if (!declByName.has(d.name)) declByName.set(d.name, d);
  const set = deps.get(d.name) || new Set();
  let m;
  VAR_RE.lastIndex = 0;
  while ((m = VAR_RE.exec(d.value)) !== null) {
    set.add(m[1]);
  }
  deps.set(d.name, set);
}

// ── Rule 3a: direct self-reference ───────────────────────────────────────────
for (const d of allDecls) {
  const refs = new Set();
  let m; VAR_RE.lastIndex = 0;
  while ((m = VAR_RE.exec(d.value)) !== null) refs.add(m[1]);
  if (refs.has(d.name)) {
    errors.push({ file: d.file, line: d.line, rule: 'self-referential', msg: `\`${d.name}\` references itself: \`${d.name}: ${d.value}\` (resolves to nothing)` });
  }
}

// ── Rule 3b: indirect cycles (DFS over the var graph) ────────────────────────
const cyclesReported = new Set();
const WHITE = 0, GRAY = 1, BLACK = 2;
const color = new Map();
for (const name of deps.keys()) color.set(name, WHITE);
const stack = [];
function dfs(name) {
  color.set(name, GRAY);
  stack.push(name);
  for (const nxt of deps.get(name) || []) {
    if (!deps.has(nxt)) continue; // undefined handled separately
    if (nxt === name) continue; // direct self-ref already reported
    const col = color.get(nxt);
    if (col === GRAY) {
      // found a cycle: from nxt..end of stack
      const idx = stack.indexOf(nxt);
      const cyc = stack.slice(idx).concat(nxt);
      const sig = [...cyc].sort().join(',');
      if (!cyclesReported.has(sig)) {
        cyclesReported.add(sig);
        const d = declByName.get(name);
        errors.push({ file: d.file, line: d.line, rule: 'cyclic-var', msg: `cyclic var reference: ${cyc.join(' → ')} (resolves to nothing)` });
      }
    } else if (col === WHITE) {
      dfs(nxt);
    }
  }
  stack.pop();
  color.set(name, BLACK);
}
for (const name of deps.keys()) {
  if (color.get(name) === WHITE) dfs(name);
}

// ── Rule 5: undefined var (warning unless --strict) ──────────────────────────
// A var(--y) with NO fallback, where --y is never defined in any passed file.
for (const d of allDecls) {
  let m; VAR_RE.lastIndex = 0;
  while ((m = VAR_RE.exec(d.value)) !== null) {
    const ref = m[1];
    const fallback = (m[2] || '').trim();
    if (!definedNames.has(ref) && fallback === '') {
      const rec = { file: d.file, line: d.line, rule: 'undefined-var', msg: `\`${d.name}\` references \`var(${ref})\` which is never defined in the passed files and has no fallback (best-effort — ignore if injected at runtime)` };
      (STRICT ? errors : warnings).push(rec);
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
errors.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
warnings.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ ok: errors.length === 0, errors, warnings, filesScanned: files, declCount: allDecls.length }, null, 2) + '\n');
} else {
  for (const e of errors) process.stdout.write(`ERROR  ${e.file}:${e.line}  [${e.rule}]  ${e.msg}\n`);
  for (const w of warnings) process.stdout.write(`WARN   ${w.file}:${w.line}  [${w.rule}]  ${w.msg}\n`);
  if (errors.length === 0 && warnings.length === 0) {
    process.stdout.write(`✓ design-token-lint: ${allDecls.length} custom properties across ${files.length} file(s), no issues.\n`);
  } else {
    process.stdout.write(`\n${errors.length} error(s), ${warnings.length} warning(s) across ${files.length} file(s).\n`);
  }
}

process.exit(errors.length > 0 ? 1 : 0);
