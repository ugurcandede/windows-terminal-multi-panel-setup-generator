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

// Browser-safe bindings. Avoid Ctrl+N (new window — non-overridable in
// Chrome/Firefox) and Ctrl+S (browser save-page dialog, surprises users
// even when overridden). Single-letter keys only fire when no input has
// focus so they never eat typed characters. Ctrl/Cmd+Z and Ctrl+Shift+Z
// stay native inside text inputs so typing-level undo keeps working.
export const useKeyboardShortcuts = ({ onShowShortcuts, onAddPanel }: Options) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key;
      const insideInput = isEditableElement(e.target);

      // Undo / redo — app-level only when input not focused; inside inputs
      // the browser's native text undo takes over.
      if (!insideInput) {
        if (ctrl && !e.shiftKey && (key === 'z' || key === 'Z')) {
          e.preventDefault();
          useEditorStore.temporal.getState().undo();
          return;
        }
        if (ctrl && e.shiftKey && (key === 'z' || key === 'Z')) {
          e.preventDefault();
          useEditorStore.temporal.getState().redo();
          return;
        }
      }

      // Alt+E — export configuration (Ctrl+S replacement; Alt+letter doesn't
      // collide with default browser actions on Win/Mac/Linux).
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (key === 'e' || key === 'E')) {
        e.preventDefault();
        downloadConfigFile(useEditorStore.getState().panels);
        return;
      }

      // Single-letter shortcuts only fire when not typing.
      if (insideInput) return;

      // `n` — add new panel
      if (!ctrl && !e.altKey && !e.shiftKey && (key === 'n' || key === 'N')) {
        e.preventDefault();
        onAddPanel();
        return;
      }

      // Delete selected panel
      if (key === 'Delete' || key === 'Backspace') {
        const { selectedId, deletePanel } = useEditorStore.getState();
        if (selectedId) {
          e.preventDefault();
          deletePanel(selectedId);
        }
        return;
      }

      // ? — show shortcuts dialog
      if (key === '?') {
        e.preventDefault();
        onShowShortcuts();
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onShowShortcuts, onAddPanel]);
};
