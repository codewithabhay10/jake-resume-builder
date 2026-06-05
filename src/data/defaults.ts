import type {
  Bullet,
  EducationEntry,
  ExperienceEntry,
  GenericEntry,
  PersonalData,
  ProjectEntry,
  Section,
  SkillCategory,
} from '../types';
import { uid } from '../utils/id';

export const emptyPersonal = (): PersonalData => ({
  fullName: '',
  phone: '',
  email: '',
  location: '',
  website: '',
});

export const emptyBullet = (html = ''): Bullet => ({ id: uid('b'), html });

export const emptyEducationEntry = (): EducationEntry => ({
  id: uid('edu'),
  institution: '',
  location: '',
  degree: '',
  dateRange: '',
});

export const emptyExperienceEntry = (): ExperienceEntry => ({
  id: uid('exp'),
  role: '',
  dateRange: '',
  company: '',
  location: '',
  bullets: [emptyBullet()],
});

export const emptyProjectEntry = (): ProjectEntry => ({
  id: uid('proj'),
  name: '',
  technologies: '',
  dateRange: '',
  bullets: [emptyBullet()],
});

export const emptySkillCategory = (name = ''): SkillCategory => ({
  id: uid('skill'),
  name,
  items: '',
});

export const emptyGenericEntry = (): GenericEntry => ({
  id: uid('gen'),
  heading: '',
  subheading: '',
  date: '',
  location: '',
  bullets: [emptyBullet()],
});

/** The six core sections, in Jake's canonical order, all present on first run. */
export function createInitialSections(): Section[] {
  return [
    {
      id: uid('sec'),
      type: 'personal',
      title: 'Personal Information',
      removable: false,
      category: 'core',
      data: emptyPersonal(),
    },
    {
      id: uid('sec'),
      type: 'social',
      title: 'Additional Social Links',
      removable: false,
      category: 'core',
      links: [],
    },
    {
      id: uid('sec'),
      type: 'education',
      title: 'Education',
      removable: false,
      category: 'core',
      entries: [],
    },
    {
      id: uid('sec'),
      type: 'experience',
      title: 'Experience',
      removable: false,
      category: 'core',
      entries: [],
    },
    {
      id: uid('sec'),
      type: 'projects',
      title: 'Projects',
      removable: false,
      category: 'core',
      entries: [],
    },
    {
      id: uid('sec'),
      type: 'skills',
      title: 'Technical Skills',
      removable: false,
      category: 'core',
      categories: [
        emptySkillCategory('Languages'),
        emptySkillCategory('Frameworks'),
        emptySkillCategory('Developer Tools'),
        emptySkillCategory('Libraries'),
      ],
    },
  ];
}
