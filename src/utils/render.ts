import type { Bullet, PersonalData, Section, SocialLink } from '../types';
import { isHtmlEmpty } from './richText';

/** Bullets with actual text content (drops blank rich-text bullets). */
export function nonEmptyBullets(bullets: Bullet[]): Bullet[] {
  return bullets.filter((b) => !isHtmlEmpty(b.html));
}

/**
 * Whether a section produces any output. Empty list-sections are skipped so the
 * generated .tex never emits an empty itemize (which fails to compile) — the
 * HTML preview applies the same rule so the two stay in sync.
 */
export function hasRenderableContent(section: Section): boolean {
  switch (section.type) {
    case 'personal':
      return true;
    case 'social':
      return section.links.some((l) => l.url.trim() || l.label.trim());
    case 'education':
    case 'experience':
    case 'projects':
    case 'generic':
      return section.entries.length > 0;
    case 'skills':
      return section.categories.some((c) => c.name.trim() || c.items.trim());
  }
}

/** Strip protocol + trailing slash for the header's visible link text
 * (matches Jake's "linkedin.com/in/jake" style). */
export function cleanUrlDisplay(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
}

/** Ensure a user-typed URL has a scheme so the anchor/\href works. */
export function ensureHttp(url: string): string {
  const u = url.trim();
  if (!u) return '';
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  return `https://${u}`;
}

export interface ContactItem {
  display: string;
  href?: string;
  isEmail?: boolean;
}

/** The centered header contact line: phone | email | website | social links. */
export function buildContactItems(
  personal: PersonalData,
  social: SocialLink[],
): ContactItem[] {
  const items: ContactItem[] = [];
  if (personal.phone.trim()) items.push({ display: personal.phone.trim() });
  if (personal.email.trim()) {
    items.push({
      display: personal.email.trim(),
      href: `mailto:${personal.email.trim()}`,
      isEmail: true,
    });
  }
  if (personal.website.trim()) {
    items.push({
      display: cleanUrlDisplay(personal.website.trim()),
      href: ensureHttp(personal.website),
    });
  }
  for (const link of social) {
    const url = link.url.trim();
    const label = link.label.trim();
    if (!url && !label) continue;
    // Prefer the label as the visible text (e.g. "LinkedIn", "Portfolio"),
    // falling back to a cleaned URL — matching modern Jake's-style headers.
    items.push({
      display: label || cleanUrlDisplay(url),
      href: url ? ensureHttp(url) : undefined,
    });
  }
  return items;
}

/** Pull the personal-info data out of the sections list (or empty defaults). */
export function findPersonal(sections: Section[]): PersonalData {
  const s = sections.find((x) => x.type === 'personal');
  return s && s.type === 'personal'
    ? s.data
    : { fullName: '', phone: '', email: '', location: '', website: '' };
}

/** Pull the social links out of the sections list. */
export function findSocialLinks(sections: Section[]): SocialLink[] {
  const s = sections.find((x) => x.type === 'social');
  return s && s.type === 'social' ? s.links : [];
}
