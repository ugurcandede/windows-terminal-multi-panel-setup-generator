import { TopBar } from './TopBar';
import { PanelList } from '@/components/panels-rail/PanelList';
import { StaticPreview } from '@/components/editor/StaticPreview';
import { InspectorPanel } from '@/components/inspector/InspectorPanel';
import { OutputTabs } from '@/components/output/OutputTabs';

export function AppShell() {
  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <div className="grid flex-1 grid-cols-[260px_1fr_320px] overflow-hidden">
        <aside className="border-r border-zinc-200 dark:border-zinc-800">
          <PanelList />
        </aside>
        <main className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <StaticPreview />
          </div>
          <div className="h-[280px] overflow-hidden">
            <OutputTabs />
          </div>
        </main>
        <aside className="border-l border-zinc-200 dark:border-zinc-800">
          <InspectorPanel />
        </aside>
      </div>
    </div>
  );
}
