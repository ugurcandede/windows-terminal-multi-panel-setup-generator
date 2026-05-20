import { nanoid } from 'nanoid';
import type { Tab } from '@/types/tab';
import { sanitizePanels } from './sanitize';

export const sanitizeTab = (raw: unknown): Tab | null => {
  const r = (raw ?? {}) as Record<string, unknown>;
  const panels = sanitizePanels((r as { panels?: unknown }).panels);
  if (panels.length === 0) return null;
  return {
    id: typeof r.id === 'string' && r.id.length > 0 ? r.id : nanoid(8),
    name: typeof r.name === 'string' ? r.name : '',
    panels,
  };
};

export const sanitizeTabs = (raw: unknown): Tab[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t) => sanitizeTab(t))
    .filter((t): t is Tab => t !== null)
    .slice(0, 8);
};
