import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { downloadConfigFile } from '@/lib/share/fileShare';

const isEditableElement = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
};

interface Options {
  onShowShortcuts: () => void;
  onAddPanel: () => void;
}

export const useKeyboardShortcuts = ({ onShowShortcuts, onAddPanel }: Options) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key;

      // Undo / redo — work even inside input fields, but only with modifier
      if (ctrl && !e.shiftKey && (key === 'z' || key === 'Z')) {
        useEditorStore.temporal.getState().undo();
        e.preventDefault();
        return;
      }
      if (ctrl && e.shiftKey && (key === 'z' || key === 'Z')) {
        useEditorStore.temporal.getState().redo();
        e.preventDefault();
        return;
      }
      if (ctrl && (key === 'y' || key === 'Y')) {
        useEditorStore.temporal.getState().redo();
        e.preventDefault();
        return;
      }

      // Ctrl+N — add panel (avoid native new-window only when fields aren't focused)
      if (ctrl && (key === 'n' || key === 'N')) {
        if (isEditableElement(e.target)) return;
        e.preventDefault();
        onAddPanel();
        return;
      }

      // Ctrl+S — export config
      if (ctrl && (key === 's' || key === 'S')) {
        e.preventDefault();
        downloadConfigFile(useEditorStore.getState().panels);
        return;
      }

      // Delete focused panel (only when not typing)
      if ((key === 'Delete' || key === 'Backspace') && !isEditableElement(e.target)) {
        const { selectedId, deletePanel } = useEditorStore.getState();
        if (selectedId) {
          e.preventDefault();
          deletePanel(selectedId);
        }
        return;
      }

      // ? — show shortcuts (only when not typing)
      if (key === '?' && !isEditableElement(e.target)) {
        e.preventDefault();
        onShowShortcuts();
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onShowShortcuts, onAddPanel]);
};
