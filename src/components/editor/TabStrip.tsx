import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { MAX_TABS } from '@/types/tab';
import { cn } from '@/lib/utils/cn';

export function TabStrip() {
  const tabs = useEditorStore((s) => s.tabs);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const addTab = useEditorStore((s) => s.addTab);
  const deleteTab = useEditorStore((s) => s.deleteTab);
  const renameTab = useEditorStore((s) => s.renameTab);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = tabs.length >= MAX_TABS;
  const canDelete = tabs.length > 1;

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.select();
    }
  }, [editingId]);

  const commitRename = () => {
    if (editingId) renameTab(editingId, draft);
    setEditingId(null);
  };

  return (
    <div className="flex items-center gap-1 border-b border-zinc-200 bg-zinc-50 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-950/40">
      {tabs.map((tab, i) => {
        const isActive = tab.id === activeTabId;
        const displayName = tab.name.trim() || `Tab ${i + 1}`;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onDoubleClick={() => {
              setEditingId(tab.id);
              setDraft(tab.name);
            }}
            className={cn(
              'group flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs cursor-pointer transition-colors',
              isActive
                ? 'border-[var(--accent)] bg-white shadow-sm dark:bg-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            )}
            title="Double-click to rename"
          >
            {editingId === tab.id ? (
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitRename}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitRename();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setEditingId(null);
                  }
                }}
                className="w-24 bg-transparent text-xs outline-none"
              />
            ) : (
              <span className="select-none">{displayName}</span>
            )}
            <span className="text-[10px] text-zinc-400">{tab.panels.length}</span>
            {canDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTab(tab.id);
                }}
                className="rounded p-0.5 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-200 hover:text-zinc-700 group-hover:opacity-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                aria-label={`Close ${displayName}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={addTab}
        disabled={atMax}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        title={atMax ? `Max ${MAX_TABS} tabs` : 'Add tab'}
      >
        <Plus className="h-3.5 w-3.5" />
        New tab
      </button>
    </div>
  );
}
