import type { AccentKey } from '@/lib/data/accents';
import type { Profile } from '@/types/panel';
import { LS_KEYS, SCHEMA_VERSION } from './keys';

export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: Theme;
  accent: AccentKey;
  defaultProfile: Profile;
  defaultDirectory: string;
  autoSave: boolean;
  railCollapsed: boolean;
  outputCollapsed: boolean;
  inspectorCollapsed: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  accent: 'blue',
  defaultProfile: 'PowerShell',
  defaultDirectory: 'C:\\',
  autoSave: true,
  railCollapsed: false,
  outputCollapsed: false,
  inspectorCollapsed: false,
};

interface StoredSettings {
  version: number;
  settings: AppSettings;
}

export const saveSettings = (settings: AppSettings): void => {
  try {
    const payload: StoredSettings = { version: SCHEMA_VERSION, settings };
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(payload));
  } catch (err) {
    console.warn('saveSettings failed', err);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(LS_KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as StoredSettings | null;
    if (!parsed || parsed.version !== SCHEMA_VERSION) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...parsed.settings };
  } catch {
    return DEFAULT_SETTINGS;
  }
};
