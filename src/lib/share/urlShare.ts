import type { Panel } from '@/types/panel';
import { sanitizePanels } from '@/lib/storage/sanitize';

// Compress field names to keep URLs short. Values stay as-is (already small).
interface CompactPanel {
  t: string;
  d: string;
  c: string;
  cl: string;
  p: string;
  s: string | null;
  sz: number;
}

const SHARE_VERSION = '2';

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

export const encodePanelsToParam = (panels: Panel[]): string =>
  toBase64Url(JSON.stringify(panels.map(compactPanel)));

export const decodePanelsFromParam = (param: string): Panel[] | null => {
  try {
    const json = fromBase64Url(param);
    const raw = JSON.parse(json) as CompactPanel[];
    if (!Array.isArray(raw)) return null;
    const expanded = raw.map(expandPanel);
    const sanitized = sanitizePanels(expanded);
    return sanitized.length > 0 ? sanitized : null;
  } catch {
    return null;
  }
};

export const buildShareUrl = (panels: Panel[]): string => {
  const param = encodePanelsToParam(panels);
  const url = new URL(window.location.href);
  url.searchParams.set('v', SHARE_VERSION);
  url.searchParams.set('p', param);
  return url.toString();
};

export const readPanelsFromUrl = (): Panel[] | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('v') !== SHARE_VERSION) return null;
  const p = params.get('p');
  if (!p) return null;
  return decodePanelsFromParam(p);
};

export const replaceUrlWithoutShareParams = (): void => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('v');
  url.searchParams.delete('p');
  window.history.replaceState({}, '', url.toString());
};
