import type { Panel } from '@/types/panel';
import { HEX_COLOR, WINDOWS_PATH } from './rules';
import { lintCommands } from './linter';
import type { Issue } from './types';

export const validatePanel = (panel: Panel, isFirst: boolean): Issue[] => {
  const issues: Issue[] = [];

  if (!panel.title.trim()) {
    issues.push({ field: 'title', severity: 'warning', message: 'Title is recommended for clarity' });
  }

  if (!panel.directory.trim()) {
    issues.push({ field: 'directory', severity: 'warning', message: 'Starting directory is empty' });
  } else if (!WINDOWS_PATH.test(panel.directory)) {
    issues.push({
      field: 'directory',
      severity: 'error',
      message: 'Not a valid Windows path (use C:\\…, \\\\server\\…, ./… or %VAR%\\…)',
    });
  }

  if (!HEX_COLOR.test(panel.color)) {
    issues.push({ field: 'color', severity: 'error', message: 'Color must be a hex value (#RGB or #RRGGBB)' });
  }

  if (!isFirst) {
    if (panel.split !== 'vertical' && panel.split !== 'horizontal') {
      issues.push({ field: 'split', severity: 'error', message: 'Split direction is required for non-first panels' });
    }
    if (panel.size < 0.1 || panel.size > 0.9) {
      issues.push({ field: 'size', severity: 'error', message: 'Size must be between 0.1 and 0.9' });
    }
  }

  if (panel.commands.trim()) {
    issues.push(...lintCommands(panel.commands));
  }

  return issues;
};
