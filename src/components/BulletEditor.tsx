import { useCallback, useEffect, useRef } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  LinkIcon,
  EraserIcon,
} from './icons';

type ToolAction = 'bold' | 'italic' | 'underline' | 'link' | 'clear';

const TOOLS: {
  action: ToolAction;
  title: string;
  Icon: typeof BoldIcon;
}[] = [
  { action: 'bold', title: 'Bold (Ctrl+B)', Icon: BoldIcon },
  { action: 'italic', title: 'Italic (Ctrl+I)', Icon: ItalicIcon },
  { action: 'underline', title: 'Underline (Ctrl+U)', Icon: UnderlineIcon },
  { action: 'link', title: 'Link (Ctrl+K)', Icon: LinkIcon },
  { action: 'clear', title: 'Clear formatting', Icon: EraserIcon },
];

/**
 * A single rich-text bullet built on a contenteditable div + document.execCommand.
 * Supports Bold (Ctrl+B), Italic (Ctrl+I), Underline (Ctrl+U), Link (Ctrl+K),
 * and clear-formatting. Stores raw inline HTML; it's sanitized at the
 * preview / LaTeX boundary.
 */
export function BulletEditor({
  html,
  onChange,
  placeholder = 'Describe an accomplishment…',
}: {
  html: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync external changes (load sample / clear) without disturbing the caret.
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerHTML !== html) {
      el.innerHTML = html;
    }
  }, [html]);

  // Set initial content on mount.
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers are wrapped so the contenteditable ref is only read when invoked
  // from an event — never during render.
  const emit = useCallback(
    () => onChange(ref.current?.innerHTML ?? ''),
    [onChange],
  );

  const exec = useCallback(
    (command: string, value?: string) => {
      ref.current?.focus();
      document.execCommand(command, false, value);
      emit();
    },
    [emit],
  );

  const addLink = useCallback(() => {
    const selected = window.getSelection()?.toString() ?? '';
    const url = window.prompt('Link URL:', 'https://');
    if (!url) return;
    if (selected) {
      exec('createLink', url);
    } else {
      // No selection: insert the URL as its own linked text.
      exec('insertHTML', `<a href="${url}">${url}</a>`);
    }
  }, [exec]);

  const clearFormatting = useCallback(() => {
    ref.current?.focus();
    document.execCommand('removeFormat', false);
    document.execCommand('unlink', false);
    emit();
  }, [emit]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        addLink();
      }
    },
    [addLink],
  );

  const runTool = useCallback(
    (action: ToolAction) => {
      if (action === 'link') addLink();
      else if (action === 'clear') clearFormatting();
      else exec(action);
    },
    [addLink, clearFormatting, exec],
  );

  return (
    <div className="group/bullet flex-1">
      <div className="mb-1 flex items-center gap-0.5 opacity-60 transition group-focus-within/bullet:opacity-100">
        {TOOLS.map((t) => (
          <button
            key={t.action}
            type="button"
            title={t.title}
            // preventDefault keeps the selection inside the editor on click
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runTool(t.action)}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-800"
          >
            <t.Icon width={14} height={14} />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={emit}
        onKeyDown={onKeyDown}
        className="min-h-[34px] w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm leading-snug text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 [&_a]:text-indigo-600 [&_a]:underline"
      />
    </div>
  );
}
