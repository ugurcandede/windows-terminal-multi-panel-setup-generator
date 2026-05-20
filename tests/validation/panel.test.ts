import { describe, expect, it } from 'vitest';
import { validatePanel } from '@/lib/validation/panel';
import { makePanel } from '../generator/fixtures';

describe('validatePanel', () => {
  it('fully valid first panel has no issues', () => {
    const issues = validatePanel(makePanel(), true);
    expect(issues).toHaveLength(0);
  });

  it('empty title flags a warning, not an error', () => {
    const issues = validatePanel(makePanel({ title: '' }), true);
    expect(issues).toContainEqual(expect.objectContaining({ field: 'title', severity: 'warning' }));
  });

  it('invalid windows path raises an error on directory', () => {
    const issues = validatePanel(makePanel({ directory: 'not-a-path' }), true);
    expect(issues).toContainEqual(expect.objectContaining({ field: 'directory', severity: 'error' }));
  });

  it('accepts %USERPROFILE% style env-prefixed paths', () => {
    const issues = validatePanel(makePanel({ directory: '%USERPROFILE%\\Documents' }), true);
    const dirIssues = issues.filter((i) => i.field === 'directory');
    expect(dirIssues).toHaveLength(0);
  });

  it('accepts UNC paths', () => {
    const issues = validatePanel(makePanel({ directory: '\\\\server\\share' }), true);
    expect(issues.filter((i) => i.field === 'directory')).toHaveLength(0);
  });

  it('invalid hex color flags an error', () => {
    const issues = validatePanel(makePanel({ color: 'red' }), true);
    expect(issues).toContainEqual(expect.objectContaining({ field: 'color', severity: 'error' }));
  });

  it('non-first panel without split direction errors', () => {
    const issues = validatePanel(makePanel({ split: null, size: 0.5 }), false);
    expect(issues).toContainEqual(expect.objectContaining({ field: 'split', severity: 'error' }));
  });

  it('out-of-range size errors', () => {
    const issues = validatePanel(makePanel({ split: 'vertical', size: 0.05 }), false);
    expect(issues).toContainEqual(expect.objectContaining({ field: 'size', severity: 'error' }));
  });
});
