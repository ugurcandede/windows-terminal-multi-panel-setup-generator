import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, htmlFor, className, children }: Props) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export const baseInputClass = cn(
  'h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm',
  'dark:border-zinc-800 dark:bg-zinc-900',
  'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1',
  'placeholder:text-zinc-400'
);

export const baseTextareaClass = cn(
  'min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm',
  'dark:border-zinc-800 dark:bg-zinc-900',
  'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1',
  'placeholder:text-zinc-400 font-mono'
);
