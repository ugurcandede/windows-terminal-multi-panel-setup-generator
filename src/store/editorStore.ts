import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { temporal } from 'zundo';
import { useStore } from 'zustand';
import type { TemporalState } from 'zundo';
import type { Panel, Profile, SplitDirection } from '@/types/panel';
import { DEFAULT_COLOR, DEFAULT_SIZE, MAX_PANELS } from '@/types/panel';
import type { Tab } from '@/types/tab';
import { MAX_TABS } from '@/types/tab';

interface EditorState {
  tabs: Tab[];
  activeTabId: string;
  selectedId: string | null;

  // panel actions (operate on the active tab)
  addPanel: (direction?: SplitDirection) => void;
  deletePanel: (id: string) => void;
  duplicatePanel: (id: string) => void;
  updatePanel: (id: string, patch: Partial<Panel>) => void;
  reorderPanels: (fromIndex: number, toIndex: number) => void;
  setSelected: (id: string | null) => void;
  setSplit: (id: string, direction: SplitDirection) => void;
  resizePane: (id: string, size: number) => void;

  // tab actions
  addTab: () => void;
  deleteTab: (id: string) => void;
  renameTab: (id: string, name: string) => void;
  setActiveTab: (id: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;

  // bulk
  loadPanels: (panels: Panel[]) => void;
  loadTabs: (tabs: Tab[]) => void;
  reset: () => void;
}

const makePanel = (isFirst: boolean): Panel => ({
  id: nanoid(8),
  title: '',
  directory: '',
  commands: '',
  color: DEFAULT_COLOR,
  profile: 'PowerShell' as Profile,
  split: isFirst ? null : 'vertical',
  size: isFirst ? 1.0 : DEFAULT_SIZE,
});

const makeTab = (name = ''): Tab => ({
  id: nanoid(8),
  name,
  panels: [makePanel(true)],
});

const normalizeFirstPanel = (panels: Panel[]): Panel[] =>
  panels.map((p, i) =>
    i === 0 ? { ...p, split: null, size: 1.0 } : { ...p, split: p.split ?? 'vertical' }
  );

const updateTab = (tabs: Tab[], id: string, fn: (t: Tab) => Tab): Tab[] =>
  tabs.map((t) => (t.id === id ? fn(t) : t));

const activePanels = (tabs: Tab[], activeTabId: string): Panel[] =>
  tabs.find((t) => t.id === activeTabId)?.panels ?? [];

export const useEditorStore = create<EditorState>()(
  temporal(
    (set, get) => {
      const initialTab = makeTab();
      return {
        tabs: [initialTab],
        activeTabId: initialTab.id,
        selectedId: null,

        addPanel: (direction = 'vertical') =>
          set((s) => {
            const panels = activePanels(s.tabs, s.activeTabId);
            if (panels.length >= MAX_PANELS) return s;
            const next = { ...makePanel(false), split: direction };
            return {
              tabs: updateTab(s.tabs, s.activeTabId, (t) => ({ ...t, panels: [...t.panels, next] })),
              selectedId: next.id,
            };
          }),

        deletePanel: (id) =>
          set((s) => {
            const panels = activePanels(s.tabs, s.activeTabId);
            if (panels.length <= 1) return s;
            const filtered = normalizeFirstPanel(panels.filter((p) => p.id !== id));
            const nextSelected = s.selectedId === id ? filtered[0]?.id ?? null : s.selectedId;
            return {
              tabs: updateTab(s.tabs, s.activeTabId, (t) => ({ ...t, panels: filtered })),
              selectedId: nextSelected,
            };
          }),

        duplicatePanel: (id) =>
          set((s) => {
            const panels = activePanels(s.tabs, s.activeTabId);
            if (panels.length >= MAX_PANELS) return s;
            const source = panels.find((p) => p.id === id);
            if (!source) return s;
            const copy: Panel = {
              ...source,
              id: nanoid(8),
              // duplicate always lands as a split-pane (vertical) after the source
              split: 'vertical',
              size: DEFAULT_SIZE,
            };
            return {
              tabs: updateTab(s.tabs, s.activeTabId, (t) => ({ ...t, panels: [...t.panels, copy] })),
              selectedId: copy.id,
            };
          }),

        updatePanel: (id, patch) =>
          set((s) => ({
            tabs: updateTab(s.tabs, s.activeTabId, (t) => ({
              ...t,
              panels: t.panels.map((p) => (p.id === id ? { ...p, ...patch } : p)),
            })),
          })),

        reorderPanels: (fromIndex, toIndex) =>
          set((s) => {
            if (fromIndex === toIndex) return s;
            return {
              tabs: updateTab(s.tabs, s.activeTabId, (t) => {
                const next = [...t.panels];
                const [moved] = next.splice(fromIndex, 1);
                next.splice(toIndex, 0, moved);
                return { ...t, panels: normalizeFirstPanel(next) };
              }),
            };
          }),

        setSelected: (id) => set({ selectedId: id }),

        setSplit: (id, direction) =>
          set((s) => ({
            tabs: updateTab(s.tabs, s.activeTabId, (t) => ({
              ...t,
              panels: t.panels.map((p, i) =>
                p.id === id && i !== 0 ? { ...p, split: direction } : p
              ),
            })),
          })),

        resizePane: (id, size) =>
          set((s) => ({
            tabs: updateTab(s.tabs, s.activeTabId, (t) => ({
              ...t,
              panels: t.panels.map((p) =>
                p.id === id ? { ...p, size: Math.max(0.1, Math.min(0.9, size)) } : p
              ),
            })),
          })),

        addTab: () =>
          set((s) => {
            if (s.tabs.length >= MAX_TABS) return s;
            const tab = makeTab();
            return { tabs: [...s.tabs, tab], activeTabId: tab.id, selectedId: null };
          }),

        deleteTab: (id) =>
          set((s) => {
            if (s.tabs.length <= 1) return s;
            const idx = s.tabs.findIndex((t) => t.id === id);
            if (idx === -1) return s;
            const next = s.tabs.filter((t) => t.id !== id);
            const newActive =
              s.activeTabId === id ? next[Math.min(idx, next.length - 1)].id : s.activeTabId;
            return { tabs: next, activeTabId: newActive, selectedId: null };
          }),

        renameTab: (id, name) =>
          set((s) => ({
            tabs: updateTab(s.tabs, id, (t) => ({ ...t, name })),
          })),

        setActiveTab: (id) => {
          if (!get().tabs.some((t) => t.id === id)) return;
          set({ activeTabId: id, selectedId: null });
        },

        reorderTabs: (fromIndex, toIndex) =>
          set((s) => {
            if (fromIndex === toIndex) return s;
            const next = [...s.tabs];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return { tabs: next };
          }),

        loadPanels: (panels) =>
          set((s) => {
            if (!panels || panels.length === 0) {
              const t = makeTab();
              return { tabs: [t], activeTabId: t.id, selectedId: null };
            }
            const withIds = panels.map((p) => ({ ...p, id: p.id || nanoid(8) }));
            const sanitized = normalizeFirstPanel(withIds);
            return {
              tabs: updateTab(s.tabs, s.activeTabId, (t) => ({ ...t, panels: sanitized })),
              selectedId: null,
            };
          }),

        loadTabs: (tabs) =>
          set(() => {
            if (!tabs || tabs.length === 0) {
              const t = makeTab();
              return { tabs: [t], activeTabId: t.id, selectedId: null };
            }
            const sanitized = tabs.map((t) => ({
              id: t.id || nanoid(8),
              name: t.name ?? '',
              panels: normalizeFirstPanel(
                t.panels.map((p) => ({ ...p, id: p.id || nanoid(8) }))
              ),
            }));
            return { tabs: sanitized, activeTabId: sanitized[0].id, selectedId: null };
          }),

        reset: () => {
          const t = makeTab();
          set({ tabs: [t], activeTabId: t.id, selectedId: null });
        },
      };
    },
    {
      limit: 50,
      partialize: (state) =>
        ({ tabs: state.tabs, activeTabId: state.activeTabId }) as Partial<EditorState>,
      equality: (a, b) => a.tabs === b.tabs && a.activeTabId === b.activeTabId,
    }
  )
);

// ---------- selectors ----------

export const selectActivePanels = (s: EditorState): Panel[] =>
  s.tabs.find((t) => t.id === s.activeTabId)?.panels ?? [];

export const useActivePanels = (): Panel[] => useEditorStore(selectActivePanels);

export const useActiveTab = (): Tab | undefined =>
  useEditorStore((s) => s.tabs.find((t) => t.id === s.activeTabId));

export const useTemporalEditorStore = <T,>(selector: (s: TemporalState<Partial<EditorState>>) => T) =>
  useStore(useEditorStore.temporal, selector);
