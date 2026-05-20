import type { Panel } from '@/types/panel';
import { SCHEMA_VERSION } from '@/lib/storage/keys';
import { sanitizePanels } from '@/lib/storage/sanitize';

interface ExportFile {
  version: number;
  generator: 'windows-terminal-multi-panel-setup-generator';
  exportedAt: string;
  panels: Panel[];
}

export const downloadConfigFile = (panels: Panel[]): void => {
  const payload: ExportFile = {
    version: SCHEMA_VERSION,
    generator: 'windows-terminal-multi-panel-setup-generator',
    exportedAt: new Date().toISOString(),
    panels,
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

export const readConfigFile = async (file: File): Promise<Panel[]> => {
  const text = await file.text();
  const parsed = JSON.parse(text) as Partial<ExportFile> & { panels?: unknown };
  const panels = sanitizePanels(parsed.panels);
  if (panels.length === 0) {
    throw new Error('No valid panels in the imported file');
  }
  return panels;
};
