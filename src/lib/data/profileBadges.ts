import type { Profile } from '@/types/panel';

export interface ProfileBadge {
  label: string;
  short: string;
  tint: string;
}

export const PROFILE_BADGES: Record<Profile, ProfileBadge> = {
  PowerShell:       { label: 'pwsh',        short: 'PS',  tint: '#012456' },
  'Command Prompt': { label: 'cmd',         short: 'CMD', tint: '#0c2c52' },
  'Git Bash':       { label: 'bash',        short: 'sh',  tint: '#5e2750' },
  WSL:              { label: 'wsl',         short: 'WSL', tint: '#e95420' },
};
