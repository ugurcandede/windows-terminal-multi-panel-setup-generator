import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/ContextMenu';
import { useEditorStore } from '@/store/editorStore';
import { MAX_PANELS, DEFAULT_SIZE, type SplitDirection } from '@/types/panel';
import { nanoid } from 'nanoid';
import type { Panel } from '@/types/panel';
import type { ReactNode } from 'react';

interface Props {
  panel: Panel;
  children: ReactNode;
}

export function PaneContextMenu({ panel, children }: Props) {
  const panels = useEditorStore((s) => s.panels);
  const deletePanel = useEditorStore((s) => s.deletePanel);

  const atMax = panels.length >= MAX_PANELS;
  const isOnlyPanel = panels.length <= 1;

  const splitFrom = (direction: SplitDirection) => {
    // Always append a new pane to the end of the array — buildLayoutTree treats
    // each newly added panel as a split off the current last leaf. This matches
    // the wt semantics: splits operate on the currently active pane.
    if (atMax) return;
    useEditorStore.setState((s) => {
      const newPanel: Panel = {
        id: nanoid(8),
        title: '',
        directory: '',
        commands: '',
        color: '#64748b',
        profile: 'PowerShell',
        split: direction,
        size: DEFAULT_SIZE,
      };
      return { panels: [...s.panels, newPanel], selectedId: newPanel.id };
    });
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
