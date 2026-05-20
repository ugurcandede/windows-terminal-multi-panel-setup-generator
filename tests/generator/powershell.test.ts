import { describe, expect, it } from 'vitest';
import { generatePowershell } from '@/lib/generator/powershell';
import { makePanel, minimalFirst, singleTab } from './fixtures';

describe('generatePowershell', () => {
  it('returns placeholder for empty input', () => {
    const out = generatePowershell([]);
    expect(out.clipboard).toBe('# No panels configured');
    expect(out.display).toBe('# No panels configured');
  });

  it('single minimal panel: just wt new-tab + profile (no flags)', () => {
    const out = generatePowershell(singleTab([minimalFirst()]));
    expect(out.clipboard).toBe('wt new-tab pwsh');
  });

  it('single full panel includes all flags in correct order', () => {
    const out = generatePowershell(
      singleTab([makePanel({ title: 'Frontend', directory: 'C:\\f', commands: 'npm run dev', color: '#ff6b6b' })])
    );
    expect(out.clipboard).toBe(
      'wt new-tab --title "Frontend" --suppressApplicationTitle --startingDirectory "C:\\\\f" --tabColor "#ff6b6b" pwsh -Command "npm run dev"'
    );
  });

  it('two-panel vertical default size omits --size', () => {
    const out = generatePowershell(
      singleTab([
        makePanel({ id: 'p1' }),
        makePanel({ id: 'p2', title: 'B', directory: 'C:\\b', commands: 'npm start', color: '#ff6b6b', split: 'vertical', size: 0.5 }),
      ])
    );
    expect(out.clipboard).not.toContain('--size');
    expect(out.clipboard).toContain(' `; split-pane -V ');
  });

  it('two-panel horizontal with size 0.7', () => {
    const out = generatePowershell(
      singleTab([
        makePanel(),
        makePanel({ id: 'p2', title: 'B', directory: 'C:\\b', commands: 'tail -f', color: '#ff6b6b', split: 'horizontal', size: 0.7 }),
      ])
    );
    expect(out.clipboard).toContain('split-pane -H');
    expect(out.clipboard).toContain('--size 0.7');
  });

  it('default color #64748b is omitted', () => {
    const out = generatePowershell(singleTab([makePanel({ color: '#64748b' })]));
    expect(out.clipboard).not.toContain('--tabColor');
  });

  it('custom color is included', () => {
    const out = generatePowershell(singleTab([makePanel({ color: '#abcdef' })]));
    expect(out.clipboard).toContain('--tabColor "#abcdef"');
  });

  it('title with quote is escaped (" -> "")', () => {
    const out = generatePowershell(singleTab([makePanel({ title: 'Foo"Bar' })]));
    expect(out.clipboard).toContain('--title "Foo""Bar"');
  });

  it('title with backtick is escaped (` -> ``)', () => {
    const out = generatePowershell(singleTab([makePanel({ title: 'Foo`Bar' })]));
    expect(out.clipboard).toContain('--title "Foo``Bar"');
  });

  it('empty commands omits -Command flag entirely', () => {
    const out = generatePowershell(singleTab([makePanel({ commands: '' })]));
    expect(out.clipboard).not.toContain('-Command');
  });

  it('commands with only whitespace also omitted', () => {
    const out = generatePowershell(singleTab([makePanel({ commands: '   \n  ' })]));
    expect(out.clipboard).not.toContain('-Command');
  });

  it('profile mapping covers all four profiles', () => {
    expect(generatePowershell(singleTab([makePanel({ profile: 'PowerShell' })])).clipboard).toContain(' pwsh');
    expect(generatePowershell(singleTab([makePanel({ profile: 'Command Prompt' })])).clipboard).toContain(' cmd');
    expect(generatePowershell(singleTab([makePanel({ profile: 'Git Bash' })])).clipboard).toContain(' bash');
    expect(generatePowershell(singleTab([makePanel({ profile: 'Ubuntu' })])).clipboard).toContain(' wsl -d Ubuntu');
  });

  it('every --title is followed by --suppressApplicationTitle', () => {
    const out = generatePowershell(
      singleTab([
        makePanel({ title: 'A' }),
        makePanel({ id: 'p2', title: 'B', split: 'vertical', size: 0.5 }),
      ])
    );
    const titleMatches = out.clipboard.match(/--title "[^"]+" --suppressApplicationTitle/g);
    expect(titleMatches).toHaveLength(2);
  });

  it('panels separated by backtick-semicolon', () => {
    const out = generatePowershell(
      singleTab([
        makePanel(),
        makePanel({ id: 'p2', split: 'vertical', size: 0.5 }),
        makePanel({ id: 'p3', split: 'horizontal', size: 0.5 }),
      ])
    );
    const splits = out.clipboard.split(' `; ');
    expect(splits).toHaveLength(3);
  });

  it('accepts 6 panels (max boundary)', () => {
    const panels = Array.from({ length: 6 }, (_, i) =>
      makePanel({ id: `p${i}`, title: `T${i}`, split: i === 0 ? null : 'vertical', size: i === 0 ? 1 : 0.5 })
    );
    const out = generatePowershell(singleTab(panels));
    expect(out.clipboard.match(/split-pane/g)).toHaveLength(5);
  });

  it('display variant is multi-line and starts with `wt \\``\\n`', () => {
    const out = generatePowershell(singleTab([makePanel()]));
    expect(out.display.startsWith('wt `\n')).toBe(true);
    expect(out.display).toContain('\n');
  });

  it('clipboard variant is single-line (no \\n)', () => {
    const out = generatePowershell(
      singleTab([
        makePanel(),
        makePanel({ id: 'p2', split: 'vertical', size: 0.5 }),
      ])
    );
    expect(out.clipboard.includes('\n')).toBe(false);
  });

  it('display and clipboard share the same token content (no drift)', () => {
    const out = generatePowershell(
      singleTab([
        makePanel({ title: 'A', commands: 'npm start' }),
        makePanel({ id: 'p2', title: 'B', split: 'vertical', size: 0.5, commands: '' }),
      ])
    );
    const stripWhitespace = (s: string) => s.replace(/\s+/g, ' ').replace(/`\s*/g, '');
    expect(stripWhitespace(out.display)).toBe(stripWhitespace(out.clipboard));
  });

  it('multi-tab: each tab opens its own new-tab', () => {
    const out = generatePowershell([
      { id: 't1', name: '', panels: [makePanel({ id: 'a', title: 'A' })] },
      { id: 't2', name: '', panels: [makePanel({ id: 'b', title: 'B' })] },
    ]);
    const newTabCount = out.clipboard.match(/new-tab/g)?.length ?? 0;
    expect(newTabCount).toBe(2);
    expect(out.clipboard).not.toContain('split-pane');
  });

  it('multi-tab: subsequent panels in same tab still use split-pane', () => {
    const out = generatePowershell([
      { id: 't1', name: '', panels: [makePanel({ id: 'a' }), makePanel({ id: 'b', split: 'vertical', size: 0.5 })] },
      { id: 't2', name: '', panels: [makePanel({ id: 'c' })] },
    ]);
    expect(out.clipboard.match(/new-tab/g)?.length).toBe(2);
    expect(out.clipboard.match(/split-pane/g)?.length).toBe(1);
  });
});
