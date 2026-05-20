import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { ACCENTS } from '@/lib/data/accents';

export const useAccent = () => {
  const accent = useSettingsStore((s) => s.accent);

  useEffect(() => {
    const preset = ACCENTS.find((a) => a.key === accent) ?? ACCENTS[0];
    document.documentElement.style.setProperty('--accent', preset.hex);
    document.documentElement.style.setProperty('--accent-fg', preset.fg);
  }, [accent]);
};
