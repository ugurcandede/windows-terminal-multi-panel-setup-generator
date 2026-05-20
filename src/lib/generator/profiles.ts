import type { Profile } from '@/types/panel';

export const PROFILE_MAP: Record<Profile, string> = {
  PowerShell: 'pwsh',
  'Command Prompt': 'cmd',
  'Git Bash': 'bash',
  WSL: 'wsl -d Ubuntu',
};

export const getProfileCommand = (profile: Profile): string =>
  PROFILE_MAP[profile] ?? 'pwsh';
