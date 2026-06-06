import type { Section } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { SortableList } from '../common/SortableList';
import { SortableItem } from '../common/SortableItem';
import { EntryCard } from '../common/EntryCard';
import { BulletList } from '../BulletList';
import { Button, Field } from '../common/ui';
import { PlusIcon } from '../icons';

export function EducationForm({
  section,
}: {
  section: Extract<Section, { type: 'education' }>;
}) {
  const addEntry = useResumeStore((s) => s.addEntry);
  const updateEntry = useResumeStore((s) => s.updateEntry);
  const removeEntry = useResumeStore((s) => s.removeEntry);
  const reorderEntries = useResumeStore((s) => s.reorderEntries);

  return (
    <div className="space-y-3">
      <SortableList
        items={section.entries.map((e) => e.id)}
        onReorder={(a, o) => reorderEntries(section.id, a, o)}
      >
        <div className="space-y-3">
          {section.entries.map((entry, i) => (
            <SortableItem key={entry.id} id={entry.id}>
              {({ handleProps }) => (
                <EntryCard
                  title={`Education ${i + 1}`}
                  handleProps={handleProps}
                  onRemove={() => removeEntry(section.id, entry.id)}
                >
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <Field
                      label="Institution"
                      value={entry.institution}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { institution: v })
                      }
                      placeholder="Southwestern University"
                    />
                    <Field
                      label="Location"
                      value={entry.location}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { location: v })
                      }
                      placeholder="Georgetown, TX"
                    />
                    <Field
                      label="Degree"
                      value={entry.degree}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { degree: v })
                      }
                      placeholder="Bachelor of Arts in Computer Science"
                    />
                    <Field
                      label="Date Range"
                      value={entry.dateRange}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { dateRange: v })
                      }
                      placeholder="Aug. 2018 - May 2021"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-600">
                      Grades / Achievements{' '}
                      <span className="font-normal text-slate-400">
                        (optional)
                      </span>
                    </span>
                    <div className="mt-1.5">
                      <BulletList
                        sectionId={section.id}
                        entryId={entry.id}
                        bullets={entry.bullets}
                      />
                    </div>
                  </div>
                </EntryCard>
              )}
            </SortableItem>
          ))}
        </div>
      </SortableList>

      <Button
        variant="subtle"
        icon={<PlusIcon width={15} height={15} />}
        onClick={() => addEntry(section.id)}
      >
        Add education
      </Button>
    </div>
  );
}
