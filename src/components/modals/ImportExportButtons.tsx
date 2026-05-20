import { useRef, useState } from 'react';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEditorStore } from '@/store/editorStore';
import { downloadConfigFile, readConfigFile } from '@/lib/share/fileShare';

export function ImportExportButtons() {
  const panels = useEditorStore((s) => s.panels);
  const loadPanels = useEditorStore((s) => s.loadPanels);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    if (panels.length === 0) return;
    downloadConfigFile(panels);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await readConfigFile(file);
      loadPanels(imported);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
      setTimeout(() => setError(null), 3500);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-3.5 w-3.5" /> Import
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-3.5 w-3.5" /> Export
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFileChange}
      />
      {error && (
        <span className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </span>
      )}
    </>
  );
}
