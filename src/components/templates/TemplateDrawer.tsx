import { useState } from 'react';
import { Layers, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useEditorStore } from '@/store/editorStore';
import { useTemplatesStore } from '@/store/templatesStore';
import { DEFAULT_TEMPLATES, type DefaultTemplate } from '@/lib/data/defaultTemplates';
import type { UserTemplate } from '@/lib/storage/userTemplates';
import { cn } from '@/lib/utils/cn';

export function TemplateDrawer() {
  const [open, setOpen] = useState(false);
  const loadPanels = useEditorStore((s) => s.loadPanels);
  const userTemplates = useTemplatesStore((s) => s.userTemplates);
  const deleteTemplate = useTemplatesStore((s) => s.deleteTemplate);

  const applyDefault = (t: DefaultTemplate) => {
    loadPanels(t.panels.map((p, i) => ({ ...p, id: `t-${t.id}-${i}` })));
    setOpen(false);
  };

  const applyUser = (t: UserTemplate) => {
    loadPanels(t.panels);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Layers className="h-3.5 w-3.5" /> Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Templates</DialogTitle>
          <DialogDescription>
            Pick a starting setup. Loading a template replaces the current panels.
          </DialogDescription>
        </DialogHeader>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Presets
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DEFAULT_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyDefault(t)}
                className={cn(
                  'rounded-md border border-zinc-200 p-3 text-left transition-colors',
                  'hover:border-[var(--accent)] hover:shadow-sm',
                  'dark:border-zinc-800'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
                  <span className="text-sm font-medium">{t.name}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{t.description}</p>
                <p className="mt-2 text-[11px] text-zinc-400">{t.panels.length} panels</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Your templates {userTemplates.length > 0 ? `(${userTemplates.length})` : ''}
          </h3>
          {userTemplates.length === 0 ? (
            <p className="rounded-md border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
              No saved templates yet. Use "Save as template" from the toolbar to keep your current setup.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {userTemplates.map((t) => (
                <li
                  key={t.id}
                  className="group flex items-center gap-2 rounded-md border border-zinc-200 p-2 text-sm dark:border-zinc-800"
                >
                  <button
                    type="button"
                    onClick={() => applyUser(t)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="text-[11px] text-zinc-500">
                      {t.panels.length} panels · {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTemplate(t.id)}
                    className="text-zinc-400 opacity-0 hover:text-red-500 group-hover:opacity-100"
                    aria-label={`Delete ${t.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
