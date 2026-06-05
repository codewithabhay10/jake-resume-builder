import type { Section } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { SortableList } from '../common/SortableList';
import { SortableItem } from '../common/SortableItem';
import { Button, Field, IconButton } from '../common/ui';
import { GripIcon, PlusIcon, TrashIcon } from '../icons';

export function SocialForm({
  section,
}: {
  section: Extract<Section, { type: 'social' }>;
}) {
  const addSocialLink = useResumeStore((s) => s.addSocialLink);
  const updateSocialLink = useResumeStore((s) => s.updateSocialLink);
  const removeSocialLink = useResumeStore((s) => s.removeSocialLink);
  const reorderSocialLinks = useResumeStore((s) => s.reorderSocialLinks);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        These merge into the centered contact line beneath your name (LinkedIn,
        GitHub, portfolio, etc.).
      </p>

      {section.links.length === 0 && (
        <p className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-400">
          No links yet.
        </p>
      )}

      <SortableList
        items={section.links.map((l) => l.id)}
        onReorder={reorderSocialLinks}
      >
        <div className="space-y-2">
          {section.links.map((link) => (
            <SortableItem key={link.id} id={link.id}>
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
                  <div className="w-32 shrink-0">
                    <Field
                      label="Label"
                      value={link.label}
                      onChange={(v) => updateSocialLink(link.id, { label: v })}
                      placeholder="LinkedIn"
                    />
                  </div>
                  <div className="flex-1">
                    <Field
                      label="URL"
                      value={link.url}
                      onChange={(v) => updateSocialLink(link.id, { url: v })}
                      placeholder="https://linkedin.com/in/jake"
                    />
                  </div>
                  <IconButton
                    title="Delete link"
                    className="mb-0.5 hover:bg-red-50 hover:text-red-600"
                    icon={<TrashIcon width={15} height={15} />}
                    onClick={() => removeSocialLink(link.id)}
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
        onClick={addSocialLink}
      >
        Add social link
      </Button>
    </div>
  );
}
