import { nanoid } from 'nanoid';
import type { Panel, Profile, SplitDirection } from '@/types/panel';
import { DEFAULT_COLOR, DEFAULT_SIZE, PROFILES } from '@/types/panel';

const isProfile = (v: unknown): v is Profile =>
  typeof v === 'string' && (PROFILES as readonly string[]).includes(v);

const isSplit = (v: unknown): v is SplitDirection =>
  v === 'vertical' || v === 'horizontal';

const HEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const sanitizePanel = (raw: unknown, index: number): Panel => {
  const r = (raw ?? {}) as Record<string, unknown>;
  const isFirst = index === 0;
  const sizeRaw = typeof r.size === 'number' ? r.size : isFirst ? 1.0 : DEFAULT_SIZE;
  const colorRaw = typeof r.color === 'string' && HEX.test(r.color) ? r.color : DEFAULT_COLOR;

  return {
    id: typeof r.id === 'string' && r.id.length > 0 ? r.id : nanoid(8),
    title: typeof r.title === 'string' ? r.title : '',
    directory: typeof r.directory === 'string' ? r.directory : '',
    commands: typeof r.commands === 'string' ? r.commands : '',
    color: colorRaw,
    profile: isProfile(r.profile) ? r.profile : 'PowerShell',
    split: isFirst ? null : isSplit(r.split) ? r.split : 'vertical',
    size: isFirst ? 1.0 : Math.max(0.1, Math.min(0.9, sizeRaw)),
  };
};

export const sanitizePanels = (raw: unknown): Panel[] => {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 6).map((p, i) => sanitizePanel(p, i));
};
