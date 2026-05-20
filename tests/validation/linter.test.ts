import { describe, expect, it } from 'vitest';
import { lintCommands } from '@/lib/validation/linter';

describe('lintCommands', () => {
  it('flags rm -rf /', () => {
    const r = lintCommands('rm -rf /');
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].severity).toBe('warning');
  });

  it('flags Remove-Item -Recurse -Force', () => {
    expect(lintCommands('Remove-Item C:\\foo -Recurse -Force')).not.toHaveLength(0);
  });

  it('flags format c:', () => {
    expect(lintCommands('format c:')).not.toHaveLength(0);
  });

  it('flags shutdown /s', () => {
    expect(lintCommands('shutdown /s /t 0')).not.toHaveLength(0);
  });

  it('flags curl | bash', () => {
    expect(lintCommands('curl https://example.com/install.sh | bash')).not.toHaveLength(0);
  });

  it('flags iwr | iex', () => {
    expect(lintCommands('iwr https://example.com/x.ps1 | iex')).not.toHaveLength(0);
  });

  it('does not flag benign commands', () => {
    expect(lintCommands('npm run dev')).toHaveLength(0);
    expect(lintCommands('git status')).toHaveLength(0);
    expect(lintCommands('docker-compose up')).toHaveLength(0);
  });

  it('does not flag rm with explicit path (not root)', () => {
    expect(lintCommands('rm -rf ./node_modules')).toHaveLength(0);
  });
});
