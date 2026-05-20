import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import type { Panel } from '@/types/panel';
import { cn } from '@/lib/utils/cn';

interface Props {
  panel: Panel;
  index: number;
}

export function PanelListItem({ panel, index }: Props) {
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const deletePanel = useEditorStore((s) => s.deletePanel);
  const panelsLen = useEditorStore((s) => s.panels.length);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: panel.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedId === panel.id;
  const displayTitle = panel.title.trim() || `Panel ${index + 1}`;

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={() => setSelected(panel.id)}
      className={cn(
        'group flex items-center gap-2 rounded-md border bg-white p-2 text-sm shadow-sm transition-colors',
        'dark:bg-zinc-900',
        isSelected
          ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
          : 'border-zinc-200 dark:border-zinc-800',
        'cursor-pointer'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        aria-label="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span
        className="h-3 w-3 shrink-0 rounded-full ring-1 ring-zinc-300 dark:ring-zinc-700"
        style={{ backgroundColor: panel.color }}
      />

      <span className="flex-1 truncate">{displayTitle}</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deletePanel(panel.id);
        }}
        disabled={panelsLen <= 1}
        className="text-zinc-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
        aria-label="Delete panel"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
