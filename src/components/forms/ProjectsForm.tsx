import type { Section } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { SortableList } from '../common/SortableList';
import { SortableItem } from '../common/SortableItem';
import { EntryCard } from '../common/EntryCard';
import { BulletList } from '../BulletList';
import { Button, Field } from '../common/ui';
import { PlusIcon } from '../icons';

export function ProjectsForm({
  section,
}: {
  section: Extract<Section, { type: 'projects' }>;
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
                  title={`Project ${i + 1}`}
                  handleProps={handleProps}
                  onRemove={() => removeEntry(section.id, entry.id)}
                >
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <Field
                      label="Project Name"
                      value={entry.name}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { name: v })
                      }
                      placeholder="Gitlytics"
                    />
                    <Field
                      label="Date Range"
                      optional
                      value={entry.dateRange}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { dateRange: v })
                      }
                      placeholder="June 2020 - Present"
                    />
                    <div className="sm:col-span-2">
                      <Field
                        label="Technologies"
                        value={entry.technologies}
                        onChange={(v) =>
                          updateEntry(section.id, entry.id, { technologies: v })
                        }
                        placeholder="Python, Flask, React, PostgreSQL, Docker"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Field
                        label="Project link"
                        optional
                        value={entry.url}
                        onChange={(v) =>
                          updateEntry(section.id, entry.id, { url: v })
                        }
                        placeholder="https://github.com/… or live site (makes the name clickable)"
                      />
                    </div>
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
        Add project
      </Button>
    </div>
  );
}
