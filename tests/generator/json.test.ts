import { describe, expect, it } from 'vitest';
import { generateJSON } from '@/lib/generator/json';
import { makePanel } from './fixtures';

const parse = (s: string) => JSON.parse(s);

describe('generateJSON', () => {
  it('returns placeholder JSON for empty input', () => {
    const out = parse(generateJSON([]));
    expect(out.command.action).toBe('newTab');
    expect(out.name).toBe('Empty Setup');
  });

  it('single panel emits newTab and a trailing moveFocus', () => {
    const out = parse(
      generateJSON([makePanel({ title: 'Frontend', directory: 'C:\\f', commands: 'npm run dev' })])
    );
    const actions = out.command.actions;
    expect(actions[0].action).toBe('newTab');
    expect(actions[actions.length - 1]).toEqual({ action: 'moveFocus', direction: 'first' });
  });

  it('paths are double-escaped for JSON (each \\ becomes \\\\ once normalized, then again by JSON.stringify)', () => {
    const out = generateJSON([makePanel({ directory: 'C:\\Projects' })]);
    // normalizeWinPath turns 1 backslash into 2; JSON.stringify turns each into 2 more → 4 visible
    expect(out).toContain('"startingDirectory": "C:\\\\\\\\Projects"');
  });

  it('default color is omitted from output', () => {
    const out = parse(generateJSON([makePanel({ color: '#64748b' })]));
    expect(out.command.actions[0].tabColor).toBeUndefined();
  });

  it('custom color is included', () => {
    const out = parse(generateJSON([makePanel({ color: '#ff6b6b' })]));
    expect(out.command.actions[0].tabColor).toBe('#ff6b6b');
  });

  it('every action carries suppressApplicationTitle: true', () => {
    const out = parse(
      generateJSON([
        makePanel({ title: 'A' }),
        makePanel({ id: 'p2', title: 'B', split: 'vertical', size: 0.5 }),
      ])
    );
    expect(out.command.actions[0].suppressApplicationTitle).toBe(true);
    expect(out.command.actions[1].suppressApplicationTitle).toBe(true);
  });

  it('split direction propagates from panel.split', () => {
    const out = parse(
      generateJSON([
        makePanel(),
        makePanel({ id: 'p2', split: 'horizontal', size: 0.5 }),
      ])
    );
    expect(out.command.actions[1].split).toBe('horizontal');
  });

  it('default size 0.5 is omitted, custom size included', () => {
    const out = parse(
      generateJSON([
        makePanel(),
        makePanel({ id: 'p2', split: 'vertical', size: 0.5 }),
        makePanel({ id: 'p3', split: 'horizontal', size: 0.7 }),
      ])
    );
    expect(out.command.actions[1].size).toBeUndefined();
    expect(out.command.actions[2].size).toBe(0.7);
  });

  it("single quotes in commands are doubled inside pwsh -Command \"cd '...'\"", () => {
    const out = parse(
      generateJSON([makePanel({ directory: "C:\\don't", commands: "echo 'hi'" })])
    );
    expect(out.command.actions[0].commandline).toContain("cd 'C:\\don''t'");
    expect(out.command.actions[0].commandline).toContain("echo ''hi''");
  });

  it('action name uses up to 3 titles joined with " + " plus "+ more"', () => {
    const out = parse(
      generateJSON([
        makePanel({ title: 'A' }),
        makePanel({ id: 'p2', title: 'B', split: 'vertical', size: 0.5 }),
        makePanel({ id: 'p3', title: 'C', split: 'horizontal', size: 0.5 }),
        makePanel({ id: 'p4', title: 'D', split: 'vertical', size: 0.5 }),
      ])
    );
    expect(out.name).toBe('A + B + C + more');
  });

  it('always includes moveFocus action at the end', () => {
    const single = parse(generateJSON([makePanel()]));
    const triple = parse(generateJSON([
      makePanel(),
      makePanel({ id: 'p2', split: 'vertical', size: 0.5 }),
      makePanel({ id: 'p3', split: 'horizontal', size: 0.5 }),
    ]));
    expect(single.command.actions.at(-1).action).toBe('moveFocus');
    expect(triple.command.actions.at(-1).action).toBe('moveFocus');
  });
});
