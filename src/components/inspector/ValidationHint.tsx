import { AlertCircle, AlertTriangle } from 'lucide-react';
import type { Issue } from '@/lib/validation/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  issues: Issue[];
  className?: string;
}

export function ValidationHint({ issues, className }: Props) {
  if (issues.length === 0) return null;
  return (
    <ul className={cn('flex flex-col gap-1 text-xs', className)}>
      {issues.map((issue, i) => {
        const isError = issue.severity === 'error';
        const Icon = isError ? AlertCircle : AlertTriangle;
        return (
          <li
            key={i}
            className={cn(
              'flex items-start gap-1.5',
              isError ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
            )}
          >
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{issue.message}</span>
          </li>
        );
      })}
    </ul>
  );
}

export const borderClassFor = (issues: Issue[]): string => {
  if (issues.some((i) => i.severity === 'error')) return 'border-red-400 focus:ring-red-500';
  if (issues.some((i) => i.severity === 'warning')) return 'border-amber-400 focus:ring-amber-500';
  return '';
};
