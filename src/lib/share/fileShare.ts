import type { Tab } from '@/types/tab';
import { SCHEMA_VERSION } from '@/lib/storage/keys';
import { sanitizeTabs } from '@/lib/storage/sanitizeTabs';
import { sanitizePanels } from '@/lib/storage/sanitize';

interface ExportFileV3 {
  version: 3;
  generator: 'windows-terminal-multi-panel-setup-generator';
  exportedAt: string;
  tabs: Tab[];
}

export const downloadConfigFile = (tabs: Tab[]): void => {
  const payload: ExportFileV3 = {
    version: SCHEMA_VERSION,
    generator: 'windows-terminal-multi-panel-setup-generator',
    exportedAt: new Date().toISOString(),
    tabs,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wt-setup-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const readConfigFile = async (file: File): Promise<Tab[]> => {
  const text = await file.text();
  const parsed = JSON.parse(text) as { tabs?: unknown; panels?: unknown; version?: number };

  // v3 + tabs
  if (Array.isArray(parsed.tabs)) {
    const tabs = sanitizeTabs(parsed.tabs);
    if (tabs.length === 0) throw new Error('No valid tabs in the imported file');
    return tabs;
  }

  // v2 + panels — migrate forward into a single tab
  if (parsed.panels !== undefined) {
    const panels = sanitizePanels(parsed.panels);
    if (panels.length === 0) throw new Error('No valid panels in the imported file');
    return [{ id: 'imported', name: '', panels }];
  }

  throw new Error('Unrecognized configuration file format');
};
