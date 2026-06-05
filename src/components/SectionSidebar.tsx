import type { Section } from '../types';
import { useResumeStore } from '../store/useResumeStore';
import { isSectionComplete } from '../utils/completion';
import { SortableList } from './common/SortableList';
import { SortableItem } from './common/SortableItem';
import { cn } from '../utils/cn';
import { CheckIcon, GripIcon, PlusIcon } from './icons';

export function SectionSidebar({
  sections,
  selectedId,
  onSelect,
  reorderMode,
  onAddSection,
}: {
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  reorderMode: boolean;
  onAddSection: () => void;
}) {
  const reorderSections = useResumeStore((s) => s.reorderSections);

  const row = (section: Section, index: number, dragHandle?: React.ReactNode) => {
    const complete = isSectionComplete(section);
    const selected = section.id === selectedId;
    return (
      <div
        className={cn(
          'group flex items-center gap-2 rounded-lg border px-2.5 py-2 transition',
          selected
            ? 'border-indigo-300 bg-indigo-50'
            : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
        )}
      >
        {dragHandle}
        <span
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
            complete
              ? 'bg-emerald-500 text-white'
              : 'border border-slate-300 text-slate-400',
          )}
          title={complete ? 'Complete' : 'Incomplete'}
        >
          {complete ? <CheckIcon width={12} height={12} /> : index + 1}
        </span>
        <button
          type="button"
          disabled={reorderMode}
          onClick={() => onSelect(section.id)}
          className={cn(
            'flex-1 truncate text-left text-sm',
            selected ? 'font-semibold text-indigo-700' : 'text-slate-700',
            reorderMode && 'cursor-grab',
          )}
        >
          {section.title}
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">Sections</h2>
        <p className="text-[11px] text-slate-400">
          {reorderMode ? 'Drag to reorder sections' : 'Select a section to edit'}
        </p>
      </div>

      <div className="thin-scroll flex-1 space-y-1 overflow-auto p-2">
        {reorderMode ? (
          <SortableList
            items={sections.map((s) => s.id)}
            onReorder={reorderSections}
          >
            <div className="space-y-1">
              {sections.map((section, i) => (
                <SortableItem key={section.id} id={section.id}>
                  {({ handleProps }) =>
                    row(
                      section,
                      i,
                      <button
                        {...handleProps}
                        type="button"
                        title="Drag to reorder"
                        className="cursor-grab touch-none text-slate-300 hover:text-slate-600 active:cursor-grabbing"
                      >
                        <GripIcon width={16} height={16} />
                      </button>,
                    )
                  }
                </SortableItem>
              ))}
            </div>
          </SortableList>
        ) : (
          sections.map((section, i) => (
            <div key={section.id}>{row(section, i)}</div>
          ))
        )}
      </div>

      <div className="border-t border-slate-200 p-2">
        <button
          type="button"
          onClick={onAddSection}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <PlusIcon width={15} height={15} />
          Add Section
        </button>
      </div>
    </div>
  );
}
