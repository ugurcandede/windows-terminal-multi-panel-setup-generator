import { useEffect, useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useSettingsStore } from '@/store/settingsStore';
import { saveConfig } from '@/lib/storage/config';
import { debounce } from '@/lib/utils/debounce';

export function useAutoSave() {
  const autoSave = useSettingsStore((s) => s.autoSave);

  const debounced = useMemo(() => debounce(saveConfig, 400), []);

  useEffect(() => {
    if (!autoSave) return;
    const unsub = useEditorStore.subscribe((state, prev) => {
      if (state.tabs === prev.tabs) return;
      debounced(state.tabs);
    });
    debounced(useEditorStore.getState().tabs);
    return unsub;
  }, [autoSave, debounced]);
}
