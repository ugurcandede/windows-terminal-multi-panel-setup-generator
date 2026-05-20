import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils/cn';
import { PROFILE_BADGES } from '@/lib/data/profileBadges';
import { PaneContextMenu } from './PaneContextMenu';

interface Props {
  panelId: string;
}

export function PaneNode({ panelId }: Props) {
  const panel = useEditorStore((s) => s.panels.find((p) => p.id === panelId));
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelected = useEditorStore((s) => s.setSelected);

  if (!panel) return null;

  const isSelected = selectedId === panel.id;
  const title = panel.title.trim() || 'Untitled pane';
  const cmdPreview = panel.commands.split('\n')[0]?.trim() ?? '';

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
          <span className="truncate font-medium text-zinc-200">{title}</span>
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
