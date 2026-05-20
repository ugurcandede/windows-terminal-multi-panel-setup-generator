import { useMemo, useState } from 'react';
import { FilePlus2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/output/CopyButton';
import { useEditorStore } from '@/store/editorStore';
import { generateJSON } from '@/lib/generator';
import { cn } from '@/lib/utils/cn';

const STEPS = [
  {
    title: 'Open Windows Terminal settings',
    body: 'In Windows Terminal press Ctrl+, (or open Settings → Open JSON file). This opens settings.json in your default editor.',
  },
  {
    title: 'Find or create the "actions" array',
    body: 'Locate the top-level "actions" array. If it does not exist, add it as a sibling of "schemes" and "profiles".',
  },
  {
    title: 'Paste the generated action',
    body: 'Add this JSON object as a new entry in the "actions" array. Save the file, then trigger the action via the command palette or bind it to a key.',
  },
];

export function InjectWizardDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const tabs = useEditorStore((s) => s.tabs);
  const json = useMemo(() => generateJSON(tabs), [tabs]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setStep(0);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FilePlus2 className="h-3.5 w-3.5" /> Inject into settings.json
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Inject into Windows Terminal settings</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {STEPS.length}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i <= step ? 'bg-[var(--accent)]' : 'bg-zinc-200 dark:bg-zinc-800'
              )}
            />
          ))}
        </div>

        <div>
          <h3 className="text-sm font-semibold">{STEPS[step].title}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{STEPS[step].body}</p>
        </div>

        {step === STEPS.length - 1 && (
          <div className="relative">
            <div className="absolute right-2 top-2 z-10">
              <CopyButton text={json} />
            </div>
            <pre className="max-h-72 overflow-auto rounded-md bg-zinc-950 p-4 pt-12 font-mono text-xs leading-relaxed text-zinc-100">
              {json}
            </pre>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="ghost" size="sm" onClick={prev} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button size="sm" onClick={next}>
              Next
            </Button>
          ) : (
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
