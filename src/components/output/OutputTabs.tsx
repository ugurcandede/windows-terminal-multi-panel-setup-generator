import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { generateAll } from '@/lib/generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { CopyButton } from './CopyButton';
import { CodeBlock } from './CodeBlock';

export function OutputTabs() {
  const tabs = useEditorStore((s) => s.tabs);
  const output = useMemo(() => generateAll(tabs), [tabs]);

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
          <CodeBlock code={output.powershellDisplay} language="powershell" />
        </TabsContent>

        <TabsContent value="json" className="relative flex-1 overflow-hidden">
          <div className="absolute right-4 top-2 z-10">
            <CopyButton text={output.json} />
          </div>
          <CodeBlock code={output.json} language="json" />
        </TabsContent>

        <TabsContent value="batch" className="relative flex-1 overflow-hidden">
          <div className="absolute right-4 top-2 z-10">
            <CopyButton text={output.batch} />
          </div>
          <CodeBlock code={output.batch} language="batch" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
