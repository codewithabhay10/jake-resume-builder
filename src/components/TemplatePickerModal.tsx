import { useEffect, useMemo, useState } from 'react';
import {
  SECTION_TEMPLATES,
  TEMPLATE_FILTERS,
  type TemplateFilter,
} from '../data/sectionTemplates';
import { Button } from './common/ui';
import { cn } from '../utils/cn';
import { PlusIcon, SearchIcon, XIcon } from './icons';

export function TemplatePickerModal({
  open,
  onClose,
  onAddTemplate,
  onAddCustom,
}: {
  open: boolean;
  onClose: () => void;
  onAddTemplate: (key: string) => void;
  onAddCustom: (title: string) => void;
}) {
  // Transient state starts fresh each time the modal opens because App remounts
  // it via a changing `key`, so no reset effect is needed.
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TemplateFilter>('All');
  const [customTitle, setCustomTitle] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTION_TEMPLATES.filter((t) => {
      const matchesFilter =
        filter === 'All' || t.category === filter.toLowerCase();
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  if (!open) return null;

  const addCustom = () => {
    if (customTitle.trim()) {
      onAddCustom(customTitle.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Choose a Section Template
            </h2>
            <p className="text-xs text-slate-500">
              Add an optional section. You can rename, reorder, and remove it
              later.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        {/* Search + filters */}
        <div className="space-y-3 border-b border-slate-200 px-5 py-3">
          <div className="relative">
            <SearchIcon
              width={16}
              height={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search section templates…"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATE_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition',
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="thin-scroll flex-1 overflow-auto px-5 py-4">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No templates match “{query}”.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {results.map((tpl) => (
                <button
                  key={tpl.key}
                  type="button"
                  onClick={() => {
                    onAddTemplate(tpl.key);
                    onClose();
                  }}
                  className="group flex flex-col items-start rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">
                      {tpl.title}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-500 group-hover:bg-white">
                      {tpl.category}
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-slate-500">
                    {tpl.description}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom section */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
          <label className="text-xs font-semibold text-slate-600">
            Create Custom Section
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="e.g. Leadership, Achievements…"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <Button
              variant="primary"
              icon={<PlusIcon width={15} height={15} />}
              onClick={addCustom}
              disabled={!customTitle.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
