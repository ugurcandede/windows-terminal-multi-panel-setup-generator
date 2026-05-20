import type { Panel } from '@/types/panel';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@/types/panel';
import { escapePSSingleQuoted, normalizeWinPath } from './escape';

interface NewTabAction {
  action: 'newTab';
  commandline: string;
  startingDirectory?: string;
  tabTitle?: string;
  tabColor?: string;
  suppressApplicationTitle: true;
}

interface SplitPaneAction {
  action: 'splitPane';
  split: 'vertical' | 'horizontal';
  size?: number;
  commandline: string;
  startingDirectory?: string;
  tabTitle?: string;
  tabColor?: string;
  suppressApplicationTitle: true;
}

interface MoveFocusAction {
  action: 'moveFocus';
  direction: 'first';
}

type WtAction = NewTabAction | SplitPaneAction | MoveFocusAction;

interface MultipleActions {
  command: { action: 'multipleActions'; actions: WtAction[] };
  name: string;
  icon: string;
}

const buildCommandline = (directory: string, commands: string): string => {
  const parts: string[] = [];
  if (directory) parts.push(`cd '${escapePSSingleQuoted(directory)}'`);
  const trimmed = commands?.trim();
  if (trimmed) parts.push(escapePSSingleQuoted(trimmed));
  const inner = parts.join('; ');
  return `pwsh -Command "${inner}"`;
};

const generateActionName = (panels: Panel[]): string => {
  if (panels.length === 1) {
    return panels[0].title || 'Single Panel Setup';
  }
  const titles = panels
    .map((p) => p.title)
    .filter((t) => t && !/^Panel\s+\d+$/i.test(t))
    .slice(0, 3);
  if (titles.length > 0) {
    return titles.join(' + ') + (panels.length > 3 ? ' + more' : '');
  }
  return `${panels.length} Panel Setup`;
};

export const generateJSON = (panels: Panel[]): string => {
  if (!panels || panels.length === 0) {
    return JSON.stringify(
      {
        command: { action: 'newTab', tabTitle: 'Empty Configuration' },
        name: 'Empty Setup',
        icon: '!',
      },
      null,
      2
    );
  }

  const actions: WtAction[] = [];

  const first = panels[0];
  const firstAction: NewTabAction = {
    action: 'newTab',
    commandline: buildCommandline(first.directory, first.commands),
    suppressApplicationTitle: true,
  };
  if (first.directory) firstAction.startingDirectory = normalizeWinPath(first.directory);
  if (first.title) firstAction.tabTitle = first.title;
  if (first.color && first.color !== DEFAULT_COLOR) firstAction.tabColor = first.color;
  actions.push(firstAction);

  for (const panel of panels.slice(1)) {
    const splitAction: SplitPaneAction = {
      action: 'splitPane',
      split: panel.split ?? 'vertical',
      commandline: buildCommandline(panel.directory, panel.commands),
      suppressApplicationTitle: true,
    };
    if (panel.size && panel.size !== DEFAULT_SIZE) splitAction.size = panel.size;
    if (panel.directory) splitAction.startingDirectory = normalizeWinPath(panel.directory);
    if (panel.title) splitAction.tabTitle = panel.title;
    if (panel.color && panel.color !== DEFAULT_COLOR) splitAction.tabColor = panel.color;
    actions.push(splitAction);
  }

  actions.push({ action: 'moveFocus', direction: 'first' });

  const result: MultipleActions = {
    command: { action: 'multipleActions', actions },
    name: generateActionName(panels),
    icon: '🚀',
  };

  return JSON.stringify(result, null, 2);
};
