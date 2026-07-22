export interface IvrFlowNode {
  id: string;
  digit?: string;
  label: string;
  prompt: string;
  hangup: boolean;
  destination: string;
  webhookUrl?: string;
  children: IvrFlowNode[];
}

export interface IvrFlow {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  rootMenu: IvrFlowNode;
  createdAt: number;
  updatedAt: number;
}

export interface IvrFlowOption {
  digit: number;
  destination: string;
  prompt: string;
  hangup: boolean;
  options: IvrFlowOption[];
}

export interface IvrFlowApiPayload {
  main: {
    prompt: string;
    options: IvrFlowOption[];
  };
}

export interface IvrListItem {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  itemCount: number;
  lastModified: number;
}

export function findNodeById(root: IvrFlowNode, id: string): IvrFlowNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function flattenOptions(node: IvrFlowNode): { digit: string; label: string }[] {
  return node.children.map((child) => ({
    digit: child.digit || '?',
    label: child.label,
  }));
}

export const DIAL_PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export function buildApiPayload(flow: IvrFlow): IvrFlowApiPayload {
  const mapNode = (node: IvrFlowNode): IvrFlowOption => ({
    digit: parseInt(node.digit || '0') || 0,
    destination: node.destination || '',
    prompt: node.prompt || '',
    hangup: node.hangup || false,
    options: (node.children || []).map(mapNode),
  });

  return {
    main: {
      prompt: flow.rootMenu.prompt || '',
      options: (flow.rootMenu.children || []).map(mapNode),
    },
  };
}
