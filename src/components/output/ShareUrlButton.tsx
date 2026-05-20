import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEditorStore } from '@/store/editorStore';
import { buildShareUrl } from '@/lib/share/urlShare';

export function ShareUrlButton() {
  const [copied, setCopied] = useState(false);
  const panels = useEditorStore((s) => s.panels);

  const handleShare = async () => {
    const url = buildShareUrl(panels);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.warn('Clipboard write failed', err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare} disabled={panels.length === 0}>
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Link2 className="h-3.5 w-3.5" />}
      {copied ? 'Link copied' : 'Share link'}
    </Button>
  );
}
