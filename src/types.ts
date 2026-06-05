/**
 * Resume data model.
 *
 * The whole resume is an ordered list of `Section`s (a discriminated union on
 * `type`). Reordering the resume = reordering this array. `personal` and
 * `social` are special: they always render as the centered header block, the
 * remaining sections render as titled \section blocks in array order.
 */

/** A single rich-text bullet. `html` holds the contenteditable markup
 * (only <b>/<strong>, <i>/<em>, <u>, <a href>, <br>, plain text). */
export interface Bullet {
  id: string;
  html: string;
}

export interface PersonalData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  website: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  location: string;
  degree: string;
  dateRange: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  dateRange: string;
  company: string;
  location: string;
  bullets: Bullet[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  technologies: string;
  dateRange: string;
  bullets: Bullet[];
}

export interface SkillCategory {
  id: string;
  name: string;
  items: string;
}

/** Generic entry used by every add-on / custom section. Rendered in Jake's
 * style: bold heading + right date, optional italic subheading + right
 * location, then bullets. Fields left empty collapse gracefully. */
export interface GenericEntry {
  id: string;
  heading: string;
  subheading: string;
  date: string;
  location: string;
  bullets: Bullet[];
}

/** Which add-on category a generic section came from (for the picker UI). */
export type SectionCategory =
  | 'core'
  | 'professional'
  | 'academic'
  | 'personal'
  | 'custom';

export interface BaseSection {
  id: string;
  title: string;
  /** Core sections (personal/education/...) cannot be deleted. */
  removable: boolean;
  category: SectionCategory;
}

export type Section =
  | (BaseSection & { type: 'personal'; data: PersonalData })
  | (BaseSection & { type: 'social'; links: SocialLink[] })
  | (BaseSection & { type: 'education'; entries: EducationEntry[] })
  | (BaseSection & { type: 'experience'; entries: ExperienceEntry[] })
  | (BaseSection & { type: 'projects'; entries: ProjectEntry[] })
  | (BaseSection & { type: 'skills'; categories: SkillCategory[] })
  | (BaseSection & { type: 'generic'; entries: GenericEntry[] });

export type SectionType = Section['type'];

export interface ResumeState {
  sections: Section[];
}

/** A template offered by the "Choose a Section Template" modal. */
export interface SectionTemplate {
  key: string;
  title: string;
  category: Exclude<SectionCategory, 'core'>;
  description: string;
  /** Builds a fresh, empty generic section for this template. */
  seedEntry?: Partial<GenericEntry>;
}
