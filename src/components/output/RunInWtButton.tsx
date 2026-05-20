import { useState } from 'react';
import { Play, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface Props {
  command: string;
}

const KBD_CLASS =
  'rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';

export function RunInWtButton({ command }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(command);
      } else {
        const ta = document.createElement('textarea');
        ta.value = command;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
    } catch (err) {
      console.warn('Clipboard write failed', err);
      setCopied(false);
    }
    setOpen(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setCopied(false);
      }}
    >
      <Button variant="primary" size="sm" onClick={handleClick}>
        <Play className="h-3.5 w-3.5" /> Run in WT
      </Button>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Run in Windows Terminal</DialogTitle>
          <DialogDescription>
            {copied
              ? 'Command copied to clipboard. Three quick steps to launch it:'
              : 'Copy failed — copy the command manually, then follow the steps:'}
          </DialogDescription>
        </DialogHeader>

        <ol className="flex flex-col gap-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--accent-fg)]">
              1
            </span>
            <span className="flex items-center gap-1.5 flex-wrap">
              Open the Run dialog: <kbd className={KBD_CLASS}>Win</kbd> +
              <kbd className={KBD_CLASS}>R</kbd>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--accent-fg)]">
              2
            </span>
            <span className="flex items-center gap-1.5 flex-wrap">
              Paste the command: <kbd className={KBD_CLASS}>Ctrl</kbd> +
              <kbd className={KBD_CLASS}>V</kbd>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--accent-fg)]">
              3
            </span>
            <span className="flex items-center gap-1.5">
              Press <kbd className={KBD_CLASS}>Enter</kbd>
            </span>
          </li>
        </ol>

        {copied && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            Command is in your clipboard, ready to paste.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
