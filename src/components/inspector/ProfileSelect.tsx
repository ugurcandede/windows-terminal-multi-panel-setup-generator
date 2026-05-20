import { Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { PROFILES, type Profile } from '@/types/panel';

interface Props {
  value: Profile;
  onChange: (p: Profile) => void;
  commands?: string;
}

// Tokens that are specific enough to a profile that mixing with another would likely fail.
const POWERSHELL_HINTS = /\b(Get-|Set-|Remove-|Invoke-|Select-Object|Sort-Object|Out-Null|Where-Object|ForEach-Object)\b/;
const UNIX_HINTS = /\b(ls\s|cat\s|grep\s|awk\s|sed\s|tail\s|head\s|chmod\s|chown\s|sudo\s|export\s+[A-Z_]+=)/;

const detectMismatch = (profile: Profile, commands: string): string | null => {
  const c = commands;
  if (!c.trim()) return null;
  if (profile === 'Git Bash' || profile === 'Ubuntu' || profile === 'Command Prompt') {
    if (POWERSHELL_HINTS.test(c)) {
      return `Looks like PowerShell syntax — consider switching profile to PowerShell.`;
    }
  }
  if (profile === 'PowerShell' || profile === 'Command Prompt') {
    if (UNIX_HINTS.test(c)) {
      return `Looks like Unix shell syntax — consider switching profile to Git Bash or Ubuntu.`;
    }
  }
  return null;
};

export function ProfileSelect({ value, onChange, commands = '' }: Props) {
  const mismatch = detectMismatch(value, commands);
  return (
    <div className="flex flex-col gap-1.5">
      <Select value={value} onValueChange={(v) => onChange(v as Profile)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PROFILES.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {mismatch && (
        <p className="flex items-start gap-1.5 text-xs text-blue-600 dark:text-blue-400">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {mismatch}
        </p>
      )}
    </div>
  );
}
