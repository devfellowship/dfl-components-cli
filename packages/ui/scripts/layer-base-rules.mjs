// Cascade-layer helpers for the shipped stylesheets. Node built-ins only.
//
// Tailwind v4 utilities live in `@layer utilities`. ANY unlayered rule beats every
// layered rule, whatever its specificity. An element-level or universal rule
// (`*`, `html`, `button`, `::selection`, ...) outside a layer therefore overrides
// `border-transparent`, `bg-*` and the ghost Button variant in a consumer app.
//
// `theme.css` is hand-written and keeps its resets inside `@layer base`.
// `tokens.v2.css` is a GENERATED mirror of the brand site: it must stay
// byte-identical to the upstream, so its source cannot be edited. `layerBaseRules`
// is applied to it when the package is built (tsup.config.ts), and `dist/styles/
// tokens.v2.css` is what a consumer imports (`@devfellowship/components/tokens.v2`).

// A top-level rule may stay unlayered only when its selectors are scoped to a DFL
// class, `:root`, or a `[data-*]` attribute.
const SAFE_SELECTOR = /^(\.|:root\b|\[data-)/;
// At-rules whose body is plain rules that stay unlayered unless they hold element rules.
const TRANSPARENT_AT = /^@(media|container|supports|scope)\b/;

export const LAYER_OPEN = '@layer base {\n';
export const LAYER_CLOSE = '\n}';

/** Replace every comment by spaces of the same length, so offsets stay valid. */
export function maskComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

/** Index of the `}` that closes the block opened at `open` (a `{`). */
export function closeOf(css, open) {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    const c = css[i];
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return i;
  }
  throw new Error('unbalanced braces in stylesheet');
}

/** Split a selector list on top-level commas (not the ones inside `:where(...)`). */
export function splitSelectorList(list) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (c === ',' && depth === 0) {
      out.push(list.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(list.slice(start).trim());
  return out.filter(Boolean);
}

/**
 * Split masked CSS into its top-level items. Each item is a block rule or at-rule
 * `{ start, end, prelude, body }` (`end` is exclusive), or a statement without a
 * block (`@import ...;`, `@layer a, b;`) that is skipped.
 */
function topLevelBlocks(masked) {
  const blocks = [];
  let i = 0;
  while (i < masked.length) {
    const open = masked.indexOf('{', i);
    const semi = masked.indexOf(';', i);
    if (semi !== -1 && (open === -1 || semi < open)) {
      i = semi + 1;
      continue;
    }
    if (open === -1) break;
    const close = closeOf(masked, open);
    const preludeRaw = masked.slice(i, open);
    const start = i + (preludeRaw.length - preludeRaw.trimStart().length);
    blocks.push({ start, end: close + 1, prelude: preludeRaw.trim(), body: masked.slice(open + 1, close) });
    i = close + 1;
  }
  return blocks;
}

/** Selectors of one block, split in `{ unsafe, safe }`, nested @media included. */
function classify(block) {
  const unsafe = [];
  const safe = [];
  const visit = (b) => {
    if (b.prelude.startsWith('@')) {
      // @layer (already layered), @keyframes, @font-face, @theme, @property: skip.
      if (TRANSPARENT_AT.test(b.prelude)) for (const inner of topLevelBlocks(b.body)) visit(inner);
      return;
    }
    for (const selector of splitSelectorList(b.prelude)) {
      (SAFE_SELECTOR.test(selector) ? safe : unsafe).push(selector);
    }
  };
  visit(block);
  return { unsafe, safe };
}

/** Selectors of rules that sit outside every `@layer`, nested @media included. */
export function unlayeredElementSelectors(source) {
  const found = [];
  for (const block of topLevelBlocks(maskComments(source))) found.push(...classify(block).unsafe);
  return found;
}

/**
 * Wrap every top-level rule that holds an element-level or universal selector in
 * `@layer base { ... }`, in place. Values, order, comments and every other byte stay
 * as they are, so removing the wrapper text gives the input back. Idempotent: a rule
 * that is already in a layer is not touched. A top-level @media that mixes element
 * rules with class rules throws: wrapping it would layer the class rules too.
 */
export function layerBaseRules(source) {
  const masked = maskComments(source);
  let out = '';
  let cursor = 0;
  for (const block of topLevelBlocks(masked)) {
    const { unsafe, safe } = classify(block);
    if (unsafe.length === 0) continue;
    if (safe.length > 0) {
      throw new Error(`cannot layer \`${block.prelude}\`: it mixes element selectors (${unsafe.join(', ')}) with scoped ones (${safe.join(', ')})`);
    }
    out += source.slice(cursor, block.start) + LAYER_OPEN + source.slice(block.start, block.end) + LAYER_CLOSE;
    cursor = block.end;
  }
  return out + source.slice(cursor);
}
