import { useState } from 'react';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { PanelList } from '@/components/panels-rail/PanelList';
import { LayoutCanvas } from '@/components/editor/LayoutCanvas';
import { InspectorPanel } from '@/components/inspector/InspectorPanel';
import { OutputTabs } from '@/components/output/OutputTabs';
import { ShortcutsDialog } from '@/components/modals/ShortcutsDialog';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useEditorStore } from '@/store/editorStore';

export function AppShell() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const addPanel = useEditorStore((s) => s.addPanel);

  useKeyboardShortcuts({
    onShowShortcuts: () => setShowShortcuts(true),
    onAddPanel: addPanel,
  });

  return (
    <div className="flex h-full flex-col">
      <TopBar onShowShortcuts={() => setShowShortcuts(true)} />
      <div className="grid flex-1 grid-cols-[260px_1fr_320px] overflow-hidden">
        <aside className="border-r border-zinc-200 dark:border-zinc-800">
          <PanelList />
        </aside>
        <main className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <LayoutCanvas />
          </div>
          <div className="h-[280px] overflow-hidden">
            <OutputTabs />
          </div>
        </main>
        <aside className="border-l border-zinc-200 dark:border-zinc-800">
          <InspectorPanel />
        </aside>
      </div>
      <Footer />
      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </div>
  );
}
