import { useState } from 'react';
import { Settings, Sun, Moon, Monitor } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/inspector/Field';
import { useSettingsStore } from '@/store/settingsStore';
import { ACCENTS, type AccentKey } from '@/lib/data/accents';
import type { Theme } from '@/lib/storage/settings';
import { cn } from '@/lib/utils/cn';

const THEMES: Array<{ key: Theme; label: string; Icon: typeof Sun }> = [
  { key: 'light', label: 'Light', Icon: Sun },
  { key: 'dark', label: 'Dark', Icon: Moon },
  { key: 'system', label: 'System', Icon: Monitor },
];

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const theme = useSettingsStore((s) => s.theme);
  const accent = useSettingsStore((s) => s.accent);
  const autoSave = useSettingsStore((s) => s.autoSave);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setAccent = useSettingsStore((s) => s.setAccent);
  const setAutoSave = useSettingsStore((s) => s.setAutoSave);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Settings" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Field label="Theme">
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-md border py-3 text-xs transition-colors',
                  theme === key
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Accent color">
          <div className="flex flex-wrap items-center gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.key}
                type="button"
                aria-label={a.name}
                title={a.name}
                onClick={() => setAccent(a.key as AccentKey)}
                className={cn(
                  'h-8 w-8 rounded-full transition-transform',
                  accent === a.key
                    ? 'scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
                    : 'hover:scale-105'
                )}
                style={{ backgroundColor: a.hex, boxShadow: accent === a.key ? `0 0 0 2px ${a.hex}` : undefined }}
              />
            ))}
          </div>
        </Field>

        <Field label="Auto-save">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            <span>Save configuration to local storage automatically</span>
          </label>
        </Field>
      </DialogContent>
    </Dialog>
  );
}
