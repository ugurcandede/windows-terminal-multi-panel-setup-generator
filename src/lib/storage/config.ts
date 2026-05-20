import type { Panel } from '@/types/panel';
import { LS_KEYS, SCHEMA_VERSION } from './keys';
import { sanitizePanels } from './sanitize';

interface StoredConfig {
  version: number;
  panels: Panel[];
  savedAt: string;
}

export const saveConfig = (panels: Panel[]): void => {
  try {
    const payload: StoredConfig = {
      version: SCHEMA_VERSION,
      panels,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(LS_KEYS.config, JSON.stringify(payload));
  } catch (err) {
    console.warn('saveConfig failed', err);
  }
};

export const loadConfig = (): Panel[] | null => {
  try {
    const raw = localStorage.getItem(LS_KEYS.config);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConfig | null;
    if (!parsed || parsed.version !== SCHEMA_VERSION) return null;
    const panels = sanitizePanels(parsed.panels);
    return panels.length > 0 ? panels : null;
  } catch (err) {
    console.warn('loadConfig failed', err);
    return null;
  }
};

export const clearConfig = (): void => {
  try {
    localStorage.removeItem(LS_KEYS.config);
  } catch {
    /* ignore */
  }
};
