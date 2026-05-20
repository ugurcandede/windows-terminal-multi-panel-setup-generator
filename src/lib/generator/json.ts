import type { Panel } from '@/types/panel';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@/types/panel';
import type { Tab } from '@/types/tab';
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

const buildNewTab = (p: Panel): NewTabAction => {
  const a: NewTabAction = {
    action: 'newTab',
    commandline: buildCommandline(p.directory, p.commands),
    suppressApplicationTitle: true,
  };
  if (p.directory) a.startingDirectory = normalizeWinPath(p.directory);
  if (p.title) a.tabTitle = p.title;
  if (p.color && p.color !== DEFAULT_COLOR) a.tabColor = p.color;
  return a;
};

const buildSplitPane = (p: Panel): SplitPaneAction => {
  const a: SplitPaneAction = {
    action: 'splitPane',
    split: p.split ?? 'vertical',
    commandline: buildCommandline(p.directory, p.commands),
    suppressApplicationTitle: true,
  };
  if (p.size && p.size !== DEFAULT_SIZE) a.size = p.size;
  if (p.directory) a.startingDirectory = normalizeWinPath(p.directory);
  if (p.title) a.tabTitle = p.title;
  if (p.color && p.color !== DEFAULT_COLOR) a.tabColor = p.color;
  return a;
};

const generateActionName = (tabs: Tab[]): string => {
  const allTitles = tabs.flatMap((t) => t.panels.map((p) => p.title));
  const named = allTitles.filter((t) => t && !/^Panel\s+\d+$/i.test(t)).slice(0, 3);
  if (named.length > 0) {
    return named.join(' + ') + (allTitles.length > 3 ? ' + more' : '');
  }
  const totalPanels = tabs.reduce((n, t) => n + t.panels.length, 0);
  if (totalPanels === 1) return 'Single Panel Setup';
  return `${totalPanels} Panel Setup`;
};

export const generateJSON = (tabs: Tab[]): string => {
  const totalPanels = tabs?.reduce((n, t) => n + t.panels.length, 0) ?? 0;

  if (!tabs || totalPanels === 0) {
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

  for (const tab of tabs) {
    if (tab.panels.length === 0) continue;
    actions.push(buildNewTab(tab.panels[0]));
    for (const panel of tab.panels.slice(1)) {
      actions.push(buildSplitPane(panel));
    }
  }

  actions.push({ action: 'moveFocus', direction: 'first' });

  const result: MultipleActions = {
    command: { action: 'multipleActions', actions },
    name: generateActionName(tabs),
    icon: '🚀',
  };

  return JSON.stringify(result, null, 2);
};
