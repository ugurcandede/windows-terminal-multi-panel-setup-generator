import type { Panel } from '@/types/panel';

export type Severity = 'error' | 'warning';

export type IssueField = keyof Panel | 'global';

export interface Issue {
  field: IssueField;
  severity: Severity;
  message: string;
}
