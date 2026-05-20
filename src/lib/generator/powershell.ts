import type { Panel } from '@/types/panel';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@/types/panel';
import type { Tab } from '@/types/tab';
import { escapePS, escapePSPath } from './escape';
import { getProfileCommand } from './profiles';

const INDENT = '    ';

const buildPanelTokens = (panel: Panel, isFirstInTab: boolean): string[] => {
  const tokens: string[] = [];

  if (isFirstInTab) {
    tokens.push('new-tab');
  } else {
    const direction = panel.split === 'horizontal' ? '-H' : '-V';
    tokens.push(`split-pane ${direction}`);
  }

  if (panel.title) {
    tokens.push(`--title "${escapePS(panel.title)}" --suppressApplicationTitle`);
  }

  if (panel.directory) {
    tokens.push(`--startingDirectory "${escapePSPath(panel.directory)}"`);
  }

  if (!isFirstInTab && panel.size && panel.size !== DEFAULT_SIZE) {
    tokens.push(`--size ${panel.size}`);
  }

  if (panel.color && panel.color !== DEFAULT_COLOR) {
    tokens.push(`--tabColor "${panel.color}"`);
  }

  tokens.push(getProfileCommand(panel.profile));

  if (panel.commands && panel.commands.trim()) {
    tokens.push(`-Command "${escapePS(panel.commands)}"`);
  }

  return tokens;
};

export interface PowershellOutput {
  display: string;
  clipboard: string;
}

const collectGroups = (tabs: Tab[]): string[][] =>
  tabs.flatMap((tab) => tab.panels.map((p, i) => buildPanelTokens(p, i === 0)));

export const generatePowershell = (tabs: Tab[]): PowershellOutput => {
  if (!tabs || tabs.length === 0 || tabs.every((t) => t.panels.length === 0)) {
    const empty = '# No panels configured';
    return { display: empty, clipboard: empty };
  }

  const groups = collectGroups(tabs);

  const clipboard = 'wt ' + groups.map((g) => g.join(' ')).join(' `; ');

  const display =
    'wt `\n' +
    groups.map((g) => INDENT + g.join(` \`\n${INDENT}`)).join(' `;\n');

  return { display, clipboard };
};
