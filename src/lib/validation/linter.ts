import type { Issue } from './types';

interface Pattern {
  regex: RegExp;
  message: string;
}

export const DANGEROUS_PATTERNS: readonly Pattern[] = [
  { regex: /\brm\s+-rf\s+\/(?!\w)/i,                         message: 'Recursive delete from filesystem root' },
  { regex: /Remove-Item[^\n]*-Recurse[^\n]*-Force/i,         message: 'PowerShell recursive force delete' },
  { regex: /\bformat\s+[a-z]:/i,                             message: 'Disk format command' },
  { regex: /\bdel\s+\/[sqf]/i,                               message: 'Force delete (cmd)' },
  { regex: /\bshutdown\s+\/[sr]\b/i,                         message: 'System shutdown or restart' },
  { regex: /:\(\)\s*\{[^}]*\|\s*:\s*[&;]/,                   message: 'Fork bomb pattern' },
  { regex: /\bcurl\b[^\n|]*\|\s*(bash|sh|pwsh|powershell)/i, message: 'Piping network content into a shell' },
  { regex: /Invoke-Expression[^\n]*Invoke-WebRequest/i,      message: 'Executing remote content via IEX' },
  { regex: /\biwr\b[^\n]*\|\s*iex\b/i,                       message: 'IEX of Invoke-WebRequest content' },
];

export const lintCommands = (commands: string): Issue[] =>
  DANGEROUS_PATTERNS.filter((p) => p.regex.test(commands)).map((p) => ({
    field: 'commands' as const,
    severity: 'warning' as const,
    message: `Potentially dangerous: ${p.message}`,
  }));
