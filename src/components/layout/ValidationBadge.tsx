import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { useValidation } from '@/hooks/useValidation';
import { useActivePanels, useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils/cn';

const fieldLabel: Record<string, string> = {
  title: 'Title',
  directory: 'Directory',
  commands: 'Commands',
  color: 'Color',
  profile: 'Profile',
  split: 'Split direction',
  size: 'Size',
  global: '',
};

export function ValidationBadge() {
  const snap = useValidation();
  const panels = useActivePanels();
  const setSelected = useEditorStore((s) => s.setSelected);

  const { errorCount, warningCount, byPanel } = snap;
  const isClean = errorCount === 0 && warningCount === 0;

  if (isClean) {
    return (
      <div
        className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
        title="No validation issues"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>OK</span>
      </div>
    );
  }

  const issuesByPanel = panels
    .map((p, i) => ({ panel: p, index: i, issues: byPanel[p.id] ?? [] }))
    .filter((entry) => entry.issues.length > 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Show validation issues"
          className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1 text-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {errorCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {warningCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Validation issues</span>
          <span className="text-zinc-500">
            {errorCount > 0 && <span className="text-red-600 dark:text-red-400">{errorCount} error{errorCount === 1 ? '' : 's'}</span>}
            {errorCount > 0 && warningCount > 0 && ' · '}
            {warningCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400">
                {warningCount} warning{warningCount === 1 ? '' : 's'}
              </span>
            )}
          </span>
        </div>

        <ul className="flex max-h-80 flex-col gap-3 overflow-y-auto">
          {issuesByPanel.map(({ panel, index, issues }) => {
            const title = panel.title.trim() || `Panel ${index + 1}`;
            return (
              <li key={panel.id}>
                <button
                  type="button"
                  onClick={() => setSelected(panel.id)}
                  className="mb-1 flex items-center gap-2 text-left text-xs font-medium text-zinc-800 hover:text-[var(--accent)] dark:text-zinc-200"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: panel.color }}
                  />
                  {title}
                </button>
                <ul className="flex flex-col gap-1 pl-4">
                  {issues.map((issue, i) => {
                    const isError = issue.severity === 'error';
                    const Icon = isError ? AlertCircle : AlertTriangle;
                    const label = fieldLabel[issue.field] ?? issue.field;
                    return (
                      <li
                        key={i}
                        className={cn(
                          'flex items-start gap-1.5 text-[11px]',
                          isError ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                        )}
                      >
                        <Icon className="mt-0.5 h-3 w-3 shrink-0" />
                        <span>
                          {label && <span className="font-mono text-zinc-500">{label}:</span>} {issue.message}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
