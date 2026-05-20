import type { Panel } from '@/types/panel';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@/types/panel';
import { escapePS, escapePSPath } from './escape';
import { getProfileCommand } from './profiles';

const INDENT = '    ';

const buildPanelTokens = (panel: Panel, isFirst: boolean): string[] => {
  const tokens: string[] = [];

  if (isFirst) {
    tokens.push('new-tab');
  } else {
    const direction = panel.split === 'horizontal' ? '-H' : '-V';
    tokens.push(`split-pane ${direction}`);
  }

  if (panel.title) {
    tokens.push(
      `--title "${escapePS(panel.title)}" --suppressApplicationTitle`
    );
  }

  if (panel.directory) {
    tokens.push(`--startingDirectory "${escapePSPath(panel.directory)}"`);
  }

  if (!isFirst && panel.size && panel.size !== DEFAULT_SIZE) {
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

export const generatePowershell = (panels: Panel[]): PowershellOutput => {
  if (!panels || panels.length === 0) {
    const empty = '# No panels configured';
    return { display: empty, clipboard: empty };
  }

  const groups = panels.map((p, i) => buildPanelTokens(p, i === 0));

  const clipboard = 'wt ' + groups.map((g) => g.join(' ')).join(' `; ');

  const display =
    'wt `\n' +
    groups
      .map((g) => INDENT + g.join(` \`\n${INDENT}`))
      .join(' `;\n');

  return { display, clipboard };
};
