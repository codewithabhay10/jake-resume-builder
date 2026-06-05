/**
 * LaTeX escaping for user-entered text.
 *
 * Special characters that must be escaped:  \ & % $ # _ { } ~ ^
 * Backslash/tilde/caret can't be handled by a naive replace (their
 * replacements contain braces, which the simple pass would re-escape), so we
 * stash them as control-char placeholders, escape the simple set, then restore.
 */
const SLASH = String.fromCharCode(1);
const TILDE = String.fromCharCode(2);
const CARET = String.fromCharCode(3);

export function latexEscape(input: string): string {
  if (!input) return '';
  return input
    .replace(/\\/g, SLASH)
    .replace(/~/g, TILDE)
    .replace(/\^/g, CARET)
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(new RegExp(SLASH, 'g'), '\\textbackslash{}')
    .replace(new RegExp(TILDE, 'g'), '\\textasciitilde{}')
    .replace(new RegExp(CARET, 'g'), '\\textasciicircum{}');
}

/**
 * Escape a date-range string and normalize separators to LaTeX en-dashes,
 * e.g. "May 2018 - May 2020" -> "May 2018 -- May 2020".
 */
export function latexEscapeDate(input: string): string {
  if (!input) return '';
  return latexEscape(input).replace(/\s*(?:--|–|—|-)\s*/g, ' -- ');
}

/** Light escaping for URLs used inside \href{...}. */
export function latexEscapeUrl(url: string): string {
  if (!url) return '';
  return url.replace(/%/g, '\\%').replace(/#/g, '\\#');
}
