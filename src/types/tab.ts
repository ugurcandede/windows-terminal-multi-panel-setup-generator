import type { Panel } from './panel';

export interface Tab {
  id: string;
  name: string;
  panels: Panel[];
}

export const MAX_TABS = 5;
