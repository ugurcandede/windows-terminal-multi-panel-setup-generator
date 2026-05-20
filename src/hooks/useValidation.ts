import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { validatePanel } from '@/lib/validation/panel';
import type { Issue, IssueField } from '@/lib/validation/types';

export interface ValidationSnapshot {
  byPanel: Record<string, Issue[]>;
  errorCount: number;
  warningCount: number;
}

export const useValidation = (): ValidationSnapshot => {
  const panels = useEditorStore((s) => s.panels);

  return useMemo(() => {
    const byPanel: Record<string, Issue[]> = {};
    let errorCount = 0;
    let warningCount = 0;
    panels.forEach((p, i) => {
      const issues = validatePanel(p, i === 0);
      byPanel[p.id] = issues;
      for (const issue of issues) {
        if (issue.severity === 'error') errorCount++;
        else warningCount++;
      }
    });
    return { byPanel, errorCount, warningCount };
  }, [panels]);
};

export const useFieldIssues = (panelId: string | null, field: IssueField): Issue[] => {
  const snap = useValidation();
  if (!panelId) return [];
  return (snap.byPanel[panelId] ?? []).filter((i) => i.field === field);
};
