import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

const applyTheme = (resolved: 'light' | 'dark') => {
  const root = document.documentElement;
  if (resolved === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
};

const systemPrefers = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const useTheme = () => {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const resolved = theme === 'system' ? systemPrefers() : theme;
    applyTheme(resolved);

    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme(systemPrefers());
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return theme;
};

export const useResolvedTheme = (): 'light' | 'dark' => {
  const theme = useSettingsStore((s) => s.theme);
  if (theme !== 'system') return theme;
  if (typeof window === 'undefined') return 'light';
  return systemPrefers();
};
