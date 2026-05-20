import { ChevronRight } from 'lucide-react';
import { useActivePanels, useEditorStore } from '@/store/editorStore';
import { useFieldIssues } from '@/hooks/useValidation';
import { Field, baseInputClass, baseTextareaClass } from './Field';
import { ColorPicker } from './ColorPicker';
import { ProfileSelect } from './ProfileSelect';
import { SplitControls } from './SplitControls';
import { ValidationHint, borderClassFor } from './ValidationHint';
import { cn } from '@/lib/utils/cn';

interface Props {
  onCollapse?: () => void;
}

export function InspectorPanel({ onCollapse }: Props = {}) {
  const panels = useActivePanels();
  const selectedId = useEditorStore((s) => s.selectedId);
  const updatePanel = useEditorStore((s) => s.updatePanel);

  const selected = panels.find((p) => p.id === selectedId);
  const index = selected ? panels.indexOf(selected) : -1;
  const isFirst = index === 0;

  const titleIssues = useFieldIssues(selected?.id ?? null, 'title');
  const dirIssues = useFieldIssues(selected?.id ?? null, 'directory');
  const cmdIssues = useFieldIssues(selected?.id ?? null, 'commands');
  const colorIssues = useFieldIssues(selected?.id ?? null, 'color');
  const splitIssues = useFieldIssues(selected?.id ?? null, 'split');
  const sizeIssues = useFieldIssues(selected?.id ?? null, 'size');

  const collapseButton = onCollapse ? (
    <button
      type="button"
      onClick={onCollapse}
      aria-label="Collapse inspector"
      title="Collapse inspector"
      className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
    >
      <ChevronRight className="h-3.5 w-3.5" />
    </button>
  ) : null;

  if (!selected) {
    return (
      <div className="flex h-full flex-col">
        {collapseButton && (
          <div className="flex items-center justify-end border-b border-zinc-200 px-2 py-1.5 dark:border-zinc-800">
            {collapseButton}
          </div>
        )}
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-zinc-500">
          <div>
            <p className="mb-1 font-medium">No panel selected</p>
            <p className="text-xs">Pick a panel from the left rail or click one in the preview.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-center gap-2">
        <h2 className="flex-1 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Panel {index + 1}
        </h2>
        <span className="text-xs text-zinc-500">{isFirst ? 'new-tab' : 'split-pane'}</span>
        {collapseButton}
      </div>

      <Field label="Title" htmlFor={`title-${selected.id}`}>
        <input
          id={`title-${selected.id}`}
          className={cn(baseInputClass, borderClassFor(titleIssues))}
          value={selected.title}
          placeholder="e.g. Frontend"
          onChange={(e) => updatePanel(selected.id, { title: e.target.value })}
        />
        <ValidationHint issues={titleIssues} />
      </Field>

      <Field label="Starting directory" htmlFor={`dir-${selected.id}`}>
        <input
          id={`dir-${selected.id}`}
          className={cn(baseInputClass, borderClassFor(dirIssues))}
          value={selected.directory}
          placeholder="C:\\Projects\\frontend"
          onChange={(e) => updatePanel(selected.id, { directory: e.target.value })}
          spellCheck={false}
        />
        <ValidationHint issues={dirIssues} />
      </Field>

      <Field label="Commands" htmlFor={`cmd-${selected.id}`} hint={cmdIssues.length === 0 ? 'One command per line. Leave empty to open an interactive shell.' : undefined}>
        <textarea
          id={`cmd-${selected.id}`}
          className={cn(baseTextareaClass, borderClassFor(cmdIssues))}
          value={selected.commands}
          placeholder="npm run dev"
          onChange={(e) => updatePanel(selected.id, { commands: e.target.value })}
          spellCheck={false}
        />
        <ValidationHint issues={cmdIssues} />
      </Field>

      <Field label="Profile">
        <ProfileSelect
          value={selected.profile}
          onChange={(p) => updatePanel(selected.id, { profile: p })}
          commands={selected.commands}
        />
      </Field>

      <Field label="Tab color">
        <ColorPicker value={selected.color} onChange={(hex) => updatePanel(selected.id, { color: hex })} />
        <ValidationHint issues={colorIssues} />
      </Field>

      {!isFirst && (
        <>
          <SplitControls
            panel={selected}
            onSplitChange={(dir) => updatePanel(selected.id, { split: dir })}
            onSizeChange={(size) => updatePanel(selected.id, { size })}
          />
          <ValidationHint issues={[...splitIssues, ...sizeIssues]} />
        </>
      )}
    </div>
  );
}
