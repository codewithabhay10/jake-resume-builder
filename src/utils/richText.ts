/**
 * Helpers for the contenteditable rich-text bullets. We keep the stored HTML
 * minimal (b/strong, i/em, u, a, br, plain text) so it maps cleanly to both the
 * preview and the LaTeX generator.
 */

/** True if the bullet has no visible text content. */
// Zero-width space (U+200B) and BOM (U+FEFF) that contenteditable can leave behind.
const zeroWidth = new RegExp(
  `[${String.fromCharCode(0x200b)}${String.fromCharCode(0xfeff)}]`,
  'g',
);

export function isHtmlEmpty(html: string): boolean {
  if (!html) return true;
  const text = html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(zeroWidth, '')
    .trim();
  return text.length === 0;
}

/** Plain-text projection of a bullet (used for completion checks). */
export function htmlToText(html: string): string {
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, '');
  }
  const el = document.createElement('div');
  el.innerHTML = html;
  return (el.textContent || '').trim();
}

const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'A', 'BR', 'SPAN']);

/**
 * Sanitize contenteditable output down to the allowed inline tags. Strips
 * styles/scripts and unwraps anything unexpected, keeping the text. Runs in the
 * browser (uses DOMParser); safe to render with dangerouslySetInnerHTML.
 */
export function sanitizeBulletHtml(html: string): string {
  if (typeof window === 'undefined' || !html) return html;
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstChild as HTMLElement | null;
  if (!root) return '';

  const clean = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeForHtml(node.textContent || '');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as HTMLElement;
    const tag = el.tagName;
    const inner = Array.from(el.childNodes).map(clean).join('');

    if (tag === 'BR') return '<br>';
    if (!ALLOWED_TAGS.has(tag)) return inner;

    if (tag === 'A') {
      const href = el.getAttribute('href') || '';
      const safe = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : '';
      return safe
        ? `<a href="${escapeAttr(safe)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
        : inner;
    }
    if (tag === 'SPAN') return inner; // drop styling spans, keep text
    return `<${tag.toLowerCase()}>${inner}</${tag.toLowerCase()}>`;
  };

  return Array.from(root.childNodes).map(clean).join('');
}

function escapeForHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
