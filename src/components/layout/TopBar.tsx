import { Terminal } from 'lucide-react';
import { TemplateDrawer } from '@/components/templates/TemplateDrawer';
import { SaveAsTemplateDialog } from '@/components/templates/SaveAsTemplateDialog';
import { ImportExportButtons } from '@/components/modals/ImportExportButtons';
import { ShareUrlButton } from '@/components/output/ShareUrlButton';

export function TopBar() {
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
        <TemplateDrawer />
        <SaveAsTemplateDialog />
        <ImportExportButtons />
        <ShareUrlButton />
      </div>
    </header>
  );
}
