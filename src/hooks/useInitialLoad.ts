import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { loadConfig } from '@/lib/storage/config';
import { readTabsFromUrl, replaceUrlWithoutShareParams } from '@/lib/share/urlShare';

/**
 * Loads initial editor state on mount: URL share param > localStorage > default empty tab.
 * Runs once. URL share takes precedence and is stripped from the address bar
 * after consumption so subsequent reloads pull from the (auto-saved) LS state.
 */
export function useInitialLoad() {
  const loadTabs = useEditorStore((s) => s.loadTabs);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const fromUrl = readTabsFromUrl();
    if (fromUrl && fromUrl.length > 0) {
      loadTabs(fromUrl);
      replaceUrlWithoutShareParams();
      return;
    }

    const fromLs = loadConfig();
    if (fromLs && fromLs.length > 0) {
      loadTabs(fromLs);
    }
  }, [loadTabs]);
}
