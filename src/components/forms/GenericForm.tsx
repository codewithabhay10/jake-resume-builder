import type { GenericLayout, Section } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { SortableList } from '../common/SortableList';
import { SortableItem } from '../common/SortableItem';
import { EntryCard } from '../common/EntryCard';
import { BulletList } from '../BulletList';
import { Button, Field } from '../common/ui';
import { PlusIcon } from '../icons';

const LAYOUT_OPTIONS: { value: GenericLayout; label: string }[] = [
  { value: 'standard', label: 'Heading + subheading (stacked)' },
  { value: 'inline', label: 'Heading & subheading on one line' },
  { value: 'bullets', label: 'Bullet points only' },
];

/** Form for every add-on / custom section. Renders generic entries in Jake's
 * style: heading + date, optional subheading + location, then bullets.
 * The `layout` selector switches between stacked, inline, and bullets-only. */
export function GenericForm({
  section,
}: {
  section: Extract<Section, { type: 'generic' }>;
}) {
  const addEntry = useResumeStore((s) => s.addEntry);
  const updateEntry = useResumeStore((s) => s.updateEntry);
  const removeEntry = useResumeStore((s) => s.removeEntry);
  const reorderEntries = useResumeStore((s) => s.reorderEntries);
  const setGenericLayout = useResumeStore((s) => s.setGenericLayout);

  const bulletsOnly = section.layout === 'bullets';

  return (
    <div className="space-y-3">
      <label className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-600">Layout</span>
        <select
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          value={section.layout}
          onChange={(e) =>
            setGenericLayout(section.id, e.target.value as GenericLayout)
          }
        >
          {LAYOUT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

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
                  {!bulletsOnly && (
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
                      <Field
                        label="Heading link"
                        optional
                        value={entry.headingUrl}
                        onChange={(v) =>
                          updateEntry(section.id, entry.id, { headingUrl: v })
                        }
                        placeholder="https://… (makes heading clickable)"
                      />
                      <Field
                        label="Subheading link"
                        optional
                        value={entry.subheadingUrl}
                        onChange={(v) =>
                          updateEntry(section.id, entry.id, {
                            subheadingUrl: v,
                          })
                        }
                        placeholder="https://… (makes subheading clickable)"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-medium text-slate-600">
                      Bullet Points
                      {!bulletsOnly && (
                        <span className="font-normal text-slate-400">
                          {' '}
                          (optional)
                        </span>
                      )}
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
