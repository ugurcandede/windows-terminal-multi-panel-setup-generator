import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { temporal } from 'zundo';
import { useStore } from 'zustand';
import type { TemporalState } from 'zundo';
import type { Panel, Profile, SplitDirection } from '@/types/panel';
import { DEFAULT_COLOR, DEFAULT_SIZE, MAX_PANELS } from '@/types/panel';

interface EditorState {
  panels: Panel[];
  selectedId: string | null;
  addPanel: () => void;
  deletePanel: (id: string) => void;
  updatePanel: (id: string, patch: Partial<Panel>) => void;
  reorderPanels: (fromIndex: number, toIndex: number) => void;
  setSelected: (id: string | null) => void;
  setSplit: (id: string, direction: SplitDirection) => void;
  resizePane: (id: string, size: number) => void;
  loadPanels: (panels: Panel[]) => void;
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

const normalizeFirstPanel = (panels: Panel[]): Panel[] =>
  panels.map((p, i) =>
    i === 0 ? { ...p, split: null, size: 1.0 } : { ...p, split: p.split ?? 'vertical' }
  );

export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      panels: [makePanel(true)],
      selectedId: null,

      addPanel: () =>
        set((s) => {
          if (s.panels.length >= MAX_PANELS) return s;
          const next = makePanel(false);
          return { panels: [...s.panels, next], selectedId: next.id };
        }),

      deletePanel: (id) =>
        set((s) => {
          if (s.panels.length <= 1) return s;
          const filtered = s.panels.filter((p) => p.id !== id);
          const normalized = normalizeFirstPanel(filtered);
          const nextSelected = s.selectedId === id ? normalized[0]?.id ?? null : s.selectedId;
          return { panels: normalized, selectedId: nextSelected };
        }),

      updatePanel: (id, patch) =>
        set((s) => ({
          panels: s.panels.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      reorderPanels: (fromIndex, toIndex) =>
        set((s) => {
          if (fromIndex === toIndex) return s;
          const next = [...s.panels];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return { panels: normalizeFirstPanel(next) };
        }),

      setSelected: (id) => set({ selectedId: id }),

      setSplit: (id, direction) =>
        set((s) => ({
          panels: s.panels.map((p) =>
            p.id === id && p !== s.panels[0] ? { ...p, split: direction } : p
          ),
        })),

      resizePane: (id, size) =>
        set((s) => ({
          panels: s.panels.map((p) =>
            p.id === id ? { ...p, size: Math.max(0.1, Math.min(0.9, size)) } : p
          ),
        })),

      loadPanels: (panels) =>
        set(() => {
          if (!panels || panels.length === 0) {
            return { panels: [makePanel(true)], selectedId: null };
          }
          const withIds = panels.map((p) => ({ ...p, id: p.id || nanoid(8) }));
          return { panels: normalizeFirstPanel(withIds), selectedId: null };
        }),

      reset: () => set({ panels: [makePanel(true)], selectedId: null }),
    }),
    {
      limit: 50,
      partialize: (state) => ({ panels: state.panels }) as Partial<EditorState>,
      equality: (a, b) => a.panels === b.panels,
    }
  )
);

export const useTemporalEditorStore = <T,>(selector: (s: TemporalState<Partial<EditorState>>) => T) =>
  useStore(useEditorStore.temporal, selector);
