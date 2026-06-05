import type { Section } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { SortableList } from '../common/SortableList';
import { SortableItem } from '../common/SortableItem';
import { EntryCard } from '../common/EntryCard';
import { BulletList } from '../BulletList';
import { Button, Field } from '../common/ui';
import { PlusIcon } from '../icons';

export function ExperienceForm({
  section,
}: {
  section: Extract<Section, { type: 'experience' }>;
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
                  title={`Experience ${i + 1}`}
                  handleProps={handleProps}
                  onRemove={() => removeEntry(section.id, entry.id)}
                >
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <Field
                      label="Role / Title"
                      value={entry.role}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { role: v })
                      }
                      placeholder="Undergraduate Research Assistant"
                    />
                    <Field
                      label="Date Range"
                      value={entry.dateRange}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { dateRange: v })
                      }
                      placeholder="June 2020 - Present"
                    />
                    <Field
                      label="Company"
                      value={entry.company}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { company: v })
                      }
                      placeholder="Texas A&M University"
                    />
                    <Field
                      label="Location"
                      value={entry.location}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { location: v })
                      }
                      placeholder="College Station, TX"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-600">
                      Bullet Points
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
        Add experience
      </Button>
    </div>
  );
}
