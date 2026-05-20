import { useEffect, useRef, useState } from 'react';
import { useActivePanels, useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils/cn';
import { PROFILE_BADGES } from '@/lib/data/profileBadges';
import { PaneContextMenu } from './PaneContextMenu';

interface Props {
  panelId: string;
}

export function PaneNode({ panelId }: Props) {
  const panels = useActivePanels();
  const panel = panels.find((p) => p.id === panelId);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const updatePanel = useEditorStore((s) => s.updatePanel);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.select();
  }, [editing]);

  if (!panel) return null;

  const isSelected = selectedId === panel.id;
  const title = panel.title.trim() || 'Untitled pane';
  const cmdPreview = panel.commands.split('\n')[0]?.trim() ?? '';

  const startEdit = () => {
    setDraft(panel.title);
    setEditing(true);
  };
  const commit = () => {
    updatePanel(panel.id, { title: draft });
    setEditing(false);
  };

  return (
    <PaneContextMenu panel={panel}>
      <button
        type="button"
        onClick={() => setSelected(panel.id)}
        className={cn(
          'flex h-full w-full flex-col items-start overflow-hidden rounded-sm border-2 bg-zinc-950/70 p-3 text-left text-xs transition-colors',
          isSelected
            ? 'border-[var(--accent)]'
            : 'border-transparent hover:border-zinc-700'
        )}
        style={{ borderTopColor: panel.color, borderTopWidth: isSelected ? 2 : 3 }}
      >
        <div className="mb-2 flex w-full items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: panel.color }}
          />
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commit();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setEditing(false);
                }
              }}
              className="flex-1 min-w-0 bg-transparent text-xs text-zinc-200 outline-none ring-1 ring-[var(--accent)] rounded-sm px-1"
              placeholder="Pane title"
            />
          ) : (
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                startEdit();
              }}
              className="truncate font-medium text-zinc-200"
              title="Double-click to rename"
            >
              {title}
            </span>
          )}
          <span
            className="ml-auto shrink-0 rounded-sm px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-white/90"
            style={{ backgroundColor: PROFILE_BADGES[panel.profile].tint }}
            title={PROFILE_BADGES[panel.profile].label}
          >
            {PROFILE_BADGES[panel.profile].short}
          </span>
        </div>
        {panel.directory && (
          <div className="mb-1 max-w-full truncate font-mono text-[10px] text-zinc-500">
            {panel.directory}
          </div>
        )}
        {cmdPreview && (
          <div className="max-w-full truncate font-mono text-[11px] text-emerald-400">
            $ {cmdPreview}
          </div>
        )}
      </button>
    </PaneContextMenu>
  );
}
