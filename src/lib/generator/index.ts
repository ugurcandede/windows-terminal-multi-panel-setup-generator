import type { Tab } from '@/types/tab';
import { generatePowershell } from './powershell';
import { generateJSON } from './json';
import { generateBatch } from './batch';
import type { GeneratorOutput } from './types';

export { generatePowershell } from './powershell';
export { generateJSON } from './json';
export { generateBatch } from './batch';
export type { GeneratorOutput } from './types';

export const generateAll = (tabs: Tab[]): GeneratorOutput => {
  const ps = generatePowershell(tabs);
  return {
    powershellDisplay: ps.display,
    powershellClipboard: ps.clipboard,
    json: generateJSON(tabs),
    batch: generateBatch(tabs),
  };
};
