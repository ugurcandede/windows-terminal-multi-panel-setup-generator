import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useValidation } from '@/hooks/useValidation';

export function ValidationBadge() {
  const { errorCount, warningCount } = useValidation();

  if (errorCount === 0 && warningCount === 0) {
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

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1 text-xs dark:border-zinc-800">
      {errorCount > 0 && (
        <span className="flex items-center gap-1 text-red-600 dark:text-red-400" title={`${errorCount} errors`}>
          <AlertCircle className="h-3.5 w-3.5" />
          {errorCount}
        </span>
      )}
      {warningCount > 0 && (
        <span
          className="flex items-center gap-1 text-amber-600 dark:text-amber-400"
          title={`${warningCount} warnings`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {warningCount}
        </span>
      )}
    </div>
  );
}
