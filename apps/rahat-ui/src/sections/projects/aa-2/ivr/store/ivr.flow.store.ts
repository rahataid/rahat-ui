import { create } from 'zustand';
import { IvrFlow, IvrFlowNode, findNodeById } from '../types/ivr.flow.types';

let nodeIdCounter = 0;
const generateNodeId = () => `node_${++nodeIdCounter}_${Date.now()}`;

function createDefaultRootMenu(): IvrFlowNode {
  return {
    id: generateNodeId(),
    label: 'Main Menu',
    prompt: '',
    hangup: false,
    destination: '',
    children: [],
  };
}

interface IvrFlowStore {
  flows: IvrFlow[];
  currentFlowId: string | null;

  loadFlow: (flowId: string) => IvrFlow | undefined;
  getCurrentFlow: () => IvrFlow | null;

  addNode: (parentId: string, node: Partial<IvrFlowNode>) => void;
  updateNode: (nodeId: string, updates: Partial<IvrFlowNode>) => void;
  deleteNode: (nodeId: string) => void;
  setFlowRootMenu: (flowId: string, rootMenu: IvrFlowNode) => void;
}

function removeNodeById(root: IvrFlowNode, id: string): boolean {
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

const initialFlows: IvrFlow[] = [];

export const useIvrFlowStore = create<IvrFlowStore>((set, get) => ({
  flows: initialFlows,
  currentFlowId: null,

  loadFlow: (flowId) => {
    const { flows } = get();
    let flow = flows.find((f) => f.id === flowId);
    if (!flow) {
      const newFlow: IvrFlow = {
        id: flowId,
        name: 'Untitled Flow',
        description: '',
        status: 'draft',
        rootMenu: createDefaultRootMenu(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      set({ flows: [...flows, newFlow], currentFlowId: flowId });
      return newFlow;
    }
    set({ currentFlowId: flowId });
    return flow;
  },

  getCurrentFlow: () => {
    const { flows, currentFlowId } = get();
    return flows.find((f) => f.id === currentFlowId) || null;
  },

  addNode: (parentId, nodePartial) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      const parent = findNodeById(flow.rootMenu, parentId);
      if (!parent) return state;

      // Parent now has children, so it should not hangup
      parent.hangup = false;

      const takenDigits = new Set(
        parent.children.map((c) => c.digit).filter((d): d is string => !!d),
      );

      const availableDigit = (() => {
        for (let i = 1; i <= 9; i++) {
          if (!takenDigits.has(String(i))) return i;
        }
        return null;
      })();

      if (availableDigit === null) return state;

      const newNode: IvrFlowNode = {
        id: generateNodeId(),
        digit: String(availableDigit),
        label: `Digit ${availableDigit}`,
        prompt: '',
        hangup: false,
        destination: '',
        children: [],
        ...nodePartial,
      };

      // New node has no children, so it should hangup (leaf node)
      newNode.hangup = true;

      parent.children.push(newNode);

      return {
        flows: state.flows.map((f) =>
          f.id === flow.id ? { ...flow, updatedAt: Date.now() } : f,
        ),
      };
    });
  },

  updateNode: (nodeId, updates) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      const node = findNodeById(flow.rootMenu, nodeId);
      if (!node) return state;

      Object.assign(node, updates, { id: node.id });

      return {
        flows: state.flows.map((f) =>
          f.id === flow.id ? { ...flow, updatedAt: Date.now() } : f,
        ),
      };
    });
  },

  deleteNode: (nodeId) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      if (flow.rootMenu.id === nodeId) return state;

      // Find parent before deleting the child
      const findParent = (
        root: IvrFlowNode,
        id: string,
      ): IvrFlowNode | null => {
        const idx = root.children.findIndex((c) => c.id === id);
        if (idx !== -1) return root;
        for (const child of root.children) {
          const found = findParent(child, id);
          if (found) return found;
        }
        return null;
      };

      const parent = findParent(flow.rootMenu, nodeId);

      removeNodeById(flow.rootMenu, nodeId);

      // If parent has no more children, it becomes a leaf node so should hangup
      if (parent && parent.children.length === 0) {
        parent.hangup = true;
      }

      return {
        flows: state.flows.map((f) =>
          f.id === flow.id ? { ...flow, updatedAt: Date.now() } : f,
        ),
      };
    });
  },

  setFlowRootMenu: (flowId, rootMenu) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === flowId);
      if (!flow) return state;
      flow.rootMenu = JSON.parse(JSON.stringify(rootMenu));
      return {
        flows: state.flows.map((f) =>
          f.id === flowId ? { ...flow, updatedAt: Date.now() } : f,
        ),
      };
    });
  },
}));
