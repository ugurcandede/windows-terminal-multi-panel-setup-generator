import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils/cn';

export function StaticPreview() {
  const panels = useEditorStore((s) => s.panels);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelected = useEditorStore((s) => s.setSelected);

  if (panels.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        No panels — add one from the left rail.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center gap-2 rounded-t-md bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-3">Windows Terminal — preview</span>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-1.5 rounded-b-md bg-zinc-900 p-2 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map((p, i) => {
          const title = p.title.trim() || `Panel ${i + 1}`;
          const cmdPreview = p.commands.split('\n')[0]?.trim() ?? '';
          const isSelected = selectedId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={cn(
                'flex min-h-[100px] flex-col items-start rounded border bg-zinc-950/40 p-3 text-left text-xs transition-colors',
                isSelected
                  ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                  : 'border-zinc-800 hover:border-zinc-600'
              )}
            >
              <div className="mb-2 flex w-full items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="truncate font-medium text-zinc-200">{title}</span>
                {i > 0 && (
                  <span className="ml-auto text-[10px] text-zinc-500">
                    {p.split === 'horizontal' ? '-H' : '-V'} · {Math.round(p.size * 100)}%
                  </span>
                )}
              </div>
              {p.directory && (
                <div className="mb-1 truncate font-mono text-[10px] text-zinc-500">
                  {p.directory}
                </div>
              )}
              {cmdPreview && (
                <div className="truncate font-mono text-[11px] text-emerald-400">
                  $ {cmdPreview}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
