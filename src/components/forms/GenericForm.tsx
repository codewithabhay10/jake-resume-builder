import type { Section } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { SortableList } from '../common/SortableList';
import { SortableItem } from '../common/SortableItem';
import { EntryCard } from '../common/EntryCard';
import { BulletList } from '../BulletList';
import { Button, Field } from '../common/ui';
import { PlusIcon } from '../icons';

/** Form for every add-on / custom section. Renders generic entries in Jake's
 * style: heading + date, optional subheading + location, then bullets. */
export function GenericForm({
  section,
}: {
  section: Extract<Section, { type: 'generic' }>;
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
                  title={`Entry ${i + 1}`}
                  handleProps={handleProps}
                  onRemove={() => removeEntry(section.id, entry.id)}
                >
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <Field
                      label="Heading"
                      value={entry.heading}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { heading: v })
                      }
                      placeholder="Title / Organization"
                    />
                    <Field
                      label="Date"
                      optional
                      value={entry.date}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { date: v })
                      }
                      placeholder="2021"
                    />
                    <Field
                      label="Subheading"
                      optional
                      value={entry.subheading}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { subheading: v })
                      }
                      placeholder="Issuer / role / detail"
                    />
                    <Field
                      label="Location"
                      optional
                      value={entry.location}
                      onChange={(v) =>
                        updateEntry(section.id, entry.id, { location: v })
                      }
                      placeholder="City, ST"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-600">
                      Bullet Points{' '}
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
        Add entry
      </Button>
    </div>
  );
}
