import type { Panel } from '@/types/panel';
import type { Tab } from '@/types/tab';

export const makePanel = (overrides: Partial<Panel> = {}): Panel => ({
  id: 'p1',
  title: 'Frontend',
  directory: 'C:\\Projects\\frontend',
  commands: 'npm run dev',
  color: '#4ecdc4',
  profile: 'PowerShell',
  split: null,
  size: 1.0,
  ...overrides,
});

export const minimalFirst = (overrides: Partial<Panel> = {}): Panel => ({
  id: 'p1',
  title: '',
  directory: '',
  commands: '',
  color: '#64748b',
  profile: 'PowerShell',
  split: null,
  size: 1.0,
  ...overrides,
});

export const tab = (panels: Panel[], name = ''): Tab => ({
  id: 't1',
  name,
  panels,
});

/** Convenience: wraps panels in a single default tab. Most generator tests
 *  only care about the panel layer, so they call this. */
export const singleTab = (panels: Panel[]): Tab[] => [tab(panels)];
