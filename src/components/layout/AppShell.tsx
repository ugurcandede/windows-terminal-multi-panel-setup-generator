import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { PanelList } from '@/components/panels-rail/PanelList';
import { LayoutCanvas } from '@/components/editor/LayoutCanvas';
import { TabStrip } from '@/components/editor/TabStrip';
import { InspectorPanel } from '@/components/inspector/InspectorPanel';
import { OutputTabs } from '@/components/output/OutputTabs';
import { ShortcutsDialog } from '@/components/modals/ShortcutsDialog';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useEditorStore } from '@/store/editorStore';
import { useSettingsStore } from '@/store/settingsStore';

const RAIL_W_OPEN = 260;
const RAIL_W_CLOSED = 32;
const INSPECTOR_W_OPEN = 320;
const INSPECTOR_W_CLOSED = 32;
const OUTPUT_H_OPEN = 280;
const OUTPUT_H_CLOSED = 36;

export function AppShell() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const addPanel = useEditorStore((s) => s.addPanel);

  const railCollapsed = useSettingsStore((s) => s.railCollapsed);
  const outputCollapsed = useSettingsStore((s) => s.outputCollapsed);
  const inspectorCollapsed = useSettingsStore((s) => s.inspectorCollapsed);
  const toggleRail = useSettingsStore((s) => s.toggleRail);
  const toggleOutput = useSettingsStore((s) => s.toggleOutput);
  const toggleInspector = useSettingsStore((s) => s.toggleInspector);

  useKeyboardShortcuts({
    onShowShortcuts: () => setShowShortcuts(true),
    onAddPanel: () => addPanel(),
  });

  const railWidth = railCollapsed ? RAIL_W_CLOSED : RAIL_W_OPEN;
  const inspectorWidth = inspectorCollapsed ? INSPECTOR_W_CLOSED : INSPECTOR_W_OPEN;
  const outputHeight = outputCollapsed ? OUTPUT_H_CLOSED : OUTPUT_H_OPEN;

  return (
    <div className="flex h-full flex-col">
      <TopBar onShowShortcuts={() => setShowShortcuts(true)} />
      <div
        className="grid flex-1 overflow-hidden transition-[grid-template-columns] duration-200 ease-out"
        style={{
          gridTemplateColumns: `${railWidth}px 1fr ${inspectorWidth}px`,
        }}
      >
        <aside className="border-r border-zinc-200 dark:border-zinc-800">
          {railCollapsed ? (
            <CollapsedStub side="left" onToggle={toggleRail} label="Panels" />
          ) : (
            <PanelList onCollapse={toggleRail} />
          )}
        </aside>

        <main className="flex flex-col overflow-hidden">
          <TabStrip />
          <div className="flex-1 overflow-hidden">
            <LayoutCanvas />
          </div>
          <div
            className="border-t border-zinc-200 transition-[height] duration-200 ease-out dark:border-zinc-800"
            style={{ height: outputHeight }}
          >
            <CollapseBar
              collapsed={outputCollapsed}
              onToggle={toggleOutput}
              label="Generated output"
            />
            {!outputCollapsed && (
              <div className="h-[calc(100%-32px)]">
                <OutputTabs />
              </div>
            )}
          </div>
        </main>

        <aside className="border-l border-zinc-200 dark:border-zinc-800">
          {inspectorCollapsed ? (
            <CollapsedStub side="right" onToggle={toggleInspector} label="Inspector" />
          ) : (
            <InspectorPanel onCollapse={toggleInspector} />
          )}
        </aside>
      </div>
      <Footer />
      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </div>
  );
}

interface CollapsedStubProps {
  side: 'left' | 'right';
  onToggle: () => void;
  label: string;
}

function CollapsedStub({ side, onToggle, label }: CollapsedStubProps) {
  // When the side panel is collapsed, expose just a single chevron in the
  // narrow strip — pointing back towards the content so the user knows the
  // panel will fly out from this edge.
  const Chevron = side === 'left' ? ChevronRight : ChevronLeft;
  return (
    <div className="flex h-full justify-center pt-2">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Expand ${label}`}
        title={`Expand ${label}`}
        className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        <Chevron className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface CollapseBarProps {
  collapsed: boolean;
  onToggle: () => void;
  label: string;
}

function CollapseBar({ collapsed, onToggle, label }: CollapseBarProps) {
  const Chevron = collapsed ? ChevronUp : ChevronDown;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
      className="flex h-8 w-full items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:bg-zinc-800"
    >
      <Chevron className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
