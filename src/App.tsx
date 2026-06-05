import { useRef, useState } from 'react';
import { useResumeStore } from './store/useResumeStore';
import { computeCompletion } from './utils/completion';
import { TopBar } from './components/TopBar';
import { SectionSidebar } from './components/SectionSidebar';
import { SectionEditor } from './components/SectionEditor';
import { PreviewPane } from './components/PreviewPane';
import { TemplatePickerModal } from './components/TemplatePickerModal';
import { XIcon } from './components/icons';

function App() {
  const sections = useResumeStore((s) => s.sections);
  const clearAll = useResumeStore((s) => s.clearAll);
  const loadSample = useResumeStore((s) => s.loadSample);
  const addTemplateSection = useResumeStore((s) => s.addTemplateSection);
  const addCustomSection = useResumeStore((s) => s.addCustomSection);

  const [selectedId, setSelectedId] = useState<string | null>(
    sections[0]?.id ?? null,
  );
  const [reorderMode, setReorderMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Derive the effective selection so a stale id (after clear / load-sample /
  // remove) transparently falls back to the first section — no effect needed.
  const effectiveSelectedId = sections.some((s) => s.id === selectedId)
    ? selectedId
    : (sections[0]?.id ?? null);

  const stats = computeCompletion(sections);

  const selectLast = () => {
    const secs = useResumeStore.getState().sections;
    setSelectedId(secs[secs.length - 1]?.id ?? null);
  };

  const handleClear = () => {
    if (
      confirm(
        'Clear all data? This permanently removes your saved resume from this browser.',
      )
    ) {
      clearAll();
      setReorderMode(false);
    }
  };

  const handleLoadSample = () => {
    const hasData = stats.completed > 0;
    if (
      !hasData ||
      confirm('Load sample data? This replaces your current resume.')
    ) {
      loadSample();
      setReorderMode(false);
    }
  };

  const handleGenerate = () => {
    setMobilePreview(true);
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        stats={stats}
        reorderMode={reorderMode}
        onToggleReorder={() => setReorderMode((v) => !v)}
        onClear={handleClear}
        onLoadSample={handleLoadSample}
        onGenerate={handleGenerate}
      />

      <div className="flex min-h-0 flex-1">
        {/* Left: section list */}
        <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
          <SectionSidebar
            sections={sections}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedId}
            reorderMode={reorderMode}
            onAddSection={() => setModalOpen(true)}
          />
        </aside>

        {/* Middle: editor */}
        <main className="thin-scroll min-w-0 flex-1 overflow-auto bg-white">
          <SectionEditor sectionId={effectiveSelectedId} />
        </main>

        {/* Right: live preview (desktop) */}
        <section
          ref={previewRef}
          className="hidden w-[44%] min-w-[420px] max-w-[700px] shrink-0 border-l border-slate-200 lg:block"
        >
          <PreviewPane sections={sections} />
        </section>
      </div>

      {/* Mobile/tablet preview overlay */}
      {mobilePreview && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
            <span className="text-sm font-semibold text-slate-800">
              Resume Preview
            </span>
            <button
              type="button"
              onClick={() => setMobilePreview(false)}
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Close preview"
            >
              <XIcon width={18} height={18} />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <PreviewPane sections={sections} />
          </div>
        </div>
      )}

      <TemplatePickerModal
        key={modalOpen ? 'open' : 'closed'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddTemplate={(key) => {
          addTemplateSection(key);
          selectLast();
        }}
        onAddCustom={(title) => {
          addCustomSection(title);
          selectLast();
        }}
      />
    </div>
  );
}

export default App;
