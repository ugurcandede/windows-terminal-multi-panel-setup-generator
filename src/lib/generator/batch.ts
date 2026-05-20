import type { Tab } from '@/types/tab';
import { generatePowershell } from './powershell';

export const generateBatch = (tabs: Tab[]): string => {
  const totalPanels = tabs?.reduce((n, t) => n + t.panels.length, 0) ?? 0;
  if (!tabs || totalPanels === 0) {
    return '@echo off\necho No panels configured\npause';
  }

  const { clipboard } = generatePowershell(tabs);
  // strip leading `wt ` — batch wraps it with `start "" wt`
  const wtArgs = clipboard.replace(/^wt /, '');
  const escaped = wtArgs.replace(/"/g, '""');

  return [
    '@echo off',
    ':: Windows Terminal Multi-Panel Setup',
    `:: Generated at ${new Date().toISOString()}`,
    '',
    'echo Starting Windows Terminal with multi-panel setup...',
    '',
    'where wt >nul 2>nul',
    'if %errorlevel% neq 0 (',
    '    echo Error: Windows Terminal (wt) not found in PATH',
    '    echo Please install Windows Terminal from Microsoft Store',
    '    pause',
    '    exit /b 1',
    ')',
    '',
    `start "" wt ${escaped}`,
    '',
    'echo Windows Terminal launched successfully!',
    'timeout /t 2 >nul',
    '',
  ].join('\n');
};
