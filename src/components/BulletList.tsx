import type { Bullet } from '../types';
import { useResumeStore } from '../store/useResumeStore';
import { BulletEditor } from './BulletEditor';
import { SortableList } from './common/SortableList';
import { SortableItem } from './common/SortableItem';
import { Button, IconButton } from './common/ui';
import { GripIcon, PlusIcon, TrashIcon } from './icons';

/** Reorderable list of rich-text bullets for one experience/project/generic entry. */
export function BulletList({
  sectionId,
  entryId,
  bullets,
}: {
  sectionId: string;
  entryId: string;
  bullets: Bullet[];
}) {
  const addBullet = useResumeStore((s) => s.addBullet);
  const updateBullet = useResumeStore((s) => s.updateBullet);
  const removeBullet = useResumeStore((s) => s.removeBullet);
  const reorderBullets = useResumeStore((s) => s.reorderBullets);

  return (
    <div className="space-y-2">
      <SortableList
        items={bullets.map((b) => b.id)}
        onReorder={(a, o) => reorderBullets(sectionId, entryId, a, o)}
      >
        <div className="space-y-2">
          {bullets.map((bullet) => (
            <SortableItem key={bullet.id} id={bullet.id}>
              {({ handleProps }) => (
                <div className="flex items-start gap-1.5">
                  <button
                    {...handleProps}
                    type="button"
                    title="Drag to reorder"
                    className="mt-7 cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing"
                  >
                    <GripIcon width={16} height={16} />
                  </button>
                  <BulletEditor
                    html={bullet.html}
                    onChange={(html) =>
                      updateBullet(sectionId, entryId, bullet.id, html)
                    }
                  />
                  <IconButton
                    title="Delete bullet"
                    className="mt-7 hover:bg-red-50 hover:text-red-600"
                    icon={<TrashIcon width={15} height={15} />}
                    onClick={() => removeBullet(sectionId, entryId, bullet.id)}
                  />
                </div>
              )}
            </SortableItem>
          ))}
        </div>
      </SortableList>

      <Button
        size="sm"
        variant="subtle"
        icon={<PlusIcon width={14} height={14} />}
        onClick={() => addBullet(sectionId, entryId)}
      >
        Add bullet point
      </Button>
    </div>
  );
}
