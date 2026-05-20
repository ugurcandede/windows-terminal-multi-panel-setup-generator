import { useMemo, type ReactNode } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { generateAll } from '@/lib/generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useResolvedTheme } from '@/hooks/useTheme';
import { CopyButton } from './CopyButton';
import { CodeBlock } from './CodeBlock';
import { RunInWtButton } from './RunInWtButton';
import { cn } from '@/lib/utils/cn';
import type { Language } from 'prism-react-renderer';

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

        <TabsContent value="powershell" className="flex-1 overflow-hidden">
          <CodePane
            code={output.powershellDisplay}
            language="powershell"
            actions={
              <>
                <CopyButton text={output.powershellClipboard} label="Copy single-line" />
                <RunInWtButton command={output.powershellClipboard} />
              </>
            }
          />
        </TabsContent>

        <TabsContent value="json" className="flex-1 overflow-hidden">
          <CodePane
            code={output.json}
            language="json"
            actions={<CopyButton text={output.json} />}
          />
        </TabsContent>

        <TabsContent value="batch" className="flex-1 overflow-hidden">
          <CodePane
            code={output.batch}
            language="batch"
            actions={<CopyButton text={output.batch} />}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CodePaneProps {
  code: string;
  language: Language;
  actions: ReactNode;
}

function CodePane({ code, language, actions }: CodePaneProps) {
  const resolved = useResolvedTheme();
  // The action toolbar sits above the scrollable content as an absolute
  // overlay — it never pushes the code lines down or scrolls away with them.
  return (
    <div
      className={cn(
        'relative h-full overflow-auto',
        resolved === 'dark' ? 'bg-[#282a36]' : 'bg-[#ffffff]'
      )}
    >
      <div className="pointer-events-none sticky top-0 z-10 flex justify-end p-2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-md bg-zinc-900/80 p-1 shadow-sm backdrop-blur-sm dark:bg-zinc-950/80">
          {actions}
        </div>
      </div>
      <div className="-mt-12">
        <CodeBlock code={code} language={language} className="pt-14" />
      </div>
    </div>
  );
}
