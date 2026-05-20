export type AccentKey = 'blue' | 'purple' | 'teal' | 'green' | 'orange' | 'pink';

export interface Accent {
  key: AccentKey;
  name: string;
  hex: string;
  fg: string;
}

export const ACCENTS: readonly Accent[] = [
  { key: 'blue',   name: 'Blue',   hex: '#3b82f6', fg: '#ffffff' },
  { key: 'purple', name: 'Purple', hex: '#a855f7', fg: '#ffffff' },
  { key: 'teal',   name: 'Teal',   hex: '#14b8a6', fg: '#ffffff' },
  { key: 'green',  name: 'Green',  hex: '#10b981', fg: '#ffffff' },
  { key: 'orange', name: 'Orange', hex: '#f59e0b', fg: '#0a0a0a' },
  { key: 'pink',   name: 'Pink',   hex: '#ec4899', fg: '#ffffff' },
];
