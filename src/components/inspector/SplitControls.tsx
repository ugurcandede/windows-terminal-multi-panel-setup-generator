import { Slider } from '@/components/ui/Slider';
import { Field } from './Field';
import type { Panel, SplitDirection } from '@/types/panel';
import { cn } from '@/lib/utils/cn';

interface Props {
  panel: Panel;
  onSplitChange: (dir: SplitDirection) => void;
  onSizeChange: (size: number) => void;
}

export function SplitControls({ panel, onSplitChange, onSizeChange }: Props) {
  return (
    <>
      <Field label="Split direction">
        <div className="grid grid-cols-2 gap-2">
          {(['vertical', 'horizontal'] as SplitDirection[]).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => onSplitChange(dir)}
              className={cn(
                'h-9 rounded-md border text-sm transition-colors',
                panel.split === dir
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              )}
            >
              {dir === 'vertical' ? 'Vertical (-V)' : 'Horizontal (-H)'}
            </button>
          ))}
        </div>
      </Field>

      <Field label={`Size — ${Math.round(panel.size * 100)}%`}>
        <Slider
          min={0.1}
          max={0.9}
          step={0.05}
          value={[panel.size]}
          onValueChange={(v) => onSizeChange(v[0])}
        />
      </Field>
    </>
  );
}
