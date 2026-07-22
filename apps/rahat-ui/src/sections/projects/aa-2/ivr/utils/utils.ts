import {
  IvrFlow,
  IvrFlowNode,
  IvrFlowOption,
  IvrFlowApiPayload,
} from '../types/ivr.flow.types';

/**
 * Removes a node from the tree by ID (mutates the tree in place).
 */
export function removeNodeById(root: IvrFlowNode, id: string): boolean {
  const idx = root.children.findIndex((c) => c.id === id);
  if (idx !== -1) {
    root.children.splice(idx, 1);
    return true;
  }
  for (const child of root.children) {
    if (removeNodeById(child, id)) return true;
  }
  return false;
}

/**
 * Finds the parent node of a given node ID in the tree.
 */
export function findParent(root: IvrFlowNode, id: string): IvrFlowNode | null {
  const idx = root.children.findIndex((c) => c.id === id);
  if (idx !== -1) return root;
  for (const child of root.children) {
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
}

/**
 * Builds a breadcrumb path (array of labels) from root to the target node.
 */
export function getBreadcrumbPath(
  root: IvrFlowNode,
  targetId: string,
): string[] {
  const path: string[] = [];
  const traverse = (node: IvrFlowNode): boolean => {
    path.push(node.label);
    if (node.id === targetId) return true;
    for (const child of node.children) {
      if (traverse(child)) return true;
    }
    path.pop();
    return false;
  };
  traverse(root);
  return path;
}

export function findNodeById(
  root: IvrFlowNode,
  id: string,
): IvrFlowNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function flattenOptions(
  node: IvrFlowNode,
): { digit: string; label: string }[] {
  return node.children.map((child) => ({
    digit: child.digit || '?',
    label: child.label,
  }));
}

export const DIAL_PAD = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '*',
  '0',
  '#',
];

export function buildApiPayload(flow: IvrFlow): IvrFlowApiPayload {
  const mapNode = (node: IvrFlowNode): IvrFlowOption => ({
    digit: parseInt(node.digit ?? '0') || 0,
    destination: node.destination ?? '',
    prompt: node.prompt ?? '',
    hangup: node.hangup ?? false,
    options: (node.children ?? []).map(mapNode),
  });

  return {
    main: {
      prompt: flow.rootMenu.prompt ?? '',
      options: (flow.rootMenu.children ?? []).map(mapNode),
    },
  };
}
