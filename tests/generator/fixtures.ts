import type { Panel } from '@/types/panel';

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
