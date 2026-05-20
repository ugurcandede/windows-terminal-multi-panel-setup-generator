export type SplitDirection = 'vertical' | 'horizontal';

export const PROFILES = ['PowerShell', 'Command Prompt', 'Git Bash', 'WSL'] as const;
export type Profile = (typeof PROFILES)[number];

export interface Panel {
  id: string;
  title: string;
  directory: string;
  commands: string;
  color: string;
  profile: Profile;
  split: SplitDirection | null;
  size: number;
}

export const MAX_PANELS = 5;
export const DEFAULT_COLOR = '#64748b';
export const DEFAULT_SIZE = 0.5;
