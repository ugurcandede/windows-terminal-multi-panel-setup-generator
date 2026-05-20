export const escapePS = (s: string): string =>
  s.replace(/`/g, '``').replace(/"/g, '""');

export const escapePSPath = (p: string): string =>
  p.replace(/\\/g, '\\\\').replace(/"/g, '""');

export const escapeJSON = (s: string): string =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');

export const normalizeWinPath = (p: string): string =>
  p.replace(/\\/g, '\\\\');

export const escapePSSingleQuoted = (s: string): string =>
  s.replace(/'/g, "''");
