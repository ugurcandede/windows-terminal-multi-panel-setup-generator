import { Terminal } from 'lucide-react';
import { TemplateDrawer } from '@/components/templates/TemplateDrawer';
import { SaveAsTemplateDialog } from '@/components/templates/SaveAsTemplateDialog';
import { ImportExportButtons } from '@/components/modals/ImportExportButtons';
import { ShareUrlButton } from '@/components/output/ShareUrlButton';
import { InjectWizardDialog } from '@/components/modals/InjectWizardDialog';
import { SettingsDialog } from '@/components/modals/SettingsDialog';
import { ShortcutsTriggerButton } from '@/components/modals/ShortcutsDialog';
import { ValidationBadge } from './ValidationBadge';

interface Props {
  onShowShortcuts: () => void;
}

export function TopBar({ onShowShortcuts }: Props) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-fg)]">
          <Terminal className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Windows Terminal Generator</div>
          <div className="text-[11px] text-zinc-500">Multi-pane setup designer</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ValidationBadge />
        <TemplateDrawer />
        <SaveAsTemplateDialog />
        <ImportExportButtons />
        <InjectWizardDialog />
        <ShareUrlButton />
        <div className="mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
        <ShortcutsTriggerButton onClick={onShowShortcuts} />
        <SettingsDialog />
      </div>
    </header>
  );
}
