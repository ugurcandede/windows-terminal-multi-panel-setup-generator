import { Highlight, themes, type Language } from 'prism-react-renderer';
import { useResolvedTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils/cn';

interface Props {
  code: string;
  language: Language;
  className?: string;
}

export function CodeBlock({ code, language, className }: Props) {
  const resolved = useResolvedTheme();
  const prismTheme = resolved === 'dark' ? themes.dracula : themes.vsLight;

  return (
    <Highlight code={code} language={language} theme={prismTheme}>
      {({ className: hlClass, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(hlClass, 'm-0 p-4 font-mono text-xs leading-relaxed', className)}
          style={{ ...style, background: 'transparent' }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
