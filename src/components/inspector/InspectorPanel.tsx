import { useEditorStore } from '@/store/editorStore';
import { Field, baseInputClass, baseTextareaClass } from './Field';
import { ColorPicker } from './ColorPicker';
import { ProfileSelect } from './ProfileSelect';
import { SplitControls } from './SplitControls';

export function InspectorPanel() {
  const panels = useEditorStore((s) => s.panels);
  const selectedId = useEditorStore((s) => s.selectedId);
  const updatePanel = useEditorStore((s) => s.updatePanel);

  const selected = panels.find((p) => p.id === selectedId);
  const index = selected ? panels.indexOf(selected) : -1;
  const isFirst = index === 0;

  if (!selected) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-zinc-500">
        <div>
          <p className="mb-1 font-medium">No panel selected</p>
          <p className="text-xs">Pick a panel from the left rail to edit its properties.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Panel {index + 1}
        </h2>
        <span className="text-xs text-zinc-500">{isFirst ? 'new-tab' : 'split-pane'}</span>
      </div>

      <Field label="Title" htmlFor={`title-${selected.id}`}>
        <input
          id={`title-${selected.id}`}
          className={baseInputClass}
          value={selected.title}
          placeholder="e.g. Frontend"
          onChange={(e) => updatePanel(selected.id, { title: e.target.value })}
        />
      </Field>

      <Field label="Starting directory" htmlFor={`dir-${selected.id}`} hint="e.g. C:\\Projects\\frontend">
        <input
          id={`dir-${selected.id}`}
          className={baseInputClass}
          value={selected.directory}
          placeholder="C:\\"
          onChange={(e) => updatePanel(selected.id, { directory: e.target.value })}
          spellCheck={false}
        />
      </Field>

      <Field label="Commands" htmlFor={`cmd-${selected.id}`} hint="One command per line. Leave empty to open an interactive shell.">
        <textarea
          id={`cmd-${selected.id}`}
          className={baseTextareaClass}
          value={selected.commands}
          placeholder="npm run dev"
          onChange={(e) => updatePanel(selected.id, { commands: e.target.value })}
          spellCheck={false}
        />
      </Field>

      <Field label="Profile">
        <ProfileSelect value={selected.profile} onChange={(p) => updatePanel(selected.id, { profile: p })} />
      </Field>

      <Field label="Tab color">
        <ColorPicker value={selected.color} onChange={(hex) => updatePanel(selected.id, { color: hex })} />
      </Field>

      {!isFirst && (
        <SplitControls
          panel={selected}
          onSplitChange={(dir) => updatePanel(selected.id, { split: dir })}
          onSizeChange={(size) => updatePanel(selected.id, { size })}
        />
      )}
    </div>
  );
}
