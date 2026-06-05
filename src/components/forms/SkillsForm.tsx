import type { Section } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { SortableList } from '../common/SortableList';
import { SortableItem } from '../common/SortableItem';
import { Button, Field, IconButton } from '../common/ui';
import { GripIcon, PlusIcon, TrashIcon } from '../icons';

export function SkillsForm({
  section,
}: {
  section: Extract<Section, { type: 'skills' }>;
}) {
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);
  const removeSkillCategory = useResumeStore((s) => s.removeSkillCategory);
  const reorderSkillCategories = useResumeStore((s) => s.reorderSkillCategories);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Each category is a bullet-free line, e.g.{' '}
        <span className="font-semibold">Languages</span>: Java, Python, SQL.
      </p>

      <SortableList
        items={section.categories.map((c) => c.id)}
        onReorder={(a, o) => reorderSkillCategories(section.id, a, o)}
      >
        <div className="space-y-2">
          {section.categories.map((cat) => (
            <SortableItem key={cat.id} id={cat.id}>
              {({ handleProps }) => (
                <div className="flex items-end gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 p-2">
                  <button
                    {...handleProps}
                    type="button"
                    title="Drag to reorder"
                    className="mb-1.5 cursor-grab touch-none text-slate-300 hover:text-slate-600 active:cursor-grabbing"
                  >
                    <GripIcon width={16} height={16} />
                  </button>
                  <div className="w-36 shrink-0">
                    <Field
                      label="Category"
                      value={cat.name}
                      onChange={(v) =>
                        updateSkillCategory(section.id, cat.id, { name: v })
                      }
                      placeholder="Languages"
                    />
                  </div>
                  <div className="flex-1">
                    <Field
                      label="Items (comma-separated)"
                      value={cat.items}
                      onChange={(v) =>
                        updateSkillCategory(section.id, cat.id, { items: v })
                      }
                      placeholder="Java, Python, C/C++, SQL, JavaScript"
                    />
                  </div>
                  <IconButton
                    title="Delete category"
                    className="mb-0.5 hover:bg-red-50 hover:text-red-600"
                    icon={<TrashIcon width={15} height={15} />}
                    onClick={() => removeSkillCategory(section.id, cat.id)}
                  />
                </div>
              )}
            </SortableItem>
          ))}
        </div>
      </SortableList>

      <Button
        variant="subtle"
        size="sm"
        icon={<PlusIcon width={14} height={14} />}
        onClick={() => addSkillCategory(section.id)}
      >
        Add category
      </Button>
    </div>
  );
}
