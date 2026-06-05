import type { ReactNode } from 'react';
import type { DragHandleProps } from './SortableItem';
import { IconButton } from './ui';
import { GripIcon, TrashIcon } from '../icons';

/** Card shell for a single repeatable entry: drag handle, label, delete. */
export function EntryCard({
  title,
  handleProps,
  onRemove,
  children,
}: {
  title: string;
  handleProps: DragHandleProps;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-500">
          <button
            {...handleProps}
            type="button"
            title="Drag to reorder"
            className="cursor-grab touch-none rounded p-0.5 text-slate-300 hover:text-slate-600 active:cursor-grabbing"
          >
            <GripIcon width={16} height={16} />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wide">
            {title}
          </span>
        </div>
        <IconButton
          title="Delete entry"
          className="hover:bg-red-50 hover:text-red-600"
          icon={<TrashIcon width={15} height={15} />}
          onClick={onRemove}
        />
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}
