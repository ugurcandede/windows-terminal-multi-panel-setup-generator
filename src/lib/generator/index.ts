import type { Panel } from '@/types/panel';
import { generatePowershell } from './powershell';
import { generateJSON } from './json';
import { generateBatch } from './batch';
import type { GeneratorOutput } from './types';

export { generatePowershell } from './powershell';
export { generateJSON } from './json';
export { generateBatch } from './batch';
export type { GeneratorOutput } from './types';

export const generateAll = (panels: Panel[]): GeneratorOutput => {
  const ps = generatePowershell(panels);
  return {
    powershellDisplay: ps.display,
    powershellClipboard: ps.clipboard,
    json: generateJSON(panels),
    batch: generateBatch(panels),
  };
};
