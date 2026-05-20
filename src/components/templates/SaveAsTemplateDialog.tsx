import { useState } from 'react';
import { Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { baseInputClass } from '@/components/inspector/Field';
import { useEditorStore } from '@/store/editorStore';
import { useTemplatesStore } from '@/store/templatesStore';

export function SaveAsTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const panels = useEditorStore((s) => s.panels);
  const saveAsTemplate = useTemplatesStore((s) => s.saveAsTemplate);

  const handleSave = () => {
    if (!name.trim()) return;
    saveAsTemplate(name.trim(), panels);
    setName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="h-3.5 w-3.5" /> Save as template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Save as template</DialogTitle>
        </DialogHeader>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Name</span>
          <input
            autoFocus
            className={baseInputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            placeholder="e.g. My Daily Setup"
          />
        </label>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Cancel</Button>
          </DialogClose>
          <Button size="sm" onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
