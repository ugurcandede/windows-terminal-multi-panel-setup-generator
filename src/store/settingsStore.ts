import { create } from 'zustand';
import type { AccentKey } from '@/lib/data/accents';
import type { Profile } from '@/types/panel';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings, type Theme } from '@/lib/storage/settings';

interface SettingsState extends AppSettings {
  setTheme: (theme: Theme) => void;
  setAccent: (accent: AccentKey) => void;
  setDefaultProfile: (p: Profile) => void;
  setDefaultDirectory: (d: string) => void;
  setAutoSave: (enabled: boolean) => void;
  toggleRail: () => void;
  toggleOutput: () => void;
  toggleInspector: () => void;
}

const initial = (): AppSettings =>
  typeof window === 'undefined' ? DEFAULT_SETTINGS : loadSettings();

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  ...initial(),

  setTheme: (theme) => {
    set({ theme });
    saveSettings({ ...get(), theme });
  },
  setAccent: (accent) => {
    set({ accent });
    saveSettings({ ...get(), accent });
  },
  setDefaultProfile: (defaultProfile) => {
    set({ defaultProfile });
    saveSettings({ ...get(), defaultProfile });
  },
  setDefaultDirectory: (defaultDirectory) => {
    set({ defaultDirectory });
    saveSettings({ ...get(), defaultDirectory });
  },
  setAutoSave: (autoSave) => {
    set({ autoSave });
    saveSettings({ ...get(), autoSave });
  },
  toggleRail: () => {
    const next = !get().railCollapsed;
    set({ railCollapsed: next });
    saveSettings({ ...get(), railCollapsed: next });
  },
  toggleOutput: () => {
    const next = !get().outputCollapsed;
    set({ outputCollapsed: next });
    saveSettings({ ...get(), outputCollapsed: next });
  },
  toggleInspector: () => {
    const next = !get().inspectorCollapsed;
    set({ inspectorCollapsed: next });
    saveSettings({ ...get(), inspectorCollapsed: next });
  },
}));
