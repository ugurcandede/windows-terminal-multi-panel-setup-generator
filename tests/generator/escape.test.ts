import { describe, expect, it } from 'vitest';
import {
  escapeJSON,
  escapePS,
  escapePSPath,
  escapePSSingleQuoted,
  normalizeWinPath,
} from '@/lib/generator/escape';

describe('escape utilities', () => {
  describe('escapePS', () => {
    it('doubles quotes', () => {
      expect(escapePS('Foo"Bar')).toBe('Foo""Bar');
    });

    it('doubles backticks', () => {
      expect(escapePS('Foo`Bar')).toBe('Foo``Bar');
    });

    it('handles both together — backtick escapes first so doubled backticks survive', () => {
      expect(escapePS('a`b"c')).toBe('a``b""c');
    });

    it('leaves ordinary strings unchanged', () => {
      expect(escapePS('npm run dev')).toBe('npm run dev');
    });
  });

  describe('escapePSPath', () => {
    it('doubles backslashes', () => {
      expect(escapePSPath('C:\\Projects')).toBe('C:\\\\Projects');
    });

    it('doubles quotes', () => {
      expect(escapePSPath('C:\\My "Stuff"')).toBe('C:\\\\My ""Stuff""');
    });
  });

  describe('escapeJSON', () => {
    it('escapes backslash, quote, newline, carriage return', () => {
      expect(escapeJSON('a\\b"c\nd\re')).toBe('a\\\\b\\"c\\nd\\re');
    });
  });

  describe('normalizeWinPath', () => {
    it('doubles backslashes only', () => {
      expect(normalizeWinPath('C:\\a\\b')).toBe('C:\\\\a\\\\b');
    });
  });

  describe('escapePSSingleQuoted', () => {
    it("doubles single quotes", () => {
      expect(escapePSSingleQuoted("Don't")).toBe("Don''t");
    });
  });
});
