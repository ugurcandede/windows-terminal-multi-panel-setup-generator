import type { Panel } from '@/types/panel';
import type { Tab } from '@/types/tab';
import { sanitizePanels } from '@/lib/storage/sanitize';
import { sanitizeTabs } from '@/lib/storage/sanitizeTabs';

// Compact field names to keep URLs short.
interface CompactPanel {
  t: string;  // title
  d: string;  // directory
  c: string;  // commands
  cl: string; // color
  p: string;  // profile
  s: string | null; // split
  sz: number; // size
}

interface CompactTab {
  n: string;          // name
  p: CompactPanel[];  // panels
}

const SHARE_VERSION = '3';

const compactPanel = (p: Panel): CompactPanel => ({
  t: p.title,
  d: p.directory,
  c: p.commands,
  cl: p.color,
  p: p.profile,
  s: p.split,
  sz: p.size,
});

const expandPanel = (c: CompactPanel): Partial<Panel> => ({
  title: c.t,
  directory: c.d,
  commands: c.c,
  color: c.cl,
  profile: c.p as Panel['profile'],
  split: c.s as Panel['split'],
  size: c.sz,
});

const compactTab = (t: Tab): CompactTab => ({
  n: t.name,
  p: t.panels.map(compactPanel),
});

// btoa works with ASCII; use TextEncoder→base64 for unicode safety.
const toBase64Url = (s: string): string => {
  const bytes = new TextEncoder().encode(s);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (s: string): string => {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};

export const encodeTabsToParam = (tabs: Tab[]): string =>
  toBase64Url(JSON.stringify(tabs.map(compactTab)));

export const decodeTabsFromParam = (param: string): Tab[] | null => {
  try {
    const json = fromBase64Url(param);
    const raw = JSON.parse(json) as CompactTab[];
    if (!Array.isArray(raw)) return null;
    const expanded = raw.map((t) => ({
      name: typeof t.n === 'string' ? t.n : '',
      panels: Array.isArray(t.p) ? t.p.map(expandPanel) : [],
    }));
    return sanitizeTabs(expanded);
  } catch {
    return null;
  }
};

// v2 compatibility: panels-only share URLs.
const decodeLegacyPanels = (param: string): Tab[] | null => {
  try {
    const json = fromBase64Url(param);
    const raw = JSON.parse(json) as CompactPanel[];
    if (!Array.isArray(raw)) return null;
    const panels = sanitizePanels(raw.map(expandPanel));
    if (panels.length === 0) return null;
    return [{ id: 'legacy', name: '', panels }];
  } catch {
    return null;
  }
};

export const buildShareUrl = (tabs: Tab[]): string => {
  const param = encodeTabsToParam(tabs);
  const url = new URL(window.location.href);
  url.searchParams.set('v', SHARE_VERSION);
  url.searchParams.set('p', param);
  return url.toString();
};

export const readTabsFromUrl = (): Tab[] | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const version = params.get('v');
  const p = params.get('p');
  if (!p) return null;
  if (version === SHARE_VERSION) return decodeTabsFromParam(p);
  if (version === '2') return decodeLegacyPanels(p);
  return null;
};

export const replaceUrlWithoutShareParams = (): void => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('v');
  url.searchParams.delete('p');
  window.history.replaceState({}, '', url.toString());
};
