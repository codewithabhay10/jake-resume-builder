import { useResumeStore } from '../store/useResumeStore';
import { SectionFormRouter } from './forms/SectionFormRouter';
import { Button } from './common/ui';
import { TrashIcon } from './icons';

const DESCRIPTIONS: Record<string, string> = {
  personal: 'Your name and the centered contact line at the top of the resume.',
  social: 'Links appended to the contact line under your name.',
  education: 'Schools, degrees, and graduation dates.',
  experience: 'Roles, companies, and what you accomplished.',
  projects: 'Notable projects with the technologies you used.',
  skills: 'Grouped technical skills, one line per category.',
  generic: 'A custom section rendered in Jake’s entry style.',
};

/** Middle column: header (title / rename / remove) + the section's form. */
export function SectionEditor({ sectionId }: { sectionId: string | null }) {
  const section = useResumeStore((s) =>
    s.sections.find((x) => x.id === sectionId),
  );
  const renameSection = useResumeStore((s) => s.renameSection);
  const removeSection = useResumeStore((s) => s.removeSection);

  if (!section) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-center text-sm text-slate-400">
        Select a section on the left to start editing.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-5">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {section.removable ? (
              <input
                value={section.title}
                onChange={(e) => renameSection(section.id, e.target.value)}
                className="w-full rounded-md border border-transparent bg-transparent text-xl font-bold text-slate-900 outline-none transition hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:px-2 focus:py-0.5"
                aria-label="Section title"
              />
            ) : (
              <h2 className="text-xl font-bold text-slate-900">
                {section.title}
              </h2>
            )}
            <p className="mt-0.5 text-sm text-slate-500">
              {DESCRIPTIONS[section.type]}
            </p>
          </div>
          {section.removable && (
            <Button
              variant="danger"
              size="sm"
              icon={<TrashIcon width={14} height={14} />}
              onClick={() => {
                if (confirm(`Remove the "${section.title}" section?`)) {
                  removeSection(section.id);
                }
              }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <SectionFormRouter section={section} />
    </div>
  );
}
