import type { Section } from '../types';
import { isHtmlEmpty } from './richText';

/** Whether a section has enough filled-in required fields to count as "done". */
export function isSectionComplete(section: Section): boolean {
  switch (section.type) {
    case 'personal':
      return Boolean(
        section.data.fullName.trim() && section.data.email.trim(),
      );
    case 'social':
      return section.links.some((l) => l.url.trim());
    case 'education':
      return section.entries.some(
        (e) => e.institution.trim() && e.degree.trim(),
      );
    case 'experience':
      return section.entries.some(
        (e) =>
          e.role.trim() &&
          e.company.trim() &&
          e.bullets.some((b) => !isHtmlEmpty(b.html)),
      );
    case 'projects':
      return section.entries.some(
        (e) => e.name.trim() && e.bullets.some((b) => !isHtmlEmpty(b.html)),
      );
    case 'skills':
      return section.categories.some((c) => c.items.trim());
    case 'generic':
      return section.entries.some((e) => e.heading.trim());
    default:
      return false;
  }
}

export interface CompletionStats {
  total: number;
  completed: number;
  percent: number;
}

export function computeCompletion(sections: Section[]): CompletionStats {
  const total = sections.length;
  const completed = sections.filter(isSectionComplete).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}
