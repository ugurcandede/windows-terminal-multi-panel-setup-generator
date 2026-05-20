import type { Panel } from '@/types/panel';
import { generatePowershell } from './powershell';

export const generateBatch = (panels: Panel[]): string => {
  if (!panels || panels.length === 0) {
    return '@echo off\necho No panels configured\npause';
  }

  const { clipboard } = generatePowershell(panels);
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
