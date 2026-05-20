import { PRESET_COLORS } from '@/lib/data/presetColors';
import { cn } from '@/lib/utils/cn';

interface Props {
  value: string;
  onChange: (hex: string) => void;
}

export function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESET_COLORS.map((c) => (
        <button
          key={c.hex}
          type="button"
          title={c.name}
          aria-label={c.name}
          onClick={() => onChange(c.hex)}
          className={cn(
            'h-7 w-7 rounded-full ring-1 ring-zinc-300 transition-transform dark:ring-zinc-700',
            value.toLowerCase() === c.hex.toLowerCase()
              ? 'scale-110 ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
              : 'hover:scale-105'
          )}
          style={{ backgroundColor: c.hex }}
        />
      ))}
      <label
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-dashed border-zinc-400 text-xs text-zinc-500 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        title="Custom color"
      >
        +
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </label>
    </div>
  );
}
