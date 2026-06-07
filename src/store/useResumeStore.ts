import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Bullet, GenericLayout, PersonalData, Section } from '../types';
import {
  createInitialSections,
  emptyBullet,
  emptyEducationEntry,
  emptyExperienceEntry,
  emptyGenericEntry,
  emptyProjectEntry,
  emptySkillCategory,
} from '../data/defaults';
import { createSampleSections } from '../data/sampleData';
import { SECTION_TEMPLATES } from '../data/sectionTemplates';
import { uid } from '../utils/id';

const STORAGE_KEY = 'jakes-resume-builder:v1';

/** Move the item with `activeId` to the slot of `overId` (in place). */
function reorderByIds<T extends { id: string }>(
  arr: T[],
  activeId: string,
  overId: string,
): void {
  const from = arr.findIndex((x) => x.id === activeId);
  const to = arr.findIndex((x) => x.id === overId);
  if (from === -1 || to === -1 || from === to) return;
  const [moved] = arr.splice(from, 1);
  arr.splice(to, 0, moved);
}

/** Entries that carry rich-text bullets (education / experience / projects / generic). */
type BulletEntry = { id: string; bullets: Bullet[] };
function bulletEntriesOf(section: Section): BulletEntry[] | undefined {
  if (
    section.type === 'education' ||
    section.type === 'experience' ||
    section.type === 'projects' ||
    section.type === 'generic'
  ) {
    return section.entries as BulletEntry[];
  }
  return undefined;
}

export interface ResumeStore {
  sections: Section[];

  // --- Section-level ---
  setSections: (sections: Section[]) => void;
  reorderSections: (activeId: string, overId: string) => void;
  addTemplateSection: (templateKey: string) => void;
  addCustomSection: (title: string) => void;
  removeSection: (id: string) => void;
  renameSection: (id: string, title: string) => void;
  setGenericLayout: (id: string, layout: GenericLayout) => void;

  // --- Personal ---
  updatePersonal: (patch: Partial<PersonalData>) => void;

  // --- Social links ---
  addSocialLink: () => void;
  updateSocialLink: (id: string, patch: { label?: string; url?: string }) => void;
  removeSocialLink: (id: string) => void;
  reorderSocialLinks: (activeId: string, overId: string) => void;

  // --- Entries (education / experience / projects / generic) ---
  addEntry: (sectionId: string) => void;
  updateEntry: (
    sectionId: string,
    entryId: string,
    patch: Record<string, string>,
  ) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
  reorderEntries: (sectionId: string, activeId: string, overId: string) => void;

  // --- Skills ---
  addSkillCategory: (sectionId: string) => void;
  updateSkillCategory: (
    sectionId: string,
    id: string,
    patch: { name?: string; items?: string },
  ) => void;
  removeSkillCategory: (sectionId: string, id: string) => void;
  reorderSkillCategories: (
    sectionId: string,
    activeId: string,
    overId: string,
  ) => void;

  // --- Bullets ---
  addBullet: (sectionId: string, entryId: string) => void;
  updateBullet: (
    sectionId: string,
    entryId: string,
    bulletId: string,
    html: string,
  ) => void;
  removeBullet: (sectionId: string, entryId: string, bulletId: string) => void;
  reorderBullets: (
    sectionId: string,
    entryId: string,
    activeId: string,
    overId: string,
  ) => void;

  // --- Global ---
  clearAll: () => void;
  loadSample: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    immer((set) => ({
      sections: createInitialSections(),

      setSections: (sections) =>
        set((s) => {
          s.sections = sections;
        }),

      reorderSections: (activeId, overId) =>
        set((s) => {
          reorderByIds(s.sections, activeId, overId);
        }),

      addTemplateSection: (templateKey) =>
        set((s) => {
          const tpl = SECTION_TEMPLATES.find((t) => t.key === templateKey);
          if (!tpl) return;
          s.sections.push({
            id: uid('sec'),
            type: 'generic',
            title: tpl.title,
            removable: true,
            category: tpl.category,
            layout: tpl.layout ?? 'standard',
            entries: [emptyGenericEntry()],
          });
        }),

      addCustomSection: (title) =>
        set((s) => {
          s.sections.push({
            id: uid('sec'),
            type: 'generic',
            title: title.trim() || 'Custom Section',
            removable: true,
            category: 'custom',
            layout: 'standard',
            entries: [emptyGenericEntry()],
          });
        }),

      removeSection: (id) =>
        set((s) => {
          const idx = s.sections.findIndex((x) => x.id === id);
          if (idx !== -1 && s.sections[idx].removable) {
            s.sections.splice(idx, 1);
          }
        }),

      renameSection: (id, title) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === id);
          if (sec) sec.title = title;
        }),

      setGenericLayout: (id, layout) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === id);
          if (sec && sec.type === 'generic') sec.layout = layout;
        }),

      updatePersonal: (patch) =>
        set((s) => {
          const sec = s.sections.find((x) => x.type === 'personal');
          if (sec && sec.type === 'personal') Object.assign(sec.data, patch);
        }),

      addSocialLink: () =>
        set((s) => {
          const sec = s.sections.find((x) => x.type === 'social');
          if (sec && sec.type === 'social') {
            sec.links.push({ id: uid('ln'), label: '', url: '' });
          }
        }),

      updateSocialLink: (id, patch) =>
        set((s) => {
          const sec = s.sections.find((x) => x.type === 'social');
          if (sec && sec.type === 'social') {
            const link = sec.links.find((l) => l.id === id);
            if (link) Object.assign(link, patch);
          }
        }),

      removeSocialLink: (id) =>
        set((s) => {
          const sec = s.sections.find((x) => x.type === 'social');
          if (sec && sec.type === 'social') {
            sec.links = sec.links.filter((l) => l.id !== id);
          }
        }),

      reorderSocialLinks: (activeId, overId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.type === 'social');
          if (sec && sec.type === 'social') {
            reorderByIds(sec.links, activeId, overId);
          }
        }),

      addEntry: (sectionId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (!sec) return;
          if (sec.type === 'education') sec.entries.push(emptyEducationEntry());
          else if (sec.type === 'experience')
            sec.entries.push(emptyExperienceEntry());
          else if (sec.type === 'projects')
            sec.entries.push(emptyProjectEntry());
          else if (sec.type === 'generic')
            sec.entries.push(emptyGenericEntry());
        }),

      updateEntry: (sectionId, entryId, patch) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (!sec || !('entries' in sec)) return;
          const entry = (sec.entries as { id: string }[]).find(
            (e) => e.id === entryId,
          );
          if (entry) Object.assign(entry, patch);
        }),

      removeEntry: (sectionId, entryId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (!sec || !('entries' in sec)) return;
          const entries = sec.entries as { id: string }[];
          const idx = entries.findIndex((e) => e.id === entryId);
          if (idx !== -1) entries.splice(idx, 1);
        }),

      reorderEntries: (sectionId, activeId, overId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (!sec || !('entries' in sec)) return;
          reorderByIds(sec.entries as { id: string }[], activeId, overId);
        }),

      addSkillCategory: (sectionId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (sec && sec.type === 'skills') {
            sec.categories.push(emptySkillCategory());
          }
        }),

      updateSkillCategory: (sectionId, id, patch) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (sec && sec.type === 'skills') {
            const cat = sec.categories.find((c) => c.id === id);
            if (cat) Object.assign(cat, patch);
          }
        }),

      removeSkillCategory: (sectionId, id) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (sec && sec.type === 'skills') {
            sec.categories = sec.categories.filter((c) => c.id !== id);
          }
        }),

      reorderSkillCategories: (sectionId, activeId, overId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (sec && sec.type === 'skills') {
            reorderByIds(sec.categories, activeId, overId);
          }
        }),

      addBullet: (sectionId, entryId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (!sec) return;
          const entry = bulletEntriesOf(sec)?.find((e) => e.id === entryId);
          if (entry) entry.bullets.push(emptyBullet());
        }),

      updateBullet: (sectionId, entryId, bulletId, html) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (!sec) return;
          const entry = bulletEntriesOf(sec)?.find((e) => e.id === entryId);
          const bullet = entry?.bullets.find((b) => b.id === bulletId);
          if (bullet) bullet.html = html;
        }),

      removeBullet: (sectionId, entryId, bulletId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (!sec) return;
          const entry = bulletEntriesOf(sec)?.find((e) => e.id === entryId);
          if (entry) {
            entry.bullets = entry.bullets.filter((b) => b.id !== bulletId);
          }
        }),

      reorderBullets: (sectionId, entryId, activeId, overId) =>
        set((s) => {
          const sec = s.sections.find((x) => x.id === sectionId);
          if (!sec) return;
          const entry = bulletEntriesOf(sec)?.find((e) => e.id === entryId);
          if (entry) reorderByIds(entry.bullets, activeId, overId);
        }),

      clearAll: () =>
        set((s) => {
          s.sections = createInitialSections();
        }),

      loadSample: () =>
        set((s) => {
          s.sections = createSampleSections();
        }),
    })),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sections: state.sections }),
      version: 4,
      // v0 -> v1: education entries gained a `bullets` array (grades/achievements).
      // v1 -> v2: generic entries gained `headingUrl`/`subheadingUrl` (clickable links).
      // v2 -> v3: generic sections gained a `layout` (standard/inline/bullets).
      // v3 -> v4: project entries gained a `url` (clickable project name).
      migrate: (persisted) => {
        const state = persisted as { sections?: Section[] } | undefined;
        state?.sections?.forEach((s) => {
          if (s.type === 'education') {
            s.entries.forEach((e) => {
              if (!Array.isArray(e.bullets)) e.bullets = [];
            });
          }
          if (s.type === 'projects') {
            s.entries.forEach((e) => {
              if (typeof e.url !== 'string') e.url = '';
            });
          }
          if (s.type === 'generic') {
            if (s.layout == null) s.layout = 'standard';
            s.entries.forEach((e) => {
              if (typeof e.headingUrl !== 'string') e.headingUrl = '';
              if (typeof e.subheadingUrl !== 'string') e.subheadingUrl = '';
            });
          }
        });
        return state as { sections: Section[] };
      },
    },
  ),
);
