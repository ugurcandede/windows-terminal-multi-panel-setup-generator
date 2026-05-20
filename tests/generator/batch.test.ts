import { describe, expect, it } from 'vitest';
import { generateBatch } from '@/lib/generator/batch';
import { makePanel } from './fixtures';

describe('generateBatch', () => {
  it('returns placeholder batch for empty input', () => {
    const out = generateBatch([]);
    expect(out).toContain('@echo off');
    expect(out).toContain('No panels configured');
  });

  it('includes wt PATH detection block', () => {
    const out = generateBatch([makePanel()]);
    expect(out).toContain('where wt >nul 2>nul');
    expect(out).toContain('if %errorlevel% neq 0');
    expect(out).toContain('exit /b 1');
  });

  it('wraps PowerShell command with `start "" wt`', () => {
    const out = generateBatch([makePanel()]);
    expect(out).toContain('start "" wt new-tab');
  });

  it('doubles quotes for batch escaping', () => {
    const out = generateBatch([makePanel({ title: 'My App' })]);
    expect(out).toContain('--title ""My App""');
  });

  it('does not include literal backtick-newline (single-line wt args)', () => {
    const out = generateBatch([
      makePanel(),
      makePanel({ id: 'p2', split: 'vertical', size: 0.5 }),
    ]);
    const wtLine = out.split('\n').find((l) => l.startsWith('start "" wt'));
    expect(wtLine).toBeDefined();
    expect(wtLine!.includes('`\n')).toBe(false);
  });
});
