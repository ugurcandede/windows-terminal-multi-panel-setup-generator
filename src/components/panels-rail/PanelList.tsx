import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useActivePanels, useEditorStore } from '@/store/editorStore';
import { MAX_PANELS } from '@/types/panel';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Plus } from 'lucide-react';
import { PanelListItem } from './PanelListItem';

interface Props {
  onCollapse?: () => void;
}

export function PanelList({ onCollapse }: Props) {
  const panels = useActivePanels();
  const addPanel = useEditorStore((s) => s.addPanel);
  const reorderPanels = useEditorStore((s) => s.reorderPanels);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = panels.findIndex((p) => p.id === active.id);
    const to = panels.findIndex((p) => p.id === over.id);
    if (from === -1 || to === -1) return;
    reorderPanels(from, to);
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Panels ({panels.length}/{MAX_PANELS})
        </h2>
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Collapse panels"
            title="Collapse panels"
            className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={panels.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-1.5">
            {panels.map((panel, index) => (
              <PanelListItem key={panel.id} panel={panel} index={index} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        onClick={() => addPanel()}
        disabled={panels.length >= MAX_PANELS}
        className="mt-2 w-full"
      >
        <Plus className="h-4 w-4" /> Add panel
      </Button>
    </div>
  );
}
