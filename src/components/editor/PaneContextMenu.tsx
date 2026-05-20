import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/ContextMenu';
import { useActivePanels, useEditorStore } from '@/store/editorStore';
import { MAX_PANELS, type SplitDirection } from '@/types/panel';
import type { Panel } from '@/types/panel';
import type { ReactNode } from 'react';

interface Props {
  panel: Panel;
  children: ReactNode;
}

export function PaneContextMenu({ panel, children }: Props) {
  const panels = useActivePanels();
  const addPanel = useEditorStore((s) => s.addPanel);
  const deletePanel = useEditorStore((s) => s.deletePanel);

  const atMax = panels.length >= MAX_PANELS;
  const isOnlyPanel = panels.length <= 1;

  const splitFrom = (direction: SplitDirection) => {
    if (atMax) return;
    addPanel(direction);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem disabled={atMax} onSelect={() => splitFrom('vertical')}>
          Split vertical (-V)
        </ContextMenuItem>
        <ContextMenuItem disabled={atMax} onSelect={() => splitFrom('horizontal')}>
          Split horizontal (-H)
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          disabled={isOnlyPanel}
          onSelect={() => deletePanel(panel.id)}
          className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          Delete pane
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
