import { AppShell } from '@/components/layout/AppShell';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useInitialLoad } from '@/hooks/useInitialLoad';

export default function App() {
  useInitialLoad();
  useAutoSave();
  return <AppShell />;
}
