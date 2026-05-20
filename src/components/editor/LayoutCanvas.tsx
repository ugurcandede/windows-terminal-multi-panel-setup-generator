import { Panel as RPanel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Minus, Square, Terminal, X } from 'lucide-react';
import { useActivePanels, useEditorStore } from '@/store/editorStore';
import { useLayoutTree, type LayoutNode } from './useLayoutTree';
import { PaneNode } from './PaneNode';

interface RenderProps {
  node: LayoutNode;
  onResize: (panelId: string, sizeFraction: number) => void;
}

function renderNode({ node, onResize }: RenderProps): JSX.Element {
  if (node.kind === 'leaf') {
    return <PaneNode panelId={node.panelId} />;
  }

  // For split nodes, sizes[1] is the new panel's size — feed it back to the store via panelId.
  return (
    <PanelGroup
      direction={node.direction}
      onLayout={(sizes) => {
        const frac = (sizes[1] ?? 50) / 100;
        onResize(node.panelId, frac);
      }}
      className="h-full w-full"
    >
      <RPanel defaultSize={node.sizes[0] * 100} minSize={10}>
        {renderNode({ node: node.children[0], onResize })}
      </RPanel>
      <PanelResizeHandle
        className={
          node.direction === 'horizontal'
            ? 'group relative w-1 bg-zinc-800 transition-colors hover:bg-[var(--accent)]'
            : 'group relative h-1 bg-zinc-800 transition-colors hover:bg-[var(--accent)]'
        }
      />
      <RPanel defaultSize={node.sizes[1] * 100} minSize={10}>
        {renderNode({ node: node.children[1], onResize })}
      </RPanel>
    </PanelGroup>
  );
}

export function LayoutCanvas() {
  const panels = useActivePanels();
  const resizePane = useEditorStore((s) => s.resizePane);
  const tree = useLayoutTree(panels);

  // PanelGroup uses defaultSize on mount only — re-key on structural changes so
  // that adding/removing/reordering panes resets the layout to the new tree's
  // intended sizes instead of inheriting the previous instance's state.
  const structureKey = panels.map((p) => `${p.id}:${p.split ?? 'root'}`).join('|');

  if (!tree) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        No panels — add one from the left rail.
      </div>
    );
  }

  const tabTitle = panels[0]?.title?.trim() || 'Windows Terminal';

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-stretch rounded-t-md bg-zinc-900 text-xs text-zinc-300 ring-1 ring-zinc-800">
        <div className="flex items-center gap-2 border-b-2 border-[var(--accent)] bg-zinc-800 px-3 py-1.5">
          <Terminal className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-medium">{tabTitle}</span>
        </div>
        <span className="ml-auto self-center px-3 text-[10px] text-zinc-500">
          drag splitters · right-click for actions
        </span>
        <div className="flex items-stretch">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="flex w-10 items-center justify-center text-zinc-400 transition-colors hover:bg-zinc-700"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="flex w-10 items-center justify-center text-zinc-400 transition-colors hover:bg-zinc-700"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="flex w-10 items-center justify-center text-zinc-400 transition-colors hover:bg-[#e81123] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden rounded-b-md bg-zinc-900 p-2 ring-1 ring-zinc-800">
        <div key={structureKey} className="h-full w-full">
          {renderNode({ node: tree, onResize: resizePane })}
        </div>
      </div>
    </div>
  );
}
