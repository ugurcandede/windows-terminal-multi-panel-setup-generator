import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { loadConfig } from '@/lib/storage/config';
import { readPanelsFromUrl, replaceUrlWithoutShareParams } from '@/lib/share/urlShare';

/**
 * Loads initial panels on mount: URL share param > localStorage > default empty.
 * Runs once. URL share takes precedence and is stripped from the address bar
 * after consumption so subsequent reloads pull from the (auto-saved) LS state.
 */
export function useInitialLoad() {
  const loadPanels = useEditorStore((s) => s.loadPanels);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const fromUrl = readPanelsFromUrl();
    if (fromUrl && fromUrl.length > 0) {
      loadPanels(fromUrl);
      replaceUrlWithoutShareParams();
      return;
    }

    const fromLs = loadConfig();
    if (fromLs && fromLs.length > 0) {
      loadPanels(fromLs);
    }
  }, [loadPanels]);
}
