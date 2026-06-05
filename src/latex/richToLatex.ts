import { latexEscape, latexEscapeUrl } from './escape';

/**
 * Convert a bullet's contenteditable HTML into LaTeX, mapping inline marks:
 *   <b>/<strong> -> \textbf{}, <i>/<em> -> \textit{}, <u> -> \underline{},
 *   <a href>     -> \href{url}{text}
 * Text nodes are LaTeX-escaped. Unknown tags are unwrapped (text kept).
 */
export function richHtmlToLatex(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') {
    // SSR / non-browser fallback: strip tags and escape.
    return latexEscape(html.replace(/<[^>]+>/g, ''));
  }
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstChild;
  return root ? serializeChildren(root) : '';
}

function serializeChildren(node: Node): string {
  return Array.from(node.childNodes).map(serializeNode).join('');
}

function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return latexEscape(node.textContent || '');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const el = node as HTMLElement;
  const inner = serializeChildren(el);

  switch (el.tagName) {
    case 'B':
    case 'STRONG':
      return inner.trim() ? `\\textbf{${inner}}` : inner;
    case 'I':
    case 'EM':
      return inner.trim() ? `\\textit{${inner}}` : inner;
    case 'U':
      return inner.trim() ? `\\underline{${inner}}` : inner;
    case 'A': {
      const href = el.getAttribute('href') || '';
      return href ? `\\href{${latexEscapeUrl(href)}}{${inner}}` : inner;
    }
    case 'BR':
      return ' ';
    default:
      return inner;
  }
}
