import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { Section } from '../types';
import { generateLatex } from '../latex/generateLatex';
import { computeCompletion } from '../utils/completion';
import { findPersonal } from '../utils/render';
import { ResumeDocument } from './ResumeDocument';
import { Button } from './common/ui';
import { CopyIcon, DownloadIcon, PrintIcon, CheckIcon } from './icons';

const PAGE_W = 8.5 * 96; // 816px at 96dpi
const PAGE_H = 11 * 96; //  1056px at 96dpi

/** Print CSS. `scale` (<= 1) is a shrink-to-fit zoom so the resume never
 * spills a stray line onto a second page when exported to PDF. */
function buildPrintStyle(scale: number): string {
  return `
  @page { size: letter; margin: 0; }
  body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .resume-page { box-shadow: none !important; zoom: ${scale}; }
`;
}

export function PreviewPane({ sections }: { sections: Section[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.75);
  const [docHeight, setDocHeight] = useState(11 * 96);
  const [copied, setCopied] = useState(false);

  // Fit the Letter-width page to the available pane width.
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const measure = () => {
      const avail = vp.clientWidth - 32;
      setScale(Math.min(1, Math.max(0.2, avail / PAGE_W)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  // Track the document's natural height so the scaled wrapper reserves space.
  useEffect(() => {
    const doc = docRef.current;
    if (!doc) return;
    const update = () => setDocHeight(doc.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(doc);
    return () => ro.disconnect();
  });

  // Shrink-to-fit: if the resume is taller than one Letter page, zoom it down
  // just enough (with a small safety margin) so Export PDF stays single-page.
  const printScale = Math.min(1, (PAGE_H - 8) / docHeight);

  const handlePrint = useReactToPrint({
    contentRef: docRef,
    documentTitle: resumeFileName(sections),
    pageStyle: buildPrintStyle(printScale),
  });

  const downloadTex = () => {
    const tex = generateLatex(sections);
    const blob = new Blob([tex], { type: 'application/x-tex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeFileName(sections)}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLatex = async () => {
    try {
      await navigator.clipboard.writeText(generateLatex(sections));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const { total, completed } = computeCompletion(sections);

  return (
    <div className="flex h-full flex-col bg-slate-100">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <div>
          <div className="text-sm font-semibold text-slate-800">Preview</div>
          <div className="text-[11px] text-slate-400">
            Browser View · US Letter · CMU Serif
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            icon={
              copied ? (
                <CheckIcon width={14} height={14} />
              ) : (
                <CopyIcon width={14} height={14} />
              )
            }
            onClick={copyLatex}
          >
            {copied ? 'Copied!' : 'Copy LaTeX'}
          </Button>
          <Button
            size="sm"
            icon={<DownloadIcon width={14} height={14} />}
            onClick={downloadTex}
          >
            Download .tex
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<PrintIcon width={14} height={14} />}
            onClick={() => handlePrint()}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Scaled page */}
      <div
        ref={viewportRef}
        className="thin-scroll flex flex-1 justify-center overflow-auto p-4"
      >
        <div
          style={{ width: PAGE_W * scale, height: docHeight * scale }}
          className="shrink-0"
        >
          <div
            className="preview-scaler"
            style={{ transform: `scale(${scale})`, width: PAGE_W }}
          >
            <ResumeDocument ref={docRef} sections={sections} />
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
        <span>
          Total Sections: <span className="font-semibold text-slate-700">{total}</span>
        </span>
        <span>
          Completed: <span className="font-semibold text-slate-700">{completed}</span>
        </span>
      </div>
    </div>
  );
}

function resumeFileName(sections: Section[]): string {
  const name = findPersonal(sections).fullName.trim();
  const slug = name.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
  return slug ? `${slug}_Resume` : 'Resume';
}
