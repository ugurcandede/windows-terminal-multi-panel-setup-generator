import { useMemo } from 'react';
import type { Panel } from '@/types/panel';

export type LayoutNode =
  | { kind: 'leaf'; panelId: string }
  | {
      kind: 'split';
      /** rrp PanelGroup direction. NOTE: wt -V (vertical split) renders side-by-side,
       *  which corresponds to rrp 'horizontal'. wt -H renders stacked → rrp 'vertical'. */
      direction: 'horizontal' | 'vertical';
      /** sizes[1] is always the newly added panel's size; sizes[0] is the rest. */
      sizes: [number, number];
      /** children[1] is always a leaf for the panel that introduced this split. */
      children: [LayoutNode, LayoutNode];
      /** id of the split-handle's panel (children[1]). drives onLayout → resizePane mapping. */
      panelId: string;
    };

type Path = number[];

const findLastLeafPath = (node: LayoutNode, path: Path = []): Path => {
  if (node.kind === 'leaf') return path;
  return findLastLeafPath(node.children[1], [...path, 1]);
};

const replaceAtPath = (
  node: LayoutNode,
  path: Path,
  replacer: (n: LayoutNode) => LayoutNode
): LayoutNode => {
  if (path.length === 0) return replacer(node);
  if (node.kind !== 'split') throw new Error('Cannot traverse leaf');
  const [head, ...rest] = path;
  const newChildren: [LayoutNode, LayoutNode] = [...node.children];
  newChildren[head] = replaceAtPath(node.children[head], rest, replacer);
  return { ...node, children: newChildren };
};

export const buildLayoutTree = (panels: Panel[]): LayoutNode | null => {
  if (!panels || panels.length === 0) return null;
  let root: LayoutNode = { kind: 'leaf', panelId: panels[0].id };

  for (let i = 1; i < panels.length; i++) {
    const panel = panels[i];
    const direction: 'horizontal' | 'vertical' =
      panel.split === 'horizontal' ? 'vertical' : 'horizontal';
    const newSize = Math.max(0.1, Math.min(0.9, panel.size));

    const lastPath = findLastLeafPath(root);
    root = replaceAtPath(root, lastPath, (existing) => ({
      kind: 'split',
      direction,
      sizes: [1 - newSize, newSize],
      children: [existing, { kind: 'leaf', panelId: panel.id }],
      panelId: panel.id,
    }));
  }

  return root;
};

export const useLayoutTree = (panels: Panel[]): LayoutNode | null =>
  useMemo(() => buildLayoutTree(panels), [panels]);
