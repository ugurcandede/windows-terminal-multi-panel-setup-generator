import { Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

const SHORTCUTS: Array<{ keys: string[]; label: string }> = [
  { keys: ['N'], label: 'Add new panel' },
  { keys: ['Del'], label: 'Delete selected panel' },
  { keys: ['←', '→'], label: 'Select previous / next pane' },
  { keys: ['↑', '↓'], label: 'Switch tab' },
  { keys: ['Ctrl', 'Z'], label: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], label: 'Redo' },
  { keys: ['Alt', 'E'], label: 'Export configuration' },
  { keys: ['?'], label: 'Show this dialog' },
  { keys: ['Esc'], label: 'Close dialog' },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ShortcutsDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard shortcuts
          </DialogTitle>
          <DialogDescription>
            Single-letter shortcuts only fire when no text field is focused — so they never eat
            characters you're typing. Ctrl+Z stays native inside inputs.
          </DialogDescription>
        </DialogHeader>
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between py-2 text-sm">
              <span className="text-zinc-700 dark:text-zinc-300">{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <kbd
                    key={i}
                    className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function ShortcutsTriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} title="Keyboard shortcuts (?)" aria-label="Keyboard shortcuts">
      <Keyboard className="h-4 w-4" />
    </Button>
  );
}
