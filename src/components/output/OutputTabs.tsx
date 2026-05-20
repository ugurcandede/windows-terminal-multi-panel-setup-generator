import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { generateAll } from '@/lib/generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { CopyButton } from './CopyButton';

export function OutputTabs() {
  const panels = useEditorStore((s) => s.panels);

  const output = useMemo(() => generateAll(panels), [panels]);

  return (
    <div className="flex h-full flex-col border-t border-zinc-200 dark:border-zinc-800">
      <Tabs defaultValue="powershell" className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4">
          <TabsList>
            <TabsTrigger value="powershell">PowerShell</TabsTrigger>
            <TabsTrigger value="json">JSON Action</TabsTrigger>
            <TabsTrigger value="batch">Batch File</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="powershell" className="relative flex-1 overflow-hidden">
          <div className="absolute right-4 top-2 z-10">
            <CopyButton text={output.powershellClipboard} label="Copy single-line" />
          </div>
          <pre className="h-full overflow-auto bg-zinc-950 p-4 pt-12 font-mono text-xs leading-relaxed text-zinc-100">
            {output.powershellDisplay}
          </pre>
        </TabsContent>

        <TabsContent value="json" className="relative flex-1 overflow-hidden">
          <div className="absolute right-4 top-2 z-10">
            <CopyButton text={output.json} />
          </div>
          <pre className="h-full overflow-auto bg-zinc-950 p-4 pt-12 font-mono text-xs leading-relaxed text-zinc-100">
            {output.json}
          </pre>
        </TabsContent>

        <TabsContent value="batch" className="relative flex-1 overflow-hidden">
          <div className="absolute right-4 top-2 z-10">
            <CopyButton text={output.batch} />
          </div>
          <pre className="h-full overflow-auto bg-zinc-950 p-4 pt-12 font-mono text-xs leading-relaxed text-zinc-100">
            {output.batch}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
