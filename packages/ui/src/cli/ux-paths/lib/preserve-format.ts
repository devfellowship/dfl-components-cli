// Minimal-diff `stamp` helper.
//
// Problem: re-stamping a flows.json by parse → JSON.stringify(doc, null, 2)
// reformats the WHOLE file (compact arrays collapse to multi-line, key order may
// shuffle, indentation normalizes). That produces a noisy git diff that fights the
// "empty diff" gate the DS fan-out relies on — a re-stamp that changed nothing but
// the timestamp shouldn't rewrite 400 lines.
//
// Fix: when re-stamping an existing file, update ONLY the volatile top-level string
// fields (`app_version`, `generated_at`) via surgical string replacement against the
// raw file text, preserving the existing file's exact formatting everywhere else.
// We only touch a field's value when it genuinely changed.

export interface StampFields {
  app_version: string;
  generated_at: string;
}

/**
 * Replace the value of a top-level JSON string field in `raw` in place,
 * preserving surrounding formatting. Matches the FIRST occurrence of a
 * `"<key>"\s*:\s*"<oldvalue>"` pair at any indentation. Returns the new text,
 * or the original text unchanged if the key isn't found as a string field.
 *
 * Only top-level volatile fields (app_version, generated_at) are stamped, so a
 * naive first-match is safe — these keys don't recur as nested object keys in
 * the flows schema.
 */
export function replaceTopLevelStringField(
  raw: string,
  key: string,
  newValue: string,
): string {
  // Capture: ("key"   :   ")  <existing value>  (")
  const re = new RegExp(`("${escapeRegExp(key)}"\\s*:\\s*")((?:[^"\\\\]|\\\\.)*)(")`);
  if (!re.test(raw)) return raw;
  return raw.replace(re, (_m, pre: string, _old: string, post: string) => {
    return pre + escapeJsonStringValue(newValue) + post;
  });
}

/**
 * Surgically stamp the volatile fields into the raw file text, preserving the
 * existing formatting. Returns the updated text. Idempotent: stamping the same
 * values returns byte-identical text.
 */
export function stampPreserveFormat(raw: string, fields: StampFields): string {
  let out = raw;
  out = replaceTopLevelStringField(out, 'app_version', fields.app_version);
  out = replaceTopLevelStringField(out, 'generated_at', fields.generated_at);
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Escape a string so it's a valid JSON string body (between the quotes). */
function escapeJsonStringValue(s: string): string {
  // JSON.stringify gives us a fully-quoted escaped string; strip the outer quotes.
  const json = JSON.stringify(s);
  return json.slice(1, -1);
}
