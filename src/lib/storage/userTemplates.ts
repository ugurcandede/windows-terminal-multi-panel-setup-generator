import { nanoid } from 'nanoid';
import type { Panel } from '@/types/panel';
import { LS_KEYS, SCHEMA_VERSION } from './keys';
import { sanitizePanels } from './sanitize';

export interface UserTemplate {
  id: string;
  name: string;
  panels: Panel[];
  createdAt: string;
}

interface StoredTemplates {
  version: number;
  templates: UserTemplate[];
}

const MAX_USER_TEMPLATES = 30;

export const loadUserTemplates = (): UserTemplate[] => {
  try {
    const raw = localStorage.getItem(LS_KEYS.templates);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredTemplates | null;
    if (!parsed || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.templates)) {
      return [];
    }
    return parsed.templates
      .map((t) => ({
        id: typeof t.id === 'string' && t.id ? t.id : nanoid(8),
        name: typeof t.name === 'string' ? t.name : 'Untitled',
        panels: sanitizePanels(t.panels),
        createdAt: typeof t.createdAt === 'string' ? t.createdAt : new Date().toISOString(),
      }))
      .filter((t) => t.panels.length > 0);
  } catch {
    return [];
  }
};

export const saveUserTemplates = (templates: UserTemplate[]): void => {
  try {
    const payload: StoredTemplates = {
      version: SCHEMA_VERSION,
      templates: templates.slice(0, MAX_USER_TEMPLATES),
    };
    localStorage.setItem(LS_KEYS.templates, JSON.stringify(payload));
  } catch (err) {
    console.warn('saveUserTemplates failed', err);
  }
};
