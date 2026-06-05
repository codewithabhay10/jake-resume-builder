import type { CompletionStats } from '../utils/completion';
import { Button } from './common/ui';
import { cn } from '../utils/cn';
import { MoveIcon, ResetIcon, SparklesIcon, PrintIcon } from './icons';

export function TopBar({
  stats,
  reorderMode,
  onToggleReorder,
  onClear,
  onLoadSample,
  onGenerate,
}: {
  stats: CompletionStats;
  reorderMode: boolean;
  onToggleReorder: () => void;
  onClear: () => void;
  onLoadSample: () => void;
  onGenerate: () => void;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            J
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-900">Resume Builder</div>
            <div className="text-[11px] text-slate-400">Jake’s Resume template</div>
          </div>
        </div>

        {/* Completion meter */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                stats.percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500',
              )}
              style={{ width: `${stats.percent}%` }}
            />
          </div>
          <span className="text-xs font-medium tabular-nums text-slate-600">
            {stats.completed}/{stats.total} ({stats.percent}%)
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          size="sm"
          icon={<SparklesIcon width={14} height={14} />}
          onClick={onLoadSample}
        >
          Load Sample Data
        </Button>
        <Button
          size="sm"
          variant="danger"
          icon={<ResetIcon width={14} height={14} />}
          onClick={onClear}
        >
          Clear Data
        </Button>
        <Button
          size="sm"
          variant={reorderMode ? 'primary' : 'default'}
          icon={<MoveIcon width={14} height={14} />}
          onClick={onToggleReorder}
        >
          {reorderMode ? 'Done Reordering' : 'Reorder Section'}
        </Button>
        <Button
          size="sm"
          variant="primary"
          icon={<PrintIcon width={14} height={14} />}
          onClick={onGenerate}
        >
          Generate Resume
        </Button>
      </div>
    </header>
  );
}
