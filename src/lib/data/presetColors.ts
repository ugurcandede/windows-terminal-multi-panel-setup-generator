export interface PresetColor {
  name: string;
  hex: string;
}

export const PRESET_COLORS: readonly PresetColor[] = [
  { name: 'Slate', hex: '#64748b' },
  { name: 'Red', hex: '#ff6b6b' },
  { name: 'Teal', hex: '#4ecdc4' },
  { name: 'Sky', hex: '#45b7d1' },
  { name: 'Yellow', hex: '#feca57' },
  { name: 'Pink', hex: '#ff9ff3' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Orange', hex: '#f59e0b' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Rose', hex: '#f43f5e' },
];
