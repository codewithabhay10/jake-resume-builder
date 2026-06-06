import type { SectionTemplate } from '../types';

/**
 * Add-on section templates offered by the "Choose a Section Template" modal.
 * Every one of these renders through the generic Jake's-style entry layout
 * (heading / date / subheading / location / bullets), so the user can add,
 * rename, remove, and reorder them freely.
 */
export const SECTION_TEMPLATES: SectionTemplate[] = [
  // ---- Professional ----
  {
    key: 'certifications',
    title: 'Certifications',
    category: 'professional',
    description: 'Professional certifications and credentials you have earned.',
    layout: 'inline',
  },
  {
    key: 'achievements',
    title: 'Achievements',
    category: 'professional',
    description: 'A simple bulleted list of key achievements and highlights.',
    layout: 'bullets',
  },
  {
    key: 'volunteer',
    title: 'Volunteer Experience',
    category: 'professional',
    description: 'Community service, nonprofit work, and volunteer roles.',
  },
  {
    key: 'licenses',
    title: 'Licenses',
    category: 'professional',
    description: 'Professional or trade licenses you currently hold.',
  },
  {
    key: 'summary',
    title: 'Professional Summary',
    category: 'professional',
    description: 'A short headline paragraph summarizing who you are.',
  },
  {
    key: 'awards',
    title: 'Awards & Honors',
    category: 'professional',
    description: 'Recognition, scholarships, and competition placements.',
  },
  // ---- Academic ----
  {
    key: 'publications',
    title: 'Publications',
    category: 'academic',
    description: 'Journal papers, articles, and other published work.',
  },
  {
    key: 'patents',
    title: 'Patents',
    category: 'academic',
    description: 'Patents you have filed or that have been granted.',
  },
  {
    key: 'presentations',
    title: 'Conference Presentations',
    category: 'academic',
    description: 'Talks, posters, and presentations at conferences.',
  },
  {
    key: 'coursework',
    title: 'Relevant Coursework',
    category: 'academic',
    description: 'Notable courses relevant to the roles you are targeting.',
  },
  // ---- Technical ----
  {
    key: 'open-source',
    title: 'Open Source Contributions',
    category: 'technical',
    description: 'Contributions to open-source projects and communities.',
  },
  {
    key: 'tech-projects',
    title: 'Additional Projects',
    category: 'technical',
    description: 'A second projects block for side or technical projects.',
  },
  // ---- Personal ----
  {
    key: 'languages',
    title: 'Languages',
    category: 'personal',
    description: 'Spoken and written languages with proficiency levels.',
  },
  {
    key: 'interests',
    title: 'Interests & Hobbies',
    category: 'personal',
    description: 'Personal interests and hobbies outside of work.',
  },
];

/** Filter chips shown above the template grid. */
export const TEMPLATE_FILTERS = [
  'All',
  'Professional',
  'Academic',
  'Technical',
  'Personal',
] as const;

export type TemplateFilter = (typeof TEMPLATE_FILTERS)[number];
