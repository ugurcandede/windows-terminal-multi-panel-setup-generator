import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Panel } from '@/types/panel';
import {
  loadUserTemplates,
  saveUserTemplates,
  type UserTemplate,
} from '@/lib/storage/userTemplates';

interface TemplatesState {
  userTemplates: UserTemplate[];
  saveAsTemplate: (name: string, panels: Panel[]) => UserTemplate;
  renameTemplate: (id: string, name: string) => void;
  deleteTemplate: (id: string) => void;
}

const persist = (templates: UserTemplate[]): void => saveUserTemplates(templates);

export const useTemplatesStore = create<TemplatesState>()((set) => ({
  userTemplates: typeof window === 'undefined' ? [] : loadUserTemplates(),

  saveAsTemplate: (name, panels) => {
    const template: UserTemplate = {
      id: nanoid(8),
      name: name.trim() || 'Untitled',
      panels: panels.map((p) => ({ ...p })),
      createdAt: new Date().toISOString(),
    };
    set((s) => {
      const next = [template, ...s.userTemplates];
      persist(next);
      return { userTemplates: next };
    });
    return template;
  },

  renameTemplate: (id, name) =>
    set((s) => {
      const next = s.userTemplates.map((t) =>
        t.id === id ? { ...t, name: name.trim() || t.name } : t
      );
      persist(next);
      return { userTemplates: next };
    }),

  deleteTemplate: (id) =>
    set((s) => {
      const next = s.userTemplates.filter((t) => t.id !== id);
      persist(next);
      return { userTemplates: next };
    }),
}));
