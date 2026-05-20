import type { Tab } from '@/types/tab';
import { LS_KEYS, SCHEMA_VERSION } from './keys';
import { sanitizeTabs } from './sanitizeTabs';
import { sanitizePanels } from './sanitize';

interface StoredConfigV3 {
  version: 3;
  tabs: Tab[];
  savedAt: string;
}

interface StoredConfigV2 {
  version: 2;
  panels: unknown;
  savedAt?: string;
}

export const saveConfig = (tabs: Tab[]): void => {
  try {
    const payload: StoredConfigV3 = {
      version: SCHEMA_VERSION,
      tabs,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(LS_KEYS.config, JSON.stringify(payload));
  } catch (err) {
    console.warn('saveConfig failed', err);
  }
};

export const loadConfig = (): Tab[] | null => {
  try {
    const raw = localStorage.getItem(LS_KEYS.config);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConfigV3 | StoredConfigV2 | null;
    if (!parsed) return null;

    // v3: current shape with tabs
    if (parsed.version === SCHEMA_VERSION && 'tabs' in parsed) {
      const tabs = sanitizeTabs(parsed.tabs);
      return tabs.length > 0 ? tabs : null;
    }

    // v2: panels-only — migrate forward into a single tab
    if (parsed.version === 2 && 'panels' in parsed) {
      const panels = sanitizePanels(parsed.panels);
      if (panels.length === 0) return null;
      return [{ id: 'migrated', name: '', panels }];
    }

    return null;
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
