import { AppShell } from '@/components/layout/AppShell';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useInitialLoad } from '@/hooks/useInitialLoad';
import { useTheme } from '@/hooks/useTheme';
import { useAccent } from '@/hooks/useAccent';

export default function App() {
  useTheme();
  useAccent();
  useInitialLoad();
  useAutoSave();
  return <AppShell />;
}
